"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import {
  CalculationMethod,
  Coordinates,
  Madhab,
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
  GENERAL_ZEFFY_URL,
  FEATURED_CAMPAIGN_QUERY,
  PRAYER_SETTINGS_QUERY,
  flyersQuery,
  getSanityClient,
  resolveCampaign,
  resolvePrayerSettings,
  type CampaignDocument,
  type FlyerDocument,
  type PrayerSettings,
} from "@/src/lib/sanity";

const DONORBOX_URL = "https://donorbox.org/embed/donate-to-imaan";
const REFRESH_MS = 300_000;
const SLIDE_MS = 60_000;
const SWIPE_PX = 40;
const EXIT_TAPS = 5;
const EXIT_WINDOW_MS = 3_000;
const EXIT_IDLE_MS = 10_000;
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

type KioskFlyer = {
  _id: string;
  title: string;
  category: string | null;
  imageUrl: string;
};

type LunarSnapshot = {
  key: string;
  hijri: string;
  fast: string;
  phaseName: string;
  illuminationPercent: number;
  phaseAngle: number;
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
  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function prayerWindows(
  now: Date,
  times: AdhanPrayerTimes,
  timesHanafi: AdhanPrayerTimes,
  nextFajr: Date,
) {
  const sunrise = times.sunrise;
  const midnight = new Date(
    times.maghrib.getTime() + (nextFajr.getTime() - times.maghrib.getTime()) / 2,
  );
  const standardAsr = formatTime(times.asr);
  const hanafiAsr = formatTime(timesHanafi.asr);
  const until: Record<string, string> = {
    Dhuhr: `${standardAsr} / ${hanafiAsr}`,
    Asr: formatTime(times.maghrib),
    Maghrib: formatTime(times.isha),
    Isha: `Midnight ${formatTime(midnight)}`,
  };
  const t = now.getTime();
  let lead = "Current Window: Dhuhr • Ends at";
  let timesLabel = [standardAsr, hanafiAsr];
  if (t < times.fajr.getTime()) {
    lead = "Current Window: Isha • Next Fajr at";
    timesLabel = [formatTime(times.fajr)];
  } else if (t < sunrise.getTime()) {
    lead = "Fajr Window • Sunrise at";
    timesLabel = [formatTime(sunrise)];
  } else if (t < times.dhuhr.getTime()) {
    lead = "Dhuhr Window • Starts at";
    timesLabel = [formatTime(times.dhuhr)];
  } else if (t < times.asr.getTime()) {
    lead = "Current Window: Dhuhr • Ends at";
    timesLabel = [standardAsr, hanafiAsr];
  } else if (t < timesHanafi.asr.getTime()) {
    lead = "Current Window: Asr • Hanafi Dhuhr until";
    timesLabel = [hanafiAsr];
  } else if (t < times.maghrib.getTime()) {
    lead = "Current Window: Asr • Ends at";
    timesLabel = [formatTime(times.maghrib)];
  } else if (t < times.isha.getTime()) {
    lead = "Current Window: Maghrib • Ends at";
    timesLabel = [formatTime(times.isha)];
  } else if (t < midnight.getTime()) {
    lead = "Current Window: Isha • Midnight at";
    timesLabel = [formatTime(midnight)];
  } else {
    lead = "Current Window: Isha • Next Fajr at";
    timesLabel = [formatTime(nextFajr)];
  }
  return { sunrise: formatTime(sunrise), until, lead, timesLabel };
}

function adhanNote(
  name: string,
  timesKarachi: AdhanPrayerTimes,
  times15: AdhanPrayerTimes,
  timesHanafi: AdhanPrayerTimes,
) {
  if (name === "Fajr") {
    return `18°: ${formatTime(timesKarachi.fajr)} | 15°: ${formatTime(times15.fajr)}`;
  }
  if (name === "Dhuhr") return formatTime(timesKarachi.dhuhr);
  if (name === "Asr") {
    return `Standard: ${formatTime(timesKarachi.asr)} | Hanafi: ${formatTime(timesHanafi.asr)}`;
  }
  if (name === "Maghrib") return formatTime(timesKarachi.maghrib);
  if (name === "Taraweeh") return "After Isha";
  return `18°: ${formatTime(timesKarachi.isha)} | 15°: ${formatTime(times15.isha)}`;
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

function flyersFromHits(
  documents: FlyerDocument[] | null | undefined,
): KioskFlyer[] {
  return (documents ?? []).flatMap((document) => {
    const imageUrl = document.imageUrl?.trim();
    const title = document.title?.trim();
    if (!imageUrl || !title) return [];
    if (document.status === "inactive") return [];
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

function KioskCard({
  children,
  className,
  label,
  tone = "light",
  onSwipe,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  tone?: "light" | "dark";
  onSwipe?: (direction: 1 | -1) => void;
}) {
  const [pressed, setPressed] = useState(false);
  const startX = useRef<number | null>(null);
  const highlight =
    tone === "dark"
      ? "border-[#D4A373] ring-2 ring-[#D4A373]/40"
      : "border-[#2E6575] ring-2 ring-[#2E6575]/25";
  const resting = tone === "dark" ? "border-slate-800" : "border-slate-200/80";

  return (
    <section
      aria-label={label}
      className={`touch-manipulation border transition-all duration-150 ${
        pressed ? highlight : resting
      } ${className ?? ""}`}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        setPressed(true);
        startX.current = event.clientX;
        if (!onSwipe) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // A synthetic or already-released pointer cannot be captured.
        }
      }}
      onPointerUp={(event) => {
        setPressed(false);
        const origin = startX.current;
        startX.current = null;
        if (!onSwipe || origin == null) return;
        const delta = event.clientX - origin;
        if (delta <= -SWIPE_PX) onSwipe(1);
        else if (delta >= SWIPE_PX) onSwipe(-1);
      }}
      onPointerLeave={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) return;
        setPressed(false);
      }}
      onPointerCancel={() => {
        setPressed(false);
        startX.current = null;
      }}
    >
      {children}
    </section>
  );
}

