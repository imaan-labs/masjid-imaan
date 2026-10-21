"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/public/images/logo.png";
import MobileMenu from "./mobile-menu";
import { useDonation } from "@/src/components/DonationModal";
import TopBar from "@/src/components/TopBar";

const services = [
  { href: "/prayer-times", label: "Prayer" },
  { href: "/prayer-times#jumuah", label: "Jumu'ah" },
  { href: "/#aalim-sessions", label: "Classes" },
  { href: "/excuse-letters", label: "Excuse Letters" },
  { href: "/gallery", label: "Photo Gallery" },
];

const bottomLinks = [
  { href: "/prayer-times", label: "Salah", icon: "prayer" },
  { href: "/bulletin", label: "Bulletin", icon: "bulletin" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
] as const;

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const { openGive } = useDonation();

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 text-slate-900 print:hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300"
        />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 transition-all duration-200 hover:opacity-90"
          >
            <Image
              src={Logo}
              alt=""
              priority
              className="h-11 w-auto"
              style={{ width: "auto", height: "2.75rem" }}
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[18px] font-bold text-slate-900">
                Imaan Masjid
              </span>
              <span className="block text-xs font-medium text-slate-500">Melissa, TX</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                aria-expanded={servicesOpen}
                aria-controls={menuId}
                onClick={() => setServicesOpen((current) => !current)}
              >
                Services
                <svg className="h-4 w-4" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              {servicesOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-md"
                >
                  {services.map((item) => (
                    <Link
                      key={item.href}
                      role="menuitem"
                      href={item.href}
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50"
                      onClick={() => setServicesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href="/bulletin"
              className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Bulletin
            </Link>
            <Link
              href="/calendar"
              className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Hilāl Calendar
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openGive()}
              className="hidden rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 md:inline-flex"
            >
              Ways to Give
            </button>
            <MobileMenu />
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur print:hidden md:hidden"
        aria-label="Quick"
      >
        <ul className="grid grid-cols-4">
          {bottomLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold ${
                    active ? "text-brand-teal" : "text-slate-600"
                  }`}
                >
                  <BarIcon name={item.icon} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => openGive()}
              className="flex w-full flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold text-brand-teal"
            >
              <BarIcon name="donate" />
              Give
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

function BarIcon({ name }: { name: "prayer" | "bulletin" | "calendar" | "donate" }) {
  const common = "h-5 w-5";
  if (name === "prayer") {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4.5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "bulletin") {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5h7.5L19 9v10.5H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 4.5V9h5M9 13h7M9 16.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
