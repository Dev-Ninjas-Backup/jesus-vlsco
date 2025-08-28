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
