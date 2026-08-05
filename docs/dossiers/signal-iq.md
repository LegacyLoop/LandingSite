# TECHNIQUE DOSSIER — Signal IQ (Setu / Pine Labs)

- **URL:** https://marketing.pinelabs.com/signaliq
- **Corpus role:** B03 bench — "precision underwriting IN ACTION" staging (model doing its job inside real product UI, then commercial benefit).
- **Artifact:** `docs/dossiers/signal-iq.html` — [FETCHED] 681,571 bytes (full Framer-published static HTML, `<meta name="generator" content="Framer">`, published Jul 16 2026).
- **Provenance legend:** [KNOWN] = corpus canon supplied to this task · [FETCHED] = read from the saved HTML artifact · [WATCHED] = read via WebFetch technique pass. Every line below is labelled.

---

## WHAT IT IS

- [KNOWN] B03 benchmark. Stack: React + TypeScript + Framer.
- [FETCHED] Published from Framer (static export). Stack visible in markup: `data-framer-*` component system, Framer SSR appear-animation runtime, marquee + keyframe CSS. Not hand-rolled React — Framer's compiled output.
- [KNOWN/WATCHED] Product: India's AI bank-statement analyser that reads UPI narrations legacy parsers miss. The page's job is to make a cold underwriting/risk category legible and to show the model working *inside a real statement UI* before stating the commercial payoff.

---

## THE MECHANIC

### Element sequence (the spine we are copying)
[KNOWN + WATCHED, order confirmed via WebFetch read of live page]

1. **Hero** — "The complete Bank Statement Analyser." Positions as infrastructure-grade AI. Tension seed: "80% of every bank statement is UPI narrations that legacy parsers can't read." [WATCHED]
2. **Closing the data gap** — narrative-tension section: "A gap in the data is a gap in the truth." Establishes the problem before any demo. [WATCHED]
3. **Precision Underwriting IN ACTION** — the load-bearing section. A *simulated bank statement UI* animates its own parsing: transaction rows (NEFT/UPI/IMPS) resolve, income is identified (salary tag), obligations map (loan payments), and a derived metric lands (FOIR 106%). The model is shown doing its job inside product chrome, not described in a paragraph. [WATCHED]
4. **Predictive / downstream** — multi-month timeline (Jan–Mar 2026) tracking recurring SIP payments, surfacing *missed* payments and computing a collection window ("01st–04th of every month"); a statement view lights up delinquency signals (EMI default, penalty charges). This is the "then the model pays off" beat. [WATCHED]
5. **Closing interaction** — value-prop payoff blocks ("PREDICT DEFAULTS BEFORE THEY HAPPEN", "CROSS-SELL THAT ACTUALLY SELLS") into a "Get In Touch" CTA. [WATCHED]

### Animation primitives (exact, from the artifact)
[FETCHED — pulled verbatim from `signal-iq.html` CSS]

Keyframes (the whole vocabulary the page uses):
```
siq-asciiFadeIn : opacity 0→0.8, translateX(20px)→0      // terminal/ASCII text streaming in
siq-slideInLeft : opacity 0→1, translateX(-40px)→0
siq-slideInRight: opacity 0→1, translateX(40px)→0
siq-calloutIn   : opacity 0→1, scale(0.9)→1              // annotation callouts popping onto the statement
siq-badge-in    : opacity 0→1, translateY(4px)→0         // small tag/badge settle
siqScaleIn      : opacity 0→1, scale(0.96)→1             // card/panel entrance
siq-blink       : opacity 1↔0 at 50%                     // terminal cursor
marquee         : translateX(0)→translateX(-50%)         // seamless logo/row scroll
```

Bindings (name · duration · easing · delay — verbatim):
```
siq-slideInLeft  0.9s cubic-bezier(.22,.9,.26,1) 0.5s forwards
siq-slideInLeft  0.9s cubic-bezier(.22,.9,.26,1) 0.2s forwards   // staggered sibling (0.2s vs 0.5s)
siq-calloutIn    0.6s ease-out forwards
siq-asciiFadeIn  1.2s ease-out forwards
siq-badge-in     0.3s ease-out forwards
siq-blink        0.7s steps(2) infinite                          // hard on/off cursor, not eased
marquee          48s linear infinite
```

