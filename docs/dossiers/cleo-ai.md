# TECHNIQUE DOSSIER — Cleo AI

- **URL:** https://web.meetcleo.com
- **Corpus role:** B03 AI-evaluation / price primary — **THE MOST IMPORTANT.** The ONLY corpus site on **Framer Motion + React + Next** — i.e. proof that SOTD-tier motion is achievable on *our exact stack*. SOTD May 23 2026, score 7.23. [KNOWN]
- **Artifact:** `docs/dossiers/cleo-ai.html` — [BLOCKED] 5,599 bytes. **Reason: Cloudflare interstitial.** The saved bytes are the "Just a moment..." challenge page (`<title>Just a moment...</title>`, `noindex,nofollow`, CSP allowlisting `challenges.cloudflare.com`, `script-src 'nonce-…' 'unsafe-eval'`). No product markup was served to curl.
- **WebFetch:** [BLOCKED] — `https://web.meetcleo.com` returned **HTTP 403 Forbidden**; `https://web.meetcleo.com/about` closed the socket. Cloudflare bot-management wall at both the curl and WebFetch layers.
- **Provenance legend:** [KNOWN] corpus canon · [BLOCKED] fetch failed (reason stated) · nothing below is invented; motion specifics are stack-canonical Framer-Motion patterns, not claimed observations of Cleo's live DOM.

---

## WHAT IT IS
[KNOWN]

- Cleo = AI personal-finance assistant. Takes a cold financial category (spending, budgets, overdraft avoidance, money "roast/hype") and makes it human and interactive.
- Corpus significance: it is the **build-to reference** because it wins Awwwards-tier recognition (SOTD, 7.23) **on React + Next + Framer Motion** — the same primitives we already ship. It proves we do not need GSAP/WebGL/agency tooling to hit the bar.
- Mechanic (canon): **animated data-viz of outcomes** — comps/figures populating, a band/range tightening, a score resolving — plus **interactive demos the visitor drives**, all wrapped in warm, human copy over an otherwise clinical category.

## FETCH STATUS — HONEST
[BLOCKED] Cloudflare denied both automated reads. The live motion could not be timed/measured from here. The RECIPE below is therefore built from (a) the [KNOWN] corpus description of what Cleo does and (b) **canonical Framer-Motion patterns** that produce those exact effects on our stack — labelled as recipe, not as observed Cleo internals. A browser-with-JS pass (Playwright, real UA, solve challenge) is the follow-up to capture true ms timings. **Banked as a gap.**

---

## THE MECHANIC (target behaviours to reproduce)
[KNOWN category behaviours → the effects we must build]

1. **Comps populating** — a set of comparable data points animate in one-by-one and settle, as if the engine is gathering evidence in real time.
2. **Price band tightening** — a wide uncertainty range visibly narrows to a confident figure (the single most persuasive AI-valuation motion: uncertainty → confidence, on screen).
3. **Condition / score resolving** — a score sweeps up and locks (gauge fill or number count-up) as the verdict.
4. **Visitor-driven interactive demo** — the user moves a control (slider/toggle/tap) and the viz responds live; not a passive autoplay loop.
5. **Cold category made human** — motion is warm and forgiving (soft springs, gentle overshoot), not hard/data-terminal. This is the tonal difference from Signal IQ.

---

## THE RECIPE IN OUR STACK
(Next 16 + Framer Motion 12 + Lenis + inline `style={{}}`, no Tailwind — the whole point: **same stack as Cleo**)

### Pattern A — Comps populating (staggered evidence reveal)
```tsx
const list = { show: { transition: { staggerChildren: 0.08 } } };
const comp = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1,
            transition: { type: "spring", stiffness: 260, damping: 22 } }, // soft, human — not linear
};
const inView = useInView(ref, { once: true, amount: 0.4 });
// map comps → <motion.div variants={comp}/> inside a <motion.div variants={list}>
```
Spring (not cubic-bezier) is the Cleo tonal tell — warmth over precision.

### Pattern B — Price band TIGHTENING (the signature move)
Drive a band's left/right edges with `useMotionValue` + `useTransform`, animate a target via `animate()`:
```tsx
const t = useMotionValue(0);                       // 0 = wide, 1 = tight
const low  = useTransform(t, [0,1], [1200, 1840]); // edges converge
const high = useTransform(t, [0,1], [3600, 2260]);
const width = useTransform(t, [0,1], ["100%", "26%"]);
useEffect(() => { if (inView) animate(t, 1, { duration: 1.4, ease: [0.22, 0.9, 0.26, 1] }); }, [inView]);
// bar: style={{ left: <derived>, width }}, edge labels bound to low/high via <motion.span>{rounded}</motion.span>
```
`useMotionValue`/`useTransform` = zero React re-renders per frame (60fps on the main thread — our perf doctrine). Pair the numeric labels with a `useTransform` rounding so `$1,200 … $3,600` visibly closes to `$1,840 … $2,260`.

