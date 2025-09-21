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
  getWeekStart,
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

    const payroll = user?.payroll;

    const from = dto.from
      ? new Date(dto.from).toISOString()
      : new Date().toISOString();
    const to = dto.to
      ? new Date(dto.to).toISOString()
      : new Date().toISOString();

    // Convert from/to to Luxon DateTime in requested timezone
    const fromDate = dto.from
      ? DateTime.fromISO(from, { zone: timezone }).startOf('day').toJSDate()
      : DateTime.now().setZone(timezone).startOf('month').toJSDate();

    const toDate = dto.to
      ? DateTime.fromISO(to, { zone: timezone }).endOf('day').toJSDate()
      : DateTime.now().setZone(timezone).endOf('month').toJSDate();

    const clocks = await this.prisma.timeClock.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        userId,
        createdAt: { gte: fromDate, lte: toDate },
      },
      include: { shift: true },
    });

    const overTimeRequestOfClocks = await this.prisma.requestOverTime.findMany({
      where: {
        timeClockId: { in: clocks.map((c) => c.id) },
      },
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

    let totalRegularHours = 0;
    let totalOvertimeHours = 0;

    const breakHours = getBreakHours(payroll.breakTimePerDay);

    clocks.forEach((clock) => {
      if (!clock.clockInAt || !clock.clockOutAt) return;

      const start = new Date(clock.clockInAt);
      const end = new Date(clock.clockOutAt);
      const worked = (end.getTime() - start.getTime()) / 36e5;

      const weekStart = getWeekStart(end);
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

      const dateKey = getLocalDateKey(end);
      if (!weekData.daily.has(dateKey)) {
        weekData.daily.set(dateKey, {
          date: dateKey,
          totalHours: 0,
          entries: [],
        });
      }

      const dayData = weekData.daily.get(dateKey)!;

      // apply break once per day
      let netWorked = worked;
      if (dayData.totalHours === 0) {
        netWorked = Math.max(worked - breakHours, 0);
      }

      const regularHours = netWorked > 8 ? 8 : netWorked;
      const overtimeHours =
        netWorked > 8 && clock.isOvertimeAllowed ? toDecimal(netWorked - 8) : 0;

      totalRegularHours += regularHours;
      totalOvertimeHours += overtimeHours;

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

      dayData.totalHours = toDecimal(dayData.totalHours + netWorked);
      weekData.weeklyTotal = toDecimal(weekData.weeklyTotal + netWorked);
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
