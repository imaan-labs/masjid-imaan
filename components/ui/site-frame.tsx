"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { DonationRoot } from "@/src/components/DonationModal";

export default function SiteFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const studio = pathname.startsWith("/admin");

  useEffect(() => {
    if (!studio) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.overflow;
    const previousBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtml;
      body.style.overflow = previousBody;
    };
  }, [studio]);

  if (studio) {
    return (
      <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <DonationRoot>
      <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-clip bg-gradient-to-b from-slate-100/80 via-white to-slate-50 pb-16 text-slate-900 md:pb-0">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </DonationRoot>
  );
}
