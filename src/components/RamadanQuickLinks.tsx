"use client";

import Link from "next/link";
import { useDonation } from "@/src/components/DonationModal";

const links = [
  {
    href: "/excuse-letters",
    label: "Ramadan Fasting & Last Ashra letters",
  },
  {
    href: "/bulletin?category=ramadan",
    label: "Ramadan flyers",
  },
] as const;

export default function RamadanQuickLinks() {
  const { openGive } = useDonation();

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => openGive()}
        className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Donate
      </button>
    </div>
  );
}
