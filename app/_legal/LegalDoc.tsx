import type { Metadata } from "next";

// CMD-DEVIN-PUBLISH-LEGAL-FOR-BETA (2026-06-24 · landing): renderer for the published
// Terms / Privacy / Cookie policies on legacy-loop.com. Text lives as data in ./content.ts
// (verbatim · published AS-IS · identical source to the app). Landing dark theme.

export type LegalBlock =
  | { t: "p"; text: string }
  | { t: "sub"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "note"; text: string }
  | { t: "table"; head: string[]; rows: string[][] };

export interface LegalSection {
  n?: string;
  h: string;
  blocks: LegalBlock[];
}

export interface LegalContent {
  title: string;
  meta: string;
  effective: string;
  updated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
}

const wrap: React.CSSProperties = {
  maxWidth: 820,
  margin: "0 auto",
  padding: "64px 24px 96px",
};
const h1: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 800,
  fontSize: 36,
  color: "#F1F5F9",
  marginBottom: 8,
};
const metaLine: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "#94A3B8",
  marginBottom: 8,
};
const heading: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 700,
  fontSize: 24,
  color: "#F1F5F9",
  marginTop: 44,
  marginBottom: 14,
  paddingBottom: 10,
  borderBottom: "1px solid rgba(0,188,212,0.15)",
};
const sub: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 600,
  fontSize: 17,
  color: "#00BCD4",
  marginTop: 22,
  marginBottom: 8,
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 15.5,
  lineHeight: 1.75,
  color: "#CBD5E1",
  margin: "0 0 14px 0",
};
const ul: React.CSSProperties = {
  paddingLeft: 22,
  fontFamily: "var(--font-body)",
  fontSize: 15.5,
  lineHeight: 1.8,
  color: "#CBD5E1",
  margin: "0 0 14px 0",
};
const note: React.CSSProperties = {
  background: "rgba(0,188,212,0.07)",
  border: "1px solid rgba(0,188,212,0.22)",
  borderRadius: 12,
  padding: "14px 18px",
  margin: "0 0 14px 0",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  lineHeight: 1.7,
  color: "#CBD5E1",
};
const twrap: React.CSSProperties = { overflowX: "auto", margin: "0 0 14px 0" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid rgba(0,188,212,0.2)",
  color: "#F1F5F9",
  fontFamily: "var(--font-heading)",
  fontWeight: 700,
};
const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  color: "#CBD5E1",
  verticalAlign: "top",
  lineHeight: 1.6,
};

function Block({ b }: { b: LegalBlock }) {
  switch (b.t) {
    case "p":
      return <p style={body}>{b.text}</p>;
    case "sub":
      return <p style={sub}>{b.text}</p>;
    case "note":
      return <div style={note}>{b.text}</div>;
    case "ul":
      return (
        <ul style={ul}>
          {b.items.map((it, k) => (
            <li key={k}>{it}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div style={twrap}>
          <table style={table}>
            <thead>
              <tr>
                {b.head.map((h, k) => (
                  <th key={k} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci} style={td}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function legalMetadata(doc: LegalContent): Metadata {
  return {
    title: `${doc.title} · Legacy-Loop`,
    description: `${doc.title} for the Legacy-Loop AI-powered resale platform. Effective ${doc.effective}.`,
  };
}

export default function LegalDoc({ doc }: { doc: LegalContent }) {
  return (
    <main style={wrap}>
      <h1 style={h1}>{doc.title}</h1>
      <p style={metaLine}>{doc.meta}</p>
      {doc.intro.map((b, i) => (
        <Block key={`i${i}`} b={b} />
      ))}
      {doc.sections.map((s, si) => (
        <section key={si}>
          <h2 style={heading}>
            {s.n ? `${s.n}. ` : ""}
            {s.h}
          </h2>
          {s.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </section>
      ))}
    </main>
  );
}
