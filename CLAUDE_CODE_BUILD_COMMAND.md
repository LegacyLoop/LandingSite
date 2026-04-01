# LEGACYLOOP LANDING PAGE — CLAUDE CODE BUILD COMMAND

## PASTE EVERYTHING BELOW THE LINE INTO CLAUDE CODE AS YOUR FIRST MESSAGE.
## DO NOT EDIT ANYTHING. THIS IS PRODUCTION-READY. ONE SESSION. ONE BUILD. LAUNCH READY.

---

## ⚠️ CRITICAL — READ BEFORE WRITING ANY CODE

This project uses **Next.js 16.2.1** which has breaking changes from what you may know. Before writing a single line of code, you MUST read the relevant docs:

```
cat node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md
cat node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
```

Also read `AGENTS.md` in the project root. It will reinforce this instruction. Heed all deprecation warnings. If any API has changed from your training data, use the version in the docs, not your memory.

---

## WHO YOU ARE

You are the lead frontend engineer for LegacyLoop. You are building a landing page that belongs in the top 10 most impressive marketing websites on the internet right now. Think Awwwards site of the year. Think Linear meets Christie's. Think the $100,000 agency build that took a 6-person team 3 months.

Your quality bar references — study the feel of these:
- **Linear** (linear.app) — dark SaaS gold standard
- **Vercel** — deployment clarity, glass feel
- **Stripe** — financial precision
- **Grok by xAI** — dark AI interface
- **SpaceX** — technical confidence
- **Tesla Model S center console** — dense information, never cluttered

The scroll must feel like turning pages in a premium magazine. Every hover must feel intentional and satisfying. Nothing decorates. Everything communicates.

Two emotional registers must coexist in one page:
- **HIGH TECH:** teal, dark slate, glassmorphism, precision, speed, AI power
- **WARM/DIGNIFIED:** estate sections soften tone with amber, more whitespace, empathetic copy
The shell is always dark and premium. Estate sections soften without breaking the system.

---

## WHY THIS MATTERS — INVESTOR-GRADE STANDARD

This landing page may be shown to our primary investor (Dr. Clark, $50K–$150K seed) at any moment. It must be investment-grade from the first line of code.

This means:
- **No placeholder text ever.** No "lorem ipsum." No "coming soon" that looks unfinished.
- **No broken images or missing assets.** Always use graceful fallbacks.
- **No TypeScript errors.** No console errors.
- **Every CTA must work** and point to the correct URL.
- **Pricing must be exactly right** — investors will check.
- **Claims must be honest** — "47 beta signups" not "thousands of users."
- **App screenshots must show a real, working product.**

If anything looks unfinished, placeholder, or broken — it costs the founder investor credibility. Build it complete. Build it right. Build it once.

---

## PROJECT STATE — ALREADY DONE FOR YOU

```
Project:           legacy-loop-landing
Dev server:        localhost:3001 (port 3000 is taken by the MVP app — separate codebase, DO NOT TOUCH)
Next.js:           16.2.1 with App Router
TypeScript:        installed ✅
framer-motion:     12.38.0 ✅
lenis:             1.3.21 ✅ (import from 'lenis', NOT '@studio-freight/lenis')
Tailwind:          NOT installed ✅ (intentional — do NOT install it)
Package manager:   npm (NOT yarn, NOT pnpm)
No src/ directory: files live at root level (app/, public/, etc.)
```

### Files already configured (DO NOT MODIFY):
- **`app/layout.tsx`** — Loads 3 Google Fonts (Exo 2, Plus Jakarta Sans, Barlow Condensed), sets metadata, favicon link, font CSS variable classes on `<html>`
- **`app/globals.css`** — All design tokens as CSS custom properties, all @keyframes, base reset, `cursor: none` on desktop, `prefers-reduced-motion` media query
- **`app/page.tsx`** — Default Next.js boilerplate. DO NOT TOUCH.
- **`package.json`** — All dependencies installed. DO NOT add packages.
- **`AGENTS.md`** — Next.js 16 instruction. Read it.

### Assets verified on disk:
- **Videos:** `public/hero-loop.webm`, `public/hero-loop.mp4`, `public/vintage-item-valuation.webm`, `public/vintage-item-valuation.mp4` — all present ✅
- **Logos:** 13 files in `public/logos/` — all present ✅
- **Images:** 108 files organized in `public/images/` subdirectories — all present ✅
- **Screenshots:** 59 app screenshots in `public/images/screenshots/` — all present ✅
- **Favicon:** `public/favicon.png` (64x64) — present ✅

---

## YOUR TARGET FILE

**Create:** `app/landing/page.tsx`

This is a **NEW** file. The ONLY file you create. Do NOT touch `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, or ANY existing file. Only create `app/landing/page.tsx`.

This file is a `'use client'` component. It will be a single-file page with all sub-components defined inline within the same file. This is intentional — one file, one build, zero import complexity.

---

## ABSOLUTE STYLING RULES — NON-NEGOTIABLE

1. **ALL styles use inline `style={{}}` ONLY.** Never Tailwind. Never external CSS. Never className for visual styling. The only exception: className is used on `<html>` in layout.tsx for font variable injection — that's already done.
2. **The LegacyLoop logo is SACRED.** Never generate it. Never recreate it in code. Never approximate it with SVG or text. Only use the exact PNG files from `/logos/`. Never bake logo text into AI backgrounds. The logo is always a separate foreground layer on top of any background.
3. **framer-motion and lenis are the ONLY animation/scroll libraries.** No GSAP. No anime.js. No other libraries. Do not `npm install` anything.
4. **`prefers-reduced-motion` is already handled** in globals.css. All CSS animations are auto-disabled. For framer-motion animations, respect the user's preference by checking `window.matchMedia('(prefers-reduced-motion: reduce)')` and skipping motion if true.
5. **Never claim fake traction.** Allowed language only: "47 beta signups" | "Early Access" | "Join the first 100" | "Pre-Launch Pricing"
6. **All font references use CSS variables:** `var(--font-heading)` for Exo 2, `var(--font-body)` for Plus Jakarta Sans, `var(--font-data)` for Barlow Condensed.
7. **Base font size minimum: 17px** for all body/reading text. This is a senior accessibility requirement from the brand guide. Non-negotiable.
8. **All images use `<img>` tags** (not `next/image`). This avoids the optimization config complexity and keeps the build simple and predictable. Use `loading="lazy"` on all images below the fold.

---

## LOGO FILES — EXACT ASSIGNMENTS

All logos are in `/logos/`. Ryan vectorized these himself in Adobe Illustrator. They are professional-grade transparent PNGs.

```
NAV BAR:          /logos/LegacyLoop-Logo-Master-04.png     (horizontal lockup with circle ring)
HERO SECTION:     /logos/LegacyLoop-Logo-Master-03.png     (full stacked lockup — large, prominent)
FOOTER:           /logos/LegacyLoop-Logo-Master-03.png     (same full stacked lockup)
STANDALONE MARK:  /logos/LegacyLoop-Logo-Master-01.png     (circle mark only — use anywhere a small icon is needed)
PRELOADER:        /logos/LegacyLoop-Logo-Master-01.png     (circle mark animating during load)
```

**LOGO TRANSPARENCY RULE:** These logo PNGs have dark backgrounds that may appear black in some contexts. Always display them with:
- `object-fit: contain` — never stretch or crop
- No background-color behind them — let the page dark bg show through
- If a dark bg becomes visible on screen around the logo, apply `mix-blend-mode: screen` as a fix
- NEVER alter the logo files themselves

---

## AI-GENERATED IMAGES — USAGE RULES

The images in `public/images/` include AI-generated visuals. Critical rules:

1. **These images are for BACKGROUNDS and ATMOSPHERIC EFFECTS only.** They blend with the design. They are never the hero subject.
2. **The LegacyLoop logo is always the prominent foreground element** when used with any background image. Always separate layers — logo on top, image behind.
3. **Never make an AI image the focal point of any section.** Use them at low opacity (0.06–0.15) for atmosphere, texture, and depth.

---

## APP SCREENSHOTS — USAGE RULES

59 screenshots in `/images/screenshots/` are from the real running LegacyLoop app (Next.js on localhost:3000, full Tier 4 access, DEMO_MODE=true). These are **proof of product** for investors.

Display rules:
- Use 3 of the best screenshots in a **Product Preview** section (pick from: app-screenshot-01 through app-screenshot-10 — these show the dashboard, bot results, and key features)
- Present as **angled floating device frames** — not flat squares
- Subtle drop shadow: `boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3)'`
- Slight rotation: `transform: 'perspective(1200px) rotateY(-8deg) rotateX(4deg)'` for left card, mirror for right, center card straight with slight scale-up
- Premium presentation — these prove the product is real and impressive

