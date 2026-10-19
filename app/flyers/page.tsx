import FlyerBoard from "@/src/components/FlyerBoard";

export const metadata = {
  title: "Flyer Bulletin | Imaan Masjid",
  description:
    "Current community flyers for youth, sisters, lectures, and fundraisers.",
};

export const revalidate = 60;

export default function FlyersPage() {
  return <FlyerBoard />;
}
