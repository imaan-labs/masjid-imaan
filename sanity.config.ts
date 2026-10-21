import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import boardMember from "./schemas/boardMember";
import campaign from "./schemas/campaign";
import flyer from "./schemas/flyer";
import galleryImage from "./schemas/galleryImage";
import prayerSettings from "./schemas/prayerSettings";

export default defineConfig({
  name: "default",
  title: "IMAAN CMS",
  basePath: "/admin",
  projectId: "zy8zabah",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [flyer, galleryImage, campaign, boardMember, prayerSettings],
  },
  vite: {
    publicDir: false,
  },
});