---

## LOCKED DESIGN TOKENS

These are defined in `globals.css` as CSS custom properties. Use them via `var(--name)` in inline styles:

```
Background:        var(--bg-primary)       = #0D1117
Background alt:    var(--bg-secondary)     = #1A1F2E
Card background:   var(--bg-card)          = rgba(255,255,255,0.03)
Accent:            var(--accent)           = #00BCD4
Accent bright:     var(--accent-bright)    = #22D3EE
Accent deep:       var(--accent-deep)      = #0097A7
Accent secondary:  var(--accent-secondary) = #009688
Text primary:      var(--text-primary)     = #F1F5F9
Text secondary:    var(--text-secondary)   = #CBD5E1
Text muted:        var(--text-muted)       = #94A3B8
Text dim:          var(--text-dim)         = #6B7280
Success:           var(--success)          = #22C55E
Warning:           var(--warning)          = #F59E0B
Error:             var(--error)            = #EF4444
Antique:           var(--antique)          = #FBBF24
MegaBot:           var(--megabot)          = #8B5CF6
Estate warm:       var(--estate-warm)      = #D4A017
```

Additional hardcoded values for inline styles:
```
Card border:        1px solid rgba(0,188,212,0.15)
Card hover border:  1px solid rgba(0,188,212,0.5)
Card radius:        16px
Backdrop filter:    blur(12px)
CTA gradient:       linear-gradient(135deg, #00bcd4, #009688)
CTA glow:           0 0 32px rgba(0,188,212,0.35), 0 4px 16px rgba(0,188,212,0.2)
CTA hover glow:     0 0 60px rgba(0,188,212,0.55), 0 8px 30px rgba(0,188,212,0.3)
Button min height:  44px (touch target — accessibility requirement)
Button radius:      12px
Transition easing:  cubic-bezier(0.23, 1, 0.32, 1)
```

---

## TYPOGRAPHY SCALE — FROM BRAND GUIDE

| Level | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Display / Hero | Exo 2 | 700-800 | clamp(48px, 7vw, 72px) | 1.1 |
| H1 | Exo 2 | 700 | clamp(36px, 5vw, 48px) | 1.2 |
| H2 | Exo 2 | 700 | clamp(24px, 3.5vw, 34px) | 1.3 |
| H3/H4 | Exo 2 | 600 | clamp(17px, 2vw, 22px) | 1.4 |
| Body Large | Plus Jakarta Sans | 400 | 17-18px | 1.65 |
| Body Default | Plus Jakarta Sans | 400 | 15-16px | 1.65 |
| Label / Nav | Plus Jakarta Sans | 500 | 13-14px | 1.4 |
| Badge / Status | Barlow Condensed | 600 | 11-13px | 1.2 |
| Metric / Stat | Barlow Condensed | 700 | 28-48px | 1.1 |
| Tagline | Barlow Condensed | 600 | 10-14px | 1.0 |

Letter spacing: Headings -0.5px to -1px. Body: 0. Tagline: +4px. Badges: +0.5px.

---

## URL CONNECTIONS — EXACT — DO NOT CHANGE

```
Login button:              https://app.legacy-loop.com/login
Sign Up / Get Started:     https://app.legacy-loop.com/signup
Investor CTA:              mailto:ryan@legacy-loop.com?subject=LegacyLoop%20Investor%20Inquiry
General contact:           support@legacy-loop.com
Website:                   legacy-loop.com
```

Every "Start Your Legacy", "Get Started Free", "Start Selling", "Go Pro", "Manage Estates" button links to `https://app.legacy-loop.com/signup`.

The "Login" button in the nav links to `https://app.legacy-loop.com/login`.

The "Request Our Pitch Deck" button links to `mailto:ryan@legacy-loop.com?subject=LegacyLoop%20Investor%20Inquiry`.

---

## ASSET PATHS — VERIFIED ON DISK

### Logos (in `/logos/`)
```
Nav bar:            /logos/LegacyLoop-Logo-Master-04.png    (horizontal lockup)
Hero + Footer:      /logos/LegacyLoop-Logo-Master-03.png    (full stacked lockup)
Standalone mark:    /logos/LegacyLoop-Logo-Master-01.png    (circle mark only)
Preloader mark:     /logos/LegacyLoop-Logo-Master-01.png
Favicon:            /favicon.png
```

### Videos (in root `/public/`)
```
Hero video:         /hero-loop.webm (primary), /hero-loop.mp4 (fallback)
                    8 seconds, 1280x720, 24fps, no audio — loops seamlessly
Valuation video:    /vintage-item-valuation.webm (primary), /vintage-item-valuation.mp4 (fallback)
                    8 seconds, 1280x706, 24fps, no audio
```

