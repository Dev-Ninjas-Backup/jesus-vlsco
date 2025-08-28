import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetTimeSheetDto } from '../dto/time-clock.dto';

@Injectable()
export class TimeSheetService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get time sheet', 'TIME_SHEET')
  async getAllUsersTimeSheetByDate(
    dto: GetTimeSheetDto,
  ): Promise<TResponse<any>> {
    const date = dto.date ? new Date(dto.date) : new Date();

    // Start and end of the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all time clocks for that date
    const timeClocks = await this.prisma.timeClock.findMany({
      where: {
        clockInAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        user: {
          include: {
            profile: true,
            payroll: true,
          },
        },
        shift: true,
      },
    });

    const outputData = timeClocks.map((tc) => {
      const payroll = tc.user.payroll;

      // Calculate worked hours
      let totalHours = 0;
      if (tc.clockInAt && tc.clockOutAt) {
        totalHours =
          (tc.clockOutAt.getTime() - tc.clockInAt.getTime()) / (1000 * 60 * 60);
      }

      // Regular vs overtime
      const regularHours = Math.min(totalHours, 8);
      const overTime = totalHours > 8 ? totalHours - 8 : 0;

      const regularPayRate = payroll?.regularPayRate || 100;
      const overTimePayRate = payroll?.overTimePayRate || 200;
      const regularPayRateType = payroll?.regularPayRateType || 'DAY';
      const overTimePayRateType = payroll?.overTimePayRateType || 'DAY';

      // Payments
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

    return successResponse(outputData, `Time sheet for ${date.toDateString()}`);
  }
}
