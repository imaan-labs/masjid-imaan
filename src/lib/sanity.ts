import { createClient, type SanityClient } from "@sanity/client";
import {
  createImageUrlBuilder as imageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

type PublicSanityEnv = {
  PUBLIC_SANITY_PROJECT_ID?: string;
  PUBLIC_SANITY_DATASET?: string;
};

const metaEnv = (import.meta as ImportMeta & { env?: PublicSanityEnv }).env;

const projectId =
  metaEnv?.PUBLIC_SANITY_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  "zy8zabah";

const dataset =
  metaEnv?.PUBLIC_SANITY_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  "production";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export const PRAYER_SETTINGS_QUERY = `*[_type == "prayerSettings"][0]{
  title,
  fajr,
  dhuhr,
  asr,
  maghrib,
  isha,
  taraweeh,
  jumuahFirstLecture,
  jumuahFirstSalah,
  jumuahSecondLecture,
  jumuahSecondSalah,
  specialAnnouncement
}`;

export type PrayerSettings = {
  title: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  taraweeh: string;
  jumuahFirstLecture: string;
  jumuahFirstSalah: string;
  jumuahSecondLecture: string;
  jumuahSecondSalah: string;
  specialAnnouncement: string;
};

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  title: "Current Daily Schedule",
  fajr: "6:15 AM",
  dhuhr: "1:30 PM",
  asr: "5:00 PM",
  maghrib: "Sunset + 5 min",
  isha: "8:30 PM",
  taraweeh: "",
  jumuahFirstLecture: "1:15 PM",
  jumuahFirstSalah: "1:50 PM",
  jumuahSecondLecture: "2:15 PM",
  jumuahSecondSalah: "2:50 PM",
  specialAnnouncement: "",
};

function scheduleText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function resolvePrayerSettings(
  document: Partial<PrayerSettings> | null | undefined,
): PrayerSettings {
  const defaults = DEFAULT_PRAYER_SETTINGS;
  return {
    title: scheduleText(document?.title, defaults.title),
    fajr: scheduleText(document?.fajr, defaults.fajr),
    dhuhr: scheduleText(document?.dhuhr, defaults.dhuhr),
    asr: scheduleText(document?.asr, defaults.asr),
    maghrib: scheduleText(document?.maghrib, defaults.maghrib),
    isha: scheduleText(document?.isha, defaults.isha),
    taraweeh: typeof document?.taraweeh === "string" ? document.taraweeh.trim() : "",
    jumuahFirstLecture: scheduleText(document?.jumuahFirstLecture, defaults.jumuahFirstLecture),
    jumuahFirstSalah: scheduleText(document?.jumuahFirstSalah, defaults.jumuahFirstSalah),
    jumuahSecondLecture: scheduleText(document?.jumuahSecondLecture, defaults.jumuahSecondLecture),
    jumuahSecondSalah: scheduleText(document?.jumuahSecondSalah, defaults.jumuahSecondSalah),
    specialAnnouncement:
      typeof document?.specialAnnouncement === "string" ? document.specialAnnouncement.trim() : "",
  };
}

export async function loadPrayerSettings(): Promise<PrayerSettings> {
  try {
    const document = await getSanityClient().fetch<Partial<PrayerSettings> | null>(
      PRAYER_SETTINGS_QUERY,
    );
    return resolvePrayerSettings(document);
  } catch {
    return DEFAULT_PRAYER_SETTINGS;
  }
}

export const flyersQuery = `*[_type == "flyer" && !(_id in path("drafts.**"))] | order(publishDate desc) {
  _id,
  title,
  category,
  actionLink,
  "assetUrl": image.asset->url
}`;

export type FlyerDocument = {
  _id: string;
  title: string;
  category?: string | null;
  actionLink?: string | null;
  assetUrl?: string | null;
};

export type Flyer = {
  _id: string;
  title: string;
  category: string | null;
  actionLink: string | null;
  imageUrl: string;
  fullImageUrl: string;
};

export class MissingSanityConfigError extends Error {
  constructor() {
    super("Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET");
    this.name = "MissingSanityConfigError";
  }
}

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
});

export function getSanityClient(): SanityClient {
  return sanityClient;
}

export async function loadFlyers(): Promise<Flyer[]> {
  try {
    return await getFlyers();
  } catch {
    return [];
  }
}

