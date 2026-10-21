/**
 * Upload local community photos to Sanity as published galleryImage documents.
 *
 * PowerShell:
 *   $env:SANITY_WRITE_TOKEN="your-write-token"
 *   npm run upload:gallery
 *
 * cmd:
 *   set SANITY_WRITE_TOKEN=your-write-token
 *   npm run upload:gallery
 *
 * macOS / Linux:
 *   SANITY_WRITE_TOKEN=your-write-token npm run upload:gallery
 */
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const LOCAL_DIRS = ["public/images", "src/assets"];
const SOURCE_DIRS = ["app", "src", "components"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".git"]);
const SKIP_NAMES = new Set([
  "logo.png",
  "logo.jpeg",
  "logo.jpg",
  "favicon.ico",
]);

const TITLE_WORDS = [
  "sisters",
  "sister",
  "kids",
  "playing",
  "basketball",
  "sandbox",
  "doodle",
  "writing",
  "board",
  "iftar",
  "taraweeh",
  "volunteer",
  "parking",
  "gathering",
  "bonfire",
  "entrance",
  "carpet",
  "center",
  "outside",
  "event",
  "gym",
  "praying",
  "prayer",
  "quran",
  "class",
  "hadith",
  "reading",
  "lecture",
  "lectures",
  "saturday",
  "khutba",
  "jumuah",
  "jummah",
  "nondaylights",
  "eid",
  "adha",
  "fitr",
  "salah",
  "bbq",
  "front",
  "door",
  "wash",
  "fence",
  "gravel",
  "snowy",
  "sunset",
  "inflatable",
  "goodies",
  "joint",
  "early",
  "days",
  "occupied",
  "marker",
  "grills",
  "grill",
  "zaddow",
  "park",
  "trip",
  "zplex",
  "foosball",
  "pool",
  "table",
  "toy",
  "room",
  "eliptical",
  "clock",
  "bird",
  "eye",
  "view",
  "blue",
  "green",
  "old",
  "raw",
  "men",
  "night",
  "first",
  "patio",
  "ducks",
  "recreation",
  "tafsir",
  "sessions",
  "community",
  "on",
];

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "Set SANITY_WRITE_TOKEN or SANITY_API_WRITE_TOKEN to a Sanity API token with Editor access, then run this script again.",
  );
  process.exit(1);
}

const client = createClient({
  projectId: "zy8zabah",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function cleanSlug(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitFilename(base) {
  let rest = base.toLowerCase().replace(/\.[^.]+$/, "");
  const parts = [];
  while (rest.length) {
    const year = rest.match(/^(?:19|20)\d{2}/);
    if (year) {
      parts.push(year[0]);
      rest = rest.slice(year[0].length);
      continue;
    }
    const word = TITLE_WORDS.filter((item) => rest.startsWith(item)).sort(
      (left, right) => right.length - left.length,
    )[0];
    if (word) {
      parts.push(word);
      rest = rest.slice(word.length);
      continue;
    }
    const digits = rest.match(/^\d+/);
    if (digits) {
      parts.push(digits[0]);
      rest = rest.slice(digits[0].length);
      continue;
    }
    const unknown = rest.match(/^[^a-z0-9]*([a-z]+)/);
    if (unknown) {
      parts.push(unknown[1]);
      rest = rest.slice(unknown[0].length);
      continue;
    }
    rest = rest.slice(1);
  }
  return parts;
}

function readableTitle(filename) {
  const words = splitFilename(filename);
  if (words.length === 0) return filename;
  return words
    .map((word) => (/^\d+$/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function inferCategory(filename) {
  const name = filename.toLowerCase();
  if (/eid|fitr|adha/.test(name)) return "eid";
  if (/pray|taraweeh|salah|jumuah|jummah|khutba|quran|hadith|lecture/.test(name)) return "prayers";
  if (
    /gym|center|entrance|parking|carpet|fence|gravel|volunteer|facility|door|recreation|pool|foosball|toy|clock|bird|raw|occupied|perimeter/.test(
      name,
    )
  ) {
    return "facility";
  }
  return "community";
}

async function walk(directory, files) {
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(extension) || SKIP_NAMES.has(entry.name.toLowerCase())) continue;
    files.push(fullPath);
  }
}

async function collectLocalImages() {
  const files = [];
  for (const directory of LOCAL_DIRS) {
    await walk(path.join(ROOT, directory), files);
  }
  const bySlug = new Map();
  for (const filePath of files.sort()) {
    const slug = cleanSlug(path.basename(filePath));
    if (!slug || bySlug.has(slug)) continue;
    bySlug.set(slug, { kind: "file", filePath, filename: path.basename(filePath), slug });
  }
  return [...bySlug.values()];
}

function remoteFilename(url) {
  const pathname = new URL(url).pathname;
  const base = path.basename(pathname).split("?")[0];
  return base || "remote-image.jpg";
}

async function collectRemoteImages(localSlugs) {
  const urls = new Set();
  const sourceFiles = [];
  for (const directory of SOURCE_DIRS) {
    await walkSources(path.join(ROOT, directory), sourceFiles);
  }
  const pattern = /https?:\/\/(?:www\.)?imaanmasjid\.org\/[^"'()\s]+\.(?:jpg|jpeg|png|webp)/gi;
  for (const filePath of sourceFiles) {
    const text = await readFile(filePath, "utf8");
    for (const match of text.matchAll(pattern)) urls.add(match[0]);
  }
  const images = [];
  for (const url of urls) {
    const filename = remoteFilename(url);
    const slug = cleanSlug(filename);
    if (!slug || localSlugs.has(slug) || SKIP_NAMES.has(filename.toLowerCase())) continue;
    images.push({ kind: "url", url, filename, slug });
  }
  return images;
}

async function walkSources(directory, files) {
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walkSources(fullPath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    if (/\.(tsx|ts|jsx|js|mjs|astro|html|md|json)$/i.test(entry.name)) files.push(fullPath);
  }
}

async function uploadBody(image) {
  if (image.kind === "file") {
    const info = await stat(image.filePath);
    if (!info.isFile() || info.size === 0) throw new Error(`Empty file: ${image.filePath}`);
    return createReadStream(image.filePath);
  }
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`Failed to fetch ${image.url} (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const local = await collectLocalImages();
  const remote = await collectRemoteImages(new Set(local.map((image) => image.slug)));
  const images = [...local, ...remote];
  if (images.length === 0) {
    console.log("No gallery photos found.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  let published = 0;
  let skipped = 0;

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    const label = `[${index + 1}/${images.length}]`;
    const title = readableTitle(image.filename);
    const category = inferCategory(image.filename);
    const documentId = `gallery-${image.slug}`;
    try {
      const existing = await client.getDocument(documentId);
      if (existing?.image?.asset?._ref) {
        skipped += 1;
        console.log(`${label} Already published: ${title}`);
        continue;
      }
      const uploadedAsset = await client.assets.upload("image", await uploadBody(image), {
        filename: image.filename,
      });
      await client.createOrReplace({
        _id: documentId,
        _type: "galleryImage",
        title,
        category,
        date: today,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedAsset._id,
          },
        },
      });
      published += 1;
      console.log(`${label} Uploaded & published: ${title} (${category})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`${label} Failed: ${image.filename} — ${message}`);
    }
  }

  console.log(`Done. Published ${published}, already present ${skipped}, total ${images.length}.`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
