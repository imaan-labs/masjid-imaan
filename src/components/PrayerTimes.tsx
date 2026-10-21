"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
} from "adhan";
import { resolveIqamahRows } from "@/src/lib/iqamahTime";
import {
  DEFAULT_PRAYER_SETTINGS,
  PRAYER_SETTINGS_QUERY,
  getSanityClient,
  resolvePrayerSettings,
  type PrayerSettings,
} from "@/src/lib/sanity";

const coordinates = new Coordinates(33.2859, -96.5728);
const TIME_ZONE = "America/Chicago";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function resolvePrayerOffset(
  settingStr: string | undefined,
  baseTime: Date,
): { time: string; note?: string } {
  if (!settingStr?.trim()) return { time: "" };

  const match = settingStr.match(/\+\s*(\d+)\s*(?:min|m)?/i);
  if (match) {
    const minutesToAdd = parseInt(match[1], 10);
    const computed = new Date(baseTime.getTime() + minutesToAdd * 60 * 1000);
    return { time: formatTime(computed), note: settingStr };
  }

  return { time: settingStr };
}

function clockInstant(label: string, sameDay: Date) {
  const match = label
    .replace(/\u202f/g, " ")
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (hour > 12 || minute > 59) return null;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  const targetMinutes = hour * 60 + minute;
  return new Date(sameDay.getTime() + (targetMinutes - chicagoMinutes(sameDay)) * 60 * 1000);
}

function offsetBase(label: string, sunset: Date, maghrib: Date, isha: Date) {
  const anchor = label.match(/^(sunset|maghrib|isha)/i)?.[1].toLowerCase();
  if (anchor === "maghrib") return maghrib;
  if (anchor === "isha") return isha;
  return sunset;
}

function melissaCalendarDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return new Date(value("year"), value("month") - 1, value("day"), 12, 0, 0);
}

function calculatedTimes(now: Date) {
  const date = melissaCalendarDate(now);
  const params15 = CalculationMethod.NorthAmerica();
  const times15 = new AdhanPrayerTimes(coordinates, date, params15);

  const params18 = CalculationMethod.Karachi();
  const times18 = new AdhanPrayerTimes(coordinates, date, params18);

  const paramsHanafi = CalculationMethod.NorthAmerica();
  paramsHanafi.madhab = Madhab.Hanafi;
  const timesHanafi = new AdhanPrayerTimes(coordinates, date, paramsHanafi);

  return { times15, times18, timesHanafi };
}

function chicagoClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const hour = value("hour") === 24 ? 0 : value("hour");
  return { hour, minute: value("minute"), second: value("second") };
}

function chicagoMinutes(date: Date) {
  const clock = chicagoClock(date);
  return clock.hour * 60 + clock.minute;
}

