"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import CampaignProgressCard from "@/src/components/CampaignProgressCard";
import {
  CAMPAIGN_ZEFFY_URL as CAMPAIGN_ZEFFY_FALLBACK,
  FALLBACK_CAMPAIGN,
  FEATURED_CAMPAIGN_QUERY,
  GENERAL_ZEFFY_URL,
  getSanityClient,
  resolveCampaign,
  type CampaignDocument,
  type CampaignProgress,
} from "@/src/lib/sanity";

const DONORBOX_EMBED = "https://donorbox.org/embed/donate-to-imaan";
const AMAZON_URL =
  "https://www.amazon.com/?&_encoding=UTF8&tag=imaan0bd-20&linkCode=ur2&linkId=c88e3ca8a369dd52a5e841cb314bc535&camp=1789&creative=9325";

const TABS = [
  { id: "card", label: "Card / ACH" },
  { id: "zeffy", label: "Zeffy" },
  { id: "zelle", label: "Bank Transfer" },
  { id: "amazon", label: "Shop Amazon" },
] as const;

export type GiveTab = (typeof TABS)[number]["id"];

const zelleAccounts = [
  { label: "Ops", email: "donate@imaanmasjid.org" },
  { label: "Building Fund", email: "helpbuild@imaanmasjid.org" },
];

type DonationContextValue = {
  openGive: (tab?: GiveTab) => void;
};

const DonationContext = createContext<DonationContextValue | null>(null);

export function useDonation() {
  const value = useContext(DonationContext);
  if (!value) {
    throw new Error("useDonation must be used inside DonationRoot");
  }
  return value;
}

export function DonationRoot({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<GiveTab>("card");

  return (
    <DonationContext.Provider
      value={{
        openGive: (next = "card") => {
          setTab(next);
          setOpen(true);
        },
      }}
    >
      {children}
      <DonationModal open={open} tab={tab} onTab={setTab} onClose={() => setOpen(false)} />
    </DonationContext.Provider>
  );
}

export function GiveButton({
  tab = "card",
  className,
  children,
}: {
  tab?: GiveTab;
  className?: string;
  children: React.ReactNode;
}) {
  const { openGive } = useDonation();
  return (
    <button type="button" className={className} onClick={() => openGive(tab)}>
      {children}
    </button>
  );
}

export default function DonationModal({
  open,
  tab,
  onTab,
  onClose,
  campaign: campaignProp,
}: {
  open: boolean;
  tab: GiveTab;
  onTab: (tab: GiveTab) => void;
  onClose: () => void;
  campaign?: CampaignProgress | null;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [fetchedCampaign, setFetchedCampaign] = useState<CampaignProgress | null>(null);

  useEffect(() => {
    if (campaignProp || !open) return;
    let cancelled = false;
    getSanityClient()
      .fetch<CampaignDocument | null>(FEATURED_CAMPAIGN_QUERY)
      .then((document) => {
        if (!cancelled) setFetchedCampaign(resolveCampaign(document));
      })
      .catch(() => {
        if (!cancelled) setFetchedCampaign(null);
      });
    return () => {
      cancelled = true;
    };
  }, [campaignProp, open]);

  const campaign = campaignProp ?? fetchedCampaign;
  const CAMPAIGN_ZEFFY_URL = campaign?.donationUrl || CAMPAIGN_ZEFFY_FALLBACK;

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  async function copyEmail(email: string) {
    let copiedOk = false;
    try {
      await navigator.clipboard.writeText(email);
      copiedOk = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      copiedOk = document.execCommand("copy");
      field.remove();
    }
    if (!copiedOk) return;
    setCopied(email);
    window.setTimeout(() => {
      setCopied((current) => (current === email ? null : current));
    }, 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close ways to give"
        className="absolute inset-0 bg-brand-dark/70"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <h2 id={titleId} className="text-base font-bold text-slate-900">
            Ways to Give
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100"
          >
            ✕ Close
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 py-2" role="tablist" aria-label="Giving methods">
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`give-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`give-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onTab(item.id)}
                className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  selected ? "bg-brand-teal text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-brand-bg p-4">
          <CampaignProgressCard
            compact
            campaign={{
              ...(campaign ?? FALLBACK_CAMPAIGN),
              donationUrl: CAMPAIGN_ZEFFY_URL,
            }}
            onGive={onTab}
          />
          <div className="mt-4">
          {tab === "card" ? (
            <div role="tabpanel" id="give-panel-card" aria-labelledby="give-tab-card">
              <p className="mb-3 text-sm leading-6 text-slate-600">
                Give immediately by debit, credit card, or ACH, or set up monthly support. The form stays on this page.
              </p>
              <div className="flex justify-center">
                <iframe
                  title="Donate to Imaan Masjid on Donorbox"
                  src={DONORBOX_EMBED}
                  className="h-[70vh] w-full max-w-[500px] rounded-xl border border-slate-200 bg-white"
                  allow="payment"
                />
              </div>
            </div>
          ) : null}
          {tab === "zeffy" ? (
            <div role="tabpanel" id="give-panel-zeffy" aria-labelledby="give-tab-zeffy" className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="w-fit rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                Recommended • 100% to Masjid
              </p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Zeffy · 0% platform fee</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Zeffy covers the transaction fee, so every cent of your gift supports masjid operations, programs, and the building fund.
              </p>
              <a
                href={GENERAL_ZEFFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2B5865] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#234752]"
              >
                Open Zeffy Portal ↗
              </a>
            </div>
          ) : null}
          {tab === "zelle" ? (
            <div role="tabpanel" id="give-panel-zelle" aria-labelledby="give-tab-zelle" className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="w-fit rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                Direct & Fee-Free
              </p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Bank transfer with Zelle</h3>
              <ul className="mt-4 space-y-4">
                {zelleAccounts.map((account) => (
                  <li key={account.email}>
                    <p className="text-sm font-semibold text-slate-900">{account.label}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-600">{account.email}</span>
                      <button
                        type="button"
                        onClick={() => copyEmail(account.email)}
                        className="rounded-xl border border-brand-teal px-3 py-1 text-xs font-semibold text-brand-teal transition-all duration-200 hover:bg-brand-teal hover:text-white"
                        aria-label={`Copy ${account.email}`}
                      >
                        {copied === account.email ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="sr-only" aria-live="polite">
                {copied ? `Copied ${copied}` : ""}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Mail a check or confirm a pledge at{" "}
                <a href="mailto:shura@imaanmasjid.org" className="font-semibold text-slate-900">
                  shura@imaanmasjid.org
                </a>
                .
              </p>
            </div>
          ) : null}
          {tab === "amazon" ? (
            <div role="tabpanel" id="give-panel-amazon" aria-labelledby="give-tab-amazon" className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <h3 className="text-xl font-bold text-slate-900">🛒 Support via Amazon Purchases</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Shop through our official affiliate link at no additional cost to you, and Amazon will contribute a percentage of eligible purchases to IMAAN.
              </p>
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-dark"
              >
                Shop on Amazon →
              </a>
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
