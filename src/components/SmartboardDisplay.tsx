"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  CalculationMethod,
  Coordinates,
  PrayerTimes as AdhanPrayerTimes,
} from "adhan";
import { MoonPhase } from "astronomy-engine";
import { resolveIqamahRows } from "@/src/lib/iqamahTime";
import { MELISSA } from "@/src/lib/melissa";
import {
  hijriFromDate,
  hijriLabel,
  nextSunnahFast,
  type UpcomingDate,
} from "@/src/lib/lunar/calendarData";
import { moonSummary } from "@/src/lib/lunar/hilalWatch";
import {
  CAMPAIGN_ZEFFY_URL,
  FEATURED_CAMPAIGN_QUERY,
  GENERAL_ZEFFY_URL,
  PRAYER_SETTINGS_QUERY,
  flyersQuery,
  getSanityClient,
  resolveCampaign,
  resolvePrayerSettings,
  type CampaignDocument,
  type PrayerSettings,
} from "@/src/lib/sanity";

const DONORBOX_URL = "https://donorbox.org/embed/donate-to-imaan";
const REFRESH_MS = 300_000;
const SLIDE_MS = 12_000;
const TIME_ZONE = MELISSA.timeZone;
const coordinates = new Coordinates(MELISSA.lat, MELISSA.lng);

const CATEGORY_LABELS: Record<string, string> = {
  general: "General Announcement",
  sessions: "Interactive Sessions / Lectures",
  ramadan: "Ramadan Services & Taraweeh",
  eid: "Eid Celebrations & Prayers",
  youth: "Youth & Kids",
  sisters: "Sisters Program",
  fundraiser: "Fundraiser",
};

const ZELLE_CARDS = [
  { label: "Operations & Sadaqah", email: "donate@imaanmasjid.org" },
  { label: "Building Fund", email: "helpbuild@imaanmasjid.org" },
] as const;

type DisplayFlyer = {
  _id: string;
  title: string;
  category: string | null;
  imageUrl: string;
};

