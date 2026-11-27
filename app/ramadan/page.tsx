import MeeqatRamadanEmbed from "@/src/components/MeeqatRamadanEmbed";
import RamadanQuickLinks from "@/src/components/RamadanQuickLinks";
import { getTargetRamadanHijriYear } from "@/src/lib/lunar/ramadanSeason";

export const metadata = {
  title: "Ramadan Timetable | Imaan Masjid",
  description:
    "Suhoor, Iftar, and Taraweeh times for Imaan Masjid in Melissa, TX.",
};

export default function RamadanPage() {
  const targetYear = getTargetRamadanHijriYear();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
          🌙 Ramadan {targetYear} AH • Melissa, TX
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Ramadan Timetable & Schedule
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Times use an 18° twilight angle, with a 5-minute Imsak buffer
          and a 2-minute Iftar margin. The first and last days can shift by a
          day when the local moonsighting differs from the civil calendar.
        </p>
      </div>

      <div className="mt-8">
        <MeeqatRamadanEmbed />
      </div>

      <div className="mt-8">
        <RamadanQuickLinks />
      </div>
    </section>
  );
}