- **Signature easing:** `cubic-bezier(.22,.9,.26,1)` (fast-out, long settle — the premium "arrive" curve). Second curve in file: `cubic-bezier(0.2,0.8,0.2,1)` for micro-transitions. [FETCHED]
- **Duration ladder:** micro-interactions cluster at 0.15s (31 occurrences), hovers 0.25–0.35s, entrances 0.6–1.2s, marquee 48s. The "in action" reveals are the *slow* ones (0.9s–1.2s) so the eye can read the model working. [FETCHED]
- **Staging via delay, not JS:** the two `siq-slideInLeft` bindings differ only by delay (0.2s / 0.5s) — that is how the statement rows cascade. The ASCII line uses a long 1.2s so text appears to stream. The blink cursor (`steps(2)`) sells the "live terminal" read. [FETCHED]
- **Scroll trigger:** Framer's appear-animation runtime plays these on scroll-into-view (Framer default: IntersectionObserver-gated `data-framer-appear-animation`). [FETCHED attr present + KNOWN Framer behaviour]

### Reduced motion
- [FETCHED] `data-framer-appear-animation="reduce"` present on the root — Framer's runtime respects `prefers-reduced-motion` by switching appear animations to a reduced variant (JS-gated, not a CSS `@media` block). We must reproduce this explicitly (Framer gives it free; we won't).

### Breakpoints
[FETCHED — from the CSS]
```
mobile : max-width 767.98px
tablet : 768px – 1199.98px
desktop: min-width 1200px
+ a max-height:800px query (short-viewport hero handling)
+ prefers-color-scheme:dark handled
```

---

## THE RECIPE IN OUR STACK
(Next 16 + Framer Motion 12 + Lenis + inline `style={{}}`, no Tailwind)

The whole "IN ACTION" section is a **scroll-triggered, delay-staggered reveal of a fake product UI that resolves itself.** No canvas needed — it is DOM rows + CSS transforms. Maps cleanly to our stack.

**1. Section as a `useInView` gate.** One `ref` on the statement panel; `useInView(ref, { once: true, amount: 0.4 })` fires the whole cascade.

**2. Row cascade = stagger via `transition.delay`.** Reproduce the 0.2s/0.5s ladder with Framer Motion variants:
```tsx
const container = { show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const row = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,
            transition: { duration: 0.9, ease: [0.22, 0.9, 0.26, 1] } }, // their exact curve
};
// <motion.div variants={container} initial="hidden" animate={inView ? "show" : "hidden"}>
//   {rows.map(r => <motion.div key={r.id} variants={row} style={{...}}/>)}
```

**3. Callouts / badges pop after their row.** Reuse their `siq-calloutIn` (scale 0.9→1, 0.6s ease-out) and `siq-badge-in` (translateY 4px, 0.3s) as Framer variants with a larger `delayChildren` so annotations land *after* the data they annotate.

**4. Derived metric (FOIR 106%, income, obligations) = count-up.** Our existing `AnimatedStat` pattern (IntersectionObserver + rAF, ease-out-quart, 2200ms) — but gate its start on the same `inView` so the number *resolves* as the visual conclusion of the cascade. This is the "model finished its job" beat.

**5. Terminal/ASCII streaming line.** Their `siq-asciiFadeIn` (1.2s) + `siq-blink` cursor (`steps(2)` 0.7s infinite). In our stack: a `@keyframes` blink in globals.css for the cursor (cheap, infinite, no JS), and a Framer Motion `opacity/x` reveal for the line body. Keep the cursor as pure CSS so it survives JS-fail (our iPad hardening doctrine).

**6. Predictive timeline (multi-month).** Same `useInView` + `staggerChildren` across month columns; the "missed payment" marker uses `siq-calloutIn`'s scale-pop to draw the eye. A horizontal connector can `scaleX(0)→1` with `transformOrigin:left`.

**7. Marquee (if used for logos/rows).** `translateX(0 → -50%)` over 48s linear on a doubled track — identical to our existing MarketplaceTicker. Pause-on-hover already in our kit.

**8. Reduced motion — MANDATORY (Framer gave them this free).** Wrap the whole cascade in our `useReducedMotion()` hook: when true, skip `initial`/stagger, render final state, keep the count-up as an instant set. Cursor blink: gate the `@keyframes` under `@media (prefers-reduced-motion: no-preference)`.

**9. Lenis.** Their scroll-into-view timing assumes smooth scroll momentum; our Lenis (duration 1.2) gives the cascade the same "settle into the section then it plays" feel.

### The transferable idea
Don't *say* the AI works — **stage a real product UI and let it resolve on scroll**: rows parse in (slide-left stagger), annotations pop (scale callout), a terminal line streams (ascii fade + blink cursor), and one derived number counts up as the verdict. Then, and only then, the commercial-benefit block. That is the exact shape for our MegaBot valuation / condition-score section.
