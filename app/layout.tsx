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
    "LegacyLoop makes selling simple, fair, and dignified. 10 AI bots + MegaBot consensus engine, 13 platforms, AI Shipping Center. Built for estates, families, and everyday sellers.",
  openGraph: {
    title: "LegacyLoop — Connecting Generations",
    description:
      "AI-powered resale automation. 10 specialized bots + MegaBot. 13 platforms. Fair pricing powered by 4 AI engines.",
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
        <link rel="icon" href="/favicon-bw-64.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/favicon-bw.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00BCD4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LegacyLoop" />
      </head>
      <body>
        {/* If JS fails completely, force-hide any preloader overlay */}
        <noscript>
          <style>{`[style*="z-index: 100000"], [style*="zIndex"] { display: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
