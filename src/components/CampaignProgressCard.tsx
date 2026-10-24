"use client";

import { useEffect, useState } from "react";
import { useDonation, type GiveTab } from "@/src/components/DonationModal";
import {
  CAMPAIGN_ZEFFY_URL,
  FALLBACK_CAMPAIGN,
  FEATURED_CAMPAIGN_QUERY,
  getSanityClient,
  resolveCampaign,
  type CampaignDocument,
  type CampaignProgress,
} from "@/src/lib/sanity";

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CampaignProgressCard({
  compact = false,
  onGive,
  campaign: campaignProp,
}: {
  compact?: boolean;
  onGive?: (tab: Extract<GiveTab, "zeffy" | "card">) => void;
  campaign?: CampaignProgress | null;
}) {
  const { openGive } = useDonation();
  const [fetchedCampaign, setFetchedCampaign] = useState<CampaignProgress>(FALLBACK_CAMPAIGN);
  const campaign = campaignProp ?? fetchedCampaign;

  useEffect(() => {
    if (campaignProp) return;
    let cancelled = false;
    getSanityClient()
      .fetch<CampaignDocument | null>(FEATURED_CAMPAIGN_QUERY)
      .then((document) => {
        const resolved = resolveCampaign(document);
        console.log("Sanity campaign:", resolved);
        if (!cancelled) setFetchedCampaign(resolved);
      })
      .catch((error) => {
        console.log("Sanity campaign:", error);
        if (!cancelled) setFetchedCampaign(FALLBACK_CAMPAIGN);
      });
    return () => {
      cancelled = true;
    };
  }, [campaignProp]);

  const funded =
    campaign.goalAmount > 0
      ? Math.max(0, Math.round((campaign.raisedAmount / campaign.goalAmount) * 1000) / 10)
      : 0;
  const barWidth = Math.min(100, funded);
  const remaining = Math.max(0, campaign.goalAmount - campaign.raisedAmount);
  const give = onGive ?? openGive;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-50/90 via-white to-orange-50/60 text-slate-900 shadow-md ${
        compact ? "px-4 py-3" : "px-5 py-4 sm:px-6 sm:py-4"
      }`}
    >
      <div
        className={`flex gap-4 ${
          compact ? "flex-col" : "flex-col lg:flex-row lg:items-center lg:justify-between"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Urgent Appeal
            </span>
            {campaign.deadline ? (
              <span className="rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                ⏳ Deadline: {campaign.deadline}
              </span>
            ) : null}
          </div>
          <h2 className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
            {campaign.title}
          </h2>
          {campaign.description ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 sm:line-clamp-2 sm:text-sm">
              {campaign.description}
            </p>
          ) : null}

          {campaign.showProgressBar ? (
            <div className="mt-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-xs font-semibold text-slate-900">
                <p>
                  {money(campaign.raisedAmount)} Raised of {money(campaign.goalAmount)} ({funded}% Funded)
                </p>
                <p className="text-red-700">{money(remaining)} Remaining Needed</p>
              </div>
              <div
                className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(barWidth)}
                aria-label={`${funded}% funded`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-600"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <a
            href={campaign?.donationUrl || CAMPAIGN_ZEFFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
          >
            Donate via Zeffy (0% Fee) →
          </a>
          <button
            type="button"
            onClick={() => give("card")}
            className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-amber-50"
          >
            Quick Donate ⚡
          </button>
        </div>
      </div>
    </article>
  );
}
