"use client";

import dynamic from "next/dynamic";

const StudioPage = dynamic(() => import("@/src/components/Studio"), {
  ssr: false,
});

export default function AdminPage() {
  return <StudioPage />;
}
