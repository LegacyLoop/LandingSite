# TECHNIQUE DOSSIER — Rogo (rogodata.com -> rogo.com)

> CMD-LANDING-PASS3 W0 recon. Bucket B08 (proof / trust primary).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[FETCHED]** `docs/dossiers/rogo.html` — **650,830 bytes**, HTTP 200 (via curl `-L`,
  which followed the redirect). Title: `Rogo | AI for the most ambitious firms in finance`.
  [PROVENANCE: local fetch + grep, 2026-08-05]
- **Redirect noted:** `rogodata.com` 301 -> `https://rogo.com/` (canonical host).
  [PROVENANCE: WebFetch redirect report]
- **WebFetch** technique read completed against `rogo.com`. [PROVENANCE: WebFetch 2026-08-05]

---

## WHAT IT IS  [KNOWN / FETCHED]

- Rogo — **secure generative AI for finance** (banks / investment firms). [FETCHED: title + copy]
- Awwwards-recognized. [KNOWN: brief]
- Our anchor for **B08 proof / trust** — trust+security easy to find; product proof that
  does NOT reveal private data; clear separation of what the product DOES vs what the
  customer CONTROLS. [KNOWN: brief]
- **Frontend = Framer.** Raw HTML: `framer` ×5802, `Framer` ×2. [PROVENANCE: grep]
  (WebFetch's markdown view could not see this; raw source confirms it.)

---

## THE MECHANIC  [FETCHED — verified]

1. **Security is a top-level nav item** — `Security` sits in the primary nav alongside
   Product / Company / Customers. Trust is one click from anywhere. [PROVENANCE: WebFetch]
2. **Compliance certifications displayed as a trust row:** **SOC2, CCPA, ISO 27001, GDPR,
   EU AI Act**. [PROVENANCE: WebFetch, verbatim list]
3. **Integration-into-your-systems framing** (proof without exposing data): *"Rogo is
   embedded directly into your firm's systems and data, from SharePoint and CRM to the
   financial data platforms your team relies on."* Positions capability via named
   integrations rather than by showing private customer records. [PROVENANCE: WebFetch]
4. **HONEST GAP (do not overstate):** On the fetched landing content, WebFetch found
   **no explicit "you stay in control" data-governance block**, and **no on-prem/VPC/
   "no training on your data"/encryption copy** on the landing itself (those may live on the
   dedicated `/security` page, which was not separately fetched this pass). Also no product
   screenshots/demos were present in the fetched landing text. [PROVENANCE: WebFetch —
   *"Absent... No mention of on-premises deployment, VPC isolation, encryption..."*]
   Recorded as-is; not fabricated.

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

Legacy-Loop's B08 job: make a **"You stay in control"** trust section that a 70-year-old
estate seller trusts AND an investor respects — proving the product's capability without
implying we hold or train on their private data.

### The "You stay in control" trust-section pattern
Two-column, inline-styled, grid-disciplined block:
- **Left column = "What Legacy-Loop does"** (the capability): AI reviews photos, drafts
  listings, surfaces offers, estimates value. Each line is honest and present-tense.
- **Right column = "What you control"** (the boundary): you approve every listing before it
  posts; you set price floors; your account data is yours; nothing lists without your tap.
- This mirrors Rogo's DOES-vs-CONTROLS separation but in senior-plain language, not finance
  jargon. Border between columns = `1px solid rgba(0,188,212,0.15)` (our card token).

### Trust badges row (honest only)
- Render a badge row ONLY for certifications/claims we can truthfully back. Do NOT copy
  Rogo's SOC2/ISO list unless Legacy-Loop actually holds them (Rule 4 — no borrowed trust).
- If we hold none yet, use truthful posture instead: "Your data stays yours", "You approve
  every listing", "No listing goes live without your tap" — capability-honest, not badge-faked.
- Badges use our `--badge-bg rgba(0,188,212,0.14)` / `--badge-border rgba(0,188,212,0.35)`.

### Security easy to find (nav-level, like Rogo)
- Add/keep a footer (and, if a security page exists, nav) "Security & Privacy" link. Trust
  should be one click from anywhere — the Rogo lesson. We already have `/privacy` + `/terms`.

### Product proof WITHOUT private data
- If we show a dashboard/inbox preview, seed it with **synthetic sample items** (as in the
  Mattered mini-inbox recipe), clearly illustrative — never a real seller's data. This is the
  "proof that doesn't reveal private data" mechanic in our context.

### Motion (restrained — this is a trust surface)
- Reveal the two columns with our staggered card reveal (`index*80ms`, translateY 32->0,
  0.6s cubic-bezier(0.23,1,0.32,1)) via Framer `whileInView`. No parallax, no scrub here —
  trust reads as calm. `useReducedMotion()` -> columns appear static.
- A11y: real headings per column, 44px targets on the security link, 7:1 body contrast.

---

## CARRY-FORWARD / FLAGS

- **[FETCHED]** Framer build; Security in top nav; SOC2/CCPA/ISO27001/GDPR/EU-AI-Act badge
  row; integration-framing for proof-without-exposure — all verified.
- **Honest gap:** explicit "stay in control" / VPC / no-training copy NOT on the landing
  (may be on `/security`, not fetched this pass). Flagged, not invented.
- Our version must earn every badge (Rule 4) — do not clone Rogo's compliance list.
