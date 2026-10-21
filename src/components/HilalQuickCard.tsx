"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoonPhase } from "astronomy-engine";
import { hijriFromDate, hijriLabel, nextSunnahFast, type UpcomingDate } from "@/src/lib/lunar/calendarData";
import { moonSummary } from "@/src/lib/lunar/hilalWatch";

type Snapshot = {
  hijri: string;
  phaseName: string;
  illuminationPercent: number;
  phaseAngle: number;
  fastChip: string;
};

function fastChip(fast: UpcomingDate | null) {
  if (!fast) return "See the Hilāl calendar";
  const day = Number(fast.hijriLabel.split(" ")[0]);
  const hijriShort = fast.hijriLabel.replace(/ \d{3,4}$/, "");
  let name = fast.label;
  if (fast.label === "White Day") {
    const ordinal = day === 13 ? "1st" : day === 14 ? "2nd" : day === 15 ? "3rd" : "";
    name = ordinal ? `${ordinal} White Day` : "White Day";
  }
  const when = fast.when === "Today" ? "Today" : "Upcoming";
  return `${when}: ${name} - ${hijriShort}`;
}

function moonLitPath(phaseAngle: number) {
  const phase = ((phaseAngle % 360) + 360) % 360 / 360;
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

function MoonDisc({ phaseAngle }: { phaseAngle: number }) {
  return (
    <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden="true">
      <circle cx="20" cy="20" r="16" className="fill-brand-teal" />
      <path d={moonLitPath(phaseAngle)} className="fill-brand-gold" />
      <circle cx="20" cy="20" r="16" fill="none" className="stroke-brand-gold" strokeWidth="1" />
    </svg>
  );
}

export default function HilalQuickCard() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const now = new Date();
    const moon = moonSummary(now);
    setSnapshot({
      hijri: hijriLabel(hijriFromDate(now)),
      phaseName: moon.phaseName,
      illuminationPercent: moon.illuminationPercent,
      phaseAngle: MoonPhase(now),
      fastChip: fastChip(nextSunnahFast(now)),
    });
  }, []);

  return (
    <section
      aria-label="Tonight's Hilāl"
      className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 flex-col items-center">
          <MoonDisc phaseAngle={snapshot?.phaseAngle ?? 0} />
          <p className="mt-1 text-[11px] font-semibold text-brand-gold">
            {snapshot ? `${snapshot.illuminationPercent}%` : "—"}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Tonight
          </p>
          <p className="mt-1 text-sm font-bold leading-5 text-white">
            {snapshot?.hijri ?? "Loading the Hijri date…"}
          </p>
          {snapshot ? (
            <p className="mt-0.5 text-xs text-slate-300">{snapshot.phaseName}</p>
          ) : null}
          <p className="mt-2 inline-flex rounded-full bg-brand-gold/15 px-2.5 py-1 text-[11px] font-semibold leading-4 text-brand-gold">
            {snapshot?.fastChip ?? "Loading the next Sunnah fast…"}
          </p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
        >
          Full Hilāl Calendar →
        </Link>
      </div>
    </section>
  );
}
