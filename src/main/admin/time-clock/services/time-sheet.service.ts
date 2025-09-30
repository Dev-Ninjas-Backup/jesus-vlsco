import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  calcAmount,
  getBreakHours,
  toDecimal,
} from '@project/main/user/time-clock/helper/timesheet.helper';
import { DateTime } from 'luxon';
import { GetTimeSheetDto } from '../dto/time-clock.dto';

@Injectable()
export class TimeSheetService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get time sheet', 'TIME_SHEET')
  async getAllUsersTimeSheetByDate(
    dto: GetTimeSheetDto,
  ): Promise<TResponse<any>> {
    const { date, timezone = 'America/Edmonton' } = dto;

    const baseDate = date
      ? DateTime.fromISO(date).setZone(timezone)
      : DateTime.now().setZone(timezone);

    const startOfDay = baseDate.startOf('day').toUTC().toJSDate();
    const endOfDay = baseDate.endOf('day').toUTC().toJSDate();

    const timeClocks = await this.prisma.timeClock.findMany({
      where: {
        clockInAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        user: { include: { profile: true, payroll: true } },
        shift: true,
      },
      orderBy: { clockInAt: 'desc' },
    });

    // Track if break applied per user
    const breakAppliedMap = new Map<string, boolean>();

    const outputData = timeClocks.map((tc) => {
      const user = tc.user;
      const payroll = user.payroll;
      const breakHours = getBreakHours(payroll?.breakTimePerDay || 'HALF_HOUR');

      let worked = 0;
      if (tc.clockInAt && tc.clockOutAt) {
        worked = (tc.clockOutAt.getTime() - tc.clockInAt.getTime()) / 36e5;
      }

      // apply break only once/day per user
      let netWorked = worked;
      if (!breakAppliedMap.get(user.id) && worked > 0) {
        netWorked = Math.max(worked - breakHours, 0);
        breakAppliedMap.set(user.id, true);
      }

      const regularHours = netWorked > 8 ? 8 : netWorked;
      const overtimeHours =
        netWorked > 8 && tc.isOvertimeAllowed ? toDecimal(netWorked - 8) : 0;

      const regularPayment = calcAmount(
        regularHours,
        payroll?.regularPayRate || 0,
        payroll?.regularPayRateType || 'HOUR',
      );

      const overTimePayment = calcAmount(
        overtimeHours,
        payroll?.overTimePayRate || 0,
        payroll?.overTimePayRateType || 'HOUR',
      );

      const name =
        user?.profile?.firstName || user?.profile?.lastName
          ? `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim()
          : 'Unknown User';

      const profileUrl =
        user?.profile?.profileUrl ||
        `https://ui-avatars.com/api/?name=${name}&background=random`;

      return {
        id: tc.id,
        user: {
          id: user.id,
          name,
          email: user.email,
          profileUrl,
        },
        shift: tc.shift
          ? {
              id: tc.shift.id,
              title: tc.shift.shiftTitle,
              location: tc.shift.location,
              locationLat: tc.shift.locationLat,
              locationLng: tc.shift.locationLng,
            }
          : null,
        clockIn: tc.clockInAt,
        clockOut: tc.clockOutAt,
        clockInLng: tc.clockInLng,
        clockInLat: tc.clockInLat,
        location: tc.shift?.location || 'Unknown Location',
        totalHours: toDecimal(netWorked),
        regularHours: toDecimal(regularHours),
        overtimeHours: toDecimal(overtimeHours),
        regularPayment: toDecimal(regularPayment),
        overTimePayment: toDecimal(overTimePayment),
        totalPayment: toDecimal(regularPayment + overTimePayment),
      };
    });

    return successResponse(
      outputData,
      `Time sheet for ${baseDate.toFormat('yyyy-MM-dd')}`,
    );
  }

  @HandleError('Failed to delete clock', 'DELETE_CLOCK')
  async deleteAClock(clockId: string) {
    const clock = await this.prisma.timeClock.findUnique({
      where: { id: clockId },
    });

    if (!clock) {
      throw new AppError(400, 'Clock ID is required');
    }

    await this.prisma.timeClock.delete({ where: { id: clockId } });

    return successResponse(clock, 'Clock deleted successfully');
  }
}
