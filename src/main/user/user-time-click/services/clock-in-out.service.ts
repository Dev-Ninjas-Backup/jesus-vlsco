import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ClockInOutService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to process clock in/out', 'CLOCK')
  async processClock(
    userId: string,
    lat: number,
    lng: number,
  ): Promise<TResponse<any>> {
    const now = new Date();

    // 1. Check if user already clocked in (ACTIVE record)
    const activeClock = await this.prisma.timeClock.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        shiftId: { not: null },
      },
      include: { shift: true },
    });

    if (activeClock) {
      const withinRadius = this.isWithinRadius(
        { lat, lng },
        {
          lat: activeClock.shift?.locationLat ?? 0,
          lng: activeClock.shift?.locationLng ?? 0,
        },
        100, // meters
      );

      if (withinRadius) {
        return successResponse(activeClock, 'Already clocked in');
      }

      // Clock-out if moved away (but clamp within shift endTime)
      const clockOutAt =
        activeClock.shift?.endTime && now > new Date(activeClock.shift.endTime)
          ? new Date(activeClock.shift.endTime)
          : now;

      const updated = await this.prisma.timeClock.update({
        where: { id: activeClock.id },
        data: {
          clockOutAt: clockOutAt.toISOString(),
          clockOutLat: lat,
          clockOutLng: lng,
          status: 'COMPLETED',
        },
      });

      return successResponse(updated, 'Clocked out successfully');
    }

    // 2. Find current or upcoming shift for today
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const shift = await this.prisma.shift.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
        OR: [
          { startTime: { lte: now }, endTime: { gte: now } }, // * current shift
          { startTime: { gte: now } }, // * upcoming shift today
        ],
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (!shift) {
      throw new AppError(404, 'No active shift found for the user');
    }

    // 3. Validate location
    const distance = this.getDistanceMeters(
      { lat, lng },
      { lat: shift.locationLat, lng: shift.locationLng },
    );

    if (distance > 100) {
      throw new AppError(400, 'You are not at the shift location');
    }

    // 4. Create new clock-in record
    const newClock = await this.prisma.timeClock.create({
      data: {
        userId,
        shiftId: shift.id,
        clockInAt: now.toISOString(),
        clockInLat: lat,
        clockInLng: lng,
        status: 'ACTIVE',
      },
    });

    return successResponse(
      newClock,
      `Clocked in successfully to shift: ${shift.shiftTitle}`,
    );
  }

  @HandleError('Failed to get current shift', 'CLOCK')
  async getCurrentShiftWithClock(userId: string): Promise<TResponse<any>> {
    // * get current UTC date range (start and end of today)
    const now = new Date();

    const startOfDay = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const endOfDay = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const shift = await this.prisma.shift.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (!shift) {
      throw new AppError(404, 'No active shift found for the user');
    }

    // * get latest clock of that user
    const clock = await this.prisma.timeClock.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
            // shifts: {
            //   some: {
            //     id: shift.id,
            //   },
            // }
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
      },
      'Current shift',
    );
  }

  // Helpers
  private isWithinRadius(
    point: { lat: number; lng: number },
    center: { lat: number; lng: number },
    radius: number,
  ): boolean {
    return this.getDistanceMeters(point, center) <= radius;
  }

  private getDistanceMeters(
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

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
