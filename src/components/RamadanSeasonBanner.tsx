"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isRamadanSeasonActive } from "@/src/lib/lunar/ramadanSeason";

const DISMISS_KEY = "ramadan-season-banner-dismissed";

export default function RamadanSeasonBanner() {
  const router = useRouter();
  const [season, setSeason] = useState<ReturnType<typeof isRamadanSeasonActive> | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setSeason(isRamadanSeasonActive());
    setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!season?.active || dismissed || !season.phase) return null;

  const label =
    season.phase === "approaching"
      ? `🌙 Ramadan ${season.hijriYear} AH is approaching — View Suhoor, Iftar & Taraweeh Timetable →`
      : "🌙 Ramadan Mubarak! View today's Suhoor, Iftar & Ramadan Timetable →";

  return (
    <div className="border-b border-[#D4A373]/30 bg-[#0F2432] text-white print:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/ramadan")}
          className="min-w-0 flex-1 text-left text-sm font-semibold leading-5 text-white"
        >
          {label}
        </button>
        <button
          type="button"
          aria-label="Dismiss Ramadan announcement"
          onClick={() => {
            window.sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-[#D4A373] transition hover:bg-white/10"
        >
          ×
        </button>
      </div>
    </div>
  );
}
