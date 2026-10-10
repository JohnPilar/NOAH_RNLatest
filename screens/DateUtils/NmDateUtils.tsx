var XDate = require('xdate');

export function page(date: any, firstDayOfWeek: number = 0, showSixWeeks: boolean = false): any[] {
  const days = month(date);

  let before: any[] = [];
  let after: any[] = [];

  const fdow = (7 + firstDayOfWeek) % 7 || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  const daysBefore = from.getDay();

  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();

  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  const daysForSixWeeks = (daysBefore + days.length) / 6 >= 6;

  if (showSixWeeks && !daysForSixWeeks) {
    to.addDays(7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

export function sameMonth(a: any, b: any): boolean {
  if (!isValidXDate(a) || !isValidXDate(b)) {
    return false;
  } else {
    return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth();
  }
}

function isGTE(a: any, b: any): boolean | undefined {
  if (a && b) {
    return b.diffDays(a) > -1;
  }
}

function isLTE(a: any, b: any): boolean | undefined {
  if (a && b) {
    return a.diffDays(b) > -1;
  }
}

function fromTo(a: any, b: any): any[] {
  const days: any[] = [];
  let from = +a;
  const to = +b;

  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

function month(date: any): any[] {
  // exported for tests only
  const year = date.getFullYear(),
    month = date.getMonth();
  const days = new XDate(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

function isValidXDate(date: any): boolean {
  return date && date instanceof XDate;
}

export function isDateNotInRange(date: any, dateRange: any): boolean {
  const year = dateRange.getFullYear(),
    month = dateRange.getMonth();
  const days = new XDate(year, month + 1, 0).getDate();

  const minDate = new XDate(year, month, 1, 0, 0, 0, true);
  const maxDate = new XDate(year, month, days, 0, 0, 0, true);

  return (minDate && !isGTE(date, new XDate(minDate))) || (maxDate && !isLTE(date, new XDate(maxDate)));
}

export function getTimeKeepingDate(mDate: any, mTime: string): any {
  const sepMS = mTime.split('.');
  const timeParts = sepMS[0].split(':');
  let newDate = new XDate(mDate);
  newDate.setHours(timeParts[0]);
  newDate.setMinutes(timeParts[1]);
  newDate.setSeconds(timeParts[2]);

  return newDate;
}

export const NmGetSQLDate = (date: any): string => {
  return new XDate(date).toString('yyyy/MM/dd HH:mm:ss.fff');
};

export function NmGetFormattedTimeDiff(totalMins: any): string {
  if (totalMins == undefined || totalMins < 1) {
    return '0h 0m';
  } else {
    try {
      return `${(totalMins / 60) ^ 0}`.slice(-2) + 'h ' + Math.round(totalMins % 60) + 'm';
    } catch {
      return '0h 0m';
    }
  }
}

export function NmGetDateTimeSplit(mDate: string, mTime: string, returnVal: any = new XDate()): any {
  const splitDate = mDate.split('T') || [];
  const splitTime = mTime.split('.') || [];

  let validDate = false;
  let validTime = false;

  if (splitDate?.length > 1) {
    validDate = true;
  }

  if (splitTime?.length > 1) {
    validTime = true;
  }

  if (validDate && validTime) {
    return new XDate(splitDate[0] + 'T' + splitTime[0], true);
  } else {
    return returnVal;
  }
}
