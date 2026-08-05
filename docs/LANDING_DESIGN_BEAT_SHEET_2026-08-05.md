# LANDING DESIGN BEAT SHEET
# CMD-LANDING-MASTER-ARC V21 · WAVE 1 / FIX 1 (R-5 deep recon) · 2026-08-05 · Agent A · NO EMOJI
# Purpose: the technique library the hero/estate/hexa-AI/video waves build FROM. Every technique
# has a "why it works" + a concrete recipe in OUR stack: Framer Motion 12 + Lenis 1.3 + inline
# React styles, dark tokens, NO Tailwind, senior floors + prefers-reduced-motion gated on all.
# Recon method (R-5): live WebFetch of each reference + established-technique knowledge, labeled
# [FETCHED] (this-session markup) vs [KNOWN] (documented craft; values live in their bundles) vs
# [VERIFIED] (source-of-truth config). References: Apple (airpods-pro / macbook-pro) · Stripe ·
# Linear · Dennis Snellenberg (Awwwards SOTY, 403-blocked -> [KNOWN]) · Lenis demo/README [VERIFIED].

---

## 0 · WHAT WE ALREADY HAVE (do not rebuild — extend)
- Lenis smooth scroll shipped · `useReducedMotion` hook · CharReveal · GlowCard · MagneticButton ·
  SectionHeading/Eyebrow · GradientBackground · NoiseOverlay · iOS/WAAPI preloader failsafe.
- Locked tokens: --accent #00BCD4 · --accent-deep #009688 · estate gold #D4A017 · glass
  rgba(255,255,255,0.03) · border rgba(0,188,212,0.15) · noise 0.035 · Exo 2 / Plus Jakarta /
  Barlow Condensed. Existing curve `cubic-bezier(0.23,1,0.32,1)` is Apple/Linear-family — KEEP.

