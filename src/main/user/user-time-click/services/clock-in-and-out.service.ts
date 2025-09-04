import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ClockDto } from '../dto/clock.dto';
import { CurrentClockShiftService } from './current-shift-clock.service';

@Injectable()
export class ClockInAndOutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentClockShiftService: CurrentClockShiftService,
  ) {}

  @HandleError('Clock In/Out Error')
  async processClock(userId: string, dto: ClockDto): Promise<TResponse<any>> {
    const date = new Date(dto.date);

    // 1. Find any active clock
    const activeClock = await this.prisma.timeClock.findFirst({
      where: { userId, status: 'ACTIVE', shiftId: { not: null } },
      include: { shift: true },
      orderBy: { clockInAt: 'desc' },
    });

    if (dto.action === 'CLOCK_IN') {
      if (activeClock) {
        return successResponse(activeClock, 'Already clocked in');
      }

      // Find current shift (UTC-safe)
      const shift = await this.currentClockShiftService.getCurrentShift(
        userId,
        date,
      );

      if (!shift) throw new AppError(404, 'No active shift found for the user');

      // Use actual current time for buffer calculation
      const now = new Date(); // server current time
      const bufferStart = new Date(now.getTime() - 15 * 60 * 1000);

      if (shift.startTime > bufferStart)
        throw new AppError(
          400,
          `Too early to clock in. You can clock in 15 minutes before shift start time.`,
        );

      // * check if clients time in date is before shift end time
      if (new Date(dto.date) > new Date(shift.endTime))
        throw new AppError(400, 'Shift is over, please clock out');

      // Location check
      const distance = this.currentClockShiftService.getDistanceMeters(
        { lat: dto.lat, lng: dto.lng },
        { lat: shift.locationLat, lng: shift.locationLng },
      );
      if (distance > 100)
        throw new AppError(400, 'You are not at the shift location');

      // Create clock-in record
      const newClock = await this.prisma.timeClock.create({
        data: {
          userId,
          shiftId: shift.id,
          clockInAt: date.toISOString(),
          clockInLat: dto.lat,
          clockInLng: dto.lng,
          status: 'ACTIVE',
        },
      });

      return successResponse(newClock, `Clocked in to ${shift.shiftTitle}`);
    }

    if (dto.action === 'CLOCK_OUT') {
      if (!activeClock) {
        throw new AppError(400, 'No active clock-in found');
      }

      const withinRadius = this.currentClockShiftService.isWithinRadius(
        { lat: dto.lat, lng: dto.lng },
        {
          lat: activeClock.shift?.locationLat ?? 0,
          lng: activeClock.shift?.locationLng ?? 0,
        },
        500,
      );
      if (!withinRadius) {
        throw new AppError(400, 'You are not at the shift location');
      }

      // Determine clock-out time (UTC-safe)
      const shiftEnd = activeClock.shift?.endTime
        ? new Date(activeClock.shift.endTime)
        : date;
      const clockOutAt = date > shiftEnd ? shiftEnd : date;

      // Calculate total hours worked
      const totalMs =
        clockOutAt.getTime() -
        (activeClock.clockInAt ? new Date(activeClock.clockInAt).getTime() : 0);
      const totalHours = totalMs / (1000 * 60 * 60); // convert ms → hr
      const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

      const updated = await this.prisma.timeClock.update({
        where: { id: activeClock.id },
        data: {
          clockOutAt: clockOutAt.toISOString(),
          clockOutLat: dto.lat,
          clockOutLng: dto.lng,
          status: 'COMPLETED',
          totalHours: Number(totalHours.toFixed(2)),
          overtimeHours: Number(overtimeHours.toFixed(2)),
        },
      });

      return successResponse(updated, 'Clocked out successfully');
    }

    throw new AppError(400, 'Invalid clock action');
  }
}
