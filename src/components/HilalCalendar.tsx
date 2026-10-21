"use client";

import { useEffect, useState } from "react";
import {
  WEEKDAYS,
  buildMonth,
  hijriFromDate,
  nextNotable,
  shiftMonth,
  type HijriDate,
} from "@/src/lib/lunar/calendarData";
import { hilalProspect, moonSummary } from "@/src/lib/lunar/hilalWatch";

export default function HilalCalendar() {
  const [now, setNow] = useState<Date | null>(null);
  const [cursor, setCursor] = useState<HijriDate | null>(null);

  useEffect(() => {
    const current = new Date();
    setNow(current);
    setCursor(hijriFromDate(current));
  }, []);

  if (!now || !cursor) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">Loading the Hilāl calendar…</p>
      </section>
    );
  }

  const today = hijriFromDate(now);
  const month = buildMonth(cursor.year, cursor.month);
  const moon = moonSummary(now);
  const upcoming = nextNotable(now);
  const sighting = hilalProspect(cursor.year, cursor.month);
  const onCurrentMonth = cursor.year === today.year && cursor.month === today.month;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">
          Melissa, TX
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Hilāl Calendar</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Hijri dates follow the Umm al-Qura civil calendar. White Days are the 13th, 14th, and
          15th. They are not marked in Ramadan, and the 13th of Dhul-Hijjah is a prohibited fast.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article className="rounded-3xl bg-brand-teal p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">Tonight</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {moon.phaseName} · {moon.illuminationPercent}% Illuminated
          </h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50">
            Computed for 33.2859° N, 96.5728° W.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            {upcoming ? upcoming.when : "Upcoming"}
          </p>
          {upcoming ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{upcoming.label}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {upcoming.detail} · {upcoming.hijriLabel}
              </p>
              <p className="mt-1 text-sm font-medium text-brand-teal">{upcoming.gregorianLabel}</p>
            </>
          ) : (
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">No date in the coming year</h2>
          )}
        </article>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-full border border-brand-teal px-4 py-2 text-sm font-semibold text-emerald-900 transition-all duration-200 hover:bg-brand-dark hover:text-white"
          onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}
        >
          ‹ Previous
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            {month.monthName} {month.year}
          </h2>
          <button
            type="button"
            className="mt-1 text-sm font-semibold text-brand-teal transition-all duration-200 hover:text-brand-dark disabled:text-slate-400"
            disabled={onCurrentMonth}
            onClick={() => setCursor(today)}
          >
            This month
          </button>
        </div>
        <button
          type="button"
          className="rounded-full border border-brand-teal px-4 py-2 text-sm font-semibold text-emerald-900 transition-all duration-200 hover:bg-brand-dark hover:text-white"
          onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}
        >
          Next ›
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[42rem] lg:min-w-0">
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                {day}
              </div>
            ))}
            {Array.from({ length: month.leadingBlanks }, (_, index) => (
              <div key={`blank-${index}`} aria-hidden="true" />
            ))}
            {month.cells.map((cell) => {
              const isToday =
                cell.hijri.year === today.year &&
                cell.hijri.month === today.month &&
                cell.hijri.day === today.day;
              return (
                <article
                  key={cell.hijri.day}
                  className={`min-h-28 rounded-2xl border bg-white p-2 transition-all duration-200 ${
                    isToday ? "border-brand-teal ring-2 ring-brand-teal" : "border-slate-200"
                  }`}
                >
                  <p className="text-2xl font-semibold leading-none text-slate-900">{cell.hijri.day}</p>
                  <p className="mt-1 text-xs text-slate-500">{cell.gregorianLabel}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cell.marks.map((mark) => (
                      <span
                        key={mark.label}
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass(mark.kind)}`}
                      >
                        {mark.short}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {sighting ? (
        <article className="mt-8 rounded-3xl border border-slate-200 bg-[#F3EAD7] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            Hilāl sighting · 29th evening
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{sighting.rating}</h2>
          <p className="mt-1 text-sm text-slate-700">
            {sighting.hijriLabel} · {sighting.gregorianLabel}
          </p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Sunset" value={sighting.sunsetLabel} />
            <Fact label="Moonset" value={sighting.moonsetLabel} />
            <Fact
              label="Lag"
              value={sighting.lagMinutes > 0 ? `${sighting.lagMinutes} min` : "With or before sunset"}
            />
            <Fact label="Illumination" value={`${sighting.illuminationPercent}%`} />
            <Fact label="Best viewing" value={sighting.windowLabel} />
            <Fact label="Moon altitude" value={`${sighting.altitudeDegrees}°`} />
          </dl>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-700">
            Look from about 15 minutes after sunset for roughly 30 minutes. The official start of
            the month follows community shura verification. This prospect is for Melissa and is not
            an announcement.
          </p>
        </article>
      ) : null}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-900">This month</h2>
        {month.observances.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {month.observances.map((cell) => (
              <li
                key={cell.hijri.day}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-semibold text-brand-teal">
                  {cell.hijri.day} {month.monthName} · {cell.gregorianLabel}
                </p>
                <p className="mt-1 text-slate-900">
                  {cell.marks.map((mark) => mark.label).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-600">No White Days or sacred dates fall in this month.</p>
        )}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function badgeClass(kind: "white-day" | "prohibited" | "sacred") {
  if (kind === "white-day") return "bg-amber-100 text-amber-900";
  if (kind === "prohibited") return "bg-slate-900 text-amber-200";
  return "bg-brand-teal text-white";
}
