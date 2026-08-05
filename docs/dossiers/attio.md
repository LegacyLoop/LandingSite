# TECHNIQUE DOSSIER — Attio (attio.com)

> CMD-LANDING-PASS3 W0 recon. Bucket B09 (typography / discipline anchor).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[FETCHED]** `docs/dossiers/attio.html` — **1,100,267 bytes**, HTTP 200.
  Title: `Attio: The CRM for agentic revenue`.
  [PROVENANCE: local fetch + grep, 2026-08-05]
- Raw HTML contains `cloudflare`/`captcha` strings, BUT delivered a **fully rendered
  document** — real h1/h2 copy present (`revenue ×41, CRM ×27, agentic ×9, pricing ×5`).
  Not a challenge shell. [PROVENANCE: grep]
- **WebFetch** technique read completed. [PROVENANCE: WebFetch 2026-08-05]

---

## WHAT IT IS  [KNOWN / FETCHED]

- Attio — a CRM ("The CRM for agentic revenue"). [FETCHED: title]
- Our **B09 discipline anchor**: typography-led SaaS layout discipline — the counterweight
  when motion crowds out clarity. [KNOWN: brief]

---

## THE MECHANIC  [FETCHED — verified in raw markup + WebFetch]

1. **Single sans-serif family, weight-driven hierarchy.** WebFetch: one type family
   throughout; hierarchy built from weight + size, not multiple faces. [PROVENANCE: WebFetch]
2. **Fluid clamp()-driven type scale — the load-bearing detail.** Raw h1/h2 inline styles
   use `clamp()` on BOTH font-size AND letter-spacing:
   - H1: `font-size:clamp(64px, calc(16px + 5.333svh), 80px);
     letter-spacing:clamp(-2.4px, calc(2.08px - 0.3733svh), -1.28px)`
   - H2: `font-size:clamp(36px, calc(26px + 2.5vw), 56px);
     letter-spacing:clamp(-0.84px, calc(-0.12px - 0.06vw), -0.36px)`
   Note `svh` units (small-viewport-height) — mobile-safe fluid sizing. Tight negative
   tracking on display type (our own H1-H3 rule is `letterSpacing:-0.02em`). [PROVENANCE:
   grep of `<h1>/<h2>` inline styles in source]
3. **Blur-in reveal as the entrance signature.** Headings start `filter:blur(1.5px);
   opacity:0` and animate to sharp/visible; `will-change:[filter,opacity,transform]` on the
   animating heading. WebFetch corroborates: understated fade + subtle vertical translate +
   blur transitions, not elaborate motion. [PROVENANCE: grep inline styles + WebFetch]
4. **Whitespace-led, grid-disciplined layout** — generous vertical rhythm, consistent
   columns, card patterns with breathing room; restraint over motion. This IS the "clarity
   over motion" lesson. [PROVENANCE: WebFetch]
5. **Pricing NOT transparent on homepage** — routes to "Talk to sales" / "Start for free";
   no tier names or prices shown. (Contrast with Cerebrium/B09-pricing bench.) [PROVENANCE: WebFetch]

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

Attio is our **discipline check**: when a section has too much motion, this is the antidote.

### Fluid clamp() type scale (adopt the technique, keep OUR fonts/tokens)
- We already use `clamp()` for font sizes (WCS Section 3). Extend it, Attio-style, to
  **letter-spacing** on display headings so tracking tightens as size grows:
  e.g. `letterSpacing: 'clamp(-0.02em, calc(-0.01em - 0.2vw), -0.03em)'` on H1-H3.
  Keep Exo 2 for headings (our font — do NOT adopt Attio's face). Barlow Condensed still on numbers.
- Consider `svh` for hero heading sizing so iOS Safari (375px, the CEO QA target) doesn't
  jump on URL-bar collapse — Attio's mobile-safe move.

### Blur-in heading reveal (restrained entrance)
- Framer Motion on section headings: `initial {opacity:0, filter:'blur(1.5px)', y:8}` ->
  `whileInView {opacity:1, filter:'blur(0px)', y:0}`,
  `transition {duration:0.6, ease:[0.23,1,0.32,1]}`. `will-change:filter,opacity,transform`
  ONLY while animating; drop it after (perf — WCS Section 6).
- This is a calmer alternative to our char-by-char headline for text-dense/clarity sections.

### Whitespace-led layout discipline (the counterweight)
- When a section risks motion-overload, apply the Attio rule: single type family (Exo 2 +
  Plus Jakarta), weight for hierarchy, generous vertical rhythm, real grid, NO parallax/scrub.
  Reveal = one gentle blur-in per heading. Nothing decorates (WCS Pillar 03 PURPOSE).

### Reduced motion / a11y
- `useReducedMotion()` -> headings render sharp + visible with no blur/translate (the
  `filter:blur` + `opacity:0` start state must NOT trap content when JS/motion is off — set a
  CSS fallback so text is visible if the reveal never fires; matches our nuclear-fallback doctrine).
- Real heading levels, 7:1 contrast, text remains selectable. Tight tracking must not drop
  legibility below WCAG AA at 200% zoom (senior QA).

---

## CARRY-FORWARD / FLAGS

- **[FETCHED]** clamp()-on-letter-spacing + `svh` fluid type + blur-in (`filter:blur(1.5px)`
  -> sharp) reveal + single-family weight hierarchy — all verified in raw inline styles.
- **Adoption caveat:** take the TECHNIQUE, keep OUR tokens/fonts (Exo 2 / Plus Jakarta /
  Barlow Condensed). Do not lift Attio's face, copy, or markup.
- **A11y watch:** heading start-state is `opacity:0` + blur — ensure a no-JS/reduced-motion
  fallback so text never stays hidden (nuclear-fallback pattern already in our globals.css).
- Attio homepage pricing is gated (Talk to sales) — this is the discipline anchor, NOT the
  transparent-pricing bench (that's Cerebrium, B09).
