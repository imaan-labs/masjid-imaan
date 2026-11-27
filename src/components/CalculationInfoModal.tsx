"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MELISSA } from "@/src/lib/melissa";

const SECTIONS = [
  {
    title: "Calculation preference",
    body: [
      `Daily Adhan times and the Ramadan timetable are calculated for Melissa, TX (${MELISSA.lat}° N, ${Math.abs(MELISSA.lng)}° W) from the sun’s position.`,
      "Fajr and Isha are shown at two twilight angles. At 18° the sky is darker, so Fajr is earlier and Isha is later. At 15° those prayers sit a little closer to sunrise and sunset. Maghrib follows sunset.",
      "Iqamah is set by the masjid. Maghrib, for example, waits a few minutes after sunset, so the congregation time is not always the same as the calculated Adhan.",
    ],
  },
  {
    title: "Standard and Hanafi timings",
    body: [
      "The masjid lists both Standard and Hanafi start times where they differ, so each household can follow the ruling it uses.",
      "The difference shows up most clearly at Asr. Standard Asr begins when a shadow is the length of the object plus its noon shadow. Hanafi Asr begins when that shadow is twice as long, so it comes later in the afternoon.",
      "Fajr, Dhuhr, Maghrib, and Isha use the same solar moments in both rulings. The posted Iqamah and the Friday Jumu'ah lecture and salah times are the congregation’s set times, so everyone can plan around the same schedule.",
    ],
  },
  {
    title: "How the Hilāl estimate works",
    body: [
      "On the 29th evening of a lunar month, the calendar looks at the sky after sunset in Melissa and asks whether a new crescent could be seen.",
      "It checks four plain things: whether the moon is still up after the sun has set, how many minutes it stays up, how high it climbs, and how far it sits from the sun’s glare. From those clues it estimates whether the crescent would be easy to see, visible under a clear sky, only with binoculars or a telescope, or not visible at all.",
      "That estimate is a planning aid. The official start of the month, and the dates for Ramadan and Eid, follow the community’s moonsighting announcement.",
    ],
  },
] as const;

export function CalculationInfoButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left text-sm text-emerald-100/80 underline decoration-emerald-100/30 underline-offset-4 hover:text-white hover:decoration-white"
      >
        Prayer Calculation & Hilāl Method
      </button>
      <CalculationInfoModal open={open} onClose={close} />
    </>
  );
}

export default function CalculationInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close prayer calculation details"
        className="absolute inset-0 bg-[#0F2432]/70"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 bg-[#0F2432] px-5 py-4 text-white">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4A373]">
              Melissa, TX
            </p>
            <h2 id={titleId} className="mt-1 font-heading text-xl font-extrabold">
              Prayer calculation & Hilāl method
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-lg font-semibold text-white hover:bg-white/10"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto px-5 py-5">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <h3 className="text-base font-bold text-[#2E6575]">{section.title}</h3>
              <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
