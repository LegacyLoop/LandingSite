"use client";

// CMD-GADS-CONSENT-GOLIVE V20 · Landing cookie banner + Google Consent Mode v2 wiring.
// The landing site had no consent UI; this adds one on the primary conversion surface
// (legacy-loop.com → waitlist → /thank-you). Consent Mode v2 defaults are DENIED in the
// document <head>; this banner calls gtag('consent','update',…) on the user's choice and
// persists it in localStorage ('ll-cookie-consent'), which /thank-you reads before firing
// the Google Ads conversion. Self-contained dark-brand styling (no CSS-var dependency).

import { useState, useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try { choice = localStorage.getItem("ll-cookie-consent"); } catch { /* blocked storage */ }
    if (!choice) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function setConsent(granted: boolean) {
    try { localStorage.setItem("ll-cookie-consent", granted ? "accepted" : "declined"); } catch { /* ignore */ }
    const v = granted ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v,
    });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
        width: "min(520px, calc(100vw - 2rem))", zIndex: 99999,
        padding: "1rem 1.25rem", borderRadius: "1rem",
        background: "#16161e", border: "1px solid rgba(0,188,212,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap",
        fontFamily: "var(--font-body, 'Plus Jakarta Sans', system-ui, sans-serif)",
      }}
    >
      <div style={{ flex: 1, minWidth: "200px", fontSize: "0.82rem", lineHeight: 1.5, color: "#cbd5e1" }}>
        We use cookies to measure ads and improve your experience.{" "}
        <a href="/cookies" style={{ color: "#00BCD4", textDecoration: "none" }}>Learn more</a>
      </div>
      <button
        onClick={() => setConsent(false)}
        style={{
          minHeight: 44, padding: "0.5rem 1rem", fontSize: "0.82rem", fontWeight: 600,
          borderRadius: "0.5rem", whiteSpace: "nowrap", cursor: "pointer",
          background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "#94a3b8",
        }}
      >
        Decline
      </button>
      <button
        onClick={() => setConsent(true)}
        style={{
          minHeight: 44, padding: "0.5rem 1.25rem", fontSize: "0.82rem", fontWeight: 700,
          borderRadius: "0.5rem", whiteSpace: "nowrap", cursor: "pointer", color: "#fff",
          border: "none", background: "linear-gradient(135deg, #00BCD4, #009688)",
        }}
      >
        Accept All
      </button>
    </div>
  );
}
