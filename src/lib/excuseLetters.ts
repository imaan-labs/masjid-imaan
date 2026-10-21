export type Audience = "student" | "employee";

export type LetterId =
  | "eid-fitr-student"
  | "eid-fitr-employee"
  | "eid-adha-student"
  | "eid-adha-employee"
  | "jummah-student"
  | "ramadan-fasting-student"
  | "ramadan-ashra-student"
  | "ramadan-ashra-employee"
  | "umrah-student";

export type LetterFields = {
  name: string;
  institution: string;
  dates: string;
};

export type LetterOption = {
  id: LetterId;
  audience: Audience;
  title: string;
  summary: string;
  dateHint: string;
};

export const excuseLetterOptions: LetterOption[] = [
  {
    id: "eid-fitr-student",
    audience: "student",
    title: "Eid Al-Fitr Student Excusal Letter",
    summary: "School leave for the holiday that marks the end of Ramadan.",
    dateHint: "March 19–20, 2027",
  },
  {
    id: "eid-fitr-employee",
    audience: "employee",
    title: "Eid Al-Fitr Employee Excusal Letter",
    summary: "Workplace leave for the holiday that marks the end of Ramadan.",
    dateHint: "March 19–20, 2027",
  },
  {
    id: "eid-adha-student",
    audience: "student",
    title: "Eid Al-Adha Student Excusal Letter",
    summary: "School leave for the holiday of sacrifice.",
    dateHint: "May 27, 2027",
  },
  {
    id: "eid-adha-employee",
    audience: "employee",
    title: "Eid Al-Adha Employee Excusal Letter",
    summary: "Workplace leave for the holiday of sacrifice.",
    dateHint: "May 27, 2027",
  },
  {
    id: "jummah-student",
    audience: "student",
    title: "Students Jummah Excusal Letter",
    summary: "Friday prayer school leave for Jumu'ah at Imaan Masjid.",
    dateHint: "Fridays this semester",
  },
  {
    id: "ramadan-fasting-student",
    audience: "student",
    title: "Students Ramadan Fasting & PE Exemption",
    summary: "Exemption from athletics and P.E. while fasting.",
    dateHint: "February 18 through March 19, 2027",
  },
  {
    id: "ramadan-ashra-student",
    audience: "student",
    title: "Students Ramadan Last Ashra Excusal",
    summary: "School leave after late-night Qiyam and Tahajjud.",
    dateHint: "March 10–19, 2027",
  },
  {
    id: "ramadan-ashra-employee",
    audience: "employee",
    title: "Employee Ramadan Last Ashra Excusal",
    summary: "Workplace accommodation for late-night Qiyam.",
    dateHint: "March 10–19, 2027",
  },
  {
    id: "umrah-student",
    audience: "student",
    title: "Students Umrah Leaves Excuse Letter",
    summary: "Extended school leave for Umrah with family.",
    dateHint: "June 1 through June 14, 2027",
  },
];

export const imaanSignature = [
  "Administration",
  "Imaan Masjid",
  "1010 Milrany Ln",
  "Melissa, TX 75454",
  "Email: shura@imaanmasjid.org",
  "imaanmasjid.org",
] as const;

const BLANK = "____________________";

function filled(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : BLANK;
}

function contactLine(audience: Audience) {
  const who = audience === "student" ? "the family or Imaan Masjid of Melissa" : "Imaan Masjid of Melissa";
  return `We thank you for your consideration and understanding in this matter. If you have any questions or need additional information, please contact ${who} directly at shura@imaanmasjid.org.`;
}

export function lettersFor(audience: Audience) {
  return excuseLetterOptions.filter((option) => option.audience === audience);
}

export function buildExcuseLetter(id: LetterId, fields: LetterFields) {
  const name = filled(fields.name);
  const institution = filled(fields.institution);
  const dates = filled(fields.dates);
  const option = excuseLetterOptions.find((item) => item.id === id) ?? excuseLetterOptions[0];
  const institutionName = fields.institution.trim();

  return {
    id: option.id,
    title: option.title,
    subject: subjectLine(option.id, name),
    salutation:
      option.audience === "employee"
        ? "To whom it may concern,"
        : institutionName
          ? `Dear ${institutionName} Administration,`
          : "Dear School Administration,",
    paragraphs: letterParagraphs(option.id, name, institution, dates),
    closing: contactLine(option.audience),
  };
}

function subjectLine(id: LetterId, name: string) {
  switch (id) {
    case "eid-fitr-student":
    case "eid-fitr-employee":
      return `Excuse for ${name} to observe Eid al-Fitr`;
    case "eid-adha-student":
    case "eid-adha-employee":
      return `Excuse for ${name} to observe Eid al-Adha`;
    case "jummah-student":
      return `Excuse for ${name} to attend Jumu'ah`;
    case "ramadan-fasting-student":
      return `Ramadan fasting exemption from P.E. for ${name}`;
    case "ramadan-ashra-student":
    case "ramadan-ashra-employee":
      return `Excuse for ${name} during the last ten nights of Ramadan`;
    case "umrah-student":
      return `Umrah leave for ${name}`;
  }
}

