import { defineField, defineType } from "sanity";

export default defineType({
  name: "prayerSettings",
  title: "Prayer & Iqamah Schedule",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Current Daily Schedule",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fajr",
      title: "Fajr Iqamah",
      type: "string",
      initialValue: "6:15 AM",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dhuhr",
      title: "Dhuhr Iqamah",
      type: "string",
      initialValue: "1:30 PM",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "asr",
      title: "Asr Iqamah",
      type: "string",
      initialValue: "5:00 PM",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "maghrib",
      title: "Maghrib Iqamah",
      type: "string",
      initialValue: "Sunset + 5 min",
      description: 'Clock time or a sunset offset, such as "6:55 PM" or "Sunset + 10 min".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isha",
      title: "Isha Iqamah",
      type: "string",
      initialValue: "8:30 PM",
      description: 'Clock time or an offset, such as "8:15 PM" or "Maghrib + 90 min".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "taraweeh",
      title: "Taraweeh Prayer (Ramadan Only)",
      type: "string",
      description: 'Leave blank to hide. Examples: "Isha + 15 min", "8:45 PM", or fixed time.',
    }),
    defineField({
      name: "jumuahFirstLecture",
      title: "1st Jumu'ah Talk",
      type: "string",
      initialValue: "1:15 PM",
    }),
    defineField({
      name: "jumuahFirstKhutbah",
      title: "1st Jumu'ah Khutbah",
      type: "string",
      initialValue: "1:30 PM",
    }),
    defineField({
      name: "jumuahFirstSalah",
      title: "1st Jumu'ah Salah",
      type: "string",
      initialValue: "1:50 PM",
    }),
    defineField({
      name: "jumuahSecondLecture",
      title: "2nd Jumu'ah Talk",
      type: "string",
      initialValue: "2:15 PM",
    }),
    defineField({
      name: "jumuahSecondKhutbah",
      title: "2nd Jumu'ah Khutbah",
      type: "string",
      initialValue: "2:30 PM",
    }),
    defineField({
      name: "jumuahSecondSalah",
      title: "2nd Jumu'ah Salah",
      type: "string",
      initialValue: "2:50 PM",
    }),
    defineField({
      name: "specialAnnouncement",
      title: "Special Announcement",
      type: "string",
      description: "Optional note, such as Ramadan Taraweeh or a temporary schedule change.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      fajr: "fajr",
      isha: "isha",
    },
    prepare({ title, fajr, isha }) {
      return {
        title: title || "Prayer & Iqamah Schedule",
        subtitle: [fajr, isha].filter(Boolean).join(" – "),
      };
    },
  },
});
