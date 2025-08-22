import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetClockSheet } from '../dto/clock.dto';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError("Failed to get my clock sheet", "CLOCK")
  @HandleError("Failed to get my clock sheet", "CLOCK")
  async getMyClockSheet(userId: string, dto: GetClockSheet): Promise<TResponse<any>> {
    const from = dto.from ? new Date(dto.from) :
      new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const to = dto.to ? new Date(dto.to) :
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const clocks = await this.prisma.timeClock.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        userId,
        createdAt: { gte: from, lte: to }
      },
      include: {
        shift: true,
      }
    });

    // --- Transform: calculate hours & group ---
    const groupedByWeek: Record<string, any> = {};

    clocks.forEach(clock => {
      if (!clock.clockInAt || !clock.clockOutAt) return;

      const start = new Date(clock.clockInAt);
      const end = new Date(clock.clockOutAt);
      const calculateHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const hours = Math.round(calculateHours * 100) / 100;

      // --- find week number ---
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() - start.getDay()); // Sunday
      const weekKey = weekStart.toISOString().split('T')[0]; // week id

      if (!groupedByWeek[weekKey]) {
        groupedByWeek[weekKey] = {
          weekStart: weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          daily: {},
          weeklyTotal: 0,
        };
      }

      const dateKey = start.toISOString().split('T')[0];
      if (!groupedByWeek[weekKey].daily[dateKey]) {
        groupedByWeek[weekKey].daily[dateKey] = {
          date: dateKey,
          totalHours: 0,
          entries: [],
        };
      }

      groupedByWeek[weekKey].daily[dateKey].entries.push({
        date: dateKey,
        shift: {
          id: clock.shiftId || "N/A",
          title: clock.shift?.shiftTitle || "N/A",
        },
        start: clock.clockInAt,
        end: clock.clockOutAt,
        totalHours: hours,
        regular: hours > 8 ? 8 : hours, // 8h cap as regular
        overtime: hours > 8 ? hours - 8 : 0,
        notes: clock.shift?.note || null,
      });

      groupedByWeek[weekKey].daily[dateKey].totalHours += hours;
      groupedByWeek[weekKey].weeklyTotal += hours;
    });

    // --- flatten result ---
    const result = Object.values(groupedByWeek).map(week => ({
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weeklyTotal: week.weeklyTotal,
      days: Object.values(week.daily),
    }));

    return successResponse(result, 'Clock sheet retrieved successfully');
  }
}
