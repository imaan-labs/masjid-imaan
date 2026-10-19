import {
  CalculationParameters,
  Coordinates,
  Madhab,
  PrayerTimes,
} from "adhan";
import {
  getPrayerSchedule,
  masjidLocation,
  type DailyPrayer,
  type IqamahRule,
  type JumuahShiftConfig,
} from "@/src/config/prayerSchedule";

const TIME_ZONE = masjidLocation.timeZone;

const PRAYER_ORDER: DailyPrayer[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

const PRAYER_NAMES: Record<DailyPrayer, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export type CalculatedStart = {
  label: string;
  at: Date;
};

export type PrayerRow = {
  key: DailyPrayer;
  name: string;
  athan: Date;
  iqamah: Date;
  starts: CalculatedStart[];
};

export type JumuahShift = {
  id: "first" | "second";
  label: string;
  englishTalk: Date;
  khutbah: Date;
  salah: Date;
};

export type Upcoming = {
  title: string;
  detail: string;
  at: Date;
  tomorrow: boolean;
  prayerKey: DailyPrayer | null;
  shiftId: "first" | "second" | null;
};

export type PrayerDay = {
  dateLabel: string;
  daylight: boolean;
  isFriday: boolean;
  prayers: PrayerRow[];
  jumuah: JumuahShift[];
  upcoming: Upcoming;
};

function zonePart(date: Date, type: Intl.DateTimeFormatPartTypes, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    ...options,
  })
    .formatToParts(date)
    .find((part) => part.type === type)?.value;
}

function chicagoYmd(date: Date) {
  return {
    year: Number(zonePart(date, "year", { year: "numeric" })),
    month: Number(zonePart(date, "month", { month: "2-digit" })),
    day: Number(zonePart(date, "day", { day: "2-digit" })),
  };
}

function zoneOffsetMs(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const lookup: Record<string, string> = {};
  formatted.forEach((part) => {
    lookup[part.type] = part.value;
  });

  const asUtc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second)
  );

  return asUtc - date.getTime();
}

export function chicagoWallTime(day: Date, hhmm: string) {
  const [hour, minute] = hhmm.split(":").map(Number);
  const { year, month, day: date } = chicagoYmd(day);
  const utcGuess = new Date(Date.UTC(year, month - 1, date, hour, minute, 0));
  const offset = zoneOffsetMs(utcGuess);
  let result = new Date(utcGuess.getTime() - offset);
  const corrected = zoneOffsetMs(result);
  if (corrected !== offset) {
    result = new Date(utcGuess.getTime() - corrected);
  }
  return result;
}

function chicagoCalendarDate(day: Date) {
  const { year, month, day: date } = chicagoYmd(day);
  return new Date(year, month - 1, date, 12, 0, 0, 0);
}

function addChicagoDays(day: Date, days: number) {
  const { year, month, day: date } = chicagoYmd(day);
  return new Date(year, month - 1, date + days, 12, 0, 0, 0);
}

export function isFridayInChicago(day: Date) {
  return (
    zonePart(day, "weekday", { weekday: "short" }) === "Fri"
  );
}

function prayerParameters(
  fajrAngle: number,
  ishaAngle: number,
  madhab: (typeof Madhab)["Shafi"] | (typeof Madhab)["Hanafi"]
) {
  const parameters = new CalculationParameters(null, fajrAngle, ishaAngle);
  parameters.madhab = madhab;
  return parameters;
}

function timesFor(
  day: Date,
  fajrAngle: number,
  ishaAngle: number,
  madhab: (typeof Madhab)["Shafi"] | (typeof Madhab)["Hanafi"]
) {
  return new PrayerTimes(
    new Coordinates(masjidLocation.latitude, masjidLocation.longitude),
    chicagoCalendarDate(day),
    prayerParameters(fajrAngle, ishaAngle, madhab)
  );
}

