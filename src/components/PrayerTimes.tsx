"use client";

import { useEffect, useState } from "react";
import {
  formatChicagoTime,
  formatCountdown,
  getPrayerDay,
  type PrayerDay,
} from "@/src/lib/prayerTimes";

export default function PrayerTimes() {
  const [now, setNow] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <section className="min-h-screen bg-[#F3EAD7] px-4 pb-28 pt-28 text-[#3F3428]">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A7843F]">
            Imaan Masjid
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-[#047857]">
            Prayer Times
          </h1>
          <p className="mt-6 text-[#5C5146]">Loading today&apos;s athan times…</p>
        </div>
      </section>
    );
  }

  const day = getPrayerDay(now);

  return (
    <>
      <section className="min-h-screen bg-[#F3EAD7] px-4 pb-36 pt-28 text-[#3F3428] sm:px-6 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A7843F]">
            Melissa, Texas
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#047857] sm:text-5xl">
            Prayer Times
          </h1>
          <p className="mt-3 text-[#5C5146]">
            {day.dateLabel} · {day.daylight ? "Daylight time" : "Standard time"}
          </p>

          <NextSummary day={day} now={now} />

          <section
            aria-labelledby="iqamah-heading"
            className="mt-8 rounded-2xl border border-[#047857] bg-[#047857] p-5 text-[#F6F0E6] shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#E7D7B8]">
              Congregation
            </p>
            <h2 id="iqamah-heading" className="mt-1 text-2xl font-semibold">
              Administrator Iqamah schedule
            </h2>
            <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {day.prayers.map((prayer) => {
                const active =
                  day.upcoming.prayerKey === prayer.key &&
                  day.upcoming.detail === "Iqamah" &&
                  !day.upcoming.tomorrow;
                return (
                  <li
                    key={prayer.key}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-xl px-3 py-3 ${
                      active ? "bg-[#C6A15B] text-[#1C1917]" : "bg-[#065F46]"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {prayer.name}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {formatChicagoTime(prayer.iqamah)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="starts-heading" className="mt-8">
            <h2 id="starts-heading" className="text-2xl font-semibold text-[#047857]">
              Calculated start times
            </h2>
            <ol className="mt-4 space-y-3">
              {day.prayers.map((prayer) => {
                const active =
                  day.upcoming.prayerKey === prayer.key &&
                  day.upcoming.detail === "Athan" &&
                  !day.upcoming.tomorrow;
                return (
                  <li
                    key={prayer.key}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-2xl border px-4 py-4 shadow-sm ${
                      active
                        ? "border-[#047857] bg-[#047857] text-[#F6F0E6]"
                        : "border-[#E6D3B0] bg-[#FFF8EC]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold">{prayer.name}</h3>
                      {active ? (
                        <span className="rounded-full bg-[#C6A15B] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1C1917]">
                          Next
                        </span>
                      ) : null}
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:text-base">
                      {prayer.starts.map((start) => (
                        <div key={`${prayer.key}-${start.label || "time"}`}>
                          {start.label ? (
                            <dt className={active ? "text-[#E7D7B8]" : "text-[#8A7352]"}>
                              {start.label}
                            </dt>
                          ) : null}
                          <dd className="text-lg font-semibold tabular-nums">
                            {formatChicagoTime(start.at)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ol>
          </section>

          <section
            aria-labelledby="jumuah-heading"
            className="mt-8 rounded-2xl border border-[#E6D3B0] bg-[#FFF8EC] p-5 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A7843F]">
              Friday
            </p>
            <h2 id="jumuah-heading" className="mt-1 text-2xl font-semibold text-[#047857]">
              Jumu&apos;ah
            </h2>
            <p className="mt-2 text-sm text-[#5C5146]">
              {day.daylight ? "Daylight schedule" : "Standard time schedule"}.
              Each shift is English talk, then khutbah, then salah.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {day.jumuah.map((shift) => {
                const active = day.upcoming.shiftId === shift.id;
                return (
                  <article
                    key={shift.id}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-xl border p-4 ${
                      active
                        ? "border-[#047857] bg-[#047857] text-[#F6F0E6]"
                        : "border-[#E6D3B0] bg-[#F3EAD7]"
                    }`}
                  >
                    <h3 className="text-lg font-semibold">{shift.label}</h3>
                    <dl className="mt-3 space-y-2 text-sm">
                      <TimeRow
                        label="English talk"
                        value={formatChicagoTime(shift.englishTalk)}
                        active={active}
                      />
                      <TimeRow
                        label="Khutbah"
                        value={formatChicagoTime(shift.khutbah)}
                        active={active}
                      />
                      <TimeRow
                        label="Salah"
                        value={formatChicagoTime(shift.salah)}
                        active={active}
                      />
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <NextPrayerDrawer
        day={day}
        now={now}
        open={drawerOpen}
        onToggle={() => setDrawerOpen((open) => !open)}
      />
    </>
  );
}

function NextSummary({ day, now }: { day: PrayerDay; now: Date }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#047857] bg-[#047857] px-5 py-4 text-[#F6F0E6] shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E7D7B8]">
        {day.upcoming.tomorrow ? "Tomorrow" : "Up next"}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold">{day.upcoming.title}</p>
          <p className="text-sm text-[#F6E7C3]">
            {day.upcoming.detail} · {formatChicagoTime(day.upcoming.at)}
          </p>
        </div>
        <p className="text-2xl font-semibold tabular-nums">
          {formatCountdown(day.upcoming.at, now)}
        </p>
      </div>
    </div>
  );
}

function TimeRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={active ? "text-[#E7D7B8]" : "text-[#8A7352]"}>{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function NextPrayerDrawer({
  day,
  now,
  open,
  onToggle,
}: {
  day: PrayerDay;
  now: Date;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-40 md:hidden">
      {open ? (
        <div className="max-h-[46vh] overflow-y-auto rounded-t-2xl border border-b-0 border-[#E6D3B0] bg-[#FFF8EC] px-4 py-3 text-[#3F3428] shadow-lg">
          <ul className="space-y-2">
            {day.prayers.map((prayer) => (
              <li key={prayer.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-[#047857]">{prayer.name}</span>
                <span className="tabular-nums">
                  {formatChicagoTime(prayer.iqamah)}
                  <span className="text-[#8A7352]"> iqamah</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 bg-[#047857] px-4 py-3 text-left text-[#F6F0E6] shadow-lg"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#E7D7B8]">
            {day.upcoming.tomorrow ? "Tomorrow" : "Next"} · {day.upcoming.detail}
          </span>
          <span className="text-base font-semibold">{day.upcoming.title}</span>
        </span>
        <span className="text-lg font-semibold tabular-nums">
          {formatCountdown(day.upcoming.at, now)}
        </span>
      </button>
    </div>
  );
}
