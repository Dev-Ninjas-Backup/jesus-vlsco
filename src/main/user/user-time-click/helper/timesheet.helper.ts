export const toDecimal = (num: number) => Number(num.toFixed(2));

export const getBreakHours = (b: string): number =>
  b === 'HALF_HOUR'
    ? 0.5
    : b === 'ONE_HOUR'
      ? 1
      : b === 'TWO_HOUR'
        ? 2
        : b === 'THREE_HOUR'
          ? 3
          : 0;

export const calcAmount = (hrs: number, rate: number, type: string) =>
  type === 'HOUR'
    ? hrs * rate
    : type === 'DAY'
      ? Math.ceil(hrs / 8) * rate
      : type === 'WEEK'
        ? Math.ceil(hrs / 40) * rate
        : rate; // MONTH flat

export const getLocalDateKey = (date: Date) => date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz

export const getWeekStart = (date: Date) => {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Sunday as start
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

export type ClockEntry = {
  id: string;
  clockInAt: string;
  clockOutAt: string;
  isOvertimeAllowed: boolean;
  shift?: any;
  shiftId?: string;
};

export type DayTotals = {
  dateKey: string;
  workedHours: number; // raw worked hours (sum of shifts - breaks)
  regularHours: number; // capped to 8 per day (policy)
  overtimeHours: number; // remainder if overtime allowed
  entries: Array<any>; // original entries for display
};

export type PeriodTotals = {
  totalWorked: number;
  totalRegular: number;
  totalOvertime: number;
  daily: DayTotals[];
};

const MS_PER_HOUR = 36e5;
const DEFAULT_REGULAR_DAILY = 8;

/**
 * computeWorkedHours: returns decimal hours between in/out
 */
export function computeWorkedHours(inAt: Date | string, outAt: Date | string) {
  const start = new Date(inAt);
  const end = new Date(outAt);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;
  return toDecimal((end.getTime() - start.getTime()) / MS_PER_HOUR);
}

/**
 * aggregateDailyTotals:
 * - clocks: list of ClockEntry (unsorted ok)
 * - breakHours: numeric hours to subtract ONCE per day
 * - overtimePerDay: boolean - if true compute overtime as (worked - 8)
 * - overtimeAllowedCheck: 'perShift' | 'perDay' - determines how overtime allowance is determined
 */
export function aggregateDailyTotals(
  clocks: ClockEntry[],
  breakHours = 0,
  overtimePerDay = true,
  overtimeAllowedCheck: 'perShift' | 'perDay' = 'perDay',
): PeriodTotals {
  // group by local date
  const dailyMap = new Map<
    string,
    { entries: ClockEntry[]; rawWorked: number; anyOvertimeAllowed: boolean }
  >();

  clocks.forEach((c) => {
    if (!c.clockInAt || !c.clockOutAt) return;
    const key = getLocalDateKey(new Date(c.clockInAt));
    const hours = computeWorkedHours(c.clockInAt, c.clockOutAt);

    if (!dailyMap.has(key))
      dailyMap.set(key, {
        entries: [],
        rawWorked: 0,
        anyOvertimeAllowed: false,
      });
    const d = dailyMap.get(key)!;
    d.entries.push(c);
    d.rawWorked = toDecimal(d.rawWorked + hours);
    if (overtimeAllowedCheck === 'perShift') {
      if (c.isOvertimeAllowed) d.anyOvertimeAllowed = true;
    } else {
      // perDay: if any shift that day has allowed flag -> allow overtime that day
      if (c.isOvertimeAllowed) d.anyOvertimeAllowed = true;
    }
  });

  const dailyResults: DayTotals[] = [];
  let totalWorked = 0,
    totalRegular = 0,
    totalOvertime = 0;

  for (const [dateKey, v] of Array.from(dailyMap.entries()).sort()) {
    const netWorked = Math.max(toDecimal(v.rawWorked - breakHours), 0);
    let regular = netWorked;
    let overtime = 0;

    if (overtimePerDay && v.anyOvertimeAllowed) {
      regular = Math.min(netWorked, DEFAULT_REGULAR_DAILY);
      overtime = Math.max(toDecimal(netWorked - DEFAULT_REGULAR_DAILY), 0);
    } else {
      // if overtime not allowed: all is regular (but still may want to cap for reporting)
      regular = netWorked;
      overtime = 0;
    }

    regular = toDecimal(regular);
    overtime = toDecimal(overtime);

    dailyResults.push({
      dateKey,
      workedHours: toDecimal(netWorked),
      regularHours: regular,
      overtimeHours: overtime,
      entries: v.entries.map((e) => ({
        id: e.id,
        start: e.clockInAt,
        end: e.clockOutAt,
        totalHours: computeWorkedHours(e.clockInAt, e.clockOutAt),
        isOvertimeAllowed: e.isOvertimeAllowed ?? false,
        shiftId: e.shiftId,
        shift: e.shift || null,
      })),
    });

    totalWorked += netWorked;
    totalRegular += regular;
    totalOvertime += overtime;
  }

  return {
    totalWorked: toDecimal(totalWorked),
    totalRegular: toDecimal(totalRegular),
    totalOvertime: toDecimal(totalOvertime),
    daily: dailyResults,
  };
}

/**
 * computePayrollFromTotals: takes the PeriodTotals and payroll rates and returns amounts.
 */
export function computePayrollFromTotals(
  totals: PeriodTotals,
  payrollConfig: {
    regularPayRate: number;
    regularPayRateType: string;
    overTimePayRate: number;
    overTimePayRateType: string;
  },
) {
  const totalRegularPay = calcAmount(
    totals.totalRegular,
    payrollConfig.regularPayRate,
    payrollConfig.regularPayRateType,
  );
  const totalOvertimePay = calcAmount(
    totals.totalOvertime,
    payrollConfig.overTimePayRate,
    payrollConfig.overTimePayRateType,
  );

  const regularPayRateFor8 = calcAmount(
    8,
    payrollConfig.regularPayRate,
    payrollConfig.regularPayRateType,
  );
  const overtimePayRateFor8 = calcAmount(
    8,
    payrollConfig.overTimePayRate,
    payrollConfig.overTimePayRateType,
  );

  return {
    totalRegularPay: toDecimal(totalRegularPay),
    totalOvertimePay: toDecimal(totalOvertimePay),
    perDay: {
      regularPayRate: toDecimal(regularPayRateFor8),
      overTimePayRate: toDecimal(overtimePayRateFor8),
    },
    totals,
  };
}