function countdownLabel(now: Date, targetSortKey: number) {
  const clock = chicagoClock(now);
  const nowSeconds = clock.hour * 3600 + clock.minute * 60 + clock.second;
  const targetSeconds = targetSortKey * 60;
  const remaining = Math.max(0, targetSeconds - nowSeconds);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function iqamahRows(sunset: Date, ishaAdhan: Date, settings: PrayerSettings) {
  return resolveIqamahRows({
    sunset,
    ishaAdhan,
    fajr: settings.fajr,
    dhuhr: settings.dhuhr,
    asr: settings.asr,
    maghrib: settings.maghrib,
    isha: settings.isha,
    taraweeh: settings.taraweeh,
  });
}

function adhanNote(
  name: string,
  times15: AdhanPrayerTimes,
  times18: AdhanPrayerTimes,
  timesHanafi: AdhanPrayerTimes,
) {
  if (name === "Fajr") {
    return `15°: ${formatTime(times15.fajr)} | 18°: ${formatTime(times18.fajr)}`;
  }
  if (name === "Dhuhr") {
    return formatTime(times15.dhuhr);
  }
  if (name === "Asr") {
    return `Std: ${formatTime(times15.asr)} | Hanafi: ${formatTime(timesHanafi.asr)}`;
  }
  if (name === "Maghrib") {
    return formatTime(times15.maghrib);
  }
  if (name === "Taraweeh") {
    return "After Isha";
  }
  return `15°: ${formatTime(times15.isha)} | 18°: ${formatTime(times18.isha)}`;
}

function jumuahShifts(settings: PrayerSettings) {
  return [
    {
      shift: "1st Jumu'ah",
      lecture: settings.jumuahFirstLecture,
      salah: settings.jumuahFirstSalah,
    },
    {
      shift: "2nd Jumu'ah",
      lecture: settings.jumuahSecondLecture,
      salah: settings.jumuahSecondSalah,
    },
  ];
}

export default function PrayerTimes({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  const [settings, setSettings] = useState<PrayerSettings>(DEFAULT_PRAYER_SETTINGS);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSanityClient()
      .fetch<Partial<PrayerSettings> | null>(PRAYER_SETTINGS_QUERY)
      .then((document) => {
        const settings = resolvePrayerSettings(document);
        console.log("Sanity prayer settings:", settings);
        if (!cancelled) setSettings(settings);
      })
      .catch((error) => {
        console.log("Sanity prayer settings:", error);
        if (!cancelled) setSettings(DEFAULT_PRAYER_SETTINGS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!now) {
    return (
      <section
        id="prayer-times"
        className="mx-4 my-4 max-w-5xl rounded-3xl bg-brand-dark px-4 py-6 text-white shadow-xl sm:mx-auto sm:p-10"
      >
        <p className="text-sm text-slate-300">Loading today&apos;s prayer times…</p>
      </section>
    );
  }

  const { times15, times18, timesHanafi } = calculatedTimes(now);
  const sunset = times15.maghrib;
  const maghribDisplay = resolvePrayerOffset(settings.maghrib, sunset);
  const maghribAt = clockInstant(maghribDisplay.time, sunset) ?? sunset;
  const ishaDisplay = resolvePrayerOffset(
    settings.isha,
    offsetBase(settings.isha, sunset, maghribAt, times15.isha),
  );
  const ishaAt = clockInstant(ishaDisplay.time, sunset) ?? times15.isha;
  const taraweehDisplay = settings.taraweeh.trim()
    ? resolvePrayerOffset(settings.taraweeh, offsetBase(settings.taraweeh, sunset, maghribAt, ishaAt))
    : { time: "" };
  const rows = iqamahRows(sunset, times15.isha, settings).map((row) => {
    if (row.name === "Maghrib" && maghribDisplay.time) return { ...row, iqamah: maghribDisplay.time };
    if (row.name === "Isha" && ishaDisplay.time) return { ...row, iqamah: ishaDisplay.time };
    if (row.name === "Taraweeh" && taraweehDisplay.time) return { ...row, iqamah: taraweehDisplay.time };
    return row;
  });
  const shifts = jumuahShifts(settings);
  const nowMinutes = chicagoMinutes(now);
  const upcoming = rows.find((row) => row.sortKey > nowMinutes);
  const nextPrayer = upcoming ?? rows[0];
  const nextIsTomorrow = !upcoming || nextPrayer.sortKey >= 24 * 60;
  const countdown = countdownLabel(
    now,
    upcoming ? nextPrayer.sortKey : nextPrayer.minutes + 24 * 60,
  );
  const dateLabel = now.toLocaleDateString("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      id="prayer-times"
      className={
        compact
          ? "scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-950/95 p-6 text-white shadow-2xl backdrop-blur-xl"
          : "mx-4 my-2 max-w-5xl scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-950/95 p-3 text-white shadow-2xl backdrop-blur-xl sm:mx-auto sm:my-8 sm:p-10"
      }
    >
      <div className="mx-auto max-w-5xl">
        {settings.specialAnnouncement ? (
          <p className="mb-3 rounded-2xl border border-brand-gold/50 bg-brand-gold/15 px-3 py-2 text-sm font-semibold text-brand-gold">
            {settings.specialAnnouncement}
          </p>
        ) : null}
        <div className="rounded-2xl border border-brand-gold/40 bg-white/10 px-3 py-2 md:px-4 md:py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
            {nextIsTomorrow ? "Next prayer · Tomorrow" : "Next prayer"}
          </p>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">{nextPrayer.name}</h2>
            <p className="text-right text-base font-semibold text-slate-200">
              Iqamah {nextPrayer.iqamah}
            </p>
          </div>
          <p className="mt-1 font-mono text-sm text-brand-gold">{countdown}</p>
        </div>

        <div className={`mt-3 ${compact ? "" : "md:hidden"}`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            Today&apos;s Prayer &amp; Iqamah
          </p>
          <div
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center border-b border-white/10 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-300"
            role="row"
          >
            <span className="py-1 text-left">Prayer</span>
            <span className="py-1 text-left">Adhan</span>
            <span className="py-1 text-right">Iqamah</span>
          </div>
          {rows.map((row) => {
            const current = row.name === nextPrayer.name;
            return (
              <div
                key={row.name}
                className={`grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center border-b border-slate-800 py-1.5 ${current ? "rounded-lg bg-white/10" : ""}`}
                role="row"
              >
                <span className={`text-sm font-bold ${current ? "text-brand-gold" : "text-white"}`}>
                  {row.name}
                </span>
                <span className="text-xs font-medium leading-4 text-slate-300">
                  {adhanNote(row.name, times15, times18, timesHanafi)}
                </span>
                <span className="text-right text-base font-bold text-white">{row.iqamah}</span>
              </div>
            );
          })}
        </div>

        <div className={`mb-8 mt-8 flex-col justify-between border-b border-white/15 pb-4 md:flex-row md:items-end ${compact ? "hidden" : "hidden md:flex"}`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              Daily & Congregational
            </span>
            <h2 className="mt-1 text-3xl font-bold text-white">
              {settings.title}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Melissa, TX (33.2859° N, 96.5728° W)
            </p>
          </div>
          <div className="mt-4 text-sm text-slate-300 md:mt-0 md:text-right">
            {dateLabel}
          </div>
        </div>

        <div className={`gap-4 md:grid-cols-2 ${taraweehDisplay.time ? "lg:grid-cols-6" : "lg:grid-cols-5"} ${compact ? "hidden" : "hidden md:grid"}`}>
          <PrayerCard name="Fajr" iqamah={settings.fajr}>
            <div>
              <span className="text-slate-300">15°:</span> {formatTime(times15.fajr)}
            </div>
            <div>
              <span className="text-slate-300">18°:</span> {formatTime(times18.fajr)}
            </div>
          </PrayerCard>

          <PrayerCard name="Dhuhr" iqamah={settings.dhuhr}>
            <span className="text-slate-300">Adhan:</span> {formatTime(times15.dhuhr)}
          </PrayerCard>

          <PrayerCard name="Asr" iqamah={settings.asr}>
            <div>
              <span className="text-slate-300">Standard:</span> {formatTime(times15.asr)}
            </div>
            <div>
              <span className="text-slate-300">Hanafi:</span> {formatTime(timesHanafi.asr)}
            </div>
          </PrayerCard>

          <PrayerCard name="Maghrib" iqamah={maghribDisplay.time} note={maghribDisplay.note} iqamahClassName="text-xl">
            <span className="text-slate-300">Adhan:</span> {formatTime(times15.maghrib)}
          </PrayerCard>

          <PrayerCard name="Isha" iqamah={ishaDisplay.time} note={ishaDisplay.note}>
            <div>
              <span className="text-slate-300">15°:</span> {formatTime(times15.isha)}
            </div>
            <div>
              <span className="text-slate-300">18°:</span> {formatTime(times18.isha)}
            </div>
          </PrayerCard>

          {taraweehDisplay.time ? (
            <PrayerCard name="Taraweeh" iqamah={taraweehDisplay.time} note={taraweehDisplay.note} iqamahClassName="text-xl">
              <span className="text-slate-300">After Isha</span>
            </PrayerCard>
          ) : null}
        </div>

        <div id="jumuah" className={`scroll-mt-28 ${compact ? "mt-3" : "mt-4 md:mt-8"}`}>
          <div className={`grid ${compact ? "grid-cols-2 gap-2" : "grid-cols-1 gap-4 md:grid-cols-2"}`}>
            {shifts.map((shift) => (
              <div
                key={shift.shift}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-brand-gold">
                  {shift.shift}
                </span>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-white">
                    Lecture: {shift.lecture}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    Salah: {shift.salah}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrayerCard({
  name,
  iqamah,
  note,
  iqamahClassName = "text-2xl",
  children,
}: {
  name: string;
  iqamah: string;
  note?: string;
  iqamahClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-200 hover:border-brand-gold/60">
      <h3 className="text-lg font-bold text-brand-gold">{name}</h3>
      <div className="my-2 rounded-xl bg-black/25 py-2">
        <span className="block text-xs font-medium uppercase text-slate-300">
          Iqamah
        </span>
        <span className={`${iqamahClassName} font-extrabold text-white`}>{iqamah}</span>
        {note ? <span className="mt-1 block px-2 text-[10px] font-medium text-slate-400">{note}</span> : null}
      </div>
      <div className="mt-3 space-y-1 text-xs text-slate-300">{children}</div>
    </div>
  );
}
