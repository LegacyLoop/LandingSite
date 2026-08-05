# TECHNIQUE DOSSIER — Terminal Industries (terminal-industries.com)

> CMD-LANDING-PASS3 W0 recon. Bucket B07 (tone anchor + no-WebGL proof).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[FETCHED]** `docs/dossiers/terminal-industries.html` — **545,112 bytes**, HTTP 200.
  Title: `Terminal Yard Operating System | The New Industry Standard in Yard Operations`.
  [PROVENANCE: local fetch + grep, 2026-08-05]
- Note: raw HTML contains `cloudflare` string(s) but delivered full rendered document
  (not a challenge shell). [PROVENANCE: grep]
- **WebFetch** technique read completed. [PROVENANCE: WebFetch 2026-08-05]

---

## WHAT IT IS  [KNOWN / FETCHED]

- Terminal Industries — a **Yard Operating System** (logistics/yard-ops infrastructure). [FETCHED: title + copy]
- Awwwards **SOTD Sep 3 2025**; **Vue + plain CSS on Vercel**; **DEV score 7.89**
  (highest dev score in the set) — cited as proof that **award-grade motion is reachable
  WITHOUT WebGL**. [KNOWN: brief]
- Two jobs for us: **(1) tone** (technical-infrastructure register) and **(2) evidence**
  that disciplined CSS + scroll orchestration reaches award grade. [KNOWN: brief]

---

## THE MECHANIC  [FETCHED — verified]

1. **Framework = Vue / Nuxt.** Raw HTML shows Nuxt signatures (`__NUXT` ×3, `__nuxt` ×1).
   [PROVENANCE: grep `__NUXT ×3, __nuxt ×1`]
2. **Scroll library = Lenis.** Present in markup (`lenis` ×10). [PROVENANCE: grep `lenis ×10`]
3. **No WebGL / Three.js / canvas.** WebFetch: *"CSS + DOM only. No WebGL, Three.js, or
   canvas detected."* Assets are plain `.svg/.jpg/.png/.webp` with responsive breakpoints.
   [PROVENANCE: WebFetch] — This is the load-bearing proof point for B07: award grade, no GPU.
4. **Scroll-orchestration present (WebFetch):**
   - **Pinned carousel/slider blocks** — "AT THE GATE / IN THE YARD / AT THE DOCK".
   - **Count-up / dynamic stat** — a "Yard Efficiency Calculator" showing figures like
     `$641,626`.
   - **Numbered progressive-disclosure sections** (01, 02, 03, 04) implying scroll-triggered reveals.
   [PROVENANCE: WebFetch]
5. **Tone / register (FETCHED):** infrastructure-operational, outcomes-oriented, aimed at
   operations + finance buyers. Sample: *"Fix One Problem in the Yard... Go live in days."*
   Lexicon: "yard operations", "gate acceleration", "dock optimization", "asset visibility."
   [PROVENANCE: WebFetch]

Exact ms/easing/pin-vh not exposed in static HTML (Vue computes at runtime). Not fabricated.

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

This dossier is primarily a **tone + discipline** reference, not a single flashy effect.
Two transferable things:

### (1) Tone lift — the "technical infrastructure register"
When the Legacy-Loop landing describes the shipping / operations / bot pipeline, borrow the
*register*, not the copy: short outcome-first sentences, numbered stages (01/02/03), a
calculator that shows a concrete dollar figure. Our voice rules still bind (WCS Section 9 —
no hype words; "Estimated"/"Early Access" honesty). Do NOT lift Terminal's copy; match cadence.

### (2) "Award grade without WebGL" — our discipline proof
Terminal proves our exact constraint (inline CSS + DOM + Lenis, no Tailwind, no GPU) can
win SOTD. Concrete patterns to reuse:

**Pinned stage carousel (GATE/YARD/DOCK -> our PHOTO/AI/LIST/SELL):**
- `gsap.timeline({ scrollTrigger:{ trigger:'#stages', start:'top top', end:'+=300%',
  pin:true, scrub:0.8 }})` with each stage panel cross-fading via `opacity`/`xPercent`.
- Drive from the shared Lenis ticker (`lenis.on('scroll', ScrollTrigger.update)` +
  `gsap.ticker.add(t=>lenis.raf(t*1000))`). No canvas.

**Count-up efficiency figure (our AnimatedStat already exists):**
- Reuse the landing `AnimatedStat` (IntersectionObserver + rAF, our canonical
  ease-out-quart `1 - Math.pow(1-p, 4)`, ~2200ms). Barlow Condensed on the number.
- Label the figure honestly — "Estimated savings" / "Illustrative", never a claimed
  customer result (Rule 4). Terminal shows a hard dollar; ours must be flagged as a model.

**Numbered progressive reveals (01/02/03/04):**
- Our existing `GlowCard` / staggered-reveal (`index * 80ms`, translateY 32->0,
  cubic-bezier(0.23,1,0.32,1), 0.6s) already matches this. Number them with Barlow Condensed.

### Reduced motion / a11y
- `useReducedMotion()` -> render all stages stacked and static, count-up jumps to final value.
- Real headings + numbered `<ol>` semantics for the stage list. 44px targets on controls.

---

## CARRY-FORWARD / FLAGS

- **[FETCHED]** Vue/Nuxt + Lenis + plain CSS, no WebGL — verified. This is the section's
  "discipline reaches award grade" evidence; nothing here needs a GPU or a new dependency.
- We already own every primitive (AnimatedStat, GlowCard, Lenis, ScrollTrigger) — this is a
  tone + orchestration reference, not a new-tech ask.
- Exact motion timings runtime-computed; recipe uses our canonical values, not fabricated.
