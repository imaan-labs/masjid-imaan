const TIME_ZONE = "America/Chicago";
const DAY_MINUTES = 24 * 60;

export type ResolvedIqamah = {
  name: string;
  iqamah: string;
  minutes: number;
  sortKey: number;
};

type AnchorName = "sunset" | "maghrib" | "isha";

function chicagoMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const hour = value("hour") === 24 ? 0 : value("hour");
  return hour * 60 + value("minute");
}

function minutesFromClock(label: string) {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (hour > 12 || minute > 59) return null;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function clockTime(label: string): ResolvedIqamah["minutes"] | null {
  const minutes = minutesFromClock(label);
  return minutes == null ? null : minutes;
}

function relativeOffset(label: string): { anchor: AnchorName; minutes: number } | null {
  const match = label.trim().match(/^(sunset|maghrib|isha)\s*\+\s*(\d+)\s*(?:min(?:ute)?s?)?$/i);
  if (!match) return null;
  const minutes = Number(match[2]);
  if (!Number.isFinite(minutes)) return null;
  return { anchor: match[1].toLowerCase() as AnchorName, minutes };
}

function at(minutes: number, sortKey = minutes): Pick<ResolvedIqamah, "minutes" | "sortKey"> {
  return { minutes: ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES, sortKey };
}

function afterDate(anchor: Date, offset: number): Pick<ResolvedIqamah, "minutes" | "sortKey"> {
  const target = new Date(anchor.getTime() + offset * 60 * 1000);
  const minutes = chicagoMinutes(target);
  const anchorMinutes = chicagoMinutes(anchor);
  const sortKey = minutes < anchorMinutes ? minutes + DAY_MINUTES : minutes;
  return { minutes, sortKey };
}

function afterResolved(
  anchor: Pick<ResolvedIqamah, "minutes" | "sortKey">,
  offset: number,
): Pick<ResolvedIqamah, "minutes" | "sortKey"> {
  return at(anchor.sortKey + offset, anchor.sortKey + offset);
}

function resolveMaghrib(label: string, sunset: Date): Pick<ResolvedIqamah, "minutes" | "sortKey"> {
  const clock = clockTime(label);
  if (clock != null) return at(clock);
  const offset = relativeOffset(label);
  if (offset && (offset.anchor === "sunset" || offset.anchor === "maghrib")) {
    return afterDate(sunset, offset.minutes);
  }
  return afterDate(sunset, 5);
}

function resolveIsha(
  label: string,
  sunset: Date,
  maghrib: Pick<ResolvedIqamah, "minutes" | "sortKey">,
  ishaAdhan: Date,
): Pick<ResolvedIqamah, "minutes" | "sortKey"> {
  const clock = clockTime(label);
  if (clock != null) return at(clock);
  const offset = relativeOffset(label);
  if (offset?.anchor === "sunset") return afterDate(sunset, offset.minutes);
  if (offset?.anchor === "maghrib") return afterResolved(maghrib, offset.minutes);
  if (offset?.anchor === "isha") return afterDate(ishaAdhan, offset.minutes);
  return at(0);
}

function resolveTaraweeh(
  label: string,
  sunset: Date,
  maghrib: Pick<ResolvedIqamah, "minutes" | "sortKey">,
  isha: Pick<ResolvedIqamah, "minutes" | "sortKey">,
): Pick<ResolvedIqamah, "minutes" | "sortKey"> | null {
  const clock = clockTime(label);
  if (clock != null) return at(clock);
  const offset = relativeOffset(label);
  if (!offset) return null;
  if (offset.anchor === "sunset") return afterDate(sunset, offset.minutes);
  if (offset.anchor === "maghrib") return afterResolved(maghrib, offset.minutes);
  return afterResolved(isha, offset.minutes);
}

export function resolveIqamahRows(input: {
  sunset: Date;
  ishaAdhan: Date;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  taraweeh?: string | null;
}): ResolvedIqamah[] {
  const maghrib = resolveMaghrib(input.maghrib, input.sunset);
  const isha = resolveIsha(input.isha, input.sunset, maghrib, input.ishaAdhan);
  const rows: ResolvedIqamah[] = [
    { name: "Fajr", iqamah: input.fajr, ...at(clockTime(input.fajr) ?? 0) },
    { name: "Dhuhr", iqamah: input.dhuhr, ...at(clockTime(input.dhuhr) ?? 0) },
    { name: "Asr", iqamah: input.asr, ...at(clockTime(input.asr) ?? 0) },
    { name: "Maghrib", iqamah: input.maghrib, ...maghrib },
    { name: "Isha", iqamah: input.isha, ...isha },
  ];

  const taraweehLabel = input.taraweeh?.trim() ?? "";
  if (!taraweehLabel) return rows;

  const taraweeh = resolveTaraweeh(taraweehLabel, input.sunset, maghrib, isha);
  rows.push({
    name: "Taraweeh",
    iqamah: taraweehLabel,
    ...(taraweeh ?? { minutes: -1, sortKey: -1 }),
  });
  return rows;
}
