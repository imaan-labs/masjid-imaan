import { defineField, defineType } from "sanity";

export default defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "string",
      options: {
        list: [
          { title: "Masjid", value: "masjid" },
          { title: "Org", value: "org" },
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "both",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "goalAmount",
      title: "Goal Amount",
      type: "number",
      description:
        "Manual aggregate entered by an editor. Leave donor-platform totals in Zeffy or Donorbox.",
    }),
    defineField({
      name: "raisedAmount",
      title: "Raised Amount",
      type: "number",
      description:
        "Manual aggregate entered by an editor. Leave donor-platform totals in Zeffy or Donorbox.",
    }),
    defineField({
      name: "showProgressBar",
      title: "Show Progress Bar",
      type: "boolean",
      description:
        "Publish the manual totals on the website. Turn this off to keep those figures private.",
      initialValue: true,
    }),
    defineField({
      name: "donationUrl",
      title: "Donation URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