### Images (in `/images/`)
```
HERO:
  /images/hero/hero-bg-glow.png            — Teal nebula background
  /images/hero/hero-bg-glow-alt.png        — Alt version
  /images/hero/hero-loop-render.png        — 3D metallic loop mark
  /images/hero/hero-loop-render-alt.png    — Alt version

MEGABOT:
  /images/megabot/four-engines.png          — 4 colored AI orbs connected by light beams (PRIMARY)
  /images/megabot/megabot-console.png       — AI dashboard with charts and 4 orbs
  /images/megabot/megabot-orbs.png          — 4 orbs rising from phone with holographic panels
  /images/megabot/megabot-desk.png          — Desk scene with MegaBot console
  /images/megabot/four-engines-alt.png      — Alt version

ESTATE:
  /images/estate/estate-room.png            — Rich room with antiques and fireplace
  /images/estate/photo-album.png            — Photo album, tea, glasses on table
  /images/estate/generations-hands.png      — Elder and child hands reaching (MOST POWERFUL IMAGE)
  /images/estate/senior-tablet.png          — Senior woman using tablet with AI cards
  /images/estate/senior-phone.png           — Senior man with phone in antique room
  /images/estate/grandmother-daughter.png   — Grandmother and granddaughter using tablet

GARAGE:
  /images/garage/garage-sale.png            — Bright organized garage sale
  /images/garage/family-garage.png          — Family of four in garage

ANTIQUE:
  /images/antique/pocket-watch.png          — Pocket watch with teal scanning frame
  /images/antique/gold-watch-analysis.png   — Gold watch with AI analysis cards (97.6 score)
  /images/antique/keepsake-box.png          — Keepsake box with heirlooms + holographic data
  /images/antique/lamp-analysis.png         — Antique lamp with analysis cards
  /images/antique/keepsake-box-alt.png      — Alt version

AI / TECH:
  /images/ai/before-after.png              — Split: dusty items vs AI-analyzed items
  /images/ai/senior-ai-analysis.png        — Senior hands with photos + AI panels
  /images/ai/network-nodes.png             — Constellation network on dark teal (tech bg)
  /images/ai/tech-surface.png              — Carbon fiber surface with teal glow (texture)
  /images/ai/tech-platform-wide.png        — Wide tech platform visual
  /images/ai/tech-platform-wide-alt.png    — Alt version

BRAND:
  /images/brand/3d-loop-mark.png           — 3D metallic loop (teal + gold + silver)
  /images/brand/loop-glow.png              — Neon teal infinity loop on dark
  /images/brand/loop-feathered.png         — Feathered metallic loop variant
  /images/brand/logo-lockup-dark.png       — Logo lockup on dark bg
  /images/brand/logo-3d-render.png         — 3D rendered logo
  /images/brand/loop-metallic.png          — Metallic loop variant
  (+ additional variants)

SCREENSHOTS:
  /images/screenshots/app-screenshot-01.png through app-screenshot-59.png
  Real app screenshots — proof of product for investors
```

---

## AWWWARDS-LEVEL EFFECTS TO IMPLEMENT

Build these as inline sub-components inside `app/landing/page.tsx`. Each one uses inline `style={{}}` only.

### EFFECT 1: SMOOTH SCROLL (Lenis)
Initialize in a `useEffect` at the top of the page component. Dynamic import to prevent SSR crash:
```tsx
useEffect(() => {
  let lenis: any
  ;(async () => {
    const Lenis = (await import('lenis')).default
    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
  })()
  return () => { if (lenis) lenis.destroy() }
}, [])
```

### EFFECT 2: CUSTOM CURSOR (Desktop Only)
Blend-mode circle cursor (32px diameter, white fill, `mixBlendMode: 'difference'`) that follows mouse with lerp smoothing (factor 0.12). Expands to 56px on interactive elements (links, buttons). Small teal dot (6px, `#00BCD4`) at exact cursor position. Both `position: fixed`, `pointerEvents: 'none'`, `zIndex: 99999`. Only render when `window.matchMedia('(pointer: fine)')` matches. Use `requestAnimationFrame` loop for smooth tracking.

### EFFECT 3: GRADIENT ORB BACKGROUND
`position: fixed`, `inset: 0`, `zIndex: 0`, `pointerEvents: 'none'`. Three radial gradient divs with `borderRadius: '50%'`:
- **Teal orb:** top center, 1000x800px, `background: 'radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)'`, `animation: 'float1 14s ease-in-out infinite'`
- **Deep teal orb:** right 40%, 700x700px, `rgba(0,150,136,0.05)`, `animation: 'float2 18s ease-in-out infinite'`
- **Amber orb:** bottom left, 600x600px, `rgba(212,160,23,0.04)`, `animation: 'float3 22s ease-in-out infinite'`

### EFFECT 4: NOISE TEXTURE OVERLAY
SVG `feTurbulence` filter (`type="fractalNoise"`, `baseFrequency="0.65"`, `numOctaves="3"`). Applied to a `position: fixed` div covering viewport at `opacity: 0.04`, `zIndex: 2`, `pointerEvents: 'none'`. This adds subtle film grain to the entire page.

### EFFECT 5: PAGE PRELOADER
Framer Motion `AnimatePresence`. Fixed overlay filling viewport on `#0D1117` bg. Shows the LegacyLoop circle mark (`/logos/LegacyLoop-Logo-Master-01.png`, 48px) with a pulse animation, plus "LEGACYLOOP" text below in Barlow Condensed 600, 12px, teal `#00BCD4`, `letterSpacing: '0.25em'`, uppercase. Loading bar below text animates width from 0% to 100% over 1200ms. Entire preloader fades out via `opacity: 0` with ease `[0.76, 0, 0.24, 1]` and `display: none` after exit.

### EFFECT 6: CHARACTER-BY-CHARACTER HEADLINE REVEAL
Hero headline text splits into individual `<span>` characters. Each character: `display: 'inline-block'`, starts `opacity: 0, transform: 'translateY(110%)'`, animates to `opacity: 1, transform: 'translateY(0)'` with stagger delay of `i * 22ms`. Easing: `cubic-bezier(0.23, 1, 0.32, 1)`. Triggered after preloader exits (delay 300ms). Space characters get `width: '0.3em'` to preserve word spacing.

### EFFECT 7: SCROLL OPACITY TEXT REVEAL
Uses framer-motion `useScroll` + `useTransform`. Text splits into words. Each word is a `<span>` with ghost text (opacity 0.1) holding layout and animated overlay text. `offset: ['start 0.9', 'start 0.2']`. Each word maps a range of `scrollYProgress` to opacity `[0.1, 1]` and y `[6, 0]`. Words light up as you scroll through them.

