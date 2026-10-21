"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDonation } from "@/src/components/DonationModal";

const links = [
  { href: "/prayer-times", label: "Prayer" },
  { href: "/prayer-times#jumuah", label: "Jumu'ah" },
  { href: "/#aalim-sessions", label: "Classes" },
  { href: "/excuse-letters", label: "Excuse Letters" },
  { href: "/bulletin", label: "Bulletin" },
  { href: "/gallery", label: "Photo Gallery" },
  { href: "/calendar", label: "Hilāl Calendar" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const titleId = useId();
  const { openGive } = useDonation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-900 transition-all duration-200 hover:bg-[#F3EAD7]"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={`absolute inset-0 bg-slate-900/40 transition-all duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <nav
          id="mobile-drawer"
          aria-labelledby={titleId}
          aria-hidden={!open}
          className={`absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white px-5 py-6 text-slate-900 shadow-xl transition-all duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <p id={titleId} className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
              Imaan Masjid
            </p>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="mt-6 space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-base font-semibold transition-all duration-200 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-6 rounded-xl bg-brand-teal px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-dark"
            onClick={() => {
              setOpen(false);
              openGive();
            }}
          >
            Ways to Give
          </button>
        </nav>
      </div>
    </div>
  );
}
