import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetClockSheet, SubmitTimeSheet } from '../dto/clock.dto';
import {
  calcAmount,
  getBreakHours,
  getLocalDateKey,
  getWeekStart,
  toDecimal,
} from '../helper/helper';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get my clock sheet', 'CLOCK')
  async getMyClockSheet(
    userId: string,
    dto: GetClockSheet,
  ): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new AppError(404, 'User not found');

    const from = dto.from
      ? new Date(dto.from)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const to = dto.to
      ? new Date(dto.to)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const clocks = await this.prisma.timeClock.findMany({
      orderBy: { createdAt: 'asc' },
      where: { userId, createdAt: { gte: from, lte: to } },
      include: { shift: true },
    });

    // --- weekly grouping ---
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
      const hours = toDecimal((end.getTime() - start.getTime()) / 36e5);

      const weekStart = getWeekStart(start);
      const weekKey = getLocalDateKey(weekStart);

      if (!groupedByWeek.has(weekKey)) {
        groupedByWeek.set(weekKey, {
          weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 86400000),
          daily: new Map(),
          weeklyTotal: 0,
        });
      }

      const weekData = groupedByWeek.get(weekKey)!;

      const dateKey = getLocalDateKey(start);
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
        id: clock.id,
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

      dayData.totalHours = toDecimal(dayData.totalHours + hours);
      weekData.weeklyTotal = toDecimal(weekData.weeklyTotal + hours);
    });

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

    return successResponse(
      {
        clockSheet: {
          user: {
            id: user.id,
            firstName: user?.profile?.firstName || 'N/A',
            lastName: user?.profile?.lastName || 'N/A',
            email: user?.email || 'N/A',
            phone: user?.phone || 'N/A',
            profileUrl: user?.profile?.profileUrl || 'N/A',
          },
          result,
        },
        daysEntries: flatDaysEntries,
      },
      'Clock sheet retrieved successfully',
    );
  }

  @HandleError('Failed to submit timesheet', 'PAYROLL')
  async submitTimeClockSheet(userId: string, dto: SubmitTimeSheet) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { payroll: true },
    });

    if (!user) throw new AppError(404, 'User not found');
    if (!user.payroll) throw new AppError(404, 'Payroll config not found');

    const { from, to } = dto;
    if (!from || !to) throw new AppError(400, 'From and To dates required');

    const clocks = await this.prisma.timeClock.findMany({
      where: {
        userId,
        clockInAt: { gte: new Date(from) },
        clockOutAt: { lte: new Date(to) },
      },
      orderBy: { clockInAt: 'asc' },
    });

    if (!clocks.length)
      throw new AppError(404, 'No clock entries found for this period');

    const {
      breakTimePerDay,
      regularPayRate,
      regularPayRateType,
      overTimePayRate,
      overTimePayRateType,
    } = user.payroll;

    const breakHours = getBreakHours(breakTimePerDay);

    // --- calculate totals per day considering overtime ---
    const dailyMap = new Map<
      string,
      { regularHours: number; overtimeHours: number }
    >();

    clocks.forEach((c) => {
      if (!c.clockInAt || !c.clockOutAt) return;

      const worked = (c.clockOutAt.getTime() - c.clockInAt.getTime()) / 36e5;
      const dayKey = getLocalDateKey(new Date(c.clockInAt));

      // apply break once per day
      const netWorked = Math.max(worked - breakHours, 0);

      let reg = netWorked;
      let ot = 0;

      if (c.isOvertimeAllowed) {
        reg = netWorked > 8 ? 8 : netWorked;
        ot = netWorked > 8 ? netWorked - 8 : 0;
      }

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, { regularHours: 0, overtimeHours: 0 });
      }

      const current = dailyMap.get(dayKey)!;
      current.regularHours += reg;
      current.overtimeHours += ot;
    });

    let totalHours = 0,
      regularHours = 0,
      overtimeHours = 0;

    dailyMap.forEach((v) => {
      regularHours += v.regularHours;
      overtimeHours += v.overtimeHours;
      totalHours += v.regularHours + v.overtimeHours;
    });

    totalHours = toDecimal(totalHours);
    regularHours = toDecimal(regularHours);
    overtimeHours = toDecimal(overtimeHours);

    const amount = toDecimal(
      calcAmount(regularHours, regularPayRate, regularPayRateType) +
        calcAmount(overtimeHours, overTimePayRate, overTimePayRateType),
    );

    // --- idempotent payroll entry (update if exists) ---
    const existing = await this.prisma.payrollEntries.findFirst({
      where: { userId, startDate: new Date(from), endDate: new Date(to) },
    });

    let payrollEntry;
    if (existing) {
      payrollEntry = await this.prisma.payrollEntries.update({
        where: { id: existing.id },
        data: {
          totalHours,
          regularHours,
          overtimeHours,
          amount,
          status: 'PENDING',
        },
      });
    } else {
      payrollEntry = await this.prisma.payrollEntries.create({
        data: {
          userId,
          totalHours,
          regularHours,
          overtimeHours,
          amount,
          status: 'PENDING',
          startDate: new Date(from),
          endDate: new Date(to),
        },
      });
    }

    return successResponse(
      payrollEntry,
      'Payroll entry submitted successfully',
    );
  }
}
