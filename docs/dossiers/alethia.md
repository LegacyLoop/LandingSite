# TECHNIQUE DOSSIER — Alethia (alethia.earth)

CMD-LANDING-PASS3 · W0 recon · NO EMOJI
Role in our canon: B01 problem-in-8s primary. "Section order IS the storyboard; names the PAIN before the machine."

---

## 1. WHAT IT IS

- Awwwards Site of the Day, Aug 5 2026. [KNOWN]
- Pipeline: Figma -> Framer. [KNOWN]
- Stack confirmed: Framer (10,341 `framer` refs, `framerusercontent` CDN, `.framer.` domain markers, `data-framer-root`, `data-framer-ssr-released-at`). [FETCHED] Framer ships Lenis-style smooth scroll — `lenis` reference present in artifact. [FETCHED]
- Domain proposition: environmental / climate MRV (Measurement, Reporting, Verification) for enterprise. [FETCHED/WATCHED]

---

## 2. THE MECHANIC

### 2a. Section order = storyboard (the B01 lesson) [WATCHED]
Rendered heading sequence, top to bottom:
1. "Where Ecosystem Science and Enterprise Strategy Meet" (hero thesis)
2. "Know your impact — precisely. End-to-end environmental intelligence..." (value promise)
3. "Gold-Standard Observation Systems" -> "Built for Scale and Complexity" (5 numbered pillars)
4. "From Data Chaos to Science-Backed, Actionable Insights" (the PAIN, named)
5. "Scientific Credibility to Corporate Climate Action"
6. "Validating What the Ecosystem Does Naturally"
7. "Scientific Rigor. Commercial Precision. Unmatched Trust."
8. "Atmospheric-Based MRV" + "Blockchain technology" (the MACHINE)
9. "No Spreadsheets / No Guesswork / Just Real, Measured Insight"
10. "Alethia Solves: The Biggest Problem in Climate Action: Trust" (pain restated as stakes)
11. "We're Not Just Evolving the System. We're Redefining It."
12. Case studies + news (social proof)

- The arc names the PAIN ("Data Chaos", "estimation bias", "The Biggest Problem... Trust") BEFORE it explains the machine (atmospheric MRV, blockchain, sensors). [WATCHED] The storyboard is: thesis -> promise -> pillars -> PAIN -> machine -> proof. This is the B01 "problem-in-8s" primary: a visitor understands the problem before any mechanism.

### 2b. Hero mechanic [WATCHED]
- Metric-driven credibility hero: a hard number ("-8.3 tCO2e" and verification data) sits ABOVE the value proposition as a live proof anchor, so measured outcome precedes methodology. [WATCHED]

### 2c. Scroll choreography / reveal system [FETCHED]
- Framer appear-effects: `data-framer-appear-id` (3+), `framer-appear` (4). [FETCHED] These are Framer's scroll-entry animations — elements start hidden (opacity 0 + translate/scale) and animate to rest as they enter viewport, keyed by an appear-id per element/group.
- `will-change` on 122 elements. [FETCHED] Heavy pre-declared compositor hinting = many transform/opacity animations primed for 60fps; Framer sets `will-change` on everything it intends to animate.
- Background image system: 58 `data-framer-background-image-wrapper`. [FETCHED] Layered background media wrappers — the substrate for parallax/scale-on-scroll section backdrops.
- Video: 10 `<video>` (8 `.webm` + 2 `.mp4`). [FETCHED] Section-backdrop / inline product videos, webm-first with mp4 fallback, Framer's standard auto-play muted loop treatment.
- Stacks/layout: `data-framer-stack-*` (direction-reverse, flexbox-gap, content-wrapper). [FETCHED] Framer flex "Stack" primitives govern the vertical section rhythm.
- Smooth scroll: `lenis` present. [FETCHED] Physics scroll underpins the appear-effect timing.

### 2d. Type / easing / pin [WATCHED/KNOWN]
- Exact per-element easing curves and pin distances are not literally in the static HTML (Framer computes them at runtime from appear-effect config). [KNOWN] Framer appear defaults: ~0.4-0.8s, spring or ease-out, translateY ~20-40px + opacity 0->1, staggered by DOM order within a stack.
- Breakpoint: `breakpoint` attributes present (4). [FETCHED] Framer emits per-breakpoint variants (desktop/tablet/phone) — layout and appear-effect values swap at breakpoints; section order is preserved, columns collapse to single-column on phone.

---

## 3. THE RECIPE IN OUR STACK (Next.js 16 + Framer Motion 12 + Lenis + inline styles, no Tailwind)

The transferable technique here is NARRATIVE ORDER, not a novel scroll trick. Rebuild the storyboard, then dress it with our standard reveal kit.

### Shared Lenis config
```
duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```

### R1 — Problem-first storyboard (the actual lesson)
- Order our sections: (1) thesis hero with a live proof number, (2) one-line promise, (3) capability pillars, (4) NAME THE PAIN in its own full section before any mechanism, (5) the machine / how-it-works, (6) proof / testimonials. Do not lead with the machine. The pain section earns the machine section.
- Proof-number hero: render the metric in Barlow Condensed above the headline; count it up with `AnimatedStat` (IntersectionObserver + rAF, ease-out quart `1 - Math.pow(1-p,4)`, ~2200ms).

### R2 — Appear-effect reveal (our version of Framer appear)
- Reusable `<Reveal>` wrapper: `motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.6, ease:[0.23,1,0.32,1] }}`.
- Stagger within a section via `staggerChildren: 0.08` on a parent `variants` container (matches Framer's DOM-order stagger). Set `will-change: transform, opacity` only while animating; clear on complete.

### R3 — Layered section backdrops + video
- Background media in a `position:absolute; inset:0` wrapper behind content; scale on scroll: `const s = useTransform(sectionProgress,[0,1],[1.08,1])`. Videos `autoPlay muted loop playsInline` with `poster`, `.webm` + `.mp4` dual-source, lazy-mounted via `useInView`.

### R4 — Breakpoints
- Single-column collapse under 600px; keep section ORDER identical across breakpoints (the storyboard must survive mobile). Reduce reveal `y` to ~16px and shorten stagger on phone.

---

## 4. PROVENANCE FOOTER
- [FETCHED] artifact: `docs/dossiers/alethia.html` — 768,042 bytes. Real Framer SSR HTML: 888 `data-framer-name`, appear-effect + background-wrapper + stack markup, 10 video tags, lenis reference.
- [WATCHED] WebFetch rendered read: section order + headings + problem-first arc + metric hero confirmed from rendered content.
- [KNOWN]: Awwwards SOTD Aug 5 2026, Figma->Framer pipeline; runtime easing curves / pin distances (Framer computes at runtime, not in static HTML).
