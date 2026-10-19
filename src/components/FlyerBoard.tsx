import FlyerBoardIsland from "@/src/components/FlyerBoardIsland";
import {
  getFlyers,
  MissingSanityConfigError,
  type Flyer,
} from "@/src/lib/sanity";

export default async function FlyerBoard() {
  let flyers: Flyer[] = [];
  let status: "ready" | "unavailable" = "ready";

  try {
    flyers = await getFlyers();
  } catch (error) {
    if (!(error instanceof MissingSanityConfigError)) {
      console.error("Failed to load flyers from Sanity", error);
    }
    status = "unavailable";
  }

  return <FlyerBoardIsland flyers={flyers} status={status} />;
}
