import { defineField, defineType } from "sanity";

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
      name: "actionLink",
      title: "Action Link",
      type: "url",
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
});
