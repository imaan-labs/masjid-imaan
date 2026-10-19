"use client";

import dynamic from "next/dynamic";

const SanityStudio = dynamic(() => import("@/src/components/SanityStudio"), {
  ssr: false,
});

export default function AdminPage() {
  return <SanityStudio />;
}
