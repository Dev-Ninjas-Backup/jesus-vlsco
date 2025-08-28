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
    const now = new Date();

    // 1. Find any active clock
    const activeClock = await this.prisma.timeClock.findFirst({
      where: { userId, status: 'ACTIVE', shiftId: { not: null } },
      include: { shift: true },
    });

    if (dto.action === 'CLOCK_IN') {
      if (activeClock) {
        return successResponse(activeClock, 'Already clocked in');
      }

      // find today's shift
      const startOfDay = new Date(now);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const shift = await this.prisma.shift.findFirst({
        where: {
          date: { gte: startOfDay, lte: endOfDay },
          shiftStatus: 'PUBLISHED',
          users: { some: { id: userId } },
          OR: [
            { startTime: { lte: now }, endTime: { gte: now } },
            { startTime: { gte: now } },
          ],
        },
        orderBy: { startTime: 'asc' },
      });

      if (!shift) throw new AppError(404, 'No active shift found for the user');

      // location check
      const distance = this.currentClockShiftService.getDistanceMeters(
        { lat: dto.lat, lng: dto.lng },
        { lat: shift.locationLat, lng: shift.locationLng },
      );
      if (distance > 100)
        throw new AppError(400, 'You are not at the shift location');

      // create record
      const newClock = await this.prisma.timeClock.create({
        data: {
          userId,
          shiftId: shift.id,
          clockInAt: now.toISOString(),
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
        100,
      );
      if (!withinRadius) {
        throw new AppError(400, 'You are not at the shift location');
      }

      const clockOutAt =
        activeClock.shift?.endTime && now > new Date(activeClock.shift.endTime)
          ? new Date(activeClock.shift.endTime)
          : now;

      const updated = await this.prisma.timeClock.update({
        where: { id: activeClock.id },
        data: {
          clockOutAt: clockOutAt.toISOString(),
          clockOutLat: dto.lat,
          clockOutLng: dto.lng,
          status: 'COMPLETED',
        },
      });

      return successResponse(updated, 'Clocked out successfully');
    }

    throw new AppError(400, 'Invalid clock action');
  }
}
