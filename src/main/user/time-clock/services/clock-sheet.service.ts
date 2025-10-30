import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { DateTime } from 'luxon';
import { GetClockSheet } from '../dto/clock.dto';
import {
  calcAmount,
  getBreakHours,
  getLocalDateKey,
  toDecimal,
} from '../helper/timesheet.helper';

@Injectable()
export class ClockSheetService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get my clock sheet', 'CLOCK')
  async getMyClockSheet(
    userId: string,
    dto: GetClockSheet,
  ): Promise<TResponse<any>> {
    const timezone = dto.timezone || 'America/Edmonton';

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, payroll: true },
    });

    if (!user) throw new AppError(404, 'User not found');
    if (!user.payroll) throw new AppError(404, 'Payroll not found');

    const payroll = user.payroll;
    const breakHours = getBreakHours(payroll.breakTimePerDay);

    // --- convert from/to to Luxon DateTime in requested timezone ---
    const fromDate =
      dto.from && !isNaN(dto.from.getTime())
        ? DateTime.fromJSDate(dto.from)
            .setZone(timezone)
            .startOf('day')
            .toJSDate()
        : DateTime.now().setZone(timezone).startOf('month').toJSDate();

    const toDate =
      dto.to && !isNaN(dto.to.getTime())
        ? DateTime.fromJSDate(dto.to).setZone(timezone).endOf('day').toJSDate()
        : DateTime.now().setZone(timezone).endOf('month').toJSDate();

    // --- fetch clocks ---
    // Fetch timeClocks that overlap the requested date range (any portion of the clock interval falls inside)
    const clocks = await this.prisma.timeClock.findMany({
      orderBy: { clockInAt: 'asc' },
      where: {
        userId,
        AND: [
          { clockInAt: { lte: toDate } }, // starts on or before the 'to' boundary
          { clockOutAt: { gte: fromDate } }, // ends on or after the 'from' boundary
        ],
      },
      include: { shift: true },
    });

    const overTimeRequestOfClocks = await this.prisma.requestOverTime.findMany({
      where: { timeClockId: { in: clocks.map((c) => c.id) } },
    });

    // --- weekly grouping ---
    const groupedByWeek = new Map<
      string,
      {
        weekStart: Date;
        weekEnd: Date;
        daily: Map<
          string,
          { date: string; totalHours: number; entries: any[] }
        >;
        // New fields for clarity and parity:
        weeklyTotal: number; // legacy/raw: sum of netWorked (kept for backward compat)
        weeklyRawWorked: number; // explicit raw worked (same as weeklyTotal)
        weeklyPaidRegular: number; // sum of paid regular hours (capped at 8 per entry)
        weeklyPaidOvertime: number; // sum of paid overtime hours (only when isOvertimeAllowed)
      }
    >();

    const getWeekStartSunday = (date: Date) => {
      const dt = DateTime.fromJSDate(date).setZone(timezone);
      const daysToSubtract = dt.weekday % 7; // Sunday=7 % 7 = 0, Monday=1 etc.
      return dt.minus({ days: daysToSubtract }).startOf('day').toJSDate();
    };

    // --- iterate clocks and populate weekly/day structures ---
    clocks.forEach((clock) => {
      if (!clock.clockInAt || !clock.clockOutAt) return;

      const start = DateTime.fromJSDate(clock.clockInAt).setZone(timezone);
      const end = DateTime.fromJSDate(clock.clockOutAt).setZone(timezone);
      const worked = end.diff(start, 'hours').hours;

      const weekStart = getWeekStartSunday(end.toJSDate());
      const weekKey = getLocalDateKey(weekStart);

      if (!groupedByWeek.has(weekKey)) {
        groupedByWeek.set(weekKey, {
          weekStart,
          weekEnd: DateTime.fromJSDate(weekStart).plus({ days: 6 }).toJSDate(),
          daily: new Map(),
          weeklyTotal: 0,
          weeklyRawWorked: 0,
          weeklyPaidRegular: 0,
          weeklyPaidOvertime: 0,
        });
      }

      const weekData = groupedByWeek.get(weekKey)!;

      const dateKey = getLocalDateKey(end.toJSDate());
      if (!weekData.daily.has(dateKey)) {
        weekData.daily.set(dateKey, {
          date: dateKey,
          totalHours: 0,
          entries: [],
        });
      }

      const dayData = weekData.daily.get(dateKey)!;

      // Apply break once per day
      let netWorked = worked;
      if (dayData.totalHours === 0) {
        netWorked = Math.max(worked - breakHours, 0);
      }

      // compute regular and overtime according to business rule (overtime only when allowed)
      const regularHours = netWorked > 8 ? 8 : netWorked;
      const overtimeHours = netWorked > 8 ? netWorked - 8 : 0;
      // netWorked > 8 && clock.isOvertimeAllowed ? netWorked - 8 : 0;

      // Add entry (keeps existing per-entry fields)
      dayData.entries.push({
        date: clock.clockOutAt || dateKey,
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
        totalHours: toDecimal(netWorked),
        regular: regularHours,
        overtime: overtimeHours,
        notes: clock.shift?.note || null,
        isOvertimeAllowed: clock.isOvertimeAllowed,
        overTimeRequestStatus:
          overTimeRequestOfClocks.find((r) => r.timeClockId === clock.id)
            ?.status || 'N/A',
      });

      // accumulate raw & paid hours
      dayData.totalHours = dayData.totalHours + netWorked;
      weekData.weeklyRawWorked = weekData.weeklyRawWorked + netWorked;
      weekData.weeklyPaidRegular = weekData.weeklyPaidRegular + regularHours;
      weekData.weeklyPaidOvertime = weekData.weeklyPaidOvertime + overtimeHours;

      // maintain legacy weeklyTotal (raw worked) for backward compatibility
      weekData.weeklyTotal = weekData.weeklyRawWorked;
    });

    // --- Build result array and compute canonical parent totals from weekly paid sums ---
    const result = Array.from(groupedByWeek.values()).map((week) => ({
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weeklyTotal: toDecimal(week.weeklyTotal),
      weeklyPaidRegular: toDecimal(week.weeklyPaidRegular),
      weeklyPaidOvertime: toDecimal(week.weeklyPaidOvertime),
      weeklyPaidTotal: toDecimal(
        week.weeklyPaidRegular + week.weeklyPaidOvertime,
      ),
      weeklyRawWorked: toDecimal(week.weeklyRawWorked),
      days: Array.from(week.daily.values()).map((day) => ({
        ...day,
        totalHours: toDecimal(day.totalHours),
      })),
    }));

    // Compute canonical parent totals from weeklyPaid fields (ensures parity)
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    groupedByWeek.forEach((w) => {
      totalRegularHours += w.weeklyPaidRegular;
      totalOvertimeHours += w.weeklyPaidOvertime;
    });

    const totalRegularPay = calcAmount(
      totalRegularHours,
      payroll.regularPayRate,
      payroll.regularPayRateType,
    );

    const totalOvertimePay = calcAmount(
      totalOvertimeHours,
      payroll.overTimePayRate,
      payroll.overTimePayRateType,
    );

    const regularPayRate = calcAmount(
      8,
      payroll.regularPayRate,
      payroll.regularPayRateType,
    );
    const overTimePayRate = calcAmount(
      8,
      payroll.overTimePayRate,
      payroll.overTimePayRateType,
    );

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
        dataPeriod: {
          from: fromDate,
          to: toDate,
        },
        paymentData: {
          payPerDay: {
            regularPayRate,
            overTimePayRate,
          },
          payPerHour: {
            regularPayRate: regularPayRate / 8,
            overTimePayRate: overTimePayRate / 8,
          },
          totalRegularHour: totalRegularHours,
          totalOvertimeHour: totalOvertimeHours,
          totalRegularPay,
          totalOvertimePay,
        },
      },
      'Clock sheet retrieved successfully',
    );
  }
}
