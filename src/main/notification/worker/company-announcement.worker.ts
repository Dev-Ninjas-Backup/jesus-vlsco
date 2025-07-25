import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { MailService } from '@project/lib/mail/mail.service';
import { Worker } from 'bullmq';
import { AnnouncementEvent } from '../interface/events';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class CompanyAnnouncementWorker implements OnModuleInit {
  // LOGGER
  private logger = new Logger(CompanyAnnouncementWorker.name);
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly config: ConfigService,
    private readonly mailService: MailService
  ) { }

  onModuleInit() {
    new Worker<AnnouncementEvent>(
      'notification',
      async (job) => {
        const { title, message, recipients, sendEmail, sendWs } = job.data;

        // Broadcast via email
        if (sendEmail && recipients.length) {
          this.logger.log(`Sending email to ${recipients.length} recipients...`);
          for (const email of recipients) {
            try {
              await this.mailService.sendAnnouncementEmail(
                email,
                title,
                `<h3>${title}</h3><p>${message}</p>`
              );
              this.logger.log(`Email sent to ${email}`);
            } catch (err) {
              this.logger.error(`Failed to send email to ${email}`, err);
            }
          }
        }

        // Broadcast via WebSocket
        if (sendWs && recipients.length) {
          for (const userId of recipients) {
            const sockets = this.gateway.getClientsForUser(userId);
            sockets.forEach((ws) =>
              ws.send(JSON.stringify({ title, message })),
            );
          }
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
}
