import type { MetadataRoute } from "next";

// CMD-GBP-SEO-REPO V20 · Slot A (landing) · Devin (CTO). Static sitemap for the
// public marketing surface. legacy-loop.com is fully static (no DB), so routes
// are enumerated explicitly. Keep in lockstep with app/ route folders.
const BASE = "https://legacy-loop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/landing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/investors", priority: 0.7, changeFrequency: "monthly" },
    { path: "/security", priority: 0.4, changeFrequency: "yearly" },
    { path: "/security/incident-response", priority: 0.3, changeFrequency: "yearly" },
    { path: "/security/security-review", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" },
    { path: "/cookies", priority: 0.5, changeFrequency: "monthly" },
    { path: "/data-deletion", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
