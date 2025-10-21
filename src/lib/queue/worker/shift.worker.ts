import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { EVENT_TYPES } from '@project/common/interface/events-name';
import { ShiftEvent } from '@project/common/interface/events-payload';
import { QueueName } from '@project/common/interface/queue-name';
import { MailService } from '@project/lib/mail/mail.service';
import { NotificationGateway } from '@project/lib/notification/notification.gateway';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { TwilioService } from '@project/lib/twilio/twilio.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { Worker } from 'bullmq';
import { DateTime } from 'luxon';

@Injectable()
export class ShiftWorker implements OnModuleInit {
  private logger = new Logger(ShiftWorker.name);

  constructor(
    private readonly gateway: NotificationGateway,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly utils: UtilsService,
    private readonly prisma: PrismaService,
    private readonly twilio: TwilioService,
  ) {}

  onModuleInit() {
    new Worker<ShiftEvent>(
      QueueName.SHIFT,
      async (job) => {
        const {
          action,
          meta: { userId, shiftId, ...meta },
        } = job.data;

        try {
          const userEmail = await this.utils.getEmailById(userId);
          const userPhone = await this.utils.getPhoneById(userId);
          const shift = await this.utils.getShiftById(shiftId);

          const title = this.generateTitle(action);
          const eventName = this.generateShiftEventName(action);

          this.logger.log(
            `Processing shift event: ${action} for ${userEmail} ${userPhone}`,
          );

          // Company website
          const companyWebsite = 'https://lgcglobalcontractingltd.com';

          // Build maps URL from lat/lng if available
          let mapsUrl: string | null = null;
          if (
            shift.locationLat &&
            shift.locationLng &&
            (shift.locationLat !== 0.0 || shift.locationLng !== 0.0)
          ) {
            mapsUrl = `https://www.google.com/maps?q=${shift.locationLat},${shift.locationLng}`;
          } else if (shift.location) {
            mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              shift.location,
            )}`;
          }

          const locationObj = {
            name: shift.location,
            lat: shift.locationLat,
            lng: shift.locationLng,
            mapsUrl,
          };

          // Build messages
          const htmlMessage = this.generateMessage(action, shift, meta, {
            companyWebsite,
            location: locationObj,
          }); // for email
          const textMessage = this.generatePlainTextMessage(
            action,
            shift,
            meta,
            {
              companyWebsite,
              location: locationObj,
            },
          ); // for SMS

          // Send Email
          await this.mailService.sendEmail(userEmail, title, htmlMessage);

          // Send SMS
          await this.twilio.sendSms(userPhone, title, textMessage);

          // Send Socket Notification
          this.gateway.notifySingleUser(userId, eventName, {
            type: eventName,
            title,
            message:
              'Shift Notification. Please check your dashboard for more details',
            createdAt: new Date(),
            meta: {
              ...meta,
              shiftId,
              shiftTitle: shift.shiftTitle,
              location: locationObj,
              website: companyWebsite,
            },
          });

          // Store in DB
          await this.prisma.notification.create({
            data: {
              type:
                action === 'URGENT_SHIFT_CHANGED'
                  ? 'UrgentShiftChanged'
                  : 'Shift',
              title,
              message: `Shift Notification for ${shift.shiftTitle} on ${shift.startTime}${
                shift.location ? ` at ${shift.location}` : ''
              }`,
              createdAt: new Date(),
              meta: {
                ...meta,
                shiftId,
                location: locationObj,
                website: companyWebsite,
              },
              users: {
                create: { userId },
              },
            },
          });

          this.logger.log(`Shift ${action} notification sent to ${userEmail}`);
        } catch (err) {
          this.logger.error(
            `Failed to process shift event ${action}: ${err.message}`,
            err.stack,
          );
        }
      },
      {
        connection: {
          host: this.config.getOrThrow(ENVEnum.REDIS_HOST),
          port: +this.config.getOrThrow(ENVEnum.REDIS_PORT),
        },
      },
    );
  }

  private generateTitle(action: ShiftEvent['action']): string {
    switch (action) {
      case 'ASSIGN':
        return 'New Shift Assigned';
      case 'STATUS_UPDATE':
        return 'Your Shift Status Updated';
      case 'CHANGE':
        return 'Shift Details Updated';
      case 'URGENT_SHIFT_CHANGED':
        return 'Urgent Shift Changed';
      case 'REMINDER':
        return "Today's Shift Reminder";
      default:
        return 'Shift Notification';
    }
  }

  private generatePlainTextMessage(
    action: ShiftEvent['action'],
    shift: any,
    meta: any,
    opts: { companyWebsite: string; location: any },
  ): string {
    const start = this.formatShiftTime(new Date(shift.startTime));
    const end = this.formatShiftTime(new Date(shift.endTime));

    const jobLine = shift.job ? `💼 Job: ${shift.job}\n` : '';
    const locationLine = opts.location.name
      ? `📍 Location: ${opts.location.name}\n`
      : '';
    const mapsLine = opts.location.mapsUrl
      ? `🗺️ Map: ${opts.location.mapsUrl}\n`
      : '';
    const noteLine = shift.note ? `📝 Note: ${shift.note}\n` : '';

    const baseDetails = `────────────────────
⏰ Shift: ${shift.shiftTitle}
🕘 Start: ${start.mountain} (${start.utc})
🕔 End:   ${end.mountain} (${end.utc})
${jobLine}${locationLine}${mapsLine}${noteLine}
────────────────────`;

    const websiteLine = `🌐 Company: ${opts.companyWebsite}`;

    let titleLine = '';
    switch (action) {
      case 'ASSIGN':
        titleLine = '📢 New Shift Assigned';
        break;
      case 'STATUS_UPDATE':
        titleLine = `🔔 Shift Status Updated: ${meta.status || shift.shiftStatus}`;
        break;
      case 'CHANGE':
        titleLine = '✏️ Shift Details Updated';
        break;
      case 'URGENT_SHIFT_CHANGED':
        titleLine = '⚠️ Urgent Shift Changed';
        break;
      case 'REMINDER':
        titleLine = "📢 Today's Shift Reminder";
        break;
      default:
        titleLine = '📢 Shift Notification';
    }

    return `${titleLine}\n${baseDetails}\n${websiteLine}`;
  }

  private generateMessage(
    action: ShiftEvent['action'],
    shift: any,
    meta: any,
    opts: { companyWebsite: string; location: any },
  ): string {
    const start = this.formatShiftTime(new Date(shift.startTime));
    const end = this.formatShiftTime(new Date(shift.endTime));

    const jobLine = shift.job
      ? `<li><strong>Job:</strong> ${shift.job}</li>`
      : '';
    const locationLine = opts.location.name
      ? `<li><strong>Location:</strong> ${opts.location.name}${
          opts.location.mapsUrl
            ? ` — <a href="${opts.location.mapsUrl}" target="_blank" rel="noopener">View on Map</a>`
            : ''
        }</li>`
      : '';
    const noteLine = shift.note
      ? `<li><strong>Note:</strong> ${shift.note}</li>`
      : '';

    const websiteLine = `<p><strong>Company:</strong> <a href="${opts.companyWebsite}" target="_blank" rel="noopener">${opts.companyWebsite}</a></p>`;

    const baseDetails = `
    <ul>
      <li><strong>Shift:</strong> ${shift.shiftTitle}</li>
      <li><strong>Start:</strong> ${start.mountain} (${start.utc})</li>
      <li><strong>End:</strong> ${end.mountain} (${end.utc})</li>
      ${jobLine}
      ${locationLine}
      ${noteLine}
    </ul>
  `;

    switch (action) {
      case 'ASSIGN':
        return `
        <p>You have been assigned a new shift.</p>
        ${baseDetails}
        ${websiteLine}
      `;
      case 'STATUS_UPDATE':
        return `
        <p>Your shift status has been updated to: <strong>${meta.status || shift.shiftStatus}</strong>.</p>
        ${baseDetails}
        ${websiteLine}
      `;
      case 'CHANGE':
        return `
        <p>Your shift has been updated with new details.</p>
        ${baseDetails}
        ${websiteLine}
      `;
      case 'URGENT_SHIFT_CHANGED':
        return `
        <p><strong>Urgent:</strong> Your shift has been changed!</p>
        ${baseDetails}
        ${websiteLine}
      `;
      case 'REMINDER':
        return `
        <p><strong>Today's Shift Reminder:</strong></p>
        ${baseDetails}
        ${websiteLine}
      `;
      default:
        return `<p>You have a shift update.</p>${baseDetails}${websiteLine}`;
    }
  }

  private generateShiftEventName(action: ShiftEvent['action']): string {
    switch (action) {
      case 'ASSIGN':
        return EVENT_TYPES.SHIFT_ASSIGN;
      case 'CHANGE':
        return EVENT_TYPES.SHIFT_CHANGE;
      case 'STATUS_UPDATE':
        return EVENT_TYPES.SHIFT_STATUS_UPDATE;
      case 'URGENT_SHIFT_CHANGED':
        return EVENT_TYPES.URGENT_SHIFT_CHANGED;
      case 'REMINDER':
        return EVENT_TYPES.SHIFT_REMINDER;
      default:
        return 'shift.unknown';
    }
  }

  private formatShiftTime(date: Date) {
    const dt = DateTime.fromJSDate(date).toUTC();

    return {
      utc: dt.toFormat("yyyy-LL-dd HH:mm 'UTC'"),
      mountain: dt
        .setZone('America/Denver')
        .toFormat("yyyy-LL-dd hh:mm a 'MT'"),
    };
  }
}
