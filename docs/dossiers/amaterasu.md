# TECHNIQUE DOSSIER — Amaterasu

Source: https://amaterasu.ai
Artifact: docs/dossiers/amaterasu.html [FETCHED · 186,671 bytes · curl 200]
WebFetch technique read: performed (result was LIMITED — see note).
Bench role: B05 peak primary (the "peak moment" of the conversational/experience surface).
CMD-LANDING-PASS3 · W0 recon · no markup/class/JS/media/copy lifted.
NOTE FOR THE RECIPE: WebGL is V2 and NOT in this pass. This dossier writes the FRAMER-MOTION interpretation (reaches ~80% impact on our stack). Camera-fly used ONCE (the peak).

---

## WHAT IT IS — [KNOWN] canon facts

- [KNOWN] SOTD Nov 14 2024. Studio: Exo Ape. Technique class: WebGL + 3D.
- [KNOWN · artifact-confirmed] `<title>Amaterasu - Empower your mental health journey</title>`. Mental-health product; site is an experiential/cinematic marketing page.
- [KNOWN · artifact-confirmed] Built on Nuxt (Vue). Markup shows `id="__nuxt"` and scoped `data-v-*` attributes.
- [KNOWN · artifact-confirmed] A dedicated WebGL layer exists: `.webgl { height:100vh; position:fixed; width:100vw; z-index:-1 }` with a full-size `<canvas>` inside — a fixed, behind-content 3D field. Additional `<canvas class="canvas">` and `splash` / `transition` / `enter` state layers present.
- [KNOWN · artifact-confirmed] Motion vocabulary in CSS: `--ease-none` easing var, `@keyframes wave` (translate loop), opacity/`transform: translate(...)` transitions on splash/enter layers, `scroll-behavior:smooth`.

## THE MECHANIC ([KNOWN] from brief + Exo Ape signature)

Three stacked WebGL techniques; the brief lifts the FEEL, not the WebGL:

1. **Point cloud reacting to cursor.**
   A particle field (point cloud) rendered in the fixed `.webgl` canvas; particles displace/parallax toward or away from the cursor. [artifact confirms the fixed full-viewport canvas layer exists; the particle behavior itself is [KNOWN] from the brief/Exo Ape signature — the shader logic is not readable from static HTML.]

2. **Camera-fly scroll (camera moves THROUGH content).**
   Scroll doesn't just translate the page — the virtual camera flies forward in Z, so the viewer moves THROUGH the scene/content. [KNOWN, brief.] Used sparingly. The brief mandates: **camera-fly used ONCE — at the peak** — not on every section.

3. **Mask-reveal on expanding light.**
   Content is revealed through a growing luminous mask (an expanding light/shape wipes content in). [artifact shows opacity-driven splash/enter transitions with `--ease-none`; the specific expanding-light mask is [KNOWN] from the brief.]

## PROVENANCE — EVERY LINE

- SOTD date / Exo Ape / WebGL+3D → [KNOWN] CMD brief citation (Awwwards SOTD record).
- Title / mental-health positioning → [artifact-confirmed] grep of amaterasu.html.
- Nuxt (`__nuxt`, `data-v-*`) → [artifact-confirmed] grep of amaterasu.html.
- `.webgl` fixed full-viewport canvas at z-index -1; extra `<canvas>`; splash/transition/enter layers → [artifact-confirmed] grep of amaterasu.html CSS + DOM.
- `--ease-none`, `@keyframes wave`, translate/opacity transitions, smooth scroll → [artifact-confirmed] grep of amaterasu.html.
- Cursor-reactive point cloud / camera-fly-through / expanding-light mask specifics → [KNOWN, brief] shader logic NOT readable from static HTML; WebFetch pass could not observe WebGL internals (markdown conversion strips canvas/JS). Labeled honestly.

---

## THE RECIPE IN OUR STACK — Framer-Motion interpretation (WebGL is V2, out of scope)
Next 16 · React 19 · Framer Motion 12 · Lenis · inline `style={{}}` · NO Tailwind · NO WebGL/Three this pass.
Target: ~80% of the impact with DOM transforms + clip-path, no GPU shader code.

### 1. Point cloud via transforms (NOT WebGL particles)
- Generate ~40–80 particles as absolutely-positioned divs (small radius, `--accent`/foreground at low opacity), seeded once with deterministic pseudo-random positions (fixed seed so SSR/CSR match — no hydration jitter).
- Parallax to cursor: one `onMouseMove` on the section (throttled via `requestAnimationFrame`), compute pointer delta from center, feed a Framer `useMotionValue` for x/y; each particle gets a per-particle depth factor (0.02–0.12) so nearer particles move more → parallax depth (WCS pillar 04 DEPTH).
- Use `transform: translate3d()` only (GPU-composited, no layout). `translateZ(0)` on the layer for iOS stability (WCS pillar 07 CRAFT).
- Desktop-only reactivity: gate cursor logic behind `(pointer: fine)` — matches the CustomCursor pattern already in the repo. On touch, particles do a slow ambient drift (reuse float1/float2/float3 @keyframes) instead of tracking a finger.

### 2. Camera-fly via scroll-driven Z (ONCE, at the peak)
- Exactly ONE section is the "peak." Wrap its stage in a Framer `useScroll({ target, offset:["start end","end start"] })`.
- Map progress → a large `scale` + `translateZ`-feel: `scale` from ~0.85 → 1.15 and content `y` drift, plus a `perspective` on the parent (e.g. `perspective: 1200px`) so children with `translateZ` read as flying toward the viewer. This fakes camera-through-content on the compositor.
- Restraint (WCS pillar 03 PURPOSE + brief mandate): do NOT apply this to other sections. One peak, once. Everything else uses normal scroll reveals.

### 3. Mask-reveal on expanding light (clip-path)
- Reveal the peak headline/hero through an expanding radial mask: `clipPath: circle(0% at 50% 50%)` → `circle(140% at 50% 50%)`, driven by `useInView` (fire once). Pair with a radial-gradient glow layer scaling from 0 → 1 so the "light" appears to expand and wipe content in.
- Framer: `initial={{clipPath:"circle(0% at 50% 50%)"}}` `animate={{clipPath:"circle(140% at 50% 50%)"}}` `transition={{duration:1.1, ease:[0.23,1,0.32,1]}}`.
- Reduced-motion: skip the mask + camera-fly entirely; render content fully visible, particles static. (WCS §5 / pillar 07.)

### Performance + a11y guardrails
- Particle divs: cap count on mobile (≤600px → half). `will-change: transform` ONLY on actively animating particles (CLAUDE §6).
- Never block main thread; all motion is transform/opacity/clip-path (no layout thrash).
- LCP: the peak's real headline text must be in the DOM and legible even before the mask animates (no text-in-canvas). Keeps LCP <2.5s (CLAUDE §9).
- Full `prefers-reduced-motion` off-switch on all three effects.

### Explicitly OUT of scope this pass
- No Three.js / R3F / WebGL / shaders (V2 only, per brief).
- No real 3D point cloud — the transform-parallax field is the stand-in.
- Do not claim this reproduces Amaterasu's shader work; it's the ~80% DOM interpretation.
