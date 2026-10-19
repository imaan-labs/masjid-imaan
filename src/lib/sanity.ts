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

export const flyersQuery = `*[_type == "flyer" && (!defined(expiryDate) || expiryDate >= now())] | order(publishDate desc) {
  _id,
  title,
  category,
  actionLink,
  publishDate,
  expiryDate,
  image
}`;

type FlyerImage = {
  asset?: {
    _ref?: string;
    _id?: string;
  };
};

type FlyerDocument = {
  _id: string;
  title: string;
  category?: string | null;
  actionLink?: string | null;
  image?: FlyerImage | null;
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

let client: SanityClient | undefined;

export function getSanityClient(): SanityClient {
  client ??= createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  return client;
}

function imageUrls(image: FlyerImage) {
  return {
    imageUrl: urlFor(image)
      .auto("format")
      .width(900)
      .height(1200)
      .fit("crop")
      .quality(75)
      .url(),
    fullImageUrl: urlFor(image).auto("format").width(2400).fit("max").quality(90).url(),
  };
}

function hasAsset(image: FlyerImage | null | undefined): image is FlyerImage {
  return Boolean(image?.asset?._ref || image?.asset?._id);
}

export async function getFlyers(): Promise<Flyer[]> {
  const client = getSanityClient();
  const documents = await client.fetch<FlyerDocument[]>(flyersQuery);

  return (documents ?? []).flatMap((document) => {
    if (!hasAsset(document.image)) return [];

    return [
      {
        _id: document._id,
        title: document.title,
        category: document.category ?? null,
        actionLink: document.actionLink ?? null,
        ...imageUrls(document.image),
      },
    ];
  });
}
