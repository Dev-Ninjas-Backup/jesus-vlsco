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
    const timeNow = new Date();
    console.log('timeNow', timeNow.toISOString());

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

      // Clock-out if moved away
      const updated = await this.prisma.timeClock.update({
        where: { id: activeClock.id },
        data: {
          clockOutAt: new Date().toISOString(),
          clockOutLat: lat,
          clockOutLng: lng,
          status: 'COMPLETED',
        },
      });

      return successResponse(updated, 'Clocked out successfully');
    }

    // 2. If not clocked in, check for active shifts
    const now = new Date();
    const nowUtc = new Date(now.toISOString());

    const shifts = await this.prisma.shift.findMany({
      where: {
        startTime: { lte: nowUtc },
        endTime: { gte: nowUtc },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
      },
    });

    if (!shifts || shifts.length === 0) {
      throw new AppError(404, 'No active shift found for the user');
    }

    // find nearest valid shift
    let selectedShift: (typeof shifts)[0] | null = null;
    let minDistance = Infinity;

    for (const shift of shifts) {
      const distance = this.getDistanceMeters(
        { lat, lng },
        { lat: shift.locationLat, lng: shift.locationLng },
      );

      if (distance <= 100 && distance < minDistance) {
        selectedShift = shift;
        minDistance = distance;
      }
    }

    if (!selectedShift) {
      throw new AppError(400, 'You are not at the shift location');
    }

    // 3. Create clock-in record
    const newClock = await this.prisma.timeClock.create({
      data: {
        userId,
        shiftId: selectedShift.id,
        clockInAt: new Date().toISOString(),
        clockInLat: lat,
        clockInLng: lng,
        status: 'ACTIVE',
      },
    });

    return successResponse(
      newClock,
      `Clocked in successfully to shift: ${selectedShift.shiftTitle}`,
    );
  }

  @HandleError('Failed to get current shift', 'CLOCK')
  async getCurrentShiftWithClock(userId: string): Promise<TResponse<any>> {
    // * get current or upcoming shift
    const now = new Date();
    const nowUtc = new Date(now.toISOString());

    const shift = await this.prisma.shift.findFirst({
      where: {
        startTime: { lte: nowUtc },
        endTime: { gte: nowUtc },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
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