### EFFECT 8: MAGNETIC CTA BUTTON
Uses framer-motion `useMotionValue` + `useSpring`. On mouse move over button, calculates offset from button center. Applies 35% of that displacement as x/y transform. Spring config: `{ stiffness: 150, damping: 15, mass: 0.1 }`. Snaps back to center on mouse leave. Apply to all primary CTA buttons.

### EFFECT 9: STAGGERED CARD REVEALS
`IntersectionObserver` with `threshold: 0.1`. Each card wrapped in a reveal component that triggers on first intersection (unobserve after trigger — `once: true`). Enter animation: `opacity: 0 → 1`, `transform: 'translateY(28px) scale(0.97)' → 'translateY(0) scale(1)'`. Transition: `600ms cubic-bezier(0.23, 1, 0.32, 1)`. Each card's delay = `index * 80ms`.

### EFFECT 10: ANIMATED STAT COUNTERS
`IntersectionObserver` triggers count-up when section is 60% visible. Uses `requestAnimationFrame` loop. Ease-out quart: `1 - Math.pow(1 - progress, 4)`. Duration: 2200ms. Display with `toLocaleString()` for commas. Counters for: 10,000+, $48B, 76%, 47 beta signups, stat cards in investor section.

### EFFECT 11: STICKY NAV WITH BLUR TRANSITION
`position: fixed`, `top: 0`, full width, `zIndex: 1000`. Transparent at page top (scroll = 0). After 20px scroll: `background: 'rgba(13,17,23,0.9)'` + `backdropFilter: 'blur(24px) saturate(180%)'` + `borderBottom: '1px solid rgba(0,188,212,0.08)'`. Transition: `all 0.4s cubic-bezier(0.23, 1, 0.32, 1)`.

### EFFECT 12: GLOW CARD (reusable)
On hover: border brightens to `rgba(0,188,212,0.5)`, `boxShadow: '0 0 30px rgba(0,188,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'`, `transform: 'translateY(-4px)'`. Default state: `background: 'rgba(255,255,255,0.03)'`, `border: '1px solid rgba(0,188,212,0.15)'`, `backdropFilter: 'blur(12px)'`, `borderRadius: 16`. Transition: `all 0.4s cubic-bezier(0.23, 1, 0.32, 1)`.

### EFFECT 13: MARKETPLACE MARQUEE TICKER
Items array doubled (concatenated with itself) for seamless infinite loop. Container has `overflow: hidden`. Inner track: `display: flex`, `animation: 'ticker 35s linear infinite'`. Items separated by teal diamond `◆` (`color: '#00BCD4'`). Pause on hover via `onMouseEnter` → `animationPlayState: 'paused'`, `onMouseLeave` → `animationPlayState: 'running'`.

### EFFECT 14: GRADIENT TEXT (reusable)
```tsx
style={{
  background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}}
```

### EFFECT 15: CLIP-PATH SECTION TRANSITION
Between hero and next section: `clipPath: 'polygon(0 5%, 100% 0%, 100% 100%, 0% 100%)'`, `marginTop: '-80px'`, `paddingTop: '120px'`. Creates a diagonal reveal edge.

---

## BUILD SEQUENCE — 5 PHASES

Build each phase completely. After each phase, run:
```
npx tsc --noEmit && npm run build
```
Fix ALL TypeScript errors and build errors before moving to the next phase. Report what you built and the result of the build check before proceeding.

---

### PHASE 1 — FOUNDATION (Effects Layer)

Create `app/landing/page.tsx` with `'use client'` directive at the very top.

Import React hooks: `useState`, `useEffect`, `useRef`, `useCallback`.
Import from framer-motion: `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useMotionValue`, `useSpring`.

Build these as inline sub-components (defined in the same file, above the default export):

1. **Lenis smooth scroll** — init in useEffect with dynamic import (pattern above). Clean up on unmount.
2. **CustomCursor** — blend mode circle + teal dot, desktop only. requestAnimationFrame lerp loop.
3. **GradientBackground** — 3 floating orbs, position fixed, behind all content.
4. **NoiseOverlay** — SVG feTurbulence, position fixed, film grain effect.
5. **Preloader** — AnimatePresence wrapper. Shows logo mark + "LEGACYLOOP" text + loading bar. Fades out at 1200ms. Sets a state flag `isLoaded` to true on exit.

The default export page component returns:
```tsx
<>
  <AnimatePresence>
    {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
  </AnimatePresence>
  <CustomCursor />
  <GradientBackground />
  <NoiseOverlay />
  <main style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
    {/* Sections added in later phases */}
  </main>
</>
```

**VERIFY:** `npx tsc --noEmit && npm run build` — must pass with zero errors.

---

### PHASE 2 — NAV + HERO + TICKER

Add these sections inside `<main>`:

#### STICKY NAV
- `position: fixed`, `top: 0`, `left: 0`, `right: 0`, `zIndex: 1000`, `height: 68px`
- Content area: `maxWidth: 1280px`, `margin: '0 auto'`, `padding: '0 32px'`, flex row, `alignItems: 'center'`, `justifyContent: 'space-between'`
- **Left:** `<img src="/logos/LegacyLoop-Logo-Master-04.png"` at `height: 36px`, `objectFit: 'contain'` — this is the horizontal lockup with circle ring. Next to it (or part of the logo): no separate text needed, the logo file includes the wordmark.
- **Center:** Nav links — "How It Works" | "AI Agents" | "Pricing" | "Investors" — `onClick` smooth scrolls via `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`. Plus Jakarta Sans 500, 14px, color `#CBD5E1`, hover `#FFFFFF`, `transition: 'color 0.3s ease'`. `cursor: 'pointer'`.
- **Right:** "Login" text link (Plus Jakarta Sans 500, 14px, `#CBD5E1`, hover `#fff`) → `https://app.legacy-loop.com/login`. Plus "Get Started" button — teal gradient bg, white text, glow shadow, 44px min height, 12px radius, `padding: '10px 24px'` → `https://app.legacy-loop.com/signup`
- **Mobile (below 768px):** Hide center nav links. Show logo left, "Get Started" button right. Consider a minimal hamburger menu or just simplify to logo + CTA.
- **Scroll behavior:** Transparent at top → glass blur on scroll past 20px (Effect 11)

