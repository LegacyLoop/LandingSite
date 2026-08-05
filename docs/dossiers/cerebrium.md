# TECHNIQUE DOSSIER — Cerebrium (cerebrium.ai)

> CMD-LANDING-PASS3 W0 recon. Bucket B08 (stat reveals) + B09 (transparent pricing).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[FETCHED]** `docs/dossiers/cerebrium.html` — **467,129 bytes**, HTTP 200.
  Title: `Serverless GPU Infrastructure for Real-Time AI | Cerebrium`.
  [PROVENANCE: local fetch + grep, 2026-08-05]
- **WebFetch** technique read completed. [PROVENANCE: WebFetch 2026-08-05]
- **Discrepancy resolved:** WebFetch's markdown view reported "no Lenis, no count-up,
  pricing gated." Raw HTML grep contradicts on two of three — raw source is authoritative
  where markdown stripping lost script/attr content (noted per claim below).

---

## WHAT IT IS  [KNOWN / FETCHED]

- Cerebrium — **serverless GPU infrastructure for real-time AI**. [FETCHED: title]
- Our bench for **B08 = scroll-triggered stat reveals + count-up**, and
  **B09 = transparent pricing calculator (no gated "contact us")**. [KNOWN: brief]

---

## THE MECHANIC  [FETCHED — with provenance per line]

1. **Stat numbers present (real, comparative):** cold-start figures
   `3.8s` / `42s` / `71s` / `156s`, plus `3.38s` / `8.23s` / `61s` / `91s`, and a
   capacity stat `2500+` GPUs. These render as comparison figures. [PROVENANCE: WebFetch]
2. **Count-up infrastructure IS in the source.** Raw HTML contains `count` ×7 and a
   `data-count` ×1 attribute — evidence of a count-up hook on at least one stat, even
   though WebFetch's static markdown pass called them "fixed numbers" (markdown can't run
   the JS that animates them). [PROVENANCE: grep `count ×7, data-count ×1`]
   Honest read: at least one animated counter is wired; the comparison bars may be static.
3. **Scroll library = Lenis, present.** Raw HTML `lenis` ×17. (WebFetch said "no Lenis" —
   it could not see the bundled script; raw source is authoritative here.)
   [PROVENANCE: grep `lenis ×17`]
4. **Pricing is TRANSPARENT, not fully gated.** Raw HTML: `pricing`/`Pricing` ×18 and
   an explicit **`pay-per-second billing`** model in structured data
   (`"pay-per-second billing"`, feature list `"Pay-per-second billing"`, `per-second` ×6).
   (WebFetch markdown missed the JSON-LD and said "gated"; raw source shows a stated
   per-second model + a pricing surface.) [PROVENANCE: grep + JSON-LD string in source]
   Honest caveat: could not confirm live from static HTML whether an *interactive calculator
   widget* renders on load vs a pricing page link — the per-second MODEL is confirmed; the
   calculator interactivity is inferred from the brief, not DOM-verified this pass.

Exact easing/ms for the count-up not exposed in static HTML. Not fabricated.

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

### B08 — scroll-triggered stat reveals + count-up (we already own this)
- Reuse the landing `AnimatedStat` component: IntersectionObserver (`threshold 0.5`) fires
  a `requestAnimationFrame` count-up, our canonical **ease-out-quart** `1 - Math.pow(1-p,4)`,
  duration ~2200ms. Barlow Condensed on every number (WCS Section 4).
- Comparison layout (Cerebrium's "us vs them" bars): render N stat rows, each an
  `AnimatedStat`, revealed with our staggered card reveal (`index*80ms`, translateY 32->0,
  0.6s cubic-bezier(0.23,1,0.32,1)) via Framer `whileInView`.
- Honesty (Rule 4): our stats must be real or clearly labeled "Estimated"/"Illustrative" —
  no fabricated benchmark. Do not copy Cerebrium's latency numbers; use our own true figures.

### B09 — transparent pricing calculator (no gated "contact us")
- Build an **inline, interactive** calculator, not a "talk to sales" wall. State-driven:
  a slider / input for the variable (e.g. items listed or est. sale value) computes a
  transparent number live with `useState` + `useMemo`. Barlow Condensed on the output.
- Pricing model shown up front, like Cerebrium's stated **pay-per-second**: for us, show the
  commission / plan math openly. Pre-revenue honesty: frame as "Pre-Launch Pricing" /
  "Early Access" (WCS Section 9), never claim traction.
- No gating: the number is visible without a form. A "Join the first 100" CTA can follow the
  result, but the price is never hidden behind it.

### Motion / a11y
- Drive any scroll reveal from the shared Lenis ticker (`lenis.on('scroll',
  ScrollTrigger.update)`); count-up itself is IntersectionObserver + rAF, no ScrollTrigger needed.
- `useReducedMotion()` -> stats render at final value instantly; calculator still fully usable.
- Slider/input are real controls, 44px targets, labeled, keyboard-operable, 9:1 contrast on numbers.

---

## CARRY-FORWARD / FLAGS

- **[FETCHED]** Lenis ×17, `data-count`/`count` hooks, and a stated **pay-per-second**
  pricing model with a pricing surface — all in raw source. WebFetch markdown UNDERCOUNTED
  these (stripped scripts/JSON-LD); raw grep is authoritative and cited.
- **Not DOM-confirmed this pass:** whether the pricing *calculator* is an on-load interactive
  widget vs a linked pricing page. Flagged, not fabricated.
- We already own AnimatedStat (count-up) — B08 is a reuse, not a new build.
