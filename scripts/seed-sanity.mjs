/**
 * Idempotent seed for Sanity project zy8zabah / production.
 *
 * PowerShell:
 *   $env:SANITY_WRITE_TOKEN="your-write-token"
 *   npm run seed
 *
 * cmd:
 *   set SANITY_WRITE_TOKEN=your-write-token
 *   npm run seed
 *
 * macOS / Linux:
 *   SANITY_WRITE_TOKEN=your-write-token npm run seed
 */
import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "Set SANITY_WRITE_TOKEN to a Sanity API token with Editor access, then run this script again.",
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

const boardMembers = [
  { name: "Haziq Hassan", role: "Director", order: 1 },
  { name: "Musab Muhammad Jafri", role: "Director", order: 2 },
  { name: "Syed Ashar Ali", role: "Director", order: 3 },
  { name: "Mohammed Iqbal Shirol", role: "Director", order: 4 },
  { name: "Ahmed AbdulWakeel", role: "Director", order: 5 },
  { name: "Zeeshan Khan", role: "Director", order: 6 },
];

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const documents = [
  ...boardMembers.map((member) => ({
    _id: `boardMember-${slug(member.name)}`,
    _type: "boardMember",
    name: member.name,
    role: member.role,
    order: member.order,
  })),
  {
    _id: "general-sadaqah-campaign",
    _type: "campaign",
    title: "General Sadaqah & Capital Building Fund",
    scope: "both",
    goalAmount: 100000,
    raisedAmount: 25000,
    showProgressBar: true,
    donationUrl: "https://www.zeffy.com/",
  },
];

for (const document of documents) {
  await client.createOrReplace(document);
  console.log(`upserted: ${document._id}`);
}

console.log("Seed complete.");
