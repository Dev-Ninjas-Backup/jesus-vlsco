import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetClockSheet } from '../dto/clock.dto';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get my clock sheet', 'CLOCK')
  async getMyClockSheet(
    userId: string,
    dto: GetClockSheet,
  ): Promise<TResponse<any>> {
    // * get user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const from = dto.from
      ? new Date(dto.from)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const to = dto.to
      ? new Date(dto.to)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const clocks = await this.prisma.timeClock.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        userId,
        createdAt: { gte: from, lte: to },
      },
      include: {
        shift: true,
      },
    });

    const toDecimal = (num: number) => Number(num.toFixed(2));

    // --- use Map for grouping ---
    const groupedByWeek = new Map<
      string,
      {
        weekStart: Date;
        weekEnd: Date;
        daily: Map<
          string,
          {
            date: string;
            totalHours: number;
            entries: any[];
          }
        >;
        weeklyTotal: number;
      }
    >();

    clocks.forEach((clock) => {
      if (!clock.clockInAt || !clock.clockOutAt) return;

      const start = new Date(clock.clockInAt);
      const end = new Date(clock.clockOutAt);
      const hours = toDecimal(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60),
      );

      // --- find week key ---
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() - start.getDay()); // Sunday
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!groupedByWeek.has(weekKey)) {
        groupedByWeek.set(weekKey, {
          weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          daily: new Map(),
          weeklyTotal: 0,
        });
      }

      const weekData = groupedByWeek.get(weekKey)!;

      // --- handle daily grouping ---
      const dateKey = start.toISOString().split('T')[0];
      if (!weekData.daily.has(dateKey)) {
        weekData.daily.set(dateKey, {
          date: dateKey,
          totalHours: 0,
          entries: [],
        });
      }

      const dayData = weekData.daily.get(dateKey)!;

      dayData.entries.push({
        date: dateKey,
        shift: {
          id: clock.shiftId || 'N/A',
          title: clock.shift?.shiftTitle || 'N/A',
          date: clock.shift?.date || 'N/A',
          startTime: clock.shift?.startTime || 'N/A',
          endTime: clock.shift?.endTime || 'N/A',
          location: clock.shift?.location || 'N/A',
          locationLat: clock.shift?.locationLat || 0,
          locationLng: clock.shift?.locationLng || 0,
        },
        start: clock.clockInAt,
        end: clock.clockOutAt,
        totalHours: hours,
        regular: hours > 8 ? 8 : hours,
        overtime: hours > 8 ? toDecimal(hours - 8) : 0,
        notes: clock.shift?.note || null,
      });

      // update totals
      dayData.totalHours = toDecimal(dayData.totalHours + hours);
      weekData.weeklyTotal = toDecimal(weekData.weeklyTotal + hours);
    });

    // --- flatten result ---
    const result = Array.from(groupedByWeek.values()).map((week) => ({
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weeklyTotal: toDecimal(week.weeklyTotal),
      days: Array.from(week.daily.values()).map((day) => ({
        ...day,
        totalHours: toDecimal(day.totalHours),
      })),
    }));

    const flatDaysEntries = result
      .flatMap((week) => week.days)
      .flatMap((day) => day.entries);

    const resultWithUser = {
      user: {
        id: user.id,
        firstName: user?.profile?.firstName || 'N/A',
        lastName: user?.profile?.lastName || 'N/A',
        email: user?.email || 'N/A',
        phone: user?.phone || 'N/A',
        profileUrl: user?.profile?.profileUrl || 'N/A',
      },
      result,
    };

    return successResponse(
      {
        clockSheet: resultWithUser,
        daysEntries: flatDaysEntries,
      },
      'Clock sheet retrieved successfully',
    );
  }
}
