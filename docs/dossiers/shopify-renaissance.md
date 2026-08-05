# TECHNIQUE DOSSIER — Shopify Editions: Renaissance (shopify.com/editions/winter2026)

CMD-LANDING-PASS3 · W0 recon · NO EMOJI
Role in our canon: B01 bench + cross-cutting IA/pacing. Usability 7.51 alongside creativity 8.24.

---

## 1. WHAT IT IS

- Shopify Editions "The Renaissance Edition" (Winter 2026) — the biannual product-launch showcase. [KNOWN]
- Scored usability 7.51 AND creativity 8.24 — the point of interest is that a heavy, creative scene pipeline still shipped USABLE and light. [KNOWN]
- Stack: Shopify Hydrogen on Remix (10 `hydrogen` refs, 6 `remix`; `next` refs are incidental strings, not the framework). [FETCHED]
- The transferable lesson: a pre-rendered heavy-scene pipeline delivered light. [KNOWN]

---

## 2. THE MECHANIC

### 2a. Information architecture / pacing [WATCHED + FETCHED]
- Hero: "The Renaissance Edition" + 12 primary category buttons. [WATCHED]
- 12 sequential feature sections, each an in-page anchor. Confirmed anchor ids in artifact: `#sidekick #agentic #online #retail #marketing #checkout #operations #shop #b2b #finance #shipping #developer`. [FETCHED]
- Pacing = hierarchical disclosure: broad category -> specific feature -> deeper doc link. Each section holds 3-8 subsections (heading + media + CTA). [WATCHED]
- The 12 hero buttons double as a jump-nav into the 12 anchors — the IA is both a table of contents and the page skeleton. [FETCHED/WATCHED]

### 2b. Heavy-scene pipeline delivered LIGHT (the core lesson) [FETCHED]
This is why it scores usability 7.51 despite creative-8.24 weight:
- 344 `loading="lazy"` attributes. [FETCHED] Almost everything below the fold defers — nothing off-screen blocks first paint.
- 86 `srcSet` + Shopify CDN crop params (`width=...&crop=center`). [FETCHED] Responsive images sized to the exact slot per breakpoint; the CDN does the resizing, the client downloads only what fits.
- Video: 12 `<video>`, 72 `.mp4` + 38 `.webm` sources, 35+ `poster` frames. [FETCHED] webm-first with mp4 fallback; EVERY video has a pre-compressed poster (`compressed-...Poster-desktop.webp` naming). The poster is the first-paint image; the video streams in behind it — the "heavy scene" is a light poster until the user is actually looking.
- 5 `sequence` references. [FETCHED] Image/scene sequences exist but are delivered as discrete lazy assets + video, NOT a blocking canvas image-sequence scrub. The heaviness is pre-rendered into video/poster pairs rather than computed live.

### 2c. Scroll choreography [WATCHED]
- Standard sequential scroll flow; no aggressive full-page pinning observed. Anchor jump-nav rather than scroll-jacking. [WATCHED] Usability comes from NOT hijacking scroll — the creativity lives in the scenes, not in fighting the scrollbar.
- Sidekick "Skills" block: a card/carousel that rotates via JS timer, not scroll-driven. [WATCHED]

### 2d. Type / reveal [WATCHED/KNOWN]
- H3/H4 feature headings + punchy body. Entry reveals (fade/rise) are applied via the design-system JS/CSS, not literal in static HTML. [WATCHED] Rebuild at canon defaults.

### 2e. Breakpoints [FETCHED]
- Portrait vs landscape poster variants (`height=173` mobile vs `height=112` desktop for the same asset). [FETCHED] Distinct media crops per breakpoint via CDN params + `srcSet`; layout collapses to single-column, jump-nav becomes a scrollable/stacked list on phone.

---

## 3. THE RECIPE IN OUR STACK (Next.js 16 + Framer Motion 12 + Lenis + inline styles, no Tailwind)

The transferable technique is the LIGHT DELIVERY of heavy scenes + a jump-nav IA — not a scroll gimmick.

### Shared Lenis config
```
duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```

### R1 — Category-grid IA that IS the page skeleton
- Hero renders N category tiles; each is an anchor link (`href="#section-id"`) to its section. Smooth-scroll the anchor jump through Lenis (`lenis.scrollTo(target, { duration: 1.2 })`) so jump-nav inherits the physics scroll. Sections are `<section id="...">` in the same order as the tiles. IA = table of contents = skeleton.

### R2 — Heavy scene, light delivery (the lesson to steal)
- Every hero/section video: `poster` = a pre-compressed `.webp` first frame; `<video autoPlay muted loop playsInline preload="none">` with `.webm` + `.mp4` sources. The poster paints instantly; the video only mounts/plays when in view.
- Gate playback: `useInView(ref, { amount: 0.3 })` -> `videoRef.current.play()` on enter, `.pause()` on exit. Off-screen video never streams.
- Images: `next/image` with explicit `sizes` matching the slot; `loading="lazy"` on everything below the fold; per-breakpoint art direction via `<picture>`/`srcSet`.
- If a section needs a "sequence" look, pre-render it to a short looping video + poster (NOT a live canvas image-sequence scrub) — pre-render heaviness offline, ship a light pair.

### R3 — Restrained reveal (usability-first)
- Do NOT scroll-jack. Sections reveal on enter only: `<Reveal>` = `motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.3}} transition={{duration:0.5, ease:[0.23,1,0.32,1]}}`. Keep the scrollbar honest; put the creativity in the scene assets, not in fighting scroll.

### R4 — Breakpoints
- Per-breakpoint poster/crop via `srcSet` + `sizes`; single-column collapse under 600px; jump-nav tiles wrap/stack. Respect `prefers-reduced-motion`: swap looping video for its static poster, disable reveals.

---

## 4. PROVENANCE FOOTER
- [FETCHED] artifact: `docs/dossiers/shopify-renaissance.html` — 1,453,150 bytes. Real Hydrogen/Remix SSR HTML: 12 anchor sections, 344 lazy attrs, 86 srcSet, 72 mp4 + 38 webm, 35 posters, 12 video tags.
- [WATCHED] WebFetch rendered read: IA (12 sections in order), poster/lazy delivery strategy, no-pinning/jump-nav scroll, portrait/landscape breakpoint posters all confirmed.
- [KNOWN]: usability 7.51 / creativity 8.24 scores; "heavy-scene pipeline delivered light" framing.
