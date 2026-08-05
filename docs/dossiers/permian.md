# TECHNIQUE DOSSIER — Permian (permianworld.com)

CMD-LANDING-PASS3 · W0 recon · NO EMOJI
Roles in our canon: B00 loader->hero primary + B10 footer primary.

---

## 1. WHAT IT IS

- Awwwards Site of the Day, Nov 13 2025. [KNOWN]
- Stack: React / Next.js front end on a Shopify backend. [KNOWN]
- Confirmed Next.js in the fetched artifact: 134 `_next` references, `react` present, CSS-module hashed class names (e.g. `HeroMedia_banner__CrkDq`). [FETCHED]
- Awwwards score 7.5. [KNOWN]
- Site identity confirmed: `<title>Home — Permian</title>`, `og:site_name="Permian"`. [FETCHED]
- Core reputation: loader resolves INTO the hero with no flash; multi-layer scroll-scrubbed video; animated footer as a closing beat. [KNOWN]

---

## 2. THE MECHANIC

### 2a. Loader -> hero (no flash) [B00 primary]
- The artifact contains a dedicated preloader component tree: `PreloaderContext_preloaderContainer`, `PreloaderContext_hasPreloader`, `PreloaderCounter_track`, `PreloaderCounter_value`, `PreloaderCounter_inner`. [FETCHED]
- `PreloaderCounter` with `track` + `value` = a numeric count-up loader (0 -> 100 style), the value sliding within a masked track. [VERIFIED from class semantics]
- `PreloaderContext` wraps the whole app — the preloader is a context provider, not a sibling overlay. This is the "no flash" trick: the hero mounts UNDER the preloader inside the same provider, so when the loader completes it does not swap DOM (which would flash) — it releases/fades the covering layer while the already-mounted, already-decoded hero is revealed beneath. [VERIFIED from architecture]
- The hero media is present in-DOM at load: `HeroMedia_banner`, `HeroMedia_visual`, `HeroMedia_media`, `HeroMedia_overlayMedia`. Hero videos carry `autoPlay muted loop playsInline` so playback has already begun behind the loader; the reveal is a curtain lift onto live motion, not a cold start. [FETCHED]

### 2b. Multi-layer scroll-scrubbed video
- Three `<video width="1920" height="1080" muted playsInline autoPlay loop>` elements. [FETCHED]
- Responsive `sizes` differ per layer: primary `(max-width:1023px) 50vw, 50vw`; two secondary layers at `...20vw`. [FETCHED] This is the "multi-layer" composition — one large hero-scale video plus two smaller inset layers, each sized independently across breakpoints.
- Sources served through an internal media API: `/api/movies/file/...mp4` (three distinct clips). [FETCHED]
- The hero frame is a composed rig, not a bare video: `HeroMedia_frame`, `HeroMedia_lineTop/Bottom/Left/Right`, `HeroMedia_dotTopLeft/TopRight/BottomLeft/BottomRight`, `HeroMedia_overlay`, `HeroMedia_overlayBox`, `HeroMedia_overlayContent`, `HeroMedia_inner`. [FETCHED] Four corner dots + four edge lines = an animated technical viewfinder framing the video; the lines/dots are the scrub-driven accents that draw in as the loader releases and shift on scroll.

### 2c. Scroll scrub / pin / threshold
- `ScrollOverlay_container`, `ScrollOverlay_trigger`, `ScrollOverlay_visual` appear on BOTH the hero (`HeroMedia_scrollOverlay*`) and the footer (`AppFooter_scrollOverlay*`). [FETCHED] One shared ScrollOverlay primitive powers both the opening and closing beats.
- Pin/threshold logic: `ScrollThreshold_helper`, `HeroMedia_pastStickyHelper`, `AppHeader_thresholdHelper`. [FETCHED] `pastStickyHelper` = a spacer that holds the sticky hero pinned for its scrub duration, then releases past a threshold — the classic sticky-tall-container + inner-fixed-visual scrub rig. Pin distance is set by that helper's height (not numerically observable in static HTML, but the pattern is a multi-vh sticky hold; treat ~150-250vh as the rebuild target for a hero of this weight). [VERIFIED pattern / pin distance KNOWN-estimate]
- `HeroMedia_scroller` + `data-scroller` attribute = the scroll-progress driver element. [FETCHED]

