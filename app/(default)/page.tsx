export const metadata = {
  title: "Imaan Masjid",
  description: "The place to practice your deen, to teach your kids and more. Certified scholars both males and females are present to learn from!",
};

import Hero from "@/components/hero";
import Features from "@/components/features";
import PrayerTimes from "@/src/components/PrayerTimes";
import FlyerBoard from "@/src/components/FlyerBoard";
import HilalQuickCard from "@/src/components/HilalQuickCard";
import ProgramsAndServices from "@/src/components/ProgramsAndServices";
import GalleryCarousel from "@/src/components/GalleryCarousel";
import CampaignProgressCard from "@/src/components/CampaignProgressCard";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 pb-2 pt-4 sm:px-6 lg:grid-cols-12 lg:items-stretch lg:px-8">
        <div className="lg:col-span-12">
          <CampaignProgressCard />
        </div>
        <div className="contents lg:col-span-5 lg:flex lg:min-w-0 lg:flex-col lg:gap-6">
          <div className="order-1 lg:order-none">
            <PrayerTimes compact />
          </div>
          <div className="order-2 lg:order-none">
            <HilalQuickCard />
          </div>
          <div className="order-4 lg:order-none">
            <ProgramsAndServices />
          </div>
        </div>
        <div className="order-3 min-w-0 lg:order-none lg:col-span-7">
          <FlyerBoard limit={2} previewOnly />
        </div>
      </section>
      <Features />
      <GalleryCarousel />
    </>
  );
}
