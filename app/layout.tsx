import type { Metadata, Viewport } from "next";
import { Exo_2, Plus_Jakarta_Sans, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

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

// Explicit viewport — Next.js does inject a sensible default, but being
// explicit ensures iOS Safari gets device-width, proper initial scale,
// and allows user pinch-zoom for accessibility. viewportFit:'cover' opts
// into the safe-area-inset-* env vars so any future notch-aware UI lands
// behind the notch instead of under it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#00BCD4",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://legacy-loop.com"),
  title: "Legacy-Loop — AI-Powered Resale Platform | Connecting Generations",
  description:
    "Legacy-Loop makes selling simple, fair, and dignified. 10 AI bots + MegaBot consensus engine, listing copy prepared for 12 marketplaces, and live carrier shipping rates. Built for estates, families, and everyday sellers.",
  applicationName: "Legacy-Loop",
  keywords: [
    "resale automation",
    "AI resale platform",
    "AI pricing",
    "estate sales",
    "online consignment",
    "sell collectibles",
    "MegaBot",
    "Connecting Generations",
    "Legacy-Loop",
    "Maine startup",
  ],
  authors: [{ name: "Legacy-Loop Tech LLC", url: "https://legacy-loop.com" }],
  creator: "Legacy-Loop Tech LLC",
  publisher: "Legacy-Loop Tech LLC",
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Legacy-Loop — Connecting Generations",
    description:
      "AI-powered resale automation. 10 specialized bots + MegaBot. Listing copy prepared for 12 marketplaces. Fair pricing powered by 4 AI engines.",
    type: "website",
    url: "https://legacy-loop.com",
    siteName: "Legacy-Loop",
    locale: "en_US",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 454,
        height: 451,
        alt: "Legacy-Loop — Connecting Generations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legacy-Loop — Connecting Generations",
    description: "AI-powered resale automation. Simple, fair, and dignified.",
    images: ["/icons/icon-512.png"],
  },
};

// CMD-GBP-SEO-REPO V20 · Slot A · Organization + WebSite structured data
// (schema.org JSON-LD) for brand knowledge-panel eligibility. Pattern cloned
// from the app item-page JSON-LD injection. NAP matches the published legal docs.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Legacy-Loop",
    legalName: "Legacy-Loop Tech LLC",
    url: "https://legacy-loop.com",
    logo: "https://legacy-loop.com/icons/icon-512.png",
    description:
      "AI-powered resale automation platform. Simple, fair, and dignified. Connecting Generations.",
    slogan: "Connecting Generations",
    foundingDate: "2026",
    foundingLocation: "Waterville, Maine, United States",
    address: {
      "@type": "PostalAddress",
      postOfficeBoxNumber: "1485",
      addressLocality: "Waterville",
      addressRegion: "ME",
      postalCode: "04903",
      addressCountry: "US",
    },
    areaServed: "US",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@legacy-loop.com",
      contactType: "customer support",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Legacy-Loop",
    url: "https://legacy-loop.com",
    publisher: { "@type": "Organization", name: "Legacy-Loop Tech LLC" },
  },
];

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
        {/* theme-color + viewport are now emitted by the Viewport export
            above. apple-mobile-web-app-* stay here — they don't map to
            the Next.js Viewport schema yet. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Legacy-Loop" />
        {/* CMD-GBP-SEO-REPO V20 · Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* CMD-GADS-CONSENT-GOLIVE V20 · Google Consent Mode v2 — DENIED defaults set BEFORE any
            tag loads (pre-hydration). Upgrades to granted only if the user previously accepted.
            The CookieConsent banner calls gtag('consent','update',…); /thank-you fires the Ads
            conversion only when consent is granted. EU/EEA/UK safe-by-default. */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','wait_for_update':500});
          try{if(localStorage.getItem('ll-cookie-consent')==='accepted'){gtag('consent','update',{'ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted','analytics_storage':'granted'});}}catch(e){}
        `}} />
      </head>
      <body>
        {/* If JS fails completely, force-hide any preloader overlay */}
        <noscript>
          <style>{`[style*="z-index: 100000"], [style*="zIndex"] { display: none !important; }`}</style>
        </noscript>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
