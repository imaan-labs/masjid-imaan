import { defineField, defineType } from "sanity";

export const galleryImageSchema = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Image Caption / Event Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo Upload",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Community & Gatherings", value: "community" },
          { title: "Prayers & Taraweeh", value: "prayers" },
          { title: "Eid & Celebrations", value: "eid" },
          { title: "Masjid Facility & Progress", value: "facility" },
        ],
        layout: "radio",
      },
      initialValue: "community",
    }),
    defineField({
      name: "date",
      title: "Date Taken / Event Date",
      type: "date",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
});

export default galleryImageSchema;
