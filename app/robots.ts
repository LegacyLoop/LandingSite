import type { MetadataRoute } from "next";

// CMD-GBP-SEO-REPO V20 · Slot A (landing) · Devin (CTO). Public marketing site —
// fully crawlable. Points engines at the sitemap and declares the canonical host.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://legacy-loop.com/sitemap.xml",
    host: "https://legacy-loop.com",
  };
}
