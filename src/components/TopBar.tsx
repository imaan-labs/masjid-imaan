const WHATSAPP_FORM =
  "https://docs.google.com/forms/d/1aQT8UFFkeKrnGlhWZCJ5KrTdQM1OcqaGD5ijvXumkz8";
const FACEBOOK = "https://www.facebook.com/imaanmasjidmelissa";
const INSTAGRAM = "https://www.instagram.com/imaan_masjid";

export default function TopBar() {
  return (
    <div className="border-b border-white/10 bg-brand-dark text-slate-100 print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <p className="font-semibold text-slate-100">
          🕌 Center for Prayer, Community &amp; Learning
        </p>
        <div className="ml-auto flex max-w-full items-center justify-end gap-x-3">
          <a
            href={WHATSAPP_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 text-right font-semibold text-white underline-offset-2 hover:underline"
          >
            💬 Request WhatsApp Invite (Anti-Spam Verification)
          </a>
          <span className="flex shrink-0 items-center gap-2 text-slate-100">
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-current hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.4 3 11 4.5 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7z" />
              </svg>
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-current hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5 fill-none stroke-current" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
                <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
