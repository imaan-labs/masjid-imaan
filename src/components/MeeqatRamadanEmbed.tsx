"use client";

import { useEffect, useRef, useState } from "react";
import { MELISSA } from "@/src/lib/melissa";
import { getTargetRamadanHijriYear } from "@/src/lib/lunar/ramadanSeason";

const MEEQAT_ORIGIN = "https://mussperiments-meeqat.web.app";

export default function MeeqatRamadanEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [targetYear] = useState(() => getTargetRamadanHijriYear());

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== MEEQAT_ORIGIN) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: unknown } | null;
      if (data?.type !== "meeqat:ramadan-calendar:resize") return;
      if (typeof data.height !== "number" || !Number.isFinite(data.height)) return;
      const iframe = iframeRef.current;
      if (!iframe) return;
      iframe.style.height = `${Math.max(720, data.height)}px`;
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src = `${MEEQAT_ORIGIN}/ramadancalendar?embed=1&theme=light&lat=${MELISSA.lat}&lng=${MELISSA.lng}&tz=${encodeURIComponent(MELISSA.timeZone)}&city=${encodeURIComponent(MELISSA.city)}&method=KARACHI&imsak=5&iftar=2&offset=0&year=${targetYear}`;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <iframe
        ref={iframeRef}
        title="Meeqat Ramadan Calendar"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{
          width: "100%",
          minHeight: "720px",
          height: "720px",
          border: 0,
          borderRadius: "12px",
          background: "transparent",
          transition: "height 200ms ease",
        }}
      />
    </div>
  );
}