function calculatedStarts(day: Date) {
  const angle15 = timesFor(day, 15, 15, Madhab.Shafi);
  const angle18 = timesFor(day, 18, 18, Madhab.Shafi);
  const hanafi = timesFor(day, 15, 15, Madhab.Hanafi);

  return {
    primary: angle15,
    starts: {
      fajr: [
        { label: "15°", at: angle15.fajr },
        { label: "18°", at: angle18.fajr },
      ],
      dhuhr: [{ label: "", at: angle15.dhuhr }],
      asr: [
        { label: "Standard", at: angle15.asr },
        { label: "Hanafi", at: hanafi.asr },
      ],
      maghrib: [{ label: "", at: angle15.maghrib }],
      isha: [
        { label: "15°", at: angle15.isha },
        { label: "18°", at: angle18.isha },
      ],
    } satisfies Record<DailyPrayer, CalculatedStart[]>,
  };
}

function iqamahTime(athan: Date, rule: IqamahRule, day: Date) {
  if (rule.type === "offset") {
    return new Date(athan.getTime() + rule.minutes * 60_000);
  }
  return chicagoWallTime(day, rule.time);
}

function dailyPrayers(day: Date): PrayerRow[] {
  const { primary, starts } = calculatedStarts(day);
  const schedule = getPrayerSchedule(day);
  return PRAYER_ORDER.map((key) => ({
    key,
    name: PRAYER_NAMES[key],
    athan: primary[key],
    iqamah: iqamahTime(primary[key], schedule.iqamah[key], day),
    starts: starts[key],
  }));
}

function jumuahShifts(day: Date, shifts: JumuahShiftConfig[]): JumuahShift[] {
  return shifts.map((shift) => ({
    id: shift.id,
    label: shift.label,
    englishTalk: chicagoWallTime(day, shift.englishTalk),
    khutbah: chicagoWallTime(day, shift.khutbah),
    salah: chicagoWallTime(day, shift.salah),
  }));
}

type TimelineItem = Upcoming;

function tomorrowFajr(day: Date): TimelineItem {
  const fajr = dailyPrayers(addChicagoDays(day, 1))[0];
  return {
    title: fajr.name,
    detail: "Athan",
    at: fajr.athan,
    tomorrow: true,
    prayerKey: "fajr",
    shiftId: null,
  };
}

export function getPrayerDay(now = new Date()): PrayerDay {
  const schedule = getPrayerSchedule(now);
  const prayers = dailyPrayers(now);
  const friday = isFridayInChicago(now);
  const jumuah = jumuahShifts(now, schedule.jumuah);
  const events: TimelineItem[] = [];

  prayers.forEach((prayer) => {
    events.push({
      title: prayer.name,
      detail: "Athan",
      at: prayer.athan,
      tomorrow: false,
      prayerKey: prayer.key,
      shiftId: null,
    });
    events.push({
      title: prayer.name,
      detail: "Iqamah",
      at: prayer.iqamah,
      tomorrow: false,
      prayerKey: prayer.key,
      shiftId: null,
    });
  });

  if (friday) {
    jumuah.forEach((shift) => {
      events.push({
        title: shift.label,
        detail: "English talk",
        at: shift.englishTalk,
        tomorrow: false,
        prayerKey: null,
        shiftId: shift.id,
      });
      events.push({
        title: shift.label,
        detail: "Khutbah",
        at: shift.khutbah,
        tomorrow: false,
        prayerKey: null,
        shiftId: shift.id,
      });
      events.push({
        title: shift.label,
        detail: "Salah",
        at: shift.salah,
        tomorrow: false,
        prayerKey: null,
        shiftId: shift.id,
      });
    });
  }

  events.sort((left, right) => left.at.getTime() - right.at.getTime());
  const upcoming =
    events.find((event) => event.at.getTime() > now.getTime()) ??
    tomorrowFajr(now);

  return {
    dateLabel: new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now),
    daylight: schedule.daylight,
    isFriday: friday,
    prayers,
    jumuah,
    upcoming,
  };
}

export function formatChicagoTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCountdown(target: Date, now: Date) {
  const total = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const minuteText = String(minutes).padStart(2, "0");
  const secondText = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}h ${minuteText}m ${secondText}s`;
  return `${minutes}m ${secondText}s`;
}
