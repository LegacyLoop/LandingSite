"use client";

// CMD-WAITLIST-CONVERSION V20 · Devin (CTO). Real /thank-you route the landing waitlist redirects
// to on successful submit. Fires the Google Ads conversion event (env-gated · no-ops until the AW
// id + label are set in Vercel env). A returning duplicate (?already=1) shows a graceful message
// and does NOT fire a conversion (never double-count).

import Link from "next/link";
import { useEffect, useState } from "react";

const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function ThankYouPage() {
  const [already, setAlready] = useState(false);

  useEffect(() => {
    const isAlready = new URLSearchParams(window.location.search).get("already") === "1";
    setAlready(isAlready);
    if (!GADS_ID) return; // no-op until the Google Ads id is set in Vercel env
    if (!document.getElementById("gads-js")) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        (window.dataLayer as unknown[]).push(arguments);
      } as (...args: unknown[]) => void;
      const s = document.createElement("script");
      s.id = "gads-js";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`;
      document.head.appendChild(s);
      window.gtag("js", new Date());
      window.gtag("config", GADS_ID);
    }
    if (!isAlready && GADS_LABEL && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: `${GADS_ID}/${GADS_LABEL}` });
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#0D1117",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(0,188,212,0.12)",
            border: "1px solid rgba(0,188,212,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00BCD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ fontFamily: "var(--font-exo2, 'Exo 2', sans-serif)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00BCD4", marginBottom: 12 }}>
          Pre-Launch · Early Access
        </div>
        <h1 style={{ fontFamily: "var(--font-exo2, 'Exo 2', sans-serif)", fontSize: 28, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          {already ? "You're already on the list" : "You're in — welcome to Legacy-Loop"}
        </h1>
        <p style={{ fontFamily: "var(--font-plus-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: 16, lineHeight: 1.7, color: "#CBD5E1", margin: "0 0 32px" }}>
          {already
            ? "Good news — you're already on the founding list. Your original confirmation is in your inbox (check Promotions the first time). We'll email you the moment your cohort opens."
            : "You're on the founding list. We'll email you from hello@legacy-loop.com the moment your cohort opens (it may land in Promotions the first time). Founding members lock in early pricing for life."}
        </p>
        <Link
          href="/landing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            padding: "0 1.75rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(135deg, #00BCD4, #009688)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to Legacy-Loop
        </Link>
      </div>
    </main>
  );
}