export function flyersFromDocuments(documents: FlyerDocument[] | null | undefined): Flyer[] {
  return (documents ?? []).flatMap((document) => {
    if (!document.assetUrl) return [];

    return [
      {
        _id: document._id,
        title: document.title,
        category: document.category ?? null,
        actionLink: document.actionLink ?? null,
        imageUrl: document.assetUrl,
        fullImageUrl: document.assetUrl,
      },
    ];
  });
}

export async function getFlyers(): Promise<Flyer[]> {
  const documents = await getSanityClient().fetch<FlyerDocument[]>(flyersQuery);
  return flyersFromDocuments(documents);
}

export const GALLERY_CATEGORIES = [
  { id: "community", label: "Community & Gatherings" },
  { id: "prayers", label: "Prayers & Taraweeh" },
  { id: "eid", label: "Eid & Celebrations" },
  { id: "facility", label: "Masjid Facility & Progress" },
] as const;

export const galleryCarouselQuery = `*[_type == "galleryImage"] | order(_createdAt desc)[0...12]{
  _id,
  title,
  category,
  "imageUrl": image.asset->url
}`;

export const galleryArchiveQuery = `*[_type == "galleryImage"] | order(date desc, _createdAt desc){
  _id,
  title,
  category,
  date,
  "imageUrl": image.asset->url
}`;

export type GalleryDocument = {
  _id: string;
  title: string;
  category?: string | null;
  date?: string | null;
  imageUrl?: string | null;
};

export type GalleryImage = {
  _id: string;
  title: string;
  category: string | null;
  date: string | null;
  imageUrl: string;
};

export function galleryCategoryLabel(category: string | null | undefined) {
  return GALLERY_CATEGORIES.find((item) => item.id === category)?.label ?? "Community & Gatherings";
}

export const FEATURED_CAMPAIGN_QUERY = `*[_type == "campaign" && !(_id in path("drafts.**")) && scope in ["masjid", "both"]] | order(isFeatured desc, _createdAt desc)[0]{
  _id,
  title,
  description,
  deadline,
  scope,
  goalAmount,
  raisedAmount,
  showProgressBar,
  donationUrl,
  isFeatured
}`;

export type CampaignDocument = {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  deadline?: string | null;
  scope?: string | null;
  goalAmount?: number | null;
  raisedAmount?: number | null;
  showProgressBar?: boolean | null;
  donationUrl?: string | null;
  isFeatured?: boolean | null;
};

export type CampaignProgress = {
  title: string;
  description: string;
  deadline: string | null;
  goalAmount: number;
  raisedAmount: number;
  showProgressBar: boolean;
  donationUrl: string | null;
};

export const FALLBACK_CAMPAIGN: CampaignProgress = {
  title: "Phase 2 Building & Property Expansion Fund",
  description: "",
  deadline: null,
  goalAmount: 400000,
  raisedAmount: 150000,
  showProgressBar: true,
  donationUrl: null,
};

export function resolveCampaign(
  document: CampaignDocument | null | undefined,
): CampaignProgress {
  const title = typeof document?.title === "string" ? document.title.trim() : "";
  if (!title) return FALLBACK_CAMPAIGN;
  const goalAmount = typeof document?.goalAmount === "number" ? document.goalAmount : 0;
  const raisedAmount = typeof document?.raisedAmount === "number" ? document.raisedAmount : 0;
  const description =
    typeof document?.description === "string" ? document.description.trim() : "";
  const deadline =
    typeof document?.deadline === "string" && document.deadline.trim()
      ? document.deadline.trim()
      : null;
  return {
    title,
    description,
    deadline,
    goalAmount,
    raisedAmount,
    showProgressBar: document?.showProgressBar !== false && goalAmount > 0,
    donationUrl: typeof document?.donationUrl === "string" ? document.donationUrl : null,
  };
}

export function galleryFromDocuments(
  documents: GalleryDocument[] | null | undefined,
): GalleryImage[] {
  return (documents ?? []).flatMap((document) => {
    if (!document.imageUrl || !document.title) return [];
    return [
      {
        _id: document._id,
        title: document.title,
        category: document.category ?? null,
        date: document.date ?? null,
        imageUrl: document.imageUrl,
      },
    ];
  });
}