#### HERO SECTION (100vh, id="hero")
- Full viewport height, flex column centered, `position: 'relative'`, `overflow: 'hidden'`
- **Video background layer:** `<video autoPlay muted loop playsInline` with `src="/hero-loop.webm"`. Fallback: `<source src="/hero-loop.mp4" type="video/mp4" />`. Positioned absolute, full cover, `objectFit: 'cover'`, `opacity: 0.12`, `zIndex: 0`. If video fails, fallback to `/images/hero/hero-bg-glow.png` as `backgroundImage`.
- **Logo mark:** `/logos/LegacyLoop-Logo-Master-03.png` (full stacked lockup) — displayed prominently above headline, `maxWidth: 280px`, centered, `marginBottom: 32px`, `objectFit: 'contain'`. Fade in after preloader.
- **Eyebrow badge:** "AI-POWERED RESALE PLATFORM — EARLY ACCESS" — Barlow Condensed 600, 12px, teal text `#00BCD4`, pill shape with `background: 'rgba(0,188,212,0.1)'`, `border: '1px solid rgba(0,188,212,0.3)'`, `padding: '6px 16px'`, `borderRadius: 20`, `letterSpacing: '0.1em'`, uppercase, `marginBottom: 24px`
- **Headline:** "Connecting Generations." — Character-by-character reveal (Effect 6), Exo 2 800, `fontSize: 'clamp(48px, 7vw, 72px)'`, gradient text (teal → white), `lineHeight: 1.1`, `letterSpacing: '-1px'`. The period is important — keep it.
- **Subheadline:** "The platform that makes selling simple, fair, and dignified." — Plus Jakarta Sans 400, 18px, `color: '#CBD5E1'`, `maxWidth: 520px`, centered, fade in 600ms after headline completes, `lineHeight: 1.65`
- **CTA row:** Two buttons, flex row, centered, `gap: 16px`, `marginTop: 40px`
  - **Primary:** "Start Your Legacy" — MAGNETIC button (Effect 8), teal gradient bg, white text, Exo 2 600, 18px, `padding: '18px 42px'`, `borderRadius: 12`, glow shadow, `minHeight: 44px` → `https://app.legacy-loop.com/signup`
  - **Ghost:** "See How It Works" — transparent bg, `border: '1px solid rgba(0,188,212,0.4)'`, teal text `#00BCD4`, Plus Jakarta Sans 500, 14px, `padding: '14px 28px'`, `borderRadius: 12`, hover border brightens → smooth scroll to `#how-it-works`
- **Scroll indicator:** Centered at bottom, `position: 'absolute'`, `bottom: 32px`, `left: '50%'`, chevron/arrow pointing down, `animation: 'scrollBounce 2s ease-in-out infinite'`, `opacity: 0.5`

#### MARKETPLACE TICKER (between hero and next section, applies clip-path transition Effect 15)
Infinite horizontal scroll marquee:
Items: `"eBay" • "Mercari" • "Poshmark" • "OfferUp" • "Etsy" • "Facebook Marketplace" • "Craigslist" • "Instagram" • "Amazon" • "TikTok Shop" • "Reverb" • "Pinterest"`
- That's 12 platforms. The 13th (Depop) should be included: add "Depop" to the list.
- Barlow Condensed 500, 13px, `color: '#6B7280'`, `letterSpacing: '0.1em'`, uppercase
- Teal diamond `◆` separator between items (`color: '#00BCD4'`)
- Container: `borderTop: '1px solid rgba(0,188,212,0.08)'`, `borderBottom: '1px solid rgba(0,188,212,0.08)'`, `padding: '16px 0'`, `overflow: 'hidden'`
- `animation: 'ticker 35s linear infinite'`, pause on hover (Effect 13)

**VERIFY:** `npx tsc --noEmit && npm run build` — must pass.

---

### PHASE 3 — PROOF + MEGABOT + HOW IT WORKS + PRODUCT PREVIEW

All sections use consistent spacing: `padding: '120px 32px'`, content `maxWidth: 1080px`, `margin: '0 auto'`.

#### SECTION: MARKET OPPORTUNITY
- **Eyebrow:** "THE OPPORTUNITY" — Barlow Condensed 600, 12px, teal `#00BCD4`, `letterSpacing: '0.15em'`, uppercase, centered
- **3 animated stat cards** in a responsive row (3 columns desktop, stack mobile). Staggered reveal (Effect 9). GlowCard (Effect 12):
  - `10,000+` | "Americans turn 65 every day" — AnimatedStat (Effect 10), counter from 0 to 10000, suffix "+"
  - `$48B` | "Estate and resale market" — prefix "$", counter to 48, suffix "B"
  - `76%` | "Of sellers say pricing is their biggest frustration" — counter to 76, suffix "%"
- Stat numbers: Barlow Condensed 700, `fontSize: 'clamp(36px, 5vw, 48px)'`, gradient text
- Stat descriptions: Plus Jakarta Sans 400, 15px, `color: '#CBD5E1'`, centered
- **ScrollRevealText (Effect 7):** "Managing an estate should not require becoming an eBay expert. LegacyLoop was built for this moment." — Exo 2 600, `fontSize: 'clamp(20px, 3vw, 28px)'`, centered, `maxWidth: 800px`, `marginTop: 64px`

#### SECTION: MEGABOT — THE CROWN JEWEL (id="megabot")
This section must feel like a command center coming online. It's the technical showpiece.
- **Eyebrow:** "THE CROWN JEWEL" — Barlow Condensed, amber-purple tint `#8B5CF6`
- **Headline:** "Four AI Engines. One Fair Price." — Exo 2 700, H1 scale. "One Fair Price" uses gradient text.
- **Subheadline:** "Our proprietary MegaBot runs OpenAI, Claude, Gemini, and Grok simultaneously. When 4 AIs agree on your item's value, you can trust the number." — Plus Jakarta Sans 400, 17px, `color: '#CBD5E1'`, `maxWidth: 640px`, centered
- **Visual:** `<img src="/images/megabot/four-engines.png"` — centered, `maxWidth: 560px`, `borderRadius: 16`, subtle glow: `boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 20px 40px rgba(0,0,0,0.3)'`, `marginTop: 48px`, `marginBottom: 48px`
- **4 engine cards** (staggered reveal, GlowCard, 2x2 grid on desktop, stack on mobile, `gap: 20px`):

  | Emoji | Engine | Role | Detail | Accent Color |
  |---|---|---|---|---|
  | 🔍 | OpenAI | Vision & Identification | Sees 48+ attributes from a single photo | `#00BCD4` (teal) |
  | 💎 | Claude | Craftsmanship & Detail | Evaluates quality, materials, and hidden value | `#8B5CF6` (purple) |
  | 📊 | Gemini | Market Intelligence | Real-time market conditions across platforms | `#F59E0B` (amber) |
  | ⚡ | Grok | Speed & Patterns | Detects pricing anomalies in milliseconds | `#94A3B8` (silver) |

  Each card has a thin left border or top accent bar in its color. Emoji at 24px. Engine name: Exo 2 600, white. Role: Plus Jakarta Sans 500, 14px, accent color. Detail: Plus Jakarta Sans 400, 14px, `#CBD5E1`.

