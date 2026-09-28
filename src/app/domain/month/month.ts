export interface IYearMonth {
  year: number;
  month: number;
}

export function shiftMonth(year: number, month: number, delta: number): IYearMonth {
  let nextMonth = month + delta;
  let nextYear = year;

  if (nextMonth < 1) {
    nextMonth = 12;
    nextYear -= 1;
  } else if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  return { year: nextYear, month: nextMonth };
}
