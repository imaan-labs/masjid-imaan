import type { Metadata } from "next";
import KioskDisplay from "@/src/components/KioskDisplay";

export const metadata: Metadata = {
  title: "Imaan Masjid — Kiosk Display",
  robots: { index: false, follow: false },
};

export default function KioskPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      <KioskDisplay />
    </div>
  );
}
