import type { Metadata } from "next";
import SmartboardDisplay from "@/src/components/SmartboardDisplay";

export const metadata: Metadata = {
  title: "Imaan Masjid — Lobby Display",
  robots: { index: false, follow: false },
};

export default function DisplayPage() {
  return <SmartboardDisplay />;
}
