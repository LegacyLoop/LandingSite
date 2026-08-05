# TECHNIQUE DOSSIER — Truck'N Roll (trucknroll.com)

> CMD-LANDING-PASS3 W0 recon. Bucket B07 (Shipping motion; PROMOTED HARD).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[FETCHED]** `docs/dossiers/trucknroll.html` — **66,537 bytes**, HTTP 200.
  Title: `Entertainment logistics - Truck'N Roll`. Canonical + `og:url` =
  `https://trucknroll.com/`. [PROVENANCE: local fetch + grep, 2026-08-05]
- **WebFetch** technique read completed against live content. [PROVENANCE: WebFetch 2026-08-05]

## IDENTITY CORRECTION — READ FIRST  [FETCHED — verified]

The brief describes Truck'N Roll as a **B07 Shipping / TMS / LTL freight** award-winner
(parcel->pallet, freight-poster layout). The **actual site at trucknroll.com is an
ENTERTAINMENT / LIVE-TOUR logistics company**, not an LTL/freight/TMS platform.
[PROVENANCE: title `Entertainment logistics`; body grep `logistics ×13, tour ×12,
Entertainment ×7`; WebFetch: *"Truck'N Roll(R) is a logistics company built for the
fast, demanding world of live entertainment."*]

- **What still transfers (verified present):** the *motion vocabulary* — morphing
  headline + editorial poster layout + Locomotive/Lenis scroll. [FETCHED — verified below]
- **What does NOT exist on this site (do not fabricate):** the "small parcel scaling
  to a pallet in one continuous shot" and "label -> pickup -> LTL freight" morph.
  **No evidence of any small-to-large object scaling transform** in the fetched markup.
  [PROVENANCE: WebFetch — *"No evidence of scaling transformations ... in the provided markup."*]
  The parcel->pallet recipe below is therefore an **ORIGINAL construction for our stack**,
  built on the morphing-header technique that IS present — labeled as such.

---

## WHAT IT IS  [KNOWN / FETCHED]

- Truck'N Roll — live-entertainment (tour) logistics company. [FETCHED: body copy]
- Awwwards **SOTD + Developer Award, Jun 3 2026**; built with **Locomotive**;
  scored **7.23**. [KNOWN: brief]
- Footer credits *"Website by Locomotive."* [FETCHED: WebFetch]
- Our anchor for **B07 shipping motion** — promoted hard as the section's motion bar. [KNOWN: brief]

---

## THE MECHANIC  [FETCHED — verified present]

1. **Morphing / transitional headline** — one concept changing shape as you scroll.
   Confirmed: **"FULL TOURS, NO"** transitions into **"EXCUSES."** (headline copy
   restructures across scroll, not a static block). [PROVENANCE: WebFetch, verbatim finding]
2. **Cascading vertical text stagger** — **"We / Move / Shows / Forward"** stacked
   vertically, staggered reveal / repositioning on scroll. [PROVENANCE: WebFetch]
3. **Editorial / poster-style layout** — oversized hero imagery, dramatic type breaks,
   cinematic full-width sections. [PROVENANCE: WebFetch]
4. **Scroll engine = Locomotive Scroll** (they use `data-scroll` attributes; footer
   credit). Lenis also present in markup (2 hits). **NOTE PER BRIEF: we do NOT use
   Locomotive — we use LENIS + GSAP ScrollTrigger.** [PROVENANCE: grep `Locomotive ×2,
   lenis ×2, locomotive ×1`; `<h1 ... data-scroll ...>` present in markup]

Precise ms / easing / pin-vh values are **NOT exposed in static HTML** (Locomotive
computes them at runtime). Not fabricated. The recipe below uses OUR canonical values.

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

Two deliverables per the brief: **(A) morphing shipping header** and **(B) parcel->pallet
continuous-shot** — built on GSAP ScrollTrigger `pin` + a single `timeline`, with
**honest trust labels** (never imply a live carrier connection we do not have).

### Shared ticker (do this once, app-wide)
```
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
This is the substitution for Locomotive — Lenis drives the ticker, ScrollTrigger reads it.

### (A) Morphing shipping header — "one idea changing shape"
Instead of Truck'N Roll's tour headline, morph the LEGACY-LOOP shipping idea through its
honest stages. Use a single pinned section and cross-fade/slide stacked labels — each label
is real text (accessible), not an image.
- Markup: one `<section id="ship-morph">` containing N absolutely-stacked `<span>`s:
  `Label` -> `Pickup` -> `In transit` (all inline-styled, Barlow Condensed on any number).
- Timeline:
  `const tl = gsap.timeline({ scrollTrigger:{ trigger:'#ship-morph', start:'top top',
   end:'+=200%', pin:true, scrub:1 }});`
  then per stage: `tl.to(spanA,{yPercent:-100,opacity:0,ease:'power2.inOut'})
  .fromTo(spanB,{yPercent:100,opacity:0},{yPercent:0,opacity:1},'<')` — the header text
  changes shape as one continuous vertical morph. `scrub:1` ties it to scroll velocity.
- pin-vh ~= 2.0 viewport (end `+=200%`). Keep it tight — Rule 1/5.

### (B) parcel -> pallet continuous shot (ORIGINAL — not on the source site)
One object scales/transforms from a small parcel silhouette to a pallet in a single
pinned timeline. Use SVG or two layered inline-styled `<div>`s with `scale` + `borderRadius`
tweens so it reads as ONE object growing, not a swap.
```
gsap.timeline({ scrollTrigger:{ trigger:'#parcel', start:'top top', end:'+=150%',
  pin:true, scrub:1 }})
  .to('#parcel-box', { scale: 3.2, borderRadius: 4, ease:'none' })
  .to('#parcel-straps', { opacity: 1 }, '<0.4')   // pallet banding fades in mid-grow
  .to('#parcel-label',  { opacity: 1 }, '<');       // dims/spec label appears
```
Framer Motion alternative for the object itself: `useScroll` + `useTransform` on `scale`
if you prefer to keep it React-native; pin still comes from ScrollTrigger.

### Honest trust labels (Rule 4 — MANDATORY on any shipping surface)
The shipping section must NEVER imply live carrier integration we don't have. Use exactly
these honesty states as the label text tied to each morph stage:
- **"Live quote"** — only if a real rate is wired. Otherwise:
- **"Estimated"** — for illustrative pricing.
- **"Waiting for dimensions"** — before the user provides item size.
- **"Carrier connection required"** — for any step gated on an integration not yet live.
These are copy, not decoration — they keep the demo truthful while the motion sells.

### Reduced motion / a11y
- `useReducedMotion()` -> if reduced: kill both pins, render the final header text and the
  full-size pallet as static states (no scrub, no scale). Content fully readable.
- Headers are real text with proper heading levels; the parcel graphic gets an
  `aria-label` describing the shipping flow. 44px targets on any CTA inside the section.
- `ScrollTrigger.getAll().forEach(t=>t.kill())` on unmount; `will-change:transform` only
  on the actively scaling node.

---

## CARRY-FORWARD / FLAGS

- **[FETCHED]** Site is entertainment-tour logistics, NOT freight/LTL. Morphing-header +
  poster layout + Locomotive-scroll verified present. Parcel->pallet + freight-morph are
  NOT on the source — recipe built as original on our stack, labeled honestly.
- Motion timing values not exposed in static HTML (runtime-computed); recipe uses our
  canonical `cubic-bezier(0.23,1,0.32,1)` / scrub values, not fabricated source numbers.
- We use LENIS + GSAP ScrollTrigger, NOT Locomotive — substitution captured above.
