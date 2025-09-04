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

    // * find shift for that date
    const shift = await this.getCurrentShift(userId, date);

    if (!shift) {
      throw new AppError(404, 'No active shift found for the user');
    }

    // * get latest clockInAt of that user for that shift
    const clock = await this.prisma.timeClock.findFirst({
      where: { userId, shiftId: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

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
          new Date() >= new Date(shift.startTime.getTime() - 15 * 60 * 1000), // 15 minutes before shift start time
      },
      'Current shift',
    );
  }

  // Helpers
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

  async getCurrentShift(userId: string, date: Date) {
    const utcDate = this.toUTCDate(date);

    const startOfDay = new Date(
      Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const shift = await this.prisma.shift.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
      },
      orderBy: { startTime: 'asc' },
    });

    return shift;
  }

  toUTCDate(input: string | Date): Date {
    const d = new Date(input);
    // If the date is invalid, throw error
    if (isNaN(d.getTime())) {
      throw new AppError(400, 'Invalid date provided');
    }
    return new Date(d.toISOString()); // ensure UTC
  }
}
