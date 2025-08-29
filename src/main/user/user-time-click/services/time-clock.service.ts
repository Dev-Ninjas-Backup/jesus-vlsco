import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { SubmitTimeSheet } from '../dto/clock.dto';
import {
  calcAmount,
  getBreakHours,
  getLocalDateKey,
  toDecimal,
} from '../helper/helper';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

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