function letterParagraphs(id: LetterId, name: string, institution: string, dates: string) {
  switch (id) {
    case "eid-fitr-student":
      return [
        `The Muslim community of the City of Melissa and adjoining areas (including but not limited to school districts) will be celebrating the Islamic holiday of Eid al-Fitr, which holds immense significance for Muslims worldwide. As per the lunar calendar, Eid al-Fitr is expected to fall on ${dates}. Based on the moon sighting, the observance may also fall on the day before or the day after.`,
        `Eid al-Fitr is celebrated annually by Muslims worldwide to mark the end of Ramadan and is one of the two important religious holidays for Muslims. As Eid al-Fitr is a very important religious holiday, pursuant to Texas Education Code §51.911 and 42 U.S.C. §2000e et seq., we request that you excuse ${name} from attending ${institution} on that day and not count the absence as unexcused. It would be appreciated if ${name} could make up any missed classwork at a later time.`,
      ];
    case "eid-fitr-employee":
      return [
        `The Muslim community will be celebrating the Islamic holiday of Eid al-Fitr, which holds immense significance for Muslims worldwide. As per the lunar calendar, Eid al-Fitr is expected to fall on ${dates}. Based on the moon sighting, the observance may also fall on the day before or the day after. We ask that you grant ${name} leave from ${institution} for this holiday on religious grounds.`,
        `Eid al-Fitr is celebrated annually by Muslims worldwide to mark the end of Ramadan. It is one of the two important religious holidays celebrated by Muslims worldwide.`,
      ];
    case "eid-adha-student":
      return [
        `The Muslim community of the City of Melissa and adjoining areas (including but not limited to school districts) will be celebrating the Islamic holiday of Eid al-Adha on ${dates}.`,
        `Eid al-Adha is celebrated worldwide by Muslims to honor the willingness of Abraham to sacrifice his son as an act of obedience to God's command. It is one of two major Islamic holidays celebrated by Muslims all over the world. As Eid al-Adha is a very important religious holiday, we request that you excuse ${name} from attending ${institution} on that day and not count the absence as unexcused. It would be appreciated if ${name} could make up any missed classwork at a later time.`,
      ];
    case "eid-adha-employee":
      return [
        `The Muslim community will be celebrating the Islamic holiday of Eid al-Adha on ${dates}. We ask that you grant ${name} leave from ${institution} for this holiday on religious grounds.`,
        `Eid al-Adha is celebrated worldwide by Muslims to honor the willingness of Abraham to sacrifice his son as an act of obedience to God's command. It is one of two major Islamic holidays celebrated by Muslims all over the world.`,
      ];
    case "jummah-student":
      return [
        `Please allow ${name} to be excused from class at ${institution} on ${dates} in order to attend Jumu'ah prayer at Imaan Masjid of Melissa. There are two congregations, 1st Jumu'ah and 2nd Jumu'ah, each lasting approximately 45 minutes. Please also allow ample time beforehand to reach the masjid and to return afterward.`,
        `Attending Jumu'ah is required for Muslims, and we request this excused absence on the grounds of religious exemption.`,
      ];
    case "ramadan-fasting-student":
      return [
        `The Muslim community of the City of Melissa and adjoining areas (including but not limited to school districts) will be observing the holy month of Ramadan on ${dates}. ${name} will be observing this fast while attending ${institution}.`,
        `Ramadan is a sacred month of fasting and spiritual reflection for Muslims around the world. During this time, Muslims abstain from food, drink, and other physical comforts from dawn to dusk. Participating in physical activities while fasting can be challenging and may lead to dehydration or other health risks. We request that you excuse ${name} from athletics and P.E. during these dates. ${name} can take part in alternative activities, such as reading or completing assignments, and a doctor's note can be provided if needed.`,
      ];
    case "ramadan-ashra-student":
      return [
        `${name} will be observing the last ten nights of Ramadan, ${dates}, while enrolled at ${institution}.`,
        `Ramadan is a sacred month of fasting and spiritual reflection for Muslims around the world. The last ten nights have a special religious significance. Muslims observe night prayers (Qiyam and Tahajjud), mostly on the odd nights, that extend to 3:00 or 4:00 AM. We request that you excuse ${name} from school on the following day and not count the absence as unexcused. It would be appreciated if any missed classwork could be made up later.`,
      ];
    case "ramadan-ashra-employee":
      return [
        `${name} will be observing the last ten nights of Ramadan, ${dates}, while employed at ${institution}.`,
        `Ramadan is a sacred month of fasting and spiritual reflection for Muslims around the world. Muslims abstain from food, drink, and other physical comforts from dawn to dusk. The last ten nights have a special religious significance. Muslims observe night prayers (Qiyam), mostly on the odd nights, that extend to 3:00 or 4:00 AM. We ask that you grant ${name} leave on the odd nights of these last ten nights, or a corresponding workplace accommodation, on religious grounds.`,
      ];
    case "umrah-student":
      return [
        `This is to inform you that ${name} will require a leave of absence from ${institution} on ${dates} for the purpose of performing Umrah with family.`,
        `Umrah is a voluntary Islamic pilgrimage to Mecca, also known as the minor pilgrimage. It offers Muslims an opportunity to renew their faith, seek forgiveness, pray for their needs, and be cleansed of their sins.`,
      ];
  }
}
