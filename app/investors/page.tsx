// CMD-ESTATE-EXP-V2 MICRO-FIX 2026-07-30 · CEO ruling G5 (T13): /investors DARKED during the truth
// cleanup. The prior page carried pre-truth-standard claims ($48B market · 85%+ margins · 50+ platform
// integrations · 10+1 bots) that fail the Integrity Gate. It returns after its own CEO review pass.
// The page had ZERO inbound links repo-wide (verified 2026-07-30) — this hold page covers direct URLs.
// Prior content is preserved in git history (be2e2c7 and earlier); nothing deleted, held dark.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investors · Legacy-Loop",
  description: "Investor materials are being updated.",
  robots: { index: false, follow: false },
};

export default function InvestorsHoldPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D1117",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading, inherit)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          Investor materials are being updated
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body, inherit)",
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#cbd5e1",
            marginBottom: "2rem",
          }}
        >
          We are refreshing this page. It will return shortly.
        </p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 44,
            padding: "0 1.5rem",
            borderRadius: 12,
            background: "#00BCD4",
            color: "#0D1117",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}
        >
          Back to Legacy-Loop
        </a>
        <p style={{ marginTop: "2.5rem", fontSize: "0.8rem", color: "#94a3b8" }}>
          Legacy-Loop Tech LLC · Built in Maine · Connecting Generations
        </p>
      </div>
    </main>
  );
}
