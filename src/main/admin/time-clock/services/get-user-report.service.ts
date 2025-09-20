import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { DateTime } from 'luxon';
import { GetUserReportDto } from '../dto/time-clock.dto';

@Injectable()
export class GetUserReportService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get user report', 'USER_REPORT')
  async getUsersReport(dto: GetUserReportDto): Promise<TResponse<any>> {
    const { startTime, endTime, search, timezone = 'America/Edmonton' } = dto;

    // Default to today if no start/end given
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
    });

    //  reuse your calculation logic
    const outputData = timeClocks.map((tc) => {
      const payroll = tc.user.payroll;
      let totalHours = 0;

      if (tc.clockInAt && tc.clockOutAt) {
        totalHours =
          (tc.clockOutAt.getTime() - tc.clockInAt.getTime()) / (1000 * 60 * 60);
      }

      const regularHours = Math.min(totalHours, 8);
      const overTime = totalHours > 8 ? totalHours - 8 : 0;

      const regularPayRate = payroll?.regularPayRate || 100;
      const overTimePayRate = payroll?.overTimePayRate || 200;
      const regularPayRateType = payroll?.regularPayRateType || 'DAY';
      const overTimePayRateType = payroll?.overTimePayRateType || 'DAY';

      const regularPayment =
        regularHours * regularPayRate * (regularPayRateType === 'HOUR' ? 1 : 8);
      const overTimePayment =
        overTime * overTimePayRate * (overTimePayRateType === 'HOUR' ? 1 : 8);

      const name =
        tc.user?.profile?.firstName || tc.user?.profile?.lastName
          ? `${tc.user.profile?.firstName ?? ''} ${tc.user.profile?.lastName ?? ''}`.trim()
          : 'Unknown User';

      return {
        user: {
          id: tc.user.id,
          name,
          email: tc.user.email,
          profileUrl:
            tc.user.profile?.profileUrl ??
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
        totalHours: totalHours.toFixed(2),
        regularHours: regularHours.toFixed(2),
        overTime: overTime.toFixed(2),
        regularPayment: regularPayment.toFixed(2),
        overTimePayment: overTimePayment.toFixed(2),
        totalPayment: (regularPayment + overTimePayment).toFixed(2),
      };
    });

    return successResponse(
      outputData,
      `Report from ${DateTime.fromJSDate(start).toFormat('yyyy-MM-dd')} to ${DateTime.fromJSDate(end).toFormat('yyyy-MM-dd')}`,
    );
  }
}