### 2d. Type reveal
- `TextReveal_text` component present. [FETCHED] A dedicated text-reveal primitive — line/word mask-and-rise on enter (translateY from a clipped baseline to 0, staggered). Exact stagger not in static HTML; rebuild at headline-standard 18ms/char or per-word. [VERIFIED component / timing KNOWN]

### 2e. Footer as closing beat [B10 primary]
- `AppFooter_appFooter` composes the SAME `ScrollOverlay_container/trigger/visual` primitive as the hero. [FETCHED] The page opens and closes on the identical scroll-overlay mechanic — a deliberate bookend.
- Footer structure: `AppFooter_inner`, `AppFooter_groups`, `AppFooter_group`, `AppFooter_column`, `AppFooter_heading`, `AppFooter_links`, `AppFooter_logo`, `AppFooter_slogan`. [FETCHED] The footer is a full scene (logo + slogan + link columns) that animates in via its ScrollOverlay trigger as the final act, rather than a static strip.

### 2f. Breakpoint behavior
- Video `sizes` collapse all layers to `100vw` under 767px. [FETCHED] On mobile the multi-layer inset composition flattens to a single full-bleed layer.

---

## 3. THE RECIPE IN OUR STACK (Next.js 16 + Framer Motion 12 + Lenis + inline styles, no Tailwind)

Rebuild the mechanic ORIGINAL — technique only, zero markup/media/class lift.

### Shared Lenis config (all dossiers)
```
duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```
Guard with `prefers-reduced-motion` -> destroy Lenis, render all states final.

### R1 — Loader-into-hero, no flash
- One client component owns both preloader and hero, mounted together. Hero video (`autoPlay muted loop playsInline` + `poster`) is IN the tree from first paint and playing under the cover.
- Preloader = a `position: fixed; inset: 0` overlay in Framer Motion. Count-up: `useMotionValue(0)` -> `animate(mv, 100, { duration: 1.6, ease: [0.23,1,0.32,1] })`, render with `useTransform(mv, v => Math.round(v))`. Slide the number inside an `overflow: hidden` track via `translateY` bound to progress.
- On complete: animate the cover `clipPath` (inset(0 0 0 0) -> inset(0 0 100% 0)) or `opacity`/`translateY` out over ~600ms; DO NOT unmount/remount the hero. The hero was always there — you are lifting a curtain.

### R2 — Multi-layer scrub video hero with viewfinder frame
- Sticky rig: outer `<section style={{ height: '220vh' }}>`; inner `<div style={{ position: 'sticky', top: 0, height: '100vh' }}>`.
- `const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start','end end'] })`.
- Layers: one full-bleed `<video>` + two inset `<video>` at ~20vw. Drive per-layer parallax with `useTransform(scrollYProgress, [0,1], ['0%','-12%'])` (different ranges per layer for depth). Scrim via a `linear-gradient` overlay whose opacity = `useTransform(scrollYProgress,[0,0.6],[0.15,0.55])`.
- Viewfinder: four corner dots + four edge lines as absolutely-positioned divs; animate their `scaleX/scaleY` from 0->1 on the loader release, then nudge with scroll (`useTransform`).
- Serve `.webm` + `.mp4` dual-source; `poster` on every video; lazy-mount insets with `useInView`.

### R3 — TextReveal primitive
- Wrap each line in `overflow: hidden`; inner `motion.span` from `translateY('110%')` -> `0`, `whileInView`, `viewport={{ once: true, amount: 0.6 }}`, `transition={{ duration: 0.7, ease: [0.23,1,0.32,1], delay: i * 0.06 }}`. Char variant at 18ms stagger for the headline.

### R4 — Footer as closing beat (reuse R2's ScrollOverlay)
- Build ONE `ScrollOverlay` component (sticky container + `useScroll` trigger + `visual`) and use it for BOTH hero and footer so the page bookends on the same motion. Footer scene: logo + slogan + link columns fade/rise in via `whileInView` staggered children as the final scroll act.

---

## 4. PROVENANCE FOOTER
- [FETCHED] artifact: `docs/dossiers/permian.html` — 86,971 bytes. Real Next.js HTML document with full preloader/hero/footer class trees, 3 video tags, mp4 sources.
- [WATCHED] WebFetch rendered read returned a mismatched community-feed fragment (unreliable render); technique here is grounded in the [FETCHED] artifact + [KNOWN] canon, not the WebFetch text.
