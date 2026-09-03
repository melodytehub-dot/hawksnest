import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hawksnestflorida.vercel.app"),
  title: {
    default: "Hawk's Nest — Spacious Estate Home in Port St. Lucie, FL",
    template: "%s | Hawk's Nest",
  },
  description:
    "Spacious country-club estate home in Port St. Lucie, Florida. Pool, hot tub, waterfall, 5 bedrooms, sleeps 16. Check dates and book directly with the owner — no platform fees.",
  keywords: ["Port St. Lucie vacation rental", "Treasure Coast estate", "Florida pool home", "Hawk's Nest"],
  openGraph: {
    siteName: "Hawk's Nest",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--ta-text)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
