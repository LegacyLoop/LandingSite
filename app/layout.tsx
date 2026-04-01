import type { Metadata } from "next";
import { Exo_2, Plus_Jakarta_Sans, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LegacyLoop — AI-Powered Resale Platform | Connecting Generations",
  description:
    "LegacyLoop makes selling simple, fair, and dignified. 11 AI agents, 13 platforms, 4-engine MegaBot consensus pricing. Built for estates, families, and everyday sellers.",
  openGraph: {
    title: "LegacyLoop — Connecting Generations",
    description:
      "AI-powered resale automation. 11 specialized bots. 13 platforms. Fair pricing powered by 4 AI engines.",
    type: "website",
    url: "https://legacy-loop.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo2.variable} ${plusJakarta.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
