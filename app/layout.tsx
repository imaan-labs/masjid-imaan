import "./css/style.css";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import SiteFrame from "@/components/ui/site-frame";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${jakarta.variable} ${inter.variable} w-full overflow-x-clip`}>
      <body className="w-full overflow-x-clip bg-gradient-to-b from-slate-100/80 via-white to-slate-50 font-sans text-slate-900 antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
