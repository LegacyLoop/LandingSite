import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Repo-split: Meta data-deletion callback + status code live ONLY in the MVP
  // app repo (app.legacy-loop.com). Proxy these two paths so Meta reviewers
  // hitting legacy-loop.com resolve the real endpoints instead of 404.
  // Path A (CMD-W28-B4). Landing's own /data-deletion disclosure page is NOT
  // proxied — it is a real page (200). Callback self-references
  // req.nextUrl.origin and returns JSON (no redirect) so host is preserved.
  async rewrites() {
    return [
      {
        source: "/api/meta/data-deletion-callback",
        destination: "https://app.legacy-loop.com/api/meta/data-deletion-callback",
      },
      {
        source: "/data-deletion-status",
        destination: "https://app.legacy-loop.com/data-deletion-status",
      },
    ];
  },
};

export default nextConfig;
