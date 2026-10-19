"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";
import Banner from "@/components/banner";

export default function SiteFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const studio = pathname.startsWith("/admin");

  if (studio) {
    return <div className="h-screen w-screen overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      {children}
      <Banner />
    </div>
  );
}
