import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import boardMember from "./schemas/boardMember";
import campaign from "./schemas/campaign";
import flyer from "./schemas/flyer";

export default defineConfig({
  name: "default",
  title: "Masjid Imaan",
  projectId: "zy8zabah",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [flyer, campaign, boardMember],
  },
});
