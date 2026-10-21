"use client";

import { useState } from "react";
import { useDonation } from "@/src/components/DonationModal";

const zelleAccounts = [
  { label: "Operations", email: "donate@imaanmasjid.org" },
  { label: "Building Fund", email: "helpbuild@imaanmasjid.org" },
];

const cardClass =
  "flex flex-col rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-900 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl";
const buttonClass =
  "mt-6 inline-flex w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800";
const badgeClass =
  "w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800";

export default function Features() {
  const [copied, setCopied] = useState<string | null>(null);
  const { openGive } = useDonation();

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

  return (
    <section id="donate" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-7xl px-4 pb-2 pt-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            For Your Scales
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Your contributions directly support daily prayers, educational
            programs, and the permanent masjid facility.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className={cardClass}>
            <p className={badgeClass}>
              Fast & Recurring
            </p>
            <h3 className="mt-4 text-xl font-bold tracking-tight">Quick Donate</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Donorbox</p>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              Give immediately via debit/credit card or set up monthly support.
            </p>
            <button type="button" onClick={() => openGive("card")} className={buttonClass}>
              Quick Donate (Card/ACH) ⚡
            </button>
          </article>

          <article className={cardClass}>
            <p className={badgeClass}>
              Recommended • 100% to Masjid
            </p>
            <h3 className="mt-4 text-xl font-bold tracking-tight">Zeffy</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">0% platform fee</p>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              Covers transaction fees so every cent supports operations.
            </p>
            <button type="button" onClick={() => openGive("zeffy")} className={buttonClass}>
              Open Zeffy Portal →
            </button>
          </article>

          <article className={cardClass}>
            <p className={badgeClass}>
              Direct & Fee-Free
            </p>
            <h3 className="mt-4 text-xl font-bold tracking-tight">Bank Transfer</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Zelle</p>
            <ul className="mt-4 flex-1 space-y-4">
              {zelleAccounts.map((account) => {
                const isCopied = copied === account.email;
                return (
                  <li key={account.email}>
                    <p className="text-sm font-semibold text-slate-900">{account.label}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-600">{account.email}</span>
                      <button
                        type="button"
                        onClick={() => copyEmail(account.email)}
                        className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 transition-all hover:bg-slate-900 hover:text-white"
                        aria-label={`Copy ${account.email}`}
                      >
                        {isCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </li>
                );
              })}
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
          </article>
        </div>

        <article className="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-900 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              🛒 Support via Amazon Purchases
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Shop through our official affiliate link at no additional cost to you, and Amazon will contribute a percentage of eligible purchases to IMAAN.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openGive("amazon")}
            className="inline-flex shrink-0 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
          >
            Shop on Amazon →
          </button>
        </article>
      </div>
    </section>
  );
}
