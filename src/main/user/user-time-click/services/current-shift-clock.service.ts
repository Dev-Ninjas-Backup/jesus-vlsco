import { Injectable } from '@nestjs/common';
import { ClientDateDto } from '@project/common/dto/client-date.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class CurrentClockShiftService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get todays shift', 'CLOCK')
  async getCurrentShiftWithClock(
    userId: string,
    dto: ClientDateDto,
  ): Promise<TResponse<any>> {
    const date = new Date(dto.date);
    const shift = await this.getCurrentShift(userId, date);

    if (!shift) {
      throw new AppError(404, 'No active shift found for the user');
    }

    // Get latest clock specifically for this shift (keeps services synchronized)
    const clock = await this.getLatestClockForShift(userId, shift.id);

    const team = await this.prisma.team.findFirst({
      where: {
        projects: {
          some: {
            projectUsers: {
              some: {
                userId,
              },
            },
          },
        },
        members: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    const teamMembers =
      team?.members.map((member) => {
        return {
          id: member.user.id,
          email: member.user.email,
          firstName: member.user.profile?.firstName,
          lastName: member.user.profile?.lastName,
          profileUrl: member.user.profile?.profileUrl,
        };
      }) || [];

    return successResponse(
      {
        shift,
        clock,
        teamMembers,
        isClockedIn: clock?.status === 'ACTIVE',
        canClockIn:
          new Date() >= new Date(shift.startTime.getTime() - 15 * 60 * 1000), // 15 minutes before shift start time (server time)
      },
      'Current shift',
    );
  }

  async getCurrentShift(userId: string, date: Date) {
    const utcDate = this.toUTCDate(date);

    // Case 1 & 2: Active or upcoming shifts
    const activeOrUpcomingShift = await this.prisma.shift.findFirst({
      where: {
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
        OR: [
          // case 1: already active
          {
            startTime: { lte: utcDate },
            endTime: { gte: utcDate },
          },
          // case 2: upcoming shift later today
          {
            startTime: { gte: utcDate },
          },
        ],
      },
      orderBy: { startTime: 'asc' },
    });

    if (activeOrUpcomingShift) return activeOrUpcomingShift;

    // Case 3: latest ended shift (delayed clock out)
    const latestEndedShift = await this.prisma.shift.findFirst({
      where: {
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
        startTime: { lte: utcDate },
        endTime: { lte: utcDate },
      },
      orderBy: { endTime: 'desc' },
    });

    return latestEndedShift;
  }

  /**
   * Get the latest timeClock for a specific user + shift
   * This ensures we don't accidentally look at a clock for a different shift.
   */
  async getLatestClockForShift(userId: string, shiftId: string) {
    return this.prisma.timeClock.findFirst({
      where: { userId, shiftId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Determine if a point is within radius (meters) of center.
   */
  isWithinRadius(
    point: { lat: number; lng: number },
    center: { lat: number; lng: number },
    radius: number,
  ): boolean {
    return this.getDistanceMeters(point, center) <= radius;
  }

  getDistanceMeters(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number },
  ): number {
    const R = 6371000; // meters
    const dLat = this.deg2rad(b.lat - a.lat);
    const dLng = this.deg2rad(b.lng - a.lng);
    const lat1 = this.deg2rad(a.lat);
    const lat2 = this.deg2rad(b.lat);

    const hav =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Convert input into a UTC Date object safely.
   * Accepts Date or ISO/string. Returns a Date that represents the same instant in UTC.
   */
  toUTCDate(input: string | Date): Date {
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      throw new AppError(400, 'Invalid date provided');
    }
    // d.toISOString() forces UTC representation; new Date of that keeps the same instant
    return new Date(d.toISOString());
  }
}
