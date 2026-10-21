export const metadata = {
  title: "Privacy Policy | Imaan Masjid",
  description:
    "How Imaan Masjid handles donor and member information. We never sell personal data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">IMAAN</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-slate-500">Last updated October 19, 2026</p>
      <div className="mt-8 space-y-6 text-base leading-7 text-slate-700">
        <p>
          Imaan Masjid in Melissa, Texas is a community site of International Mission For Aid And
          Assistance Inc, a Texas nonprofit recognized as tax-exempt under Internal Revenue Code
          section 501(c)(3) (EIN 99-1023295). This policy describes how we handle information you
          share with the masjid.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Information we receive</h2>
          <p className="mt-2">
            We may receive your name, email address, phone number, and the details you choose to
            include when you donate, request a WhatsApp community invite, ask for an excuse letter,
            or contact the masjid. Donation records may include the amount, date, and the fund you
            selected. We do not ask this website to store full payment card numbers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">We do not sell donor or member data</h2>
          <p className="mt-2">
            Donor and member information is used to process contributions, send receipts, operate
            community programs, and respond to requests you make. We do not sell, rent, or trade
            that information.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Payments and other services</h2>
          <p className="mt-2">
            Card, bank, and other online gifts are processed securely by accredited third parties,
            including Donorbox and Zeffy. Zelle transfers are handled by your bank. The WhatsApp
            invite request is collected through Google Forms so we can verify the request before
            sharing the official group. Those providers process data under their own privacy terms
            solely to complete the transaction or request.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
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