- **Consensus bar:** Full-width bar container (dark bg `rgba(255,255,255,0.05)`, `borderRadius: 8`, `height: 12px`). Inner fill bar: teal gradient, animates width from 0% to 87% on scroll-into-view (`animation: 'consensusFill 2s ease-out forwards'`, triggered by IntersectionObserver). Label above: "87% Average AI Agreement" — Barlow Condensed 600, 16px, teal, with subtle glow text-shadow.
- **Below bar:** "Cost per 4-AI analysis: less than a cup of coffee. Margin: 85%+" — Plus Jakarta Sans 400, 14px, `color: '#94A3B8'`, centered

#### SECTION: HOW IT WORKS (id="how-it-works")
- **Eyebrow:** "THE PROCESS"
- **Headline:** "From Photo to Sold in Four Steps"
- **Vertical timeline** with teal connector line (2px wide, `background: 'rgba(0,188,212,0.3)'`, centered vertically between cards):

  | Step | Emoji | Title | Description |
  |---|---|---|---|
  | 1 | 📷 | Upload a Photo | Snap a pic. Our AI handles the rest. |
  | 2 | 🧠 | AI Analysis & Pricing | 11 bots analyze your item. 4 engines agree on price. |
  | 3 | 📣 | List & Match Buyers | One click. 13 platforms. AI finds your buyers. |
  | 4 | 📦 | Ship & Get Paid | Print a label. Ship it. Money in your account. |

  Each step: GlowCard with a numbered teal circle (Barlow Condensed 700, 20px, `background: '#00BCD4'`, `color: '#0D1117'`, `width: 40px`, `height: 40px`, `borderRadius: '50%'`). Title: Exo 2 600, 18px. Description: Plus Jakarta Sans 400, 15px, `#CBD5E1`. Stagger-revealed 80ms each.

#### SECTION: PRODUCT PREVIEW (id="product")
This section shows the REAL app to prove the product exists and is impressive.
- **Eyebrow:** "THE PRODUCT"
- **Headline:** "See It In Action" — Exo 2 700, H1 scale
- **Subheadline:** "Real screenshots from the live LegacyLoop platform. Every feature you see is built and working." — Plus Jakarta Sans 400, 17px, `#CBD5E1`
- **3 screenshot cards** in a perspective row:
  - Left card: `transform: 'perspective(1200px) rotateY(8deg) rotateX(2deg) scale(0.92)'` — `/images/screenshots/app-screenshot-01.png`
  - Center card: `transform: 'scale(1.02)'`, `zIndex: 2` — `/images/screenshots/app-screenshot-03.png`
  - Right card: `transform: 'perspective(1200px) rotateY(-8deg) rotateX(2deg) scale(0.92)'` — `/images/screenshots/app-screenshot-05.png`
  - All cards: `borderRadius: 12`, `boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3)'`, `border: '1px solid rgba(0,188,212,0.1)'`, `overflow: 'hidden'`
  - Images inside: `width: '100%'`, `display: 'block'`
  - **Mobile:** Stack vertically, remove perspective transforms, center each card
- **Valuation video** below screenshots: Use `/vintage-item-valuation.webm` in a `<video>` element (autoPlay, muted, loop, playsInline) inside a GlowCard frame. `maxWidth: 680px`, centered, `borderRadius: 16`, `marginTop: 64px`. Caption below: "Watch our AI analyze and price a vintage item in real time." — 14px, `#94A3B8`

**VERIFY:** `npx tsc --noEmit && npm run build` — must pass.

---

### PHASE 4 — AI AGENTS + PRICING + ESTATE + SOCIAL PROOF

#### SECTION: 11 AI AGENTS (id="bots")
- **Eyebrow:** "YOUR AI TEAM"
- **Headline:** "Eleven Specialized AI Agents. All Working For You." — "All Working For You" in gradient text
- **Subheadline:** "MegaBot powers them all — our 4-engine consensus system that ensures every valuation is fair." — 15px, `#94A3B8`
- **Grid:** `display: 'grid'`, `gridTemplateColumns` responsive: `repeat(3, 1fr)` on desktop (1200px+), `repeat(2, 1fr)` on tablet, `1fr` on mobile. `gap: 20px`.
- **11 bot cards** (GlowCard, staggered reveal, each card):

| # | Emoji | Name | Description | Tier Badge |
|---|---|---|---|---|
| 1 | 🔍 | AnalyzeBot | 48+ attributes from one photo | ALL TIERS |
| 2 | 📊 | PriceBot | Fair market value, regional intelligence | DIY+ |
| 3 | 📷 | PhotoBot | Photo quality scoring and tips | DIY+ |
| 4 | 📝 | ListBot | Listings for 13 platforms | DIY+ |
| 5 | 🎯 | BuyerBot | 6-12 buyer profiles before you list | DIY+ |
| 6 | 📦 | ShipBot | AI shipping analysis, carrier comparisons | DIY+ |
| 7 | 🛰️ | ReconBot | Real-time market monitoring | POWER+ |
| 8 | ⏳ | AntiqueBot | Never undersell a family heirloom | POWER+ |
| 9 | ⭐ | CollectiblesBot | Expert-level collectible analysis | POWER+ |
| 10 | 🎬 | VideoBot | AI video ads for TikTok, Reels, Shorts | POWER+ |
| 11 | 🚗 | CarBot | VIN decoding + condition grading | ESTATE |

- Emoji: 28px size, `marginBottom: 8px`
- Bot name: Exo 2 600, 17px, white
- Description: Plus Jakarta Sans 400, 14px, `color: '#CBD5E1'`, `marginTop: 4px`
- Tier badge: Barlow Condensed 600, 11px, uppercase, `letterSpacing: '0.05em'`, `padding: '3px 8px'`, `borderRadius: 4`, `marginTop: 12px`, `display: 'inline-block'`. Color-coded backgrounds:
  - "ALL TIERS" → `background: 'rgba(0,188,212,0.15)'`, `color: '#00BCD4'`
  - "DIY+" → `background: 'rgba(34,197,94,0.15)'`, `color: '#22C55E'`
  - "POWER+" → `background: 'rgba(139,92,246,0.15)'`, `color: '#8B5CF6'`
  - "ESTATE" → `background: 'rgba(251,191,36,0.15)'`, `color: '#FBBF24'`

- **MegaBot power-up callout** below the grid: A special GlowCard spanning full width with purple accent border `rgba(139,92,246,0.3)`. "🧠 MegaBot — 4-Engine Consensus Pricing" as heading, "Available as a power-up on any tier. Run OpenAI, Claude, Gemini, and Grok simultaneously on any item." as description. This makes it clear MegaBot is a feature, not a standalone bot.

#### SECTION: PRICING (id="pricing")
- **Eyebrow:** "SIMPLE HONEST PRICING"
- **Headline:** "Simple, Honest Pricing"
- **Subheadline:** "Processing fees are transparent on every transaction. Never hidden." — 17px, `#CBD5E1`
- **4 tier cards** in a row (`display: 'grid'`, `gridTemplateColumns: 'repeat(4, 1fr)'` desktop, `repeat(2, 1fr)` tablet, `1fr` mobile, `gap: 20px`):

