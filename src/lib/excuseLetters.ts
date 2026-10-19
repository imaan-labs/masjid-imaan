export type LetterId =
  | "eid-fitr"
  | "eid-adha"
  | "jumuah"
  | "ramadan-pe"
  | "qiyam"
  | "umrah";

export type LetterFields = {
  name: string;
  institution: string;
  dates: string;
};

export type LetterOption = {
  id: LetterId;
  title: string;
  summary: string;
  dateHint: string;
};

export const excuseLetterOptions: LetterOption[] = [
  {
    id: "eid-fitr",
    title: "Eid Al-Fitr",
    summary: "Absence for the holiday that marks the end of Ramadan.",
    dateHint: "March 19–20, 2027",
  },
  {
    id: "eid-adha",
    title: "Eid Al-Adha",
    summary: "Absence for the holiday of sacrifice.",
    dateHint: "May 27, 2027",
  },
  {
    id: "jumuah",
    title: "Jumu'ah",
    summary: "Weekly Friday prayer at Imaan Masjid.",
    dateHint: "Fridays this semester",
  },
  {
    id: "ramadan-pe",
    title: "Ramadan Fasting PE Exemption",
    summary: "Exemption from athletics and P.E. while fasting.",
    dateHint: "February 18 through March 19, 2027",
  },
  {
    id: "qiyam",
    title: "Last 10 Nights Qiyam",
    summary: "Leave after the late-night prayers of the last ten nights.",
    dateHint: "March 10–19, 2027",
  },
  {
    id: "umrah",
    title: "Umrah leave",
    summary: "Leave to perform Umrah with family.",
    dateHint: "June 1 through June 14, 2027",
  },
];

export const imaanSignature = [
  "Administration",
  "Imaan Masjid",
  "1010 Milrany Ln",
  "Melissa, TX 75454",
  "shura@imaanmasjid.org",
  "imaanmasjid.org",
] as const;

const BLANK = "____________________";

function filled(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : BLANK;
}

function closing() {
  return "We thank you for your consideration and understanding in this matter. If you have any questions or need additional information, please contact the family or Imaan Masjid of Melissa directly at shura@imaanmasjid.org.";
}

export function buildExcuseLetter(id: LetterId, fields: LetterFields) {
  const name = filled(fields.name);
  const institution = filled(fields.institution);
  const dates = filled(fields.dates);
  const institutionName = fields.institution.trim();
  const option = excuseLetterOptions.find((item) => item.id === id)!;

  const paragraphs = letterParagraphs(id, name, institution, dates);

  return {
    id,
    title: option.title,
    subject: subjectLine(id, name),
    salutation: institutionName
      ? `Dear ${institutionName} Administration,`
      : "Dear Administration,",
    paragraphs,
    closing: closing(),
  };
}

function subjectLine(id: LetterId, name: string) {
  switch (id) {
    case "eid-fitr":
      return `Excuse for ${name} to observe Eid al-Fitr`;
    case "eid-adha":
      return `Excuse for ${name} to observe Eid al-Adha`;
    case "jumuah":
      return `Excuse for ${name} to attend Jumu'ah`;
    case "ramadan-pe":
      return `Ramadan fasting exemption from P.E. for ${name}`;
    case "qiyam":
      return `Excuse for ${name} after the last ten nights of Ramadan`;
    case "umrah":
      return `Umrah leave for ${name}`;
  }
}

function letterParagraphs(
  id: LetterId,
  name: string,
  institution: string,
  dates: string
) {
  switch (id) {
    case "eid-fitr":
      return [
        `The Muslim community of the City of Melissa and adjoining areas will be celebrating the Islamic holiday of Eid al-Fitr on ${dates}. Eid al-Fitr holds immense significance for Muslims worldwide. Because the date follows the lunar calendar and moon sighting, the observance may also fall on the day before or after that date.`,
        `Eid al-Fitr is celebrated annually by Muslims worldwide to mark the end of Ramadan and is one of the two important religious holidays for Muslims. As Eid al-Fitr is a very important religious holiday, we request that you excuse ${name} and not count the absence as unexcused. It would be appreciated if any missed classwork or duties could be made up later. This request is made pursuant to Texas Education Code §51.911 and 42 U.S.C. §2000e et seq., as applicable.`,
      ];
    case "eid-adha":
      return [
        `The Muslim community of the City of Melissa and adjoining areas will be celebrating the Islamic holiday of Eid al-Adha on ${dates}. We ask that you grant ${name} leave for this holiday on religious grounds.`,
        `Eid al-Adha is celebrated worldwide by Muslims to honor the willingness of Abraham to sacrifice his son as an act of obedience to God's command. It is one of two major Islamic holidays celebrated by Muslims all over the world. We request that you excuse ${name} and not count the absence as unexcused. It would be appreciated if any missed classwork or duties could be made up later.`,
      ];
    case "jumuah":
      return [
        `Please allow ${name} to be excused from ${institution} on ${dates} in order to attend Jumu'ah prayer at Imaan Masjid of Melissa. There are two congregations, starting at 2:00 PM and 3:30 PM, each lasting approximately 45 minutes. Please also allow ample time beforehand to reach the masjid and to return afterward.`,
        `Attending Jumu'ah is required for Muslims, and we request this excused absence on the grounds of religious exemption.`,
      ];
    case "ramadan-pe":
      return [
        `${name} will be observing the holy month of Ramadan on ${dates} while attending ${institution}.`,
        `Ramadan is a sacred month of fasting and spiritual reflection for Muslims around the world. During this time, Muslims abstain from food, drink, and other physical comforts from dawn to dusk. Participating in physical activities while fasting can be challenging and may lead to dehydration or other health risks. We request that you excuse ${name} from athletics and P.E. during these dates. ${name} can take part in alternative activities, such as reading or completing assignments, and a doctor's note can be provided if needed.`,
      ];
    case "qiyam":
      return [
        `${name} will be observing the last ten nights of Ramadan, from ${dates}.`,
        `Ramadan is a sacred month of fasting and spiritual reflection for Muslims around the world. The last ten nights have a special religious significance. Muslims observe night prayers (qiyam), mostly on the odd nights, that extend to 3:00 or 4:00 AM. We request that you excuse ${name} from ${institution} on the following day and not count the absence as unexcused. It would be appreciated if any missed classwork or duties could be made up later.`,
      ];
    case "umrah":
      return [
        `This is to inform you that ${name} will require a leave of absence from ${institution} for the purpose of performing Umrah with family on ${dates}.`,
        `Umrah is a voluntary Islamic pilgrimage to Mecca, also known as the minor pilgrimage. Umrah offers Muslims an opportunity to renew their faith, seek forgiveness, pray for their needs, and be cleansed of their sins.`,
      ];
  }
}