type FlyerHit = {
  _id: string;
  title?: string | null;
  category?: string | null;
  imageUrl?: string | null;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatClock(date: Date) {
  return date
    .toLocaleTimeString("en-US", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/[\u202f\u00a0]/g, " ");
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
  return new Date(
    sameDay.getTime() + (targetMinutes - chicagoMinutes(sameDay)) * 60 * 1000,
  );
}

function resolvePrayerOffset(settingStr: string | undefined, baseTime: Date) {
  if (!settingStr?.trim()) return { time: "" };
  const match = settingStr.match(/\+\s*(\d+)\s*(?:min|m)?/i);
  if (!match) return { time: settingStr };
  const minutesToAdd = parseInt(match[1], 10);
  const computed = new Date(baseTime.getTime() + minutesToAdd * 60 * 1000);
  return { time: formatTime(computed) };
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

function countdownClock(now: Date, targetSortKey: number) {
  const clock = chicagoClock(now);
  const nowSeconds = clock.hour * 3600 + clock.minute * 60 + clock.second;
  const remaining = Math.max(0, targetSortKey * 60 - nowSeconds);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function adhanFor(name: string, times: AdhanPrayerTimes) {
  if (name === "Fajr") return formatTime(times.fajr);
  if (name === "Dhuhr") return formatTime(times.dhuhr);
  if (name === "Asr") return formatTime(times.asr);
  if (name === "Maghrib") return formatTime(times.maghrib);
  if (name === "Taraweeh") return "After Isha";
  return formatTime(times.isha);
}

function fastChip(fast: UpcomingDate | null) {
  if (!fast) return "See the Hilāl calendar";
  const day = Number(fast.hijriLabel.split(" ")[0]);
  const hijriShort = fast.hijriLabel.replace(/ \d{3,4}$/, "");
  let name = fast.label;
  if (fast.label === "White Day") {
    const ordinal =
      day === 13 ? "1st" : day === 14 ? "2nd" : day === 15 ? "3rd" : "";
    name = ordinal ? `${ordinal} White Day` : "White Day";
  }
  const when = fast.when === "Today" ? "Today" : "Upcoming";
  return `${when}: ${name} · ${hijriShort}`;
}

function categoryLabel(category: string | null) {
  if (!category) return "Community";
  return CATEGORY_LABELS[category] ?? category;
}

function moonLitPath(phaseAngle: number) {
  const phase = (((phaseAngle % 360) + 360) % 360) / 360;
  const cx = 20;
  const cy = 20;
  const radius = 16;
  const terminator = Math.abs(Math.cos(phase * Math.PI * 2)) * radius;
  const top = `${cx} ${cy - radius}`;
  const bottom = `${cx} ${cy + radius}`;

  if (terminator < 0.4) {
    const outer = phase <= 0.5 ? 1 : 0;
    return `M ${top} A ${radius} ${radius} 0 0 ${outer} ${bottom} L ${top} Z`;
  }

  if (phase <= 0.5) {
    const sweep = phase < 0.25 ? 0 : 1;
    return `M ${top} A ${radius} ${radius} 0 0 1 ${bottom} A ${terminator} ${radius} 0 0 ${sweep} ${top} Z`;
  }

  const sweep = phase < 0.75 ? 0 : 1;
  return `M ${top} A ${radius} ${radius} 0 0 0 ${bottom} A ${terminator} ${radius} 0 0 ${sweep} ${top} Z`;
}

function flyersFromHits(documents: FlyerHit[] | null | undefined): DisplayFlyer[] {
  return (documents ?? []).flatMap((document) => {
    const imageUrl = document.imageUrl?.trim();
    const title = document.title?.trim();
    if (!imageUrl || !title) return [];
    return [
      {
        _id: document._id,
        title,
        category: document.category ?? null,
        imageUrl,
      },
    ];
  });
}

function QrTile({ value, label }: { value: string; label: string }) {
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0B1924", light: "#FFFFFF" },
    })
      .then((svg) => {
        if (!cancelled) setMarkup(svg);
      })
      .catch(() => {
        if (!cancelled) setMarkup("");
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div
        className="aspect-square w-full max-w-[9.25rem] rounded-xl bg-white p-1.5 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
        role="img"
        aria-label={label}
      />
      <p className="text-center text-[11px] font-semibold tracking-wide text-slate-200">
        {label}
      </p>
    </div>
  );
}

export default function SmartboardDisplay() {
  const [now, setNow] = useState<Date | null>(null);
  const [settings, setSettings] = useState<PrayerSettings | null>(null);
  const [flyers, setFlyers] = useState<DisplayFlyer[]>([]);
  const [flyersReady, setFlyersReady] = useState(false);
  const [zeffyUrl, setZeffyUrl] = useState(CAMPAIGN_ZEFFY_URL);
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [lunar, setLunar] = useState<{
    key: string;
    hijri: string;
    fast: string;
    phaseName: string;
    illuminationPercent: number;
    phaseAngle: number;
  } | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let sentinel: WakeLockSentinel | null = null;

    const acquire = async () => {
      if (cancelled || document.visibilityState !== "visible") return;
      if (!("wakeLock" in navigator)) return;
      try {
        sentinel = await navigator.wakeLock.request("screen");
      } catch {
        sentinel = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    const block = (event: Event) => event.preventDefault();
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlCursor = html.style.cursor;
    const previousBodyCursor = body.style.cursor;
    html.style.cursor = "none";
    body.style.cursor = "none";

    void acquire();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("selectstart", block);

    return () => {
      cancelled = true;
      html.style.cursor = previousHtmlCursor;
      body.style.cursor = previousBodyCursor;
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("selectstart", block);
      void sentinel?.release().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      const client = getSanityClient();
      Promise.all([
        client.fetch<Partial<PrayerSettings> | null>(PRAYER_SETTINGS_QUERY),
        client.fetch<FlyerHit[] | null>(flyersQuery),
        client.fetch<CampaignDocument | null>(FEATURED_CAMPAIGN_QUERY),
      ])
        .then(([settingsDoc, flyerDocs, campaignDoc]) => {
          if (cancelled) return;
          setSettings(resolvePrayerSettings(settingsDoc));
          setFlyers(flyersFromHits(flyerDocs));
          const campaign = resolveCampaign(campaignDoc);
          setZeffyUrl(
            campaign.donationUrl?.trim() ||
              CAMPAIGN_ZEFFY_URL ||
              GENERAL_ZEFFY_URL,
          );
          setFlyersReady(true);
        })
        .catch(() => {
          if (cancelled) return;
          setSettings((current) => current ?? resolvePrayerSettings(null));
          setFlyersReady(true);
        });
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setIndex((current) =>
      flyers.length === 0 ? 0 : Math.min(current, flyers.length - 1),
    );
  }, [flyers]);

  useEffect(() => {
    if (flyers.length < 2) return;
    let fadeTimer = 0;
    const cycle = window.setInterval(() => {
      setOpacity(0);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % flyers.length);
        setOpacity(1);
      }, 500);
    }, SLIDE_MS);
    return () => {
      window.clearInterval(cycle);
      window.clearTimeout(fadeTimer);
    };
  }, [flyers.length]);

  useEffect(() => {
    if (flyers.length < 2) return;
    const next = flyers[(index + 1) % flyers.length];
    if (!next) return;
    const image = new Image();
    image.src = next.imageUrl;
  }, [flyers, index]);

  useEffect(() => {
    if (!now) return;
    const key = now.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
    setLunar((current) => {
      if (current?.key === key) return current;
      const moon = moonSummary(now);
      return {
        key,
        hijri: hijriLabel(hijriFromDate(now)),
        fast: fastChip(nextSunnahFast(now)),
        phaseName: moon.phaseName,
        illuminationPercent: moon.illuminationPercent,
        phaseAngle: MoonPhase(now),
      };
    });
  }, [now]);

  const schedule = settings ?? resolvePrayerSettings(null);
  const activeFlyer = flyers[index] ?? null;

  let board: {
    rows: { name: string; adhan: string; iqamah: string }[];
    shifts: { shift: string; lecture: string; salah: string }[];
    nextName: string;
    countdown: string;
    dateLabel: string;
  } | null = null;

  if (now) {
    const date = melissaCalendarDate(now);
    const times = new AdhanPrayerTimes(
      coordinates,
      date,
      CalculationMethod.Karachi(),
    );
    const sunset = times.maghrib;
    const maghribDisplay = resolvePrayerOffset(schedule.maghrib, sunset);
    const maghribAt = clockInstant(maghribDisplay.time, sunset) ?? sunset;
    const ishaDisplay = resolvePrayerOffset(
      schedule.isha,
      offsetBase(schedule.isha, sunset, maghribAt, times.isha),
    );
    const ishaAt = clockInstant(ishaDisplay.time, sunset) ?? times.isha;
    const taraweehDisplay = schedule.taraweeh.trim()
      ? resolvePrayerOffset(
          schedule.taraweeh,
          offsetBase(schedule.taraweeh, sunset, maghribAt, ishaAt),
        )
      : { time: "" };
    const rows = resolveIqamahRows({
      sunset,
      ishaAdhan: times.isha,
      fajr: schedule.fajr,
      dhuhr: schedule.dhuhr,
      asr: schedule.asr,
      maghrib: schedule.maghrib,
      isha: schedule.isha,
      taraweeh: schedule.taraweeh,
    }).map((row) => {
      let iqamah = row.iqamah;
      if (row.name === "Maghrib" && maghribDisplay.time)
        iqamah = maghribDisplay.time;
      if (row.name === "Isha" && ishaDisplay.time) iqamah = ishaDisplay.time;
      if (row.name === "Taraweeh" && taraweehDisplay.time)
        iqamah = taraweehDisplay.time;
      return {
        name: row.name,
        adhan: adhanFor(row.name, times),
        iqamah,
        sortKey: row.sortKey,
        minutes: row.minutes,
      };
    });
    const nowMinutes = chicagoMinutes(now);
    const upcoming = rows.find((row) => row.sortKey > nowMinutes);
    const nextPrayer = upcoming ?? rows[0];
    const target = upcoming ? nextPrayer.sortKey : nextPrayer.minutes + 24 * 60;
    board = {
      rows: rows.map(({ name, adhan, iqamah }) => ({ name, adhan, iqamah })),
      shifts: [
        {
          shift: "1st Jumu'ah",
          lecture: schedule.jumuahFirstLecture,
          salah: schedule.jumuahFirstSalah,
        },
        {
          shift: "2nd Jumu'ah",
          lecture: schedule.jumuahSecondLecture,
          salah: schedule.jumuahSecondSalah,
        },
      ],
      nextName: nextPrayer?.name ?? "Fajr",
      countdown: countdownClock(now, target),
      dateLabel: now.toLocaleDateString("en-US", {
        timeZone: TIME_ZONE,
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }

  return (
    <div
      className="h-screen w-screen cursor-none select-none overflow-hidden bg-[#0B1924] text-white pointer-events-none"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
    >
      <div className="grid h-full min-h-0 grid-cols-12 grid-rows-[minmax(0,1fr)] gap-5 p-5">
        <div className="col-span-5 flex h-full min-h-0 flex-col justify-between gap-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/images/logo.png"
                alt=""
                draggable={false}
                className="h-14 w-auto"
              />
              <p className="truncate text-lg font-semibold tracking-tight">
                Imaan Masjid • Melissa, TX
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-4xl font-semibold tabular-nums leading-none">
                {now ? formatClock(now) : "--:--:-- --"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {board?.dateLabel ?? "Loading the date…"}
              </p>
              <p className="text-sm font-medium text-brand-gold">
                {lunar?.hijri ?? "Loading the Hijri date…"}
              </p>
            </div>
          </div>

          <section
            aria-label="Prayer and Jumu'ah schedule"
            className="rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold tabular-nums text-white">
                {board
                  ? `Next: ${board.nextName} in ${board.countdown}`
                  : "Loading today's prayers…"}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                Karachi · Melissa
              </p>
            </div>
            {schedule.specialAnnouncement ? (
              <p className="mt-2 line-clamp-2 rounded-xl border border-brand-gold/40 bg-brand-gold/15 px-3 py-1.5 text-sm font-semibold text-brand-gold">
                {schedule.specialAnnouncement}
              </p>
            ) : null}
            <div className="mt-2 grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span className="py-1.5 text-left">Prayer</span>
              <span className="py-1.5 text-left">Adhan</span>
              <span className="py-1.5 text-right">Iqamah</span>
            </div>
            {(board?.rows ?? []).map((row) => {
              const current = row.name === board?.nextName;
              return (
                <div
                  key={row.name}
                  className={`grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center border-b border-slate-800/80 py-1.5 ${current ? "rounded-lg bg-brand-gold/15 px-2" : ""}`}
                >
                  <span
                    className={`text-lg font-bold ${current ? "text-brand-gold" : "text-white"}`}
                  >
                    {row.name}
                  </span>
                  <span className="text-base font-medium tabular-nums text-slate-200">
                    {row.adhan}
                  </span>
                  <span className="text-right text-xl font-bold tabular-nums text-white">
                    {row.iqamah}
                  </span>
                </div>
              );
            })}
            <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-700/80">
              {(board?.shifts ?? []).map((shift) => (
                <div
                  key={shift.shift}
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 border-t border-slate-800 px-3 py-1.5 first:border-t-0"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-brand-gold">
                    {shift.shift}
                  </span>
                  <span className="text-sm text-slate-200">
                    Lecture {shift.lecture}
                  </span>
                  <span className="text-right text-sm font-semibold text-white">
                    Salah {shift.salah}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Tonight's Hilāl"
            className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5"
          >
            <div className="flex shrink-0 flex-col items-center">
              <svg viewBox="0 0 40 40" className="h-14 w-14" aria-hidden="true">
                <circle cx="20" cy="20" r="16" className="fill-brand-teal" />
                <path
                  d={moonLitPath(lunar?.phaseAngle ?? 0)}
                  className="fill-brand-gold"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  className="stroke-brand-gold"
                  strokeWidth="1"
                />
              </svg>
              <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-brand-gold">
                {lunar ? `${lunar.illuminationPercent}%` : "—"}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                Tonight&apos;s Hilāl
              </p>
              <p className="mt-0.5 truncate text-base font-semibold text-white">
                {lunar?.phaseName ?? "Reading the moon…"}
              </p>
              <p className="truncate text-sm text-slate-300">
                {lunar?.fast ?? "Loading the next Sunnah fast…"}
              </p>
            </div>
          </section>

          <section
            aria-label="Ways to give"
            className="rounded-2xl border border-slate-700/70 bg-slate-900/90 p-3.5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
              Ways to Give
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <QrTile value={zeffyUrl} label="Zeffy • 0% Fee" />
                <QrTile value={DONORBOX_URL} label="Donorbox • Card/ACH" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Zelle
                </p>
                {ZELLE_CARDS.map((card) => (
                  <div
                    key={card.email}
                    className="rounded-2xl border border-slate-600/80 bg-[#0B1924] px-3 py-2"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tracking-tight text-white">
                      {card.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-7 flex h-full min-h-0 flex-col">
          <FlyerStage
            flyer={activeFlyer}
            count={flyers.length}
            index={index}
            opacity={opacity}
            ready={flyersReady}
          />
        </div>
      </div>
    </div>
  );
}

function FlyerStage({
  flyer,
  count,
  index,
  opacity,
  ready,
}: {
  flyer: DisplayFlyer | null;
  count: number;
  index: number;
  opacity: number;
  ready: boolean;
}) {
  if (!ready) {
    return (
      <div className="relative flex h-full min-h-0 flex-col justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-center text-lg text-slate-300">
          Loading community flyers…
        </p>
      </div>
    );
  }

  if (!flyer) {
    return (
      <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Imaan Masjid · Melissa, TX
          </p>
          <p className="mt-8 text-6xl font-semibold tracking-tight">
            Assalamu Alaikum
          </p>
          <p className="mt-4 max-w-2xl text-2xl leading-snug text-slate-300">
            Welcome. Please make yourselves at home in the house of Allah.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Silence phones", "Quiet them before you enter the musalla."],
            ["Shoes on the racks", "Leave the walkways and rows clear."],
            ["Low voices", "Keep conversation soft inside the prayer hall."],
            ["Fill the rows", "Come forward and close the gaps."],
          ].map(([title, detail]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-700/80 bg-[#0B1924]/80 px-4 py-3"
            >
              <p className="text-base font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-300">{detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Sadaqah Jariyah
          </p>
          <p className="mt-2 max-w-3xl text-xl leading-snug text-white">
            A gift toward this masjid keeps benefiting the community after you
            leave. Scan a code on the left to give.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
            {categoryLabel(flyer.category)}
          </p>
          <p className="truncate text-lg font-semibold text-white">
            {flyer.title}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-300">
          {index + 1} / {count}
        </p>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <img
          src={flyer.imageUrl}
          alt={flyer.title}
          draggable={false}
          className="h-full max-h-full min-h-0 w-full rounded-2xl object-contain transition-opacity duration-700"
          style={{ opacity }}
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            key={`${flyer._id}-${index}`}
            className="smartboard-progress h-full w-full bg-brand-gold"
            style={{
              animationDuration: count > 1 ? `${SLIDE_MS}ms` : "0ms",
              transform: count > 1 ? undefined : "scaleX(1)",
            }}
          />
        </div>
        <div className="flex max-w-[40%] flex-wrap justify-end gap-1.5">
          {Array.from({ length: count }, (_, dot) => (
            <span
              key={dot}
              className={
                dot === index
                  ? "h-1.5 w-4 rounded-full bg-brand-gold"
                  : "h-1.5 w-1.5 rounded-full bg-white/30"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