| Tier | Monthly | Commission | Items | Bots Access | CTA |
|---|---|---|---|---|---|
| FREE | $0/mo | 12% commission | 3 items | AnalyzeBot only | "Get Started Free" |
| DIY SELLER | ~~$20~~ **$10/mo** | 8% commission | 25 items | +PriceBot +PhotoBot +ListBot +BuyerBot +ShipBot | "Start Selling" |
| POWER SELLER | ~~$49~~ **$25/mo** | 5% commission | 100 items | +ReconBot +AntiqueBot +CollectiblesBot +VideoBot | "Go Pro" |
| ESTATE MANAGER | ~~$99~~ **$75/mo** | 4% commission | Unlimited | ALL 11 bots + CarBot | "Manage Estates" |

  **DIY SELLER card is highlighted:** `transform: 'scale(1.03)'`, brighter border `rgba(0,188,212,0.4)`, "MOST POPULAR" badge at top (Barlow Condensed 600, 10px, uppercase, teal bg, dark text, `padding: '4px 12px'`, `borderRadius: '0 0 8px 8px'`, positioned at top center of card).

  Card layout per tier:
  - Tier name: Exo 2 600, 16px, uppercase, `letterSpacing: '0.05em'`
  - Struck-through original price: `<s>` tag, `color: '#6B7280'`, 14px
  - Active price: Barlow Condensed 700, `fontSize: 36px`, gradient text. "/mo" suffix in 14px, `#94A3B8`
  - Commission: Barlow Condensed 600, badge style, `background: 'rgba(0,188,212,0.1)'`, teal text
  - Item limit: Plus Jakarta Sans 400, 14px, `#CBD5E1`
  - Bot list: Plus Jakarta Sans 400, 13px, `#94A3B8`, each bot on its own line with checkmark ✓
  - CTA button: full-width, teal gradient (primary tiers) or ghost border (free tier), `minHeight: 44px`, `borderRadius: 12` → all link to `https://app.legacy-loop.com/signup`

- **Credit packs row** below cards: Centered, `marginTop: 40px`. "AI Credit Packs:" label then: "$25 / 30 credits • $50 / 65 credits • $100 / 140 credits • $200 / 300 credits" — Plus Jakarta Sans 400, 14px, `color: '#94A3B8'`
- **Footer note:** "First AI analysis is always free. 10 free credits when you sign up." — centered, 14px, `color: '#94A3B8'`, `marginTop: 16px`

#### SECTION: BUILT FOR ESTATES (warm amber tone shift)
This section must feel like walking into a gallery. Slower pace. More whitespace. Warm.
- Background: add warm amber atmospheric tint. Use `/images/estate/generations-hands.png` as `backgroundImage` at `opacity: 0.06`, `backgroundSize: 'cover'`, `backgroundPosition: 'center'`, with a dark overlay gradient on top to maintain readability.
- **Eyebrow:** "FOR FAMILIES" — Barlow Condensed, amber `#D4A017`
- **Headline:** "Selling Should Not Add to the Grief." — Exo 2 700, H1 scale, white
- **Body:** "When a loved one passes, families face an overwhelming task — hundreds of items, emotional weight, and no idea what anything is worth. LegacyLoop was built for this moment." — Plus Jakarta Sans 400, 17px, `color: '#CBD5E1'`, `maxWidth: 640px`, `lineHeight: 1.75`
- **4 amber-tinted GlowCards** (border tint shifts to `rgba(212,160,23,0.2)` default, `rgba(212,160,23,0.4)` on hover, 2x2 grid):
  - 🏺 "Antique detection that prevents underselling heirlooms"
  - 🌐 "Post your entire estate to 13 platforms in one click"
  - 💬 "AI Messaging Agent handles buyer conversations for you"
  - 🤝 "White-glove service available for full estate liquidation"
- **Image:** `/images/estate/senior-tablet.png` — on desktop, `float` right or use a 2-column layout (text left, image right). Image: `maxWidth: 420px`, `borderRadius: 16`, subtle warm shadow. On mobile: full width below text.

#### SECTION: SOCIAL PROOF / EARLY ACCESS
- **AnimatedStat (Effect 10):** `47` | "Beta signups and counting" — big number, centered
- **Progress bar:** "Pre-Launch Pricing: 47 of 100 early access spots remaining" — visual bar container (dark bg, `borderRadius: 8`, `height: 8px`), teal fill at 47%, `maxWidth: 400px`, centered. Text above bar: Plus Jakarta Sans 500, 14px.
- **Tagline:** "Built in Maine. Serving America." — Exo 2 600, 18px, centered, `marginTop: 32px`
- **Heroes Discount badge:** GlowCard with green accent border `rgba(34,197,94,0.3)`. "🎖️ 25% off for veterans and first responders" — Plus Jakarta Sans 500, 16px. This is a real offer — display it prominently.

**VERIFY:** `npx tsc --noEmit && npm run build` — must pass.

---

### PHASE 5 — TECH + INVESTORS + FOOTER + FINAL POLISH

#### SECTION: TECHNOLOGY CREDIBILITY
- Background: use `/images/ai/network-nodes.png` at `opacity: 0.05` as section bg, `backgroundSize: 'cover'`, dark overlay
- **Eyebrow:** "THE INFRASTRUCTURE"
- **Headline:** "Enterprise-Grade. Built to Scale."
- **4 mini GlowCards** (2x2 grid, staggered):
  - ⚡ **Next.js** — "React framework trusted by Netflix, TikTok, Notion"
  - 🔷 **TypeScript** — "300+ routes. Zero type errors. Type-safe end to end."
  - 🤖 **Real AI APIs** — "Every analysis is live AI. No fake data. No demos."
  - 📦 **Shippo** — "Real carrier rates. Real labels. USPS, UPS, FedEx."
- **ScrollRevealText (Effect 7):** "5 revenue streams. 85%+ margins on AI credits. Built for scale from day one." — Exo 2 600, H2 scale, centered, gradient text

#### SECTION: INVESTOR RELATIONS (id="investors")
- **Eyebrow:** "PARTNER WITH US"
- **Headline:** "We're Raising $50K–$150K in Seed Funding" — Exo 2 700, H1 scale
- **Body:** "LegacyLoop is positioned to become the infrastructure layer of the resale economy. We're raising to scale from beta to national launch." — Plus Jakarta Sans 400, 17px, `#CBD5E1`, `maxWidth: 640px`, centered
- **5 stat cards** in a responsive row (staggered reveal, GlowCards):
  - "$48B Market" | "85%+ Margins" | "5 Revenue Streams" | "11 AI Agents" | "13 Platforms"
  - Stat value: Barlow Condensed 700, 28px, gradient text. Label below: Plus Jakarta Sans 400, 13px, `#94A3B8`
