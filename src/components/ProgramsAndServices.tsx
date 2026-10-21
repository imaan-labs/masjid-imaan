import Link from "next/link";

const WHATSAPP_FORM =
  "https://docs.google.com/forms/d/1aQT8UFFkeKrnGlhWZCJ5KrTdQM1OcqaGD5ijvXumkz8";

const programs = [
  {
    id: "aalim-sessions",
    badge: "🎓 Weekend Learning",
    title: "Interactive Sessions with an Aa'lim",
    points: [
      "Structured weekend sessions to ask questions and learn authentic Quranic and Hadith guidance.",
      "Full accommodations for sisters with dedicated live audio-video arrangements.",
      "Open community discussion and a family-friendly environment.",
    ],
    action: { href: "/bulletin?category=sessions", label: "View Schedule & Details →" },
  },
  {
    id: "ramadan-services",
    badge: "🌙 Annual Observance",
    title: "Ramadan at Imaan Masjid",
    points: [
      "Nightly Taraweeh prayers led by qualified Huffadh.",
      "Dedicated sisters' prayer and viewing accommodations.",
      "Children's room and a supervised quiet space during Taraweeh.",
      "Community iftars and pre-dawn Suhoor during the Last 10 Nights Qiyam-ul-Layl.",
    ],
    note: "Check the Community Bulletin for current year Ramadan flyers and schedules.",
    bulletinHref: "/bulletin?category=ramadan",
  },
  {
    id: "eid-services",
    badge: "✨ Community Festivities",
    title: "Eid Services & Festivities",
    points: [
      "Multiple Eid prayer shifts, typically a first and second shift, to accommodate the community.",
      "Family social gatherings with refreshments, kids' gift bags, and activities after prayer.",
      "Coordinated Zakat-ul-Fitr collection and distribution prior to prayer.",
    ],
    note: "Official Eid announcements and registration links post to the Bulletin Board.",
    bulletinHref: "/bulletin?category=eid",
  },
];

const utilities = [
  {
    href: "/excuse-letters",
    badge: "📄 Print / PDF",
    title: "Excuse Letters",
    description: "Eid, Ramadan, and Jumu'ah letters for school and work.",
    action: "Generate Letters →",
    external: false,
  },
  {
    href: WHATSAPP_FORM,
    badge: "💬 Verified Group",
    title: "Official WhatsApp",
    description: "Complete quick verification to join the announcement group.",
    action: "Request Invite ↗",
    external: true,
  },
];

export default function ProgramsAndServices() {
  return (
    <section id="programs" className="scroll-mt-24">
      <div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Programs & Services
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Learn, worship, and gather through the year
          </h2>
        </div>

        <ul className="mt-6 grid grid-cols-1 items-stretch gap-4">
          {programs.map((program) => (
            <li key={program.id} id={program.id} className="scroll-mt-24">
              <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 text-slate-900 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
                <p className="w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
                  {program.badge}
                </p>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                  {program.title}
                </h3>
                <ul className="mt-4 flex-1 space-y-3 text-sm leading-6 text-slate-600">
                  {program.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {program.note ? (
                  <p className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600">
                    {program.note}{" "}
                    <Link href={program.bulletinHref ?? "/bulletin"} className="font-semibold underline underline-offset-2">
                      Open the bulletin
                    </Link>
                  </p>
                ) : null}
                {program.action ? (
                  <Link
                    href={program.action.href}
                    className="mt-5 inline-flex w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                  >
                    {program.action.label}
                  </Link>
                ) : null}
              </article>
            </li>
          ))}
        </ul>

        <ul className="mt-4 grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          {utilities.map((item) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 text-slate-900 shadow-sm">
                <p className="w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
                  {item.badge}
                </p>
                <h3 className="mt-3 text-base font-bold tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.description}</p>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                  >
                    {item.action}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                  >
                    {item.action}
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
