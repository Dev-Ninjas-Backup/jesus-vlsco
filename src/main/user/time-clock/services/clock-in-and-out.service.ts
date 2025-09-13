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
    // Normalize DTO date for UTC-consistent handling (useful for clock-out)
    const clientDate = new Date(dto.date);
    if (isNaN(clientDate.getTime())) throw new AppError(400, 'Invalid date');

    // Find the shift (UTC-safe) for the provided client date
    const shift = await this.currentClockShiftService.getCurrentShift(
      userId,
      clientDate,
    );
    if (!shift) throw new AppError(404, 'No active shift found for the user');

    // Use server time consistently for buffer checks and creation timestamps
    const now = new Date();

    // Process actions in transactions to avoid race conditions
    if (dto.action === 'CLOCK_IN') {
      return this.handleClockIn(userId, dto, shift, now);
    }

    if (dto.action === 'CLOCK_OUT') {
      return this.handleClockOut(userId, dto, shift, clientDate);
    }

    throw new AppError(400, 'Invalid clock action');
  }

  private async handleClockIn(
    userId: string,
    dto: ClockDto,
    shift: any,
    serverNow: Date,
  ): Promise<TResponse<any>> {
    const shiftStart = new Date(shift.startTime);
    const sixHours = 6 * 60 * 60 * 1000;

    // Prevent clock-in earlier than 6 hours before shift starts
    if (serverNow < new Date(shiftStart.getTime() - sixHours)) {
      throw new AppError(
        400,
        'You cannot clock in more than 6 hours before the shift starts',
      );
    }

    // If shift already ended
    if (serverNow > new Date(shift.endTime)) {
      throw new AppError(400, 'Shift is over, cannot clock in');
    }

    // Location check
    const distance = this.currentClockShiftService.getDistanceMeters(
      { lat: dto.lat, lng: dto.lng },
      { lat: shift.locationLat, lng: shift.locationLng },
    );
    if (distance > 700) {
      throw new AppError(400, 'You are not at the shift location');
    }

    // Use transaction to ensure there isn't an ACTIVE clock already for this user+shift
    const result = await this.prisma.$transaction(async (tx) => {
      // double-check active clock for this shift only
      const existingActive = await tx.timeClock.findFirst({
        where: { userId, shiftId: shift.id, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      });
      if (existingActive) {
        return { already: true, payload: existingActive };
      }

      const newClock = await tx.timeClock.create({
        data: {
          userId,
          shiftId: shift.id,
          clockInAt: serverNow.toISOString(),
          clockInLat: dto.lat,
          clockInLng: dto.lng,
          status: 'ACTIVE',
        },
      });

      return { already: false, payload: newClock };
    });

    if (result.already) {
      return successResponse(result.payload, 'Already clocked in');
    }

    return successResponse(result.payload, `Clocked in to ${shift.shiftTitle}`);
  }

  private async handleClockOut(
    userId: string,
    dto: ClockDto,
    shift: any,
    clientDate: Date, // user-provided date/time for clock-out intent
  ): Promise<TResponse<any>> {
    // Ensure there is an active clock for this user + shift
    const activeClock =
      await this.currentClockShiftService.getLatestClockForShift(
        userId,
        shift.id,
      );

    if (!activeClock || activeClock.status !== 'ACTIVE') {
      throw new AppError(400, 'No active clock-in found');
    }

    // Validate location (within radius)
    const withinRadius = this.currentClockShiftService.isWithinRadius(
      { lat: dto.lat, lng: dto.lng },
      {
        lat: shift?.locationLat ?? 0,
        lng: shift?.locationLng ?? 0,
      },
      700,
    );
    if (!withinRadius) {
      throw new AppError(400, 'You are not at the shift location');
    }

    // Use transaction to update the same active clock (prevents races)
    const updated = await this.prisma.$transaction(async (tx) => {
      // Re-fetch and lock the clock record for update consistency
      const clockForUpdate = await tx.timeClock.findUnique({
        where: { id: activeClock.id },
      });

      if (!clockForUpdate || clockForUpdate.status !== 'ACTIVE') {
        // someone else already clocked out or changed it
        throw new AppError(400, 'Active clock is no longer available');
      }

      const totalMs =
        clientDate.getTime() -
        (clockForUpdate.clockInAt
          ? new Date(clockForUpdate.clockInAt).getTime()
          : 0);
      const totalHours = totalMs / (1000 * 60 * 60); // ms → hr
      const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

      const updatedClock = await tx.timeClock.update({
        where: { id: clockForUpdate.id },
        data: {
          clockOutAt: clientDate.toISOString(),
          clockOutLat: dto.lat,
          clockOutLng: dto.lng,
          status: 'COMPLETED',
          totalHours: Number(totalHours.toFixed(2)),
          overtimeHours: Number(overtimeHours.toFixed(2)),
        },
      });

      return updatedClock;
    });

    return successResponse(updated, 'Clocked out successfully');
  }
}
