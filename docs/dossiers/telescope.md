# TECHNIQUE DOSSIER — Telescope (telescope.fyi)

CMD-LANDING-PASS3 · W0 recon · NO EMOJI
Role in our canon: B00 bench. "If you build only one thing, build this."

---

## 1. WHAT IT IS

- Canon bench for B00 (loader/hero-entry patterns). [KNOWN]
- Product: "Discover the best recommendations from the best curators." (og:description in shell). [FETCHED]
- Stack: Nuxt 3 (Vue). Confirmed: `/_nuxt/entry.*.css`, `#__nuxt` mount div, `__NUXT_DATA__` payload, `buildAssetsDir:"/_nuxt/"`. [FETCHED]
- Brand accent: `theme-color` / `msapplication-TileColor` = `#E3F794` (lime). [FETCHED]
- Named mechanics (canon): Zoom Scroll Intro; menu-into-footer; App-UI parallax. [KNOWN]

---

## 2. THE MECHANIC

> PROVENANCE NOTE: the fetched HTML is a Nuxt SPA SHELL only — `#__nuxt` is empty and `data-ssr="false"`. No page content, headings, sections, video, or animation markup are present server-side; everything renders client-side from `/_nuxt/*.js` bundles. The FETCHED artifact is therefore [BLOCKED] for content. WebFetch also returned only the word "Telescope" (no rendered content). Section 2 below is [KNOWN] from canon, reconstructed as a rebuild spec, NOT observed.

### 2a. Zoom Scroll Intro [KNOWN]
- The intro scene scales toward the viewer as you scroll: a hero element (device/app screenshot or wordmark) begins large-and-centered, and scroll drives a continuous `scale` (zoom-in) coupled with a subtle `translateZ`/blur falloff, so the page appears to fly INTO the product. The loader hands off directly into the first frame of this zoom (no static hero pause). This is the "build only this one thing" beat: a single scroll-scrubbed zoom that establishes depth immediately.

### 2b. Menu-into-footer [KNOWN]
- The navigation menu and the footer are the same surface at two ends of the scroll: the menu content resolves/transforms into the footer as the closing beat, so open and close rhyme. (Same bookend philosophy as Permian's shared ScrollOverlay.)

### 2c. App-UI parallax [KNOWN]
- Product/app-UI screenshots move at differing scroll speeds against their background — foreground UI cards translate faster than the panel behind them, creating layered depth from flat screenshots.

### 2d. Type / easing [KNOWN]
- Reveal patterns and easing are not observable (client-only bundle). Rebuild at canon defaults.

---

## 3. THE RECIPE IN OUR STACK (Next.js 16 + Framer Motion 12 + Lenis + inline styles, no Tailwind)

### Shared Lenis config
```
duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```
`prefers-reduced-motion` -> destroy Lenis, freeze zoom at scale 1, render final states.

### R1 — Zoom Scroll Intro (THE one thing)
- Sticky rig: outer `<section style={{ height: '250vh' }}>`; inner `<div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>`.
- `const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start','end end'] })`.
- Hero visual: `const scale = useTransform(scrollYProgress, [0,1], [1, 2.6])` (zoom IN); pair with `const blur = useTransform(scrollYProgress,[0.6,1],[0,6])` applied as `filter: blur(${b}px)` via a motion template, and `const opacity = useTransform(scrollYProgress,[0.85,1],[1,0])` so the zoom dissolves into the next section instead of clipping.
- Hand loader -> zoom: mount the zoom target under the preloader (see Permian R1) so scroll frame 1 IS the first zoom frame — no cold hero.
- Optional counter-zoom layer: a background at `scale: useTransform(p,[0,1],[1.2,1])` moving opposite the foreground for parallax depth.

### R2 — Menu-into-footer bookend
- Single `<NavFooter>` client component holding the link set once. Render it fixed as the menu at top; as `scrollYProgress` of the whole page nears 1, animate the same links' container from its nav position/scale into the footer layout (Framer `layout` prop or explicit `y`/`scale` transforms driven by a page-level `useScroll`). Open and close share one DOM subtree.

### R3 — App-UI parallax
- Stack screenshot layers absolutely. Background panel: `y = useTransform(sectionProgress,[0,1],['0%','-6%'])`. Foreground UI cards: `y = useTransform(sectionProgress,[0,1],['0%','-18%'])` (faster). Add `rotateX`/`rotateY` micro-tilt with `useTransform` on pointer for life. Lazy-mount with `useInView`.

### R4 — Type reveal
- Line-mask rise: `overflow:hidden` wrapper, inner `motion.span` `translateY('110%')->0`, `whileInView`, `transition={{ duration:0.7, ease:[0.23,1,0.32,1], delay:i*0.06 }}`. Headline chars at 18ms stagger.

---

## 4. PROVENANCE FOOTER
- [BLOCKED] FETCHED artifact `docs/dossiers/telescope.html` — 3,236 bytes. Reason: Nuxt SPA shell, `#__nuxt` empty + `data-ssr="false"`; zero server-rendered content. Real HTTP 200 document but no analyzable page content.
- [BLOCKED] WebFetch: returned only "Telescope" — client-only render, no content surfaced.
- Section 2 mechanics = [KNOWN] from canon (Zoom Scroll Intro / menu-into-footer / App-UI parallax), NOT observed. Not downgraded silently — explicitly flagged.

---

## W0 PLAYWRIGHT UPGRADE — [BLOCKED] -> [WATCHED] (2026-08-05, real browser rendered the Nuxt app)
Live DOM after hydration. [WATCHED] title "Telescope"; hero "Real recommendations by real people";
CURRENTLY IN BETA. Real evidence for the B00 App-UI parallax + Zoom-Scroll-Intro mechanics:
- [WATCHED] Lenis PRESENT (hasLenis true) — smooth-scroll substrate confirmed.
- [WATCHED] 1 `<canvas>` + 38 elements carrying translate/matrix transforms = depth-separated
  parallax layers driving the "zoom into the page" intro.
- [WATCHED] KEYFRAMES: fromBottom / toBottom / fromFade / slideUpDown + bgEntering/bgLeaving
  (crossfading background layers between sections).
- [WATCHED] WORD-SPLIT REVEAL visible in the hero ("Telescope is a new pla..." resolving word by
  word) — same split-text family as Cleo.
- [WATCHED] EASINGS harvested: easeOutQuart cubic-bezier(0.165,0.84,0.44,1), easeInOutQuart
  cubic-bezier(0.77,0,0.175,1), easeInOutSine cubic-bezier(0.445,0.05,0.55,0.95) and the standard
  Penner set — a disciplined named-easing palette, not ad-hoc.
RECIPE (our stack): App-UI parallax = wrap product screenshot layers, each `useTransform(scrollYP,
[0,1],[y1,y2])` at depth-scaled rates; the zoom-intro = a single scaled `useTransform` on the hero
container over ~120vh, released into the page. All on the shared Lenis ticker, reduced-motion static.
