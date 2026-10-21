export const TIME_ZONE = "America/Chicago";

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul-Qadah",
  "Dhul-Hijjah",
] as const;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type HijriDate = {
  year: number;
  month: number;
  day: number;
};

export type MarkKind = "white-day" | "prohibited" | "sacred";

export type DayMark = {
  kind: MarkKind;
  label: string;
  short: string;
  detail: "Sunnah fast" | "Sacred date" | "Prohibited fast";
};

export type CalendarCell = {
  hijri: HijriDate;
  gregorian: Date;
  gregorianLabel: string;
  weekday: number;
  marks: DayMark[];
};

export type MonthGrid = {
  year: number;
  month: number;
  monthName: string;
  leadingBlanks: number;
  cells: CalendarCell[];
  observances: CalendarCell[];
};

export type UpcomingDate = {
  when: "Today" | "Upcoming";
  label: string;
  detail: DayMark["detail"];
  hijriLabel: string;
  gregorianLabel: string;
};

const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const gregorianFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return Number(parts.find((part) => part.type === type)?.value);
}

export function chicagoDate(year: number, month: number, day: number, hour = 12, minute = 0) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(guess);
  const hourPart = partValue(parts, "hour");
  const asUtc = Date.UTC(
    partValue(parts, "year"),
    partValue(parts, "month") - 1,
    partValue(parts, "day"),
    hourPart === 24 ? 0 : hourPart,
    partValue(parts, "minute"),
    partValue(parts, "second"),
  );
  return new Date(guess.getTime() - (asUtc - guess.getTime()));
}

export function gregorianParts(date: Date) {
  const parts = gregorianFormatter.formatToParts(date);
  return {
    year: partValue(parts, "year"),
    month: partValue(parts, "month"),
    day: partValue(parts, "day"),
  };
}

export function hijriFromDate(date: Date): HijriDate {
  const parts = hijriFormatter.formatToParts(date);
  return {
    year: partValue(parts, "year"),
    month: partValue(parts, "month"),
    day: partValue(parts, "day"),
  };
}

export function weekdayIndex(date: Date) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(date);
  const index = WEEKDAYS.indexOf(name as (typeof WEEKDAYS)[number]);
  return index < 0 ? 0 : index;
}

export function gregorianLabel(date: Date, withWeekday = false) {
  return date.toLocaleDateString("en-US", {
    timeZone: TIME_ZONE,
    weekday: withWeekday ? "short" : undefined,
    month: "short",
    day: "numeric",
  });
}

function estimateGregorian(year: number, month: number, day: number) {
  const days = (year - 1) * 354.367 + (month - 1) * 29.5306 + (day - 1);
  return new Date(Date.UTC(622, 6, 19) + days * 86400000);
}

export function gregorianForHijri(year: number, month: number, day: number) {
  const estimate = estimateGregorian(year, month, day);
  for (const span of [6, 25]) {
    for (let delta = -span; delta <= span; delta += 1) {
      const candidate = new Date(estimate.getTime() + delta * 86400000);
      const civil = gregorianParts(candidate);
      const noon = chicagoDate(civil.year, civil.month, civil.day);
      const hijri = hijriFromDate(noon);
      if (hijri.year === year && hijri.month === month && hijri.day === day) return noon;
    }
  }
  return null;
}

export function daysInHijriMonth(year: number, month: number) {
  const thirtieth = gregorianForHijri(year, month, 30);
  if (!thirtieth) return 29;
  const hijri = hijriFromDate(thirtieth);
  return hijri.year === year && hijri.month === month && hijri.day === 30 ? 30 : 29;
}

export function marksForDay(month: number, day: number): DayMark[] {
  const marks: DayMark[] = [];

  if (month === 1 && day === 10) {
    marks.push({ kind: "sacred", label: "Day of Ashura", short: "Ashura", detail: "Sunnah fast" });
  }
  if (month === 9 && day >= 21) {
    marks.push({
      kind: "sacred",
      label: "Last 10 Nights of Ramadan",
      short: "Last 10",
      detail: "Sacred date",
    });
  }
  if (month === 10 && day === 1) {
    marks.push({ kind: "sacred", label: "Eid al-Fitr", short: "Eid", detail: "Sacred date" });
  }
  if (month === 12 && day === 9) {
    marks.push({ kind: "sacred", label: "Day of Arafah", short: "Arafah", detail: "Sunnah fast" });
  }
  if (month === 12 && day === 10) {
    marks.push({ kind: "sacred", label: "Eid al-Adha", short: "Eid", detail: "Sacred date" });
  }
  if (month === 12 && day === 13) {
    marks.push({
      kind: "prohibited",
      label: "Prohibited fast",
      short: "No fast",
      detail: "Prohibited fast",
    });
    return marks;
  }
  if (month !== 9 && (day === 13 || day === 14 || day === 15)) {
    marks.push({ kind: "white-day", label: "White Day", short: "White", detail: "Sunnah fast" });
  }

  return marks;
}

function cellFor(year: number, month: number, day: number): CalendarCell | null {
  const gregorian = gregorianForHijri(year, month, day);
  if (!gregorian) return null;
  return {
    hijri: { year, month, day },
    gregorian,
    gregorianLabel: gregorianLabel(gregorian),
    weekday: weekdayIndex(gregorian),
    marks: marksForDay(month, day),
  };
}

export function buildMonth(year: number, month: number): MonthGrid {
  const length = daysInHijriMonth(year, month);
  const cells: CalendarCell[] = [];
  for (let day = 1; day <= length; day += 1) {
    const cell = cellFor(year, month, day);
    if (cell) cells.push(cell);
  }
  return {
    year,
    month,
    monthName: HIJRI_MONTHS[month - 1] ?? "",
    leadingBlanks: cells[0]?.weekday ?? 0,
    cells,
    observances: cells.filter((cell) => cell.marks.length > 0),
  };
}

export function shiftMonth(year: number, month: number, delta: number): HijriDate {
  const index = year * 12 + (month - 1) + delta;
  const monthIndex = ((index % 12) + 12) % 12;
  return {
    year: Math.floor(index / 12),
    month: monthIndex + 1,
    day: 1,
  };
}

export function hijriLabel(date: HijriDate) {
  return `${date.day} ${HIJRI_MONTHS[date.month - 1]} ${date.year}`;
}

function nextMarked(from: Date, match: (mark: DayMark) => boolean): UpcomingDate | null {
  const start = gregorianParts(from);
  for (let offset = 0; offset < 370; offset += 1) {
    const civil = new Date(Date.UTC(start.year, start.month - 1, start.day + offset));
    const noon = chicagoDate(civil.getUTCFullYear(), civil.getUTCMonth() + 1, civil.getUTCDate());
    const hijri = hijriFromDate(noon);
    const mark = marksForDay(hijri.month, hijri.day).find(match);
    if (!mark) continue;
    return {
      when: offset === 0 ? "Today" : "Upcoming",
      label: mark.label,
      detail: mark.detail,
      hijriLabel: hijriLabel(hijri),
      gregorianLabel: gregorianLabel(noon, true),
    };
  }
  return null;
}

export function nextNotable(from: Date): UpcomingDate | null {
  return nextMarked(from, (mark) => mark.kind !== "prohibited");
}

export function nextSunnahFast(from: Date): UpcomingDate | null {
  return nextMarked(from, (mark) => mark.detail === "Sunnah fast");
}
