export const masjidLocation = {
  name: "Imaan Masjid",
  address: "1010 Milrany Ln, Melissa, TX",
  timeZone: "America/Chicago",
  latitude: 33.2859,
  longitude: -96.5728,
} as const;

export type DailyPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type IqamahRule =
  | { type: "offset"; minutes: number }
  | { type: "clock"; time: string };

/**
 * Congregation delays after athan. Swap any prayer to `{ type: "clock", time: "HH:mm" }`
 * when the masjid posts a fixed iqamah. This is the sheet the widget reads.
 */
export const iqamahRules: Record<DailyPrayer, IqamahRule> = {
  fajr: { type: "offset", minutes: 20 },
  dhuhr: { type: "offset", minutes: 15 },
  asr: { type: "offset", minutes: 15 },
  maghrib: { type: "offset", minutes: 5 },
  isha: { type: "offset", minutes: 15 },
};

export type JumuahShiftConfig = {
  id: "first" | "second";
  label: string;
  englishTalk: string;
  khutbah: string;
  salah: string;
};

/**
 * English talk times are the clocks on the posted Jumu'ah flyers.
 * Daylight matches the CDT flyer (2:00 and 3:30). Standard matches the CST flyer (1:00 and 2:00).
 * Khutbah starts 20 minutes after the English talk, and salah 15 minutes after khutbah.
 */
const KHUTBAH_AFTER_ENGLISH_MINUTES = 20;
const SALAH_AFTER_KHUTBAH_MINUTES = 15;

function clockPlus(hhmm: string, minutes: number) {
  const [hour, minute] = hhmm.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}

function shift(
  id: JumuahShiftConfig["id"],
  label: string,
  englishTalk: string
): JumuahShiftConfig {
  const khutbah = clockPlus(englishTalk, KHUTBAH_AFTER_ENGLISH_MINUTES);
  return {
    id,
    label,
    englishTalk,
    khutbah,
    salah: clockPlus(khutbah, SALAH_AFTER_KHUTBAH_MINUTES),
  };
}

export const jumuahSchedules = {
  daylight: [
    shift("first", "1st Jumu'ah", "14:00"),
    shift("second", "2nd Jumu'ah", "15:30"),
  ],
  standard: [
    shift("first", "1st Jumu'ah", "13:00"),
    shift("second", "2nd Jumu'ah", "14:00"),
  ],
} as const;

export type PrayerSchedule = {
  daylight: boolean;
  iqamah: Record<DailyPrayer, IqamahRule>;
  jumuah: JumuahShiftConfig[];
};

export function isChicagoDaylight(date: Date) {
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: masjidLocation.timeZone,
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  return zone === "CDT";
}

export function getPrayerSchedule(date = new Date()): PrayerSchedule {
  const daylight = isChicagoDaylight(date);
  return {
    daylight,
    iqamah: iqamahRules,
    jumuah: daylight ? [...jumuahSchedules.daylight] : [...jumuahSchedules.standard],
  };
}
