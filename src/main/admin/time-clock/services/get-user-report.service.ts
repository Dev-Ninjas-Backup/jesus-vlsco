import { Injectable } from '@nestjs/common';
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
import { GetUserReportDto } from '../dto/time-clock.dto';

@Injectable()
export class GetUserReportService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get user report', 'USER_REPORT')
  async getUsersReport(dto: GetUserReportDto): Promise<TResponse<any>> {
    const { startTime, endTime, search, timezone = 'America/Edmonton' } = dto;

    const baseDate = DateTime.now().setZone(timezone);
    const start = startTime
      ? DateTime.fromISO(startTime).setZone(timezone).toUTC().toJSDate()
      : baseDate.startOf('day').toUTC().toJSDate();
    const end = endTime
      ? DateTime.fromISO(endTime).setZone(timezone).toUTC().toJSDate()
      : baseDate.endOf('day').toUTC().toJSDate();

    const timeClocks = await this.prisma.timeClock.findMany({
      where: {
        clockInAt: { gte: start, lte: end },
        user: search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                {
                  profile: {
                    OR: [
                      { firstName: { contains: search, mode: 'insensitive' } },
                      { lastName: { contains: search, mode: 'insensitive' } },
                    ],
                  },
                },
              ],
            }
          : undefined,
      },
      include: {
        user: { include: { profile: true, payroll: true } },
        shift: true,
      },
      orderBy: { clockInAt: 'desc' },
    });

    // Track break applied per user per day
    const breakAppliedMap = new Map<string, boolean>();

    const outputData = timeClocks.map((tc) => {
      const user = tc.user;
      const payroll = user.payroll;

      // Determine worked hours
      let worked = 0;
      if (tc.clockInAt && tc.clockOutAt) {
        worked = (tc.clockOutAt.getTime() - tc.clockInAt.getTime()) / 36e5; // hours
      }

      // Apply break only once per user per day
      const breakHours = getBreakHours(payroll?.breakTimePerDay || 'HALF_HOUR');
      let netWorked = worked;
      const breakKey = `${user.id}-${DateTime.fromJSDate(tc.clockInAt || new Date()).toISODate()}`;
      if (!breakAppliedMap.get(breakKey) && worked > 0) {
        netWorked = Math.max(worked - breakHours, 0);
        breakAppliedMap.set(breakKey, true);
      }

      // Regular & overtime hours
      const regularHours = Math.min(netWorked, 8);
      const overtimeHours = netWorked > 8 ? toDecimal(netWorked - 8) : 0;

      // Payment calculation
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

      return {
        user: {
          id: user.id,
          name,
          email: user.email,
          profileUrl:
            user?.profile?.profileUrl ||
            `https://ui-avatars.com/api/?name=${name}&background=random`,
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
      `Report from ${DateTime.fromJSDate(start).toFormat('yyyy-MM-dd')} to ${DateTime.fromJSDate(end).toFormat('yyyy-MM-dd')}`,
    );
  }
}