## 1 · TIMING SYSTEM (adopt page-wide — the amateur tell is one duration for everything)
Two constants, applied BY INTENT (Linear's fast-in/gentle-out split):
```
const HOVER  = { duration: 0.15, ease: [0.23, 1, 0.32, 1] }   // micro-interactions, taps, hovers
const REVEAL = { duration: 0.7,  ease: [0.16, 1, 0.3, 1]  }   // scroll entrances, headline reveals
```
- Stagger step 80ms; cap any group's total stagger < 500ms (never "still loading").
- Scroll-SCRUBBED media = LINEAR map, no easing (easing there reads as lag; breaks the 1:1 "I drive this" contract). Lenis smooths the input; the frame/parallax map stays 1:1.
- Reveal distance: 16-32px translateY (Linear restraint) — never big theatrical slides.

## 2 · THE TECHNIQUE LIBRARY (ranked by value-per-effort)

### T1 · Overflow-mask per-character headline reveal  [KNOWN Dennis SOTY]  — HERO signature
Why: letters RISING from behind a line read physical/crafted; opacity-only fades read generic/AI.
Recipe: each glyph in `<span style={{display:'inline-block',overflow:'hidden',verticalAlign:'top'}}>`
wrapping a `motion.span` animating `y:'100%'->0`. staggerChildren 0.024, per-char duration 0.7,
ease [0.23,1,0.32,1]. Hero fires on load (post-curtain); section heads `whileInView once amount:0.3`.
Upgrade path: our CharReveal is opacity-based -> add the overflow mask.

### T2 · Reveal-on-approach, early trigger, once  [KNOWN Apple/Linear]  — the workhorse (80% of page)
Why: content settles BEFORE center, so reading is never interrupted; long ease = the "expensive" feel.
Recipe: `useInView(ref,{amount:0.2, margin:'0px 0px -20% 0px', once:true})` -> animate
`{opacity, y:24->0}` with REVEAL. Grouped children stagger 80ms. Standardize GlowCard/SectionHeading
to this exact timing for Apple-grade consistency.

### T3 · Scroll-decoupled ambient glow field  [KNOWN Stripe mesh + Linear radial bloom]  — hero depth
Why: a large, slow, low-saturation colour-field behind the hero reads as depth + "expense" and,
because it is TIME-based not scroll-linked, never janks under Lenis.
Recipe (behind content, zIndex 0, reduced-motion gated):
```
<motion.div aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none',
  background:'radial-gradient(60% 50% at 50% 20%, rgba(0,188,212,0.14), transparent 70%),'+
             'radial-gradient(50% 40% at 80% 60%, rgba(0,150,136,0.08), transparent 70%)',
  filter:'blur(40px)'}}
  animate={{opacity:[0.85,1,0.85], scale:[1,1.04,1]}}
  transition={{duration:14, ease:'easeInOut', repeat:Infinity}} />
```
Layer stack (Linear depth recipe, maps 1:1 to our tokens): canvas -> ambient radial glow -> glass
card (rgba(255,255,255,0.03) + 1px hairline rgba(0,188,212,0.15)) -> content. Hairline BRIGHTENS on
hover (our Effect 09). This is the one missing piece — we are 90% there already.

### T4 · Pinned feature-scene per capability  [FETCHED Linear 1.0-5.0 / KNOWN Apple pin-scrub]
Why: each feature gets one undivided moment; heading HOLDS (sticky) while the visual animates —
"scroll is narrative" made literal. Makes the loop / MegaBot / hexa-AI stories LAND, not blur past.
Recipe: `position:sticky; top:clamp(80px,20vh,160px)` on the text column (native, cheapest) +
`useScroll({target,offset:['start start','end start']})` + `useTransform` crossfade on the media:
`useTransform(scrollYProgress,[0,0.2,0.8,1],[0,1,1,0])`. Restraint: 12-24px translate, no big slides.
Apply to: the end-to-end LOOP (FIX 3), MegaBot/hexa-AI (FIX 7), estate offering stories (FIX 6).

### T5 · Poster -> video crossfade, autoplay-in-view, play-once  [FETCHED Apple two-track]
Why: kills the two ugliest video failures (black flash, pop-in); makes even one short clip premium.
Recipe: `<img>` poster (video frame 1) absolute opacity 1; `<video muted playsInline preload='none'>`
behind at opacity 0; `useInView(ref,{amount:0.5,once:true})` -> `video.play()`; on `onCanPlay`
crossfade poster opacity->0 over 500ms [0.23,1,0.32,1]; `onEnded` hold last frame (NO loop; ambient
product loops are the exception). reduced-motion -> never play(), poster stays. Wire in FIX 4.

### T6 · Scroll-scrubbed frame sequence  [FETCHED Apple startframe/endframe] — ONE hero moment only
Why: converts passive scroll into direct manipulation (user DRIVES the reveal) — the single most
"Apple" move. Highest craft-per-pixel. RESTRAINT: exactly one moment (Pillar 03), heavy asset.
Recipe: 30-60 sequential WebP frames (~1600px) preloaded into `Image[]`; tall track
`height:250vh` outer + `position:sticky;top:0;height:100vh` inner; `useScroll offset:['start
start','end end']` -> `useTransform(p,[0,1],[0,N-1])` -> paint to `<canvas>` via
`useMotionValueEvent(frame,'change',...)` (canvas beats swapping img src for 30+ frames). LINEAR map.
reduced-motion / mobile bail-out -> paint final frame only, skip the tall track. Candidate: a listing
photo -> AI-analyzed-result reveal in the hero or loop. Decide in FIX 3/4 whether the campaign clips
(FIX 2 verdicts) or a frame-scrub carries the loop.

### T7 · Bento asymmetric feature grid  [KNOWN Stripe]  — hierarchy on a flat grid
Why: asymmetric spans tell the eye what matters without a shouting headline; reads "product" not "brochure".
Recipe: `display:grid; gridTemplateColumns:repeat(6,1fr); gap:clamp(12px,1.5vw,20px); maxWidth:1120`.
Hero cell `gridColumn:'span 4'`, side cells `'span 2'`. Mobile @600px -> `1fr` stack. Wrap cells in
GlowCard. Candidate: AI-agents / hexa-AI (FIX 7), ProductPreview.

### T8 · Horizontal snap-scroll gallery  [FETCHED Apple media-card-gallery]  — mobile tactility
Why: turns a stacked list into a swipeable filmstrip with momentum — highest-value mobile pattern,
and CEO QAs on iOS 375px. Recipe: row `display:flex; overflowX:auto; scrollSnapType:'x mandatory';
gap:16; scrollbarWidth:'none'`; card `scrollSnapAlign:'center'; flex:'0 0 clamp(280px,80vw,420px)'`.
Native snap survives reduced-motion; skip only the optional parallax. 44px+ tap targets on card CTAs.

### T9 · Curtain-lift preloader -> hero char-reveal OVERLAP  [KNOWN Dennis]  — entry (optional, FIX 3)
Why: overlap removes the dead "loading done, now animating" beat. One gesture from black to live hero.
Recipe: AnimatePresence overlay exit `y:0->-100%` ease [0.76,0,0.24,1] ~0.9s; hero container
`staggerChildren delayChildren:0.3` so char-reveal is ~1/3 done as the curtain clears. Reuse the SAME
curtain for route transitions (one vocabulary). reduced-motion -> hard cut. We already ship an
iOS-failsafe preloader — the upgrade is swapping fade-out for the masked lift. LOAD-BEARING: do not
break the existing failsafe; gate behind it.

### T10 · Dual-layer magnetic CTA  [KNOWN Dennis/GSAP]  — top CTAs only
Why: container + label magnetizing at different pull ratios (0.35 vs 0.6) = depth-within-a-button.
Restraint IS the signal — hero CTA + waitlist submit + final CTA only. Recipe: `useSpring` on x/y
(stiffness 150, damping 15, mass 0.1); mousemove offset x0.35 on container, inner label x0.6;
mouseleave -> 0. Our MagneticButton exists — upgrade to dual-layer.

## 3 · TYPE + LAYOUT NUMBERS (steal-worthy, tune by eye)
- Hero display: Exo 2 600 (semibold — never 700+ at huge size; refined), `clamp(2.75rem, 11vw, 12rem)`
  where the moment earns it, letterSpacing -0.03em, lineHeight 0.95 (tighter than our current -0.02em/1.2
  for the HERO only; keep -0.02em/1.2 elsewhere per senior floors).
- Modular jump ~1.4-1.5x between tiers (body 17 -> subhead 24 -> section 40 -> hero 64+). Confident jumps.
- Body measure capped 480-620px even in wide sections. Section padding `clamp(80px,10vw,160px)`.
- Content band maxWidth ~1080-1120px; alternate with occasional 100vw cinematic breaks
  (`width:100vw; marginLeft:calc(50% - 50vw)`) + scrim `linear-gradient(180deg,transparent 40%,
  rgba(13,17,23,0.6))` for text contrast (protects our WCAG 7:1 body over media). The band<->bleed
  alternation is what makes a page read as "chapters" not "a list".
- Edge-pinned catalog index numerals (`01 — 06`, Barlow Condensed, letterSpacing 0.04em, bottom-right)
  = the Christie's-catalog authority our standard targets. Cheap, high perceived craft.

## 4 · GUARDRAILS ON EVERY TECHNIQUE
- prefers-reduced-motion collapses each to a static end state (poster/final-frame/hard-cut).
- Senior floors hold: body/CTA >= 14-15px, 44px targets, contrast (scrims over media).
- LCP < 2.5s ABSOLUTE: scrub/video assets lazy below fold, poster-first, one heavy moment max.
- Preserve every working animation + the iOS/WAAPI/preloader hardening (load-bearing per CLAUDE.md).
- PURPOSE pillar: if a motion does not earn its frame budget, cut it.

# END · beat sheet · the hero/estate/hexa-AI/video waves cite these T1-T10 by number.
