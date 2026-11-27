import { defineField, defineType } from "sanity";

const categoryTitles: Record<string, string> = {
  general: "General Announcement",
  sessions: "Interactive Sessions / Lectures",
  ramadan: "Ramadan Services & Taraweeh",
  eid: "Eid Celebrations & Prayers",
  youth: "Youth & Kids",
  sisters: "Sisters Program",
  fundraiser: "Fundraiser",
};

export default defineType({
  name: "flyer",
  title: "Flyer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General Announcement", value: "general" },
          { title: "Interactive Sessions / Lectures", value: "sessions" },
          { title: "Ramadan Services & Taraweeh", value: "ramadan" },
          { title: "Eid Celebrations & Prayers", value: "eid" },
          { title: "Youth & Kids", value: "youth" },
          { title: "Sisters Program", value: "sisters" },
          { title: "Fundraiser", value: "fundraiser" },
        ],
        layout: "radio",
      },
      initialValue: "general",
    }),
    defineField({
      name: "status",
      title: "Flyer Status",
      type: "string",
      options: {
        list: [
          { title: "Active (Visible on Website & Kiosk)", value: "active" },
          { title: "Inactive (Hidden / Archived in CMS)", value: "inactive" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "actionLink",
      title: "Action Link",
      type: "url",
    }),
    defineField({
      name: "priority",
      title: "Display Priority (Lower = Higher Up)",
      description:
        "Set a lower number (e.g., 1, 2, 3) to move a flyer higher up, or a higher number to move it down. Default is 100.",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "date",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      status: "status",
      priority: "priority",
      media: "image",
    },
    prepare({ title, category, status, priority, media }) {
      const badge = status === "inactive" ? "[INACTIVE]" : "[ACTIVE]";
      const categoryTitle =
        categoryTitles[category ?? ""] ?? category ?? "General Announcement";
      return {
        title: title || "Untitled flyer",
        subtitle: `[#${priority ?? 100}] ${badge} ${categoryTitle}`,
        media,
      };
    },
  },
});