function QrTile({ value, label }: { value: string; label: string }) {
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0F2432", light: "#FFFFFF" },
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
    <div className="flex w-[6.5rem] shrink-0 flex-col items-center gap-1">
      <div
        className="h-24 w-full rounded-xl border border-slate-200/90 bg-slate-50 p-1.5 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
        role="img"
        aria-label={label}
      />
      <p className="text-center text-[10px] font-bold leading-tight text-slate-700">
        {label}
      </p>
    </div>
  );
}

export default function KioskDisplay() {
  const [now, setNow] = useState<Date | null>(null);
  const [settings, setSettings] = useState<PrayerSettings | null>(null);
  const [flyers, setFlyers] = useState<KioskFlyer[]>([]);
  const [flyersReady, setFlyersReady] = useState(false);
  const [zeffyUrl, setZeffyUrl] = useState(CAMPAIGN_ZEFFY_URL);
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [lunar, setLunar] = useState<LunarSnapshot | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [exitActivity, setExitActivity] = useState(0);
  const fadeReady = useRef(false);
  const exitTaps = useRef<number[]>([]);
  const brandPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!exitOpen) return;
    const timer = window.setTimeout(() => setExitOpen(false), EXIT_IDLE_MS);
    return () => window.clearTimeout(timer);
  }, [exitOpen, exitActivity]);

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

    void acquire();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      void sentinel?.release().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      const client = getSanityClient();
      Promise.all([
        client.fetch<Partial<PrayerSettings> | null>(PRAYER_SETTINGS_QUERY),
        client.fetch<FlyerDocument[] | null>(flyersQuery),
        client.fetch<CampaignDocument | null>(FEATURED_CAMPAIGN_QUERY),
      ])
        .then(([settingsDoc, flyerDocs, campaignDoc]) => {
          if (cancelled) return;
          setSettings(resolvePrayerSettings(settingsDoc));
          setFlyers(flyersFromHits(flyerDocs));
          const campaign = resolveCampaign(campaignDoc);
          setZeffyUrl(campaign.donationUrl?.trim() || CAMPAIGN_ZEFFY_URL);
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
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % flyers.length);
      setStartedAt(Date.now());
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [flyers.length, index, startedAt]);

  useEffect(() => {
    if (!fadeReady.current) {
      fadeReady.current = true;
      return;
    }
    setOpacity(0);
    const timer = window.setTimeout(() => setOpacity(1), 40);
    return () => window.clearTimeout(timer);
  }, [index]);

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

  const noteBrandTap = (event: React.PointerEvent<HTMLDivElement>) => {
    const origin = brandPoint.current;
    brandPoint.current = null;
    if (!origin || exitOpen) return;
    const moved = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
    if (moved > 24) return;
    const nowMs = Date.now();
    const recent = exitTaps.current.filter((stamp) => nowMs - stamp < EXIT_WINDOW_MS);
    recent.push(nowMs);
    exitTaps.current = recent;
    if (recent.length < EXIT_TAPS) return;
    exitTaps.current = [];
    setExitActivity((value) => value + 1);
    setExitOpen(true);
  };

  const swipe = (direction: 1 | -1) => {
    if (flyers.length < 2) return;
    setIndex((current) => (current + direction + flyers.length) % flyers.length);
    setStartedAt(Date.now());
  };

  const schedule = settings ?? resolvePrayerSettings(null);
  const activeFlyer = flyers[index] ?? null;

  let board: {
    rows: {
      name: string;
      adhan: string;
      iqamah: string;
      detail: string;
      detailKind: "sunrise" | "until" | "";
    }[];
    shifts: { shift: string; lecture: string; salah: string }[];
    nextName: string;
    nextIqamah: string;
    countdown: string;
    windowLead: string;
    windowTimes: string[];
    dateLabel: string;
  } | null = null;

  if (now) {
    const date = melissaCalendarDate(now);
    const times = new AdhanPrayerTimes(
      coordinates,
      date,
      CalculationMethod.Karachi(),
    );
    const times15 = new AdhanPrayerTimes(
      coordinates,
      date,
      CalculationMethod.NorthAmerica(),
    );
    const paramsHanafi = CalculationMethod.Karachi();
    paramsHanafi.madhab = Madhab.Hanafi;
    const timesHanafi = new AdhanPrayerTimes(coordinates, date, paramsHanafi);
    const tomorrow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      12,
      0,
      0,
    );
    const nextFajr = new AdhanPrayerTimes(
      coordinates,
      tomorrow,
      CalculationMethod.Karachi(),
    ).fajr;
    const windows = prayerWindows(now, times, timesHanafi, nextFajr);
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
        adhan: adhanNote(row.name, times, times15, timesHanafi),
        detail:
          row.name === "Fajr"
            ? `Sunrise (Ends): ${windows.sunrise}`
            : (windows.until[row.name] ?? ""),
        detailKind:
          row.name === "Fajr" ? "sunrise" : windows.until[row.name] ? "until" : "",
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
      rows: rows.map(({ name, adhan, iqamah, detail, detailKind }) => ({
        name,
        adhan,
        iqamah,
        detail,
        detailKind,
      })),
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
      nextIqamah: nextPrayer?.iqamah ?? "",
      countdown: countdownClock(now, target),
      windowLead: windows.lead,
      windowTimes: windows.timesLabel,
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
      className="h-screen w-screen select-none overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
    >
      <div className="grid h-full min-h-0 grid-cols-12 grid-rows-[minmax(0,1fr)] gap-4 p-4">
        <div className="col-span-5 flex h-full min-h-0 flex-col justify-between gap-2.5">
          <KioskCard
            label="Clock and date"
            className="rounded-3xl bg-white px-5 py-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div
                className="flex min-w-0 items-center gap-3"
                onPointerDown={(event) => {
                  brandPoint.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerUp={noteBrandTap}
                onPointerCancel={() => {
                  brandPoint.current = null;
                }}
              >
                <img
                  src="/images/logo.png"
                  alt=""
                  draggable={false}
                  className="h-14 w-auto"
                />
                <div className="min-w-0">
                  <p className="truncate font-heading text-lg font-extrabold tracking-tight text-slate-900">
                    Imaan Masjid
                  </p>
                  <p className="text-xs font-medium text-slate-500">Melissa, TX</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-4xl font-extrabold tabular-nums leading-none text-slate-900">
                  {now ? formatClock(now) : "--:--:-- --"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {board?.dateLabel ?? "Loading the date…"}
                </p>
                <p className="mt-1 inline-flex rounded-full bg-[#2E6575]/10 px-2.5 py-0.5 text-sm font-semibold text-[#2E6575]">
                  {lunar?.hijri ?? "Loading the Hijri date…"}
                </p>
              </div>
            </div>
          </KioskCard>

          <KioskCard
            label="Prayer and Jumu'ah schedule"
            tone="dark"
            className="rounded-3xl bg-slate-950/95 p-3.5 text-white shadow-lg"
          >
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 px-3.5 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4A373]">
                Next Prayer
              </p>
              <div className="mt-0.5 flex items-baseline justify-between gap-3">
                <p className="text-2xl font-extrabold leading-none text-white">
                  {board?.nextName ?? "Loading today's prayers…"}
                </p>
                {board ? (
                  <p className="text-base font-bold text-white">
                    Iqamah {board.nextIqamah}
                  </p>
                ) : null}
              </div>
              {board ? (
                <p className="mt-0.5 font-mono text-xs text-[#D4A373]">
                  {board.countdown}
                </p>
              ) : null}
              {board ? (
                <p className="mt-0.5 truncate text-xs text-slate-300">
                  {board.windowLead}{" "}
                  {board.windowTimes.map((time, index) => (
                    <span key={`${time}-${index}`}>
                      {index > 0 ? " / " : null}
                      <span className="font-semibold text-[#D4A373]">{time}</span>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            {schedule.specialAnnouncement ? (
              <p className="mt-2 line-clamp-2 rounded-xl border border-[#D4A373]/40 bg-[#D4A373]/15 px-3 py-1.5 text-sm font-semibold text-[#D4A373]">
                {schedule.specialAnnouncement}
              </p>
            ) : null}
            <p className="mb-0.5 mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Today&apos;s Prayer &amp; Iqamah
            </p>
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.8fr)_minmax(0,0.9fr)] border-b border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              <span className="py-1 text-left">Prayer</span>
              <span className="py-1 text-left">Adhan</span>
              <span className="py-1 text-right">Iqamah</span>
            </div>
            {(board?.rows ?? []).map((row) => {
              const current = row.name === board?.nextName;
              return (
                <div
                  key={row.name}
                  className={`grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.8fr)_minmax(0,0.9fr)] items-center border-b border-slate-800/80 py-0.5 ${current ? "rounded-lg bg-slate-800/70 px-2" : ""}`}
                >
                  <span
                    className={`text-base font-bold ${current ? "text-[#D4A373]" : "text-white"}`}
                  >
                    {row.name}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight text-slate-300">
                      {row.adhan}
                    </span>
                    {row.detailKind === "sunrise" ? (
                      <span className="block text-[11px] leading-tight text-amber-300/90">
                        {row.detail}
                      </span>
                    ) : null}
                    {row.detailKind === "until" ? (
                      <span className="block text-[10px] leading-tight text-slate-400">
                        Until {row.detail}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-right text-base font-bold tabular-nums text-white">
                    {row.iqamah}
                  </span>
                </div>
              );
            })}
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              {(board?.shifts ?? []).map((shift) => (
                <div
                  key={shift.shift}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2.5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4A373]">
                    {shift.shift}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-white">
                    Lecture: {shift.lecture}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-300">
                    Salah: {shift.salah}
                  </p>
                </div>
              ))}
            </div>
          </KioskCard>

          <KioskCard
            label="Tonight's Hilāl"
            tone="dark"
            className="flex items-center gap-4 rounded-3xl bg-slate-950/95 px-4 py-2.5 text-white shadow-md"
          >
            <div className="flex shrink-0 flex-col items-center">
              <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden="true">
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4A373]">
                Tonight&apos;s Hilāl
              </p>
              <p className="mt-0.5 truncate font-heading text-base font-extrabold text-white">
                {lunar?.phaseName ?? "Reading the moon…"}
              </p>
              <p className="truncate text-sm text-slate-300">
                {lunar?.fast ?? "Loading the next Sunnah fast…"}
              </p>
            </div>
          </KioskCard>

          <KioskCard
            label="Ways to give"
            className="shrink-0 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E6575]">
              Ways to Give
            </p>
            <div className="mt-2 flex items-center gap-3 pb-1">
              <div className="flex shrink-0 items-start gap-1.5">
                <QrTile value={GENERAL_ZEFFY_URL} label="Zeffy • Ops" />
                <QrTile value={zeffyUrl} label="Zeffy • Property" />
                <QrTile value={DONORBOX_URL} label="Donorbox" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2E6575]">
                  Zelle
                </p>
                <div className="flex flex-col gap-1.5">
                  {ZELLE_CARDS.map((card) => (
                    <div
                      key={card.email}
                      className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#2E6575]">
                        {card.label}
                      </p>
                      <p className="truncate text-xs font-bold text-slate-900">
                        {card.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </KioskCard>
        </div>

        <div className="col-span-7 flex h-full min-h-0 flex-col">
          <FlyerStage
            flyer={activeFlyer}
            count={flyers.length}
            index={index}
            opacity={opacity}
            ready={flyersReady}
            startedAt={startedAt}
            onSwipe={swipe}
          />
        </div>
      </div>
      {exitOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Admin exit"
          onPointerDown={() => setExitActivity((value) => value + 1)}
        >
          <div className="w-full max-w-xs rounded-3xl border border-slate-200/80 bg-white p-5 shadow-lg">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E6575]">
              Admin
            </p>
            <p className="mt-1 font-heading text-lg font-extrabold text-slate-900">
              Leave the kiosk?
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="rounded-xl bg-[#2E6575] px-4 py-3 text-sm font-bold text-white"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Open Main Website (/)
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900"
                onClick={() => {
                  window.location.href = "/admin";
                }}
              >
                Open Sanity CMS (/admin)
              </button>
              <button
                type="button"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600"
                onClick={() => setExitOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FlyerStage({
  flyer,
  count,
  index,
  opacity,
  ready,
  startedAt,
  onSwipe,
}: {
  flyer: KioskFlyer | null;
  count: number;
  index: number;
  opacity: number;
  ready: boolean;
  startedAt: number;
  onSwipe: (direction: 1 | -1) => void;
}) {
  if (!ready) {
    return (
      <KioskCard
        label="Community flyers"
        className="relative flex h-full min-h-0 flex-col justify-center overflow-hidden rounded-3xl bg-white p-5 shadow-sm"
      >
        <p className="text-center text-lg font-semibold text-slate-600">
          Loading community flyers…
        </p>
      </KioskCard>
    );
  }

  if (!flyer) {
    return (
      <KioskCard
        label="Community flyers"
        className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 shadow-sm"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E6575]">
            Imaan Masjid · Melissa, TX
          </p>
          <p className="mt-6 font-heading text-5xl font-extrabold tracking-tight text-slate-900">
            Assalamu Alaikum
          </p>
          <p className="mt-3 max-w-2xl text-2xl leading-snug text-slate-600">
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
              className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3"
            >
              <p className="text-base font-bold text-slate-900">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#2E6575]/20 bg-[#2E6575]/10 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E6575]">
            Sadaqah Jariyah
          </p>
          <p className="mt-2 max-w-3xl text-xl leading-snug text-slate-900">
            A gift toward this masjid keeps benefiting the community after you
            leave. Scan a code on the left to give.
          </p>
        </div>
      </KioskCard>
    );
  }

  return (
    <KioskCard
      label="Community flyers"
      onSwipe={onSwipe}
      className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {categoryLabel(flyer.category)}
          </p>
          <p className="mt-2 truncate font-heading text-xl font-extrabold tracking-tight text-slate-900">
            {flyer.title}
          </p>
        </div>
        <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tabular-nums text-slate-600">
          {index + 1} / {count}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-slate-200/60 bg-slate-100/70 p-3">
        <img
          src={flyer.imageUrl}
          alt={flyer.title}
          draggable={false}
          className="h-full max-h-full min-h-0 w-full rounded-xl object-contain transition-opacity duration-500"
          style={{ opacity }}
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            key={startedAt}
            className="smartboard-progress h-full w-full bg-[#2E6575]"
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
                  ? "h-1.5 w-4 rounded-full bg-[#2E6575]"
                  : "h-1.5 w-1.5 rounded-full bg-slate-200"
              }
            />
          ))}
        </div>
      </div>
    </KioskCard>
  );
}
