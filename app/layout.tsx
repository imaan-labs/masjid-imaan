import "./css/style.css";

import { Inter, Architects_Daughter } from "next/font/google";

import SiteFrame from "@/components/ui/site-frame";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const architects_daughter = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects-daughter",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Imaan Masjid",
  description:
    "The place to practice your deen, to teach your kids and more. Certified scholars both males and females are present to learn from!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-white text-black tracking-tight`}
      >
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