- **CTA:** "Request Our Pitch Deck" — MAGNETIC button (Effect 8), large size, teal gradient, glow, Exo 2 600, 18px, `padding: '18px 48px'` → `mailto:ryan@legacy-loop.com?subject=LegacyLoop%20Investor%20Inquiry`
- **Below CTA:** "Or email us directly: ryan@legacy-loop.com" — Plus Jakarta Sans 400, 14px, `color: '#94A3B8'`, `marginTop: 16px`

#### FOOTER
- `borderTop: '1px solid rgba(0,188,212,0.08)'`, `padding: '64px 32px 32px'`, `background: 'rgba(0,0,0,0.3)'`
- Content: `maxWidth: 1080px`, `margin: '0 auto'`
- **3-column layout** (flex row desktop, stack mobile):
  - **Left column:**
    - Logo: `<img src="/logos/LegacyLoop-Logo-Master-03.png"` at `maxWidth: 180px`, `objectFit: 'contain'`
    - Tagline below: "CONNECTING GENERATIONS" — Barlow Condensed 600, 12px, `letterSpacing: '4px'`, `color: '#94A3B8'`, `marginTop: 12px`
  - **Center column:** Navigation links — How It Works | AI Agents | Pricing | Investors | Login — Plus Jakarta Sans 400, 14px, `color: '#94A3B8'`, hover `#fff`. Each on its own line, `lineHeight: 2`. Links smooth-scroll to sections (Login goes to `https://app.legacy-loop.com/login`).
  - **Right column:**
    - "Contact: support@legacy-loop.com" — Plus Jakarta Sans 400, 14px, `color: '#94A3B8'`
    - "Investors: ryan@legacy-loop.com" — `marginTop: 8px`
- **Bottom bar:** `borderTop: '1px solid rgba(0,188,212,0.05)'`, `marginTop: 48px`, `paddingTop: 24px`, flex row, `justifyContent: 'space-between'`, wrap on mobile
  - Left: "© 2026 LegacyLoop LLC. All rights reserved." — 13px, `#6B7280`
  - Center: "Built with heart in Maine." — 13px, `#6B7280`
  - Right: "Privacy Policy" | "Terms of Service" — 13px, `#6B7280`, `href="#"` (placeholder for now — this is the ONE exception to the no-placeholder rule, because legal pages are separate)

#### FINAL POLISH CHECKLIST (do all of these before reporting done)

1. **Smooth anchor scroll** for ALL nav links and internal CTAs — use `scrollIntoView({ behavior: 'smooth' })`
2. **Section IDs** match nav targets: `hero`, `how-it-works`, `megabot`, `bots`, `pricing`, `product`, `investors`
3. **Video hero** uses `<video>` with WebM primary + MP4 fallback. `autoPlay muted loop playsInline`. If video doesn't load, gradient background shows gracefully.
4. **Mobile responsive** (test mentally at 375px, 768px, 1024px, 1440px):
   - All grids collapse to single column on mobile
   - Nav simplifies (logo + CTA only below 768px)
   - Hero text scales with clamp()
   - Cards stack vertically with full-width
   - Minimum tap targets 44px on all interactive elements
   - No horizontal overflow anywhere
5. **Every image** has descriptive `alt` text
6. **Every icon-only button** has `aria-label`
7. **The `<main>` tag** wraps all content sections
8. **Console:** Zero errors, zero warnings related to our code
9. **Graceful image fallbacks:** If any image fails to load, the section still looks good (dark bg shows through, no broken image icons). Use `onError` handlers to hide broken images.

**VERIFY:** `npx tsc --noEmit && npm run build` — must pass with ZERO errors.

---

## COPY STANDARDS

- **Pre-revenue, demo-ready.** NEVER claim traction we don't have.
- **Allowed:** "47 beta signups" | "Early Access" | "Join the first 100" | "Pre-Launch Pricing"
- **Estate sections:** warm, empathetic, human. Slower pace. More whitespace. Amber tones. Dignified language.
- **Tech sections:** precise, confident, intelligent. No hype. No buzzwords.
- **Investor section:** factual, credible, backed by real numbers from the app. No speculation.
- **Throughout:** Simple, clear English. Short sentences. Active voice. Every word earns its place.

---

## COMPLETION CHECKLIST

After all 5 phases are done, verify every single item:

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` completes successfully
- [ ] `app/landing/page.tsx` is the ONLY file created or modified
- [ ] No Tailwind classes anywhere in the file
- [ ] No className used for styling (only for font variable injection from layout)
- [ ] All `<img>` tags reference files that exist in `/public/` — verified against the asset list above
- [ ] All CTAs link to correct URLs:
  - [ ] Login → `https://app.legacy-loop.com/login`
  - [ ] All signup CTAs → `https://app.legacy-loop.com/signup`
  - [ ] Investor CTA → `mailto:ryan@legacy-loop.com?subject=LegacyLoop%20Investor%20Inquiry`
  - [ ] `support@legacy-loop.com` in footer
  - [ ] `ryan@legacy-loop.com` in investor section and footer
- [ ] Responsive at 375px, 768px, 1024px, 1440px — no overflow, no broken layouts
- [ ] `prefers-reduced-motion` respected (CSS handles keyframes, framer-motion checks media query)
- [ ] All 11 bots listed with correct names, correct descriptions, correct tier badges
- [ ] 13 platforms in ticker (eBay, Mercari, Poshmark, OfferUp, Etsy, Facebook Marketplace, Craigslist, Instagram, Amazon, TikTok Shop, Reverb, Pinterest, Depop)
- [ ] Pricing exact: Free $0/12%, DIY ~~$20~~ $10/8%, Power ~~$49~~ $25/5%, Estate ~~$99~~ $75/4%
- [ ] Credit packs exact: $25/30cr, $50/65cr, $100/140cr, $200/300cr
- [ ] "First AI analysis is always free. 10 free credits when you sign up."
- [ ] No fake traction claims anywhere
- [ ] No placeholder text anywhere (except Privacy/Terms href="#")
- [ ] No broken images — all paths verified
- [ ] All fonts use CSS variables from layout
- [ ] Logo files used correctly: Master-04 (nav), Master-03 (hero + footer), Master-01 (standalone/preloader)
- [ ] Videos load and loop (hero bg + valuation demo)
- [ ] Screenshots displayed as angled device frames in product section
- [ ] Custom cursor works on desktop, hidden on touch devices
- [ ] Preloader shows on first load and fades cleanly

Report completion of each phase with build verification before proceeding to the next. When all 5 phases pass — report "BUILD COMPLETE" with the full checklist results.
