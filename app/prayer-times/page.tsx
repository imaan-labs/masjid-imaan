import PrayerTimes from "@/src/components/PrayerTimes";

export const metadata = {
  title: "Prayer Times | Imaan Masjid",
  description:
    "Daily athan and iqamah times for Imaan Masjid in Melissa, Texas, plus both Jumu'ah shifts.",
};

export default function PrayerTimesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PrayerTimes />
    </div>
  );
}