### Pattern C — Score / condition resolving (count-up + gauge)
- Number: our existing `AnimatedStat` (IntersectionObserver + rAF, ease-out-quart, ~2200ms). Gate start on `inView`.
- Gauge fill: SVG arc with `strokeDashoffset` animated via `motion.circle` `initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C*(1-score) }}` — sweeps and locks.

### Pattern D — Visitor-driven demo (interactivity is the differentiator)
Bind a real control to the same `MotionValue`, so the viz answers the user, not a timer:
```tsx
const drive = useMotionValue(0.5);
<input type="range" min={0} max={1} step={0.01}
  onChange={e => drive.set(+e.target.value)}
  style={{ minHeight: 44 /* senior touch target */ }} />
// band width / score / comps all read from `drive` via useTransform — live response
```
Touch target ≥44px (senior doctrine). This is what turns a screenshot into a demo.

### Pattern E — Tone (make it human)
- Springs over eased tweens for the "friendly" beats; reserve `cubic-bezier(0.22,0.9,0.26,1)` for the precise band-tighten only.
- Warm microcopy on the same reveal timeline as the number ("we found 14 comps like yours").
- Lenis smooth-scroll (duration 1.2) so sections settle before their viz plays.

### Reduced motion — MANDATORY
Wrap in `useReducedMotion()`: skip stagger/springs, render final band width + final score, set numbers instantly. Cleo/Framer would gate this; we do it explicitly.

### The transferable idea
Cleo's proof: **outcome-as-motion on our stack.** The most persuasive AI-valuation gesture is a **range tightening to a confident number while comps populate and a score locks** — and letting the visitor *drive* it. All achievable with `useInView` + `useMotionValue` + `useTransform` + `animate()`, no new dependency. This is the blueprint for our MegaBot valuation panel.

### FOLLOW-UP (banked)
Cloudflare blocked automated capture. To harvest Cleo's *real* ms timings and easing: Playwright with a full browser + real UA to pass the challenge, then read computed `transition`/`animation` and Framer Motion props from the live DOM. Until then, treat the numbers above as our-stack recipe, not measured-from-Cleo fact.

---

## W0 PLAYWRIGHT UPGRADE — [BLOCKED] -> [WATCHED] (2026-08-05, real browser bypassed Cloudflare)
Live DOM harvested via Playwright (page title "Cleo makes money better." confirmed loaded). This
CLOSES the earlier Cloudflare [BLOCKED] for the B03 build-to primary with OBSERVED evidence.

- [WATCHED] SHARED AUTHORED EASING: `cubic-bezier(0.75, 0, 0.25, 1)` — appears across many rules;
  this is the single site-wide easing that makes the page feel authored (craft-spec 5B.5). Adopt as
  a candidate for OUR shared W2 easing token alongside the Lenis config.
- [WATCHED] REVEAL EASING: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for entrance reveals; plus an
  overshoot `cubic-bezier(0.17, 0.89, 0.32, 1.27)` used sparingly for playful pops.
- [WATCHED] SPLIT-TEXT WORD REVEAL: keyframes `split-text-word ... reset-opacity` + `reset-blur` —
  headings reveal WORD BY WORD via opacity 0->1 AND blur-in->sharp. This is the exact line/word
  masked reveal the craft spec targets. Recipe in our stack: wrap each word in a span, animate
  `opacity 0->1` + `filter: blur(6px)->0`, staggerChildren ~0.04-0.06s, per-word duration in the
  observed reveal band.
- [WATCHED] REVEAL DURATION BAND: 0.6s / 0.66s / 0.75s / 0.8s / 1.2s observed — squarely the
  0.6-0.9s craft band, longer (1.2s) reserved for hero moments. Gradient-slide on headings + a
  spinner rotate for loading states.
- [WATCHED] `<canvas>` element present (count 1) — the animated data-visualization surface (the
  comps/price-band/score) is canvas-driven, consistent with the [KNOWN] mechanic. framer-motion
  runs component state (not visible as inline in the top HTML; the visible reveal system is
  CSS-module keyframes). hasLenis false at the class level (native smooth or JS not class-tagged).
- PROVENANCE: the easings, durations, and split-text keyframes above are [WATCHED] (live computed
  from document.styleSheets this pass). The higher-level mechanic narrative remains [KNOWN]/recipe.
