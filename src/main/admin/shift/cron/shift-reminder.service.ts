import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EVENT_TYPES } from '@project/common/interface/events-name';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { DateTime } from 'luxon';

@Injectable()
export class ShiftReminderService {
  private readonly logger = new Logger(ShiftReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Runs every day at 7 AM Mountain Time
  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'shiftReminder',
    timeZone: 'America/Denver', // Mountain Time
  })
  async handleShiftReminder() {
    this.logger.log('Running daily shift reminder...');

    // Today's date in Mountain Time
    const todayStart = DateTime.now()
      .setZone('America/Denver')
      .startOf('day')
      .toJSDate();
    const todayEnd = DateTime.now()
      .setZone('America/Denver')
      .endOf('day')
      .toJSDate();

    // Fetch today's shifts with users
    const shifts = await this.prisma.shift.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: { users: { include: { profile: true } } },
    });

    if (shifts.length === 0) {
      this.logger.log('No shifts found for today');
      return;
    }

    for (const shift of shifts) {
      for (const user of shift.users) {
        const payload = {
          action: EVENT_TYPES.SHIFT_REMINDER,
          meta: {
            shiftId: shift.id,
            userId: user.id,
            shiftTitle: shift.shiftTitle,
            startTime: shift.startTime,
            endTime: shift.endTime,
          },
        };
        this.eventEmitter.emit(EVENT_TYPES.SHIFT_REMINDER, payload);
        this.logger.log(`Shift reminder sent to user ${user.id}`);
      }
    }
  }
}
