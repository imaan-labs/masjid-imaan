export const metadata = {
  title: "Terms | Imaan Masjid",
  description:
    "Terms for voluntary contributions and use of Imaan Masjid facilities and community resources.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">IMAAN</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Terms</h1>
      <p className="mt-4 text-sm text-slate-500">Last updated October 19, 2026</p>
      <div className="mt-8 space-y-6 text-base leading-7 text-slate-700">
        <p>
          These terms apply to imaanmasjid.org and to use of Imaan Masjid in Melissa, Texas.
          The masjid is operated by International Mission For Aid And Assistance Inc, a Texas
          nonprofit recognized as tax-exempt under Internal Revenue Code section 501(c)(3)
          (EIN 99-1023295).
        </p>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Voluntary contributions</h2>
          <p className="mt-2">
            Gifts through Donorbox, Zeffy, Zelle, or any other method listed on this site are
            voluntary. A contribution does not purchase a service, seat, or membership. To the
            extent allowed by law, gifts to International Mission For Aid And Assistance Inc may
            be tax-deductible. We provide a receipt when the processor or our records can do so.
            This page is not tax advice. Confirm deductibility with your own tax advisor.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Facility and community resources</h2>
          <p className="mt-2">
            Prayer spaces, classrooms, the recreation area, excuse-letter templates, the bulletin,
            and other masjid resources are provided for religious, educational, and community use.
            Use remains subject to posted hours, safety rules, and direction from the masjid.
            Resources may be limited, rescheduled, or withdrawn when needed to care for the
            facility or the congregation. They are not a guarantee of access at a particular time.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Community channels</h2>
          <p className="mt-2">
            The official WhatsApp group is available after a short verification form so the
            community can limit spam and automated accounts. Access to that group can be removed
            if it is misused.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to{" "}
            <a className="font-semibold text-brand-teal" href="mailto:shura@imaanmasjid.org">
              shura@imaanmasjid.org
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
