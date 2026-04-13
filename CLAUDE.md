# ════════════════════════════════════════════════════════════════
# LEGACYLOOP LANDING SITE — CLAUDE CODE SKILL PACK
# Read every session. Non-negotiable. This is law.
# ════════════════════════════════════════════════════════════════

@AGENTS.md

## WHO WE ARE

LegacyLoop is an AI-powered resale automation platform.
Mission: "Connecting Generations" — never misspell, never alter.
Landing: legacy-loop.com | App: app.legacy-loop.com
Company: Legacy-Loop Tech LLC
Founder: Ryan Hallee — sole decision-maker and final QA authority.
Standard: Awwwards.com submission-ready. Non-negotiable.

---

## ═══════════════════════════════════════════
## SECTION 1: NON-NEGOTIABLE PROCESS RULES
## ═══════════════════════════════════════════

1. **DIAGNOSTIC BEFORE EVERY BUILD.**
   Read the exact files before touching them. Never build blind.

2. **tsc --noEmit BEFORE AND AFTER every change.** 0 errors.

3. **npm run build must PASS before any commit.**

4. **V15 REPORT at end of EVERY command.** Even if not asked.

5. **PRESERVE what works.** Never rewrite working animations.
   This landing page is 5,936 lines of hand-tuned animation code.
   If something renders correctly, DO NOT TOUCH IT.

6. **One focused scope per command.** Never expand uninvited.

7. **Read Next.js 16 docs before writing code.**
   `node_modules/next/dist/docs/` — this version has breaking changes
   from your training data. Always check docs first.

---

## ═══════════════════════════════════════════
## SECTION 2: TECH STACK — EXACT VERSIONS
## ═══════════════════════════════════════════

| Layer       | Technology             | Version |
|-------------|------------------------|---------|
| Framework   | Next.js                | 16.2.1  |
| UI          | React                  | 19.2.4  |
| Language    | TypeScript             | 5.x     |
| Animation   | Framer Motion          | 12.38.0 |
| Scroll      | Lenis                  | 1.3.21  |
| QR Codes    | qrcode.react           | 4.2.0   |
| Hosting     | Vercel                 | auto    |
| Styling     | Inline style={{}} + CSS custom properties | N/A |

**NO Tailwind CSS.** NO CSS modules (except unused legacy file).
**NO component library.** All components are inline, single-file.
**NO API layer.** This is a frontend-only static site.
**NO database.** No backend. No auth. Pure marketing site.

### Build Commands
```
npm run dev     # Local development
npm run build   # Next.js build
npm run start   # Production server
npm run lint    # ESLint
tsc --noEmit    # Type check
```

---

## ═══════════════════════════════════════════
## SECTION 3: DESIGN SYSTEM — LOCKED
## ═══════════════════════════════════════════

### Colors (globals.css custom properties)
```
--bg-primary:     #0D1117
--bg-secondary:   #161B22
--accent:         #00BCD4
--accent-bright:  #22D3EE
--accent-deep:    #0097A7
--estate-warm:    #D4AF37
--megabot:        #8B5CF6
--success:        #22C55E
--warning:        #F59E0B
--error:          #EF4444
--text-primary:   #F0F6FC
--text-secondary: #8B949E
--text-muted:     #484F58
```

### Typography (loaded in layout.tsx via next/font/google)
```
--font-heading: Exo 2          (400, 500, 600, 700, 800)
--font-body:    Plus Jakarta Sans  (400, 500, 600, 700)
--font-data:    Barlow Condensed   (300, 400, 500, 600, 700, 800)
```

### Styling Rules — CRITICAL
- **ALL styling: inline style={{}} objects.** No className for visual styling.
- CSS custom properties for colors/fonts via var().
- globals.css: ONLY @keyframes and CSS custom properties. Nothing else.
- Framer Motion for scroll-linked animations.
- Responsive: clamp() for font sizes, CSS Grid, media queries.
- Breakpoints: max-width 600px (mobile), pointer queries for touch.

### Logo Rules
- UNTOUCHABLE. Never modify any logo asset.
- Logos at /public/logos/ — 29 variants.
- Ryan handles all logo work.

---

## ═══════════════════════════════════════════
## SECTION 4: SITE ARCHITECTURE — 5 ROUTES
## ═══════════════════════════════════════════

```
/                — Redirects to /landing
/landing         — Main landing page (5,936 lines)
/privacy         — Privacy policy (228 lines)
/terms           — Terms of service (220 lines)
/investors       — Investor relations page (179 lines)
```

### Landing Page Sections (in order)
1. HeroSection — Video background, headline, CTA, scroll indicator
2. MarketplaceTicker — Scrolling platform name ticker
3. MarketOpportunitySection — $48B market stats
4. MegaBotSection — 4-AI consensus engine showcase
5. HowItWorksSection — Photo → AI → List → Sell flow
6. ShippingCenterSection — AI shipping feature
7. ProductPreviewSection — Dashboard preview
8. AIAgentsSection — 10 AI bots showcase
9. PricingSection — Tier pricing table
10. EstateSection — Estate sales messaging
11. SocialProofSection — Testimonials
12. TechSection — Integration stack
13. VideoShowcaseSection — Video gallery
14. AppDownloadSection — Mobile download CTA
15. WaitlistSection — Email signup
16. FinalCTASection — "Join the Movement"
17. Footer — Links and legal

---

## ═══════════════════════════════════════════
## SECTION 5: COMPONENT ARCHITECTURE
## ═══════════════════════════════════════════

ALL components are inline in page.tsx files. No /components/ folder.

### Foundation Components (non-visual)
- Preloader — CSS fallback + JS state (4-5s iOS failsafe)
- CustomCursor — Desktop-only (pointer: fine)
- GradientBackground — Animated gradient orbs
- NoiseOverlay — Texture overlay

### Custom Hooks
- useScrollY — Scroll position tracker
- useWindowWidth — Viewport width
- useSectionPadding — Responsive padding
- useReducedMotion — Accessibility check

### Utility Components
- AutoPlayVideo — Self-playing with fallback
- GlowCard — Scroll-reveal with glow
- MagneticButton — Mouse-tracking button
- CharReveal — Character stagger animation
- ScrollRevealText — Text reveal on scroll
- AnimatedStat — Number counter (IntersectionObserver)
- TiltCard — 3D mouse tilt effect
- SectionEyebrow — Uppercase section label
- SectionHeading — Animated section title
- GradientText — Gradient text styling

### Navigation
- StickyNav — Fixed nav with scroll state
- SectionNavigator — Section progress dots

---

## ═══════════════════════════════════════════
## SECTION 6: ANIMATION SYSTEM
## ═══════════════════════════════════════════

### CRITICAL: iPad/Touch Device Hardening
The landing page has AGGRESSIVE fallbacks for iPad Safari:
- CSS nuclear fallback: forces animations visible when JS fails
- Framer Motion: cancels stuck WAAPI animations
- Preloader: 4-5s timeout failsafe
- Reduced motion: full support via media query + hook

### @keyframes (defined in globals.css)
```
float1, float2, float3     — Floating orb animations
ticker                      — Marketplace ticker scroll
scrollBounce                — Scroll indicator bounce
shimmer                     — Loading shimmer
borderSpin                  — Border rotation
pulseGlow                   — Glow pulse
consensusFill               — MegaBot consensus bar fill
preloaderFallback           — iOS preloader fallback
pulse, fadeScaleIn, spin    — General utilities
glowCardReveal              — Card entrance
```

### Animation Libraries
- Framer Motion v12: useScroll, useTransform, useInView, motion.*
- Lenis: Smooth scroll (initialized in landing/page.tsx)
- CSS transitions: Non-critical hover/focus animations

### Performance Rules
- Never block main thread with animation JS
- Use will-change sparingly (only on actively animating elements)
- Prefer CSS transforms over layout-triggering properties
- Test on real iPad before shipping animation changes

---

## ═══════════════════════════════════════════
## SECTION 7: KEY FILES — READ BEFORE TOUCHING
## ═══════════════════════════════════════════

```
app/layout.tsx           — Metadata, 3 Google Fonts, PWA, favicons
app/globals.css          — ALL @keyframes + CSS custom properties
app/landing/page.tsx     — ENTIRE landing page (5,936 lines — READ ALL)
app/privacy/page.tsx     — Privacy policy
app/terms/page.tsx       — Terms of service
app/investors/page.tsx   — Investor relations + QR codes
next.config.ts           — Minimal config (currently empty object)
```

### Public Assets
```
/public/logos/           — 29 logo variants (NEVER TOUCH)
/public/images/          — Screenshots, feature graphics, brand images
/public/icons/           — PWA icons (192px, 512px)
/public/manifest.json    — PWA manifest
/public/*.mp4, *.webm    — Hero video, valuation demo video
```

### Design Documentation
```
/public/LegacyLoop_Landing_Page_Master_Handoff.md — 41KB design spec
```
Read this handoff doc before making ANY design decisions.

---

## ═══════════════════════════════════════════
## SECTION 8: LOCKED FILES — NEVER MODIFY
## ═══════════════════════════════════════════

```
public/logos/            — All logo assets
public/manifest.json     — PWA manifest
public/*.mp4, *.webm     — Video assets
app/globals.css          — Modify ONLY with explicit approval
```

---

## ═══════════════════════════════════════════
## SECTION 9: PERFORMANCE & SEO
## ═══════════════════════════════════════════

### Core Web Vitals Targets
- LCP: < 2.5s (hero video must not block)
- FID: < 100ms
- CLS: < 0.1 (no layout shifts from lazy-loaded content)
- Lighthouse: 90+ on all categories

### SEO (configured in layout.tsx)
- OpenGraph: title, description, type, url
- Twitter card meta tags
- Apple mobile web app capable
- Theme color: #00BCD4
- Structured data where applicable

### Video Optimization
- Hero video: mp4 + webm formats (dual-source for browser compat)
- Autoplay: muted, inline, playsinline (required for mobile)
- Fallback: static image if video fails to load

---

## ═══════════════════════════════════════════
## SECTION 10: ACCESSIBILITY — SENIOR-FRIENDLY
## ═══════════════════════════════════════════

LegacyLoop's primary audience includes seniors. Accessibility is mandatory.

- WCAG 2.1 AA minimum on all elements
- Color contrast: 4.5:1 normal text, 3:1 large text
- Touch targets: 44px minimum
- Font sizes: never below 14px body text
- Reduced motion: prefers-reduced-motion respected everywhere
- Focus indicators: visible on all interactive elements
- Keyboard navigation: all features accessible without mouse
- Screen reader: semantic HTML, ARIA labels on icons/buttons
- iPad: all content visible and interactive regardless of animation state

---

## ═══════════════════════════════════════════
## SECTION 11: GIT & V15 REPORT
## ═══════════════════════════════════════════

### Commit Format
```
CMD-[NAME]: [what changed]
```

### V15 Report (required on every command)
```
┌──────────────────────────────────────────────────┐
│  [CMD-NAME] V15 REPORT                           │
│  [Date] | V15                                    │
├──────────────────────────────────────────────────┤
│  CHECKPOINT BEFORE: tsc=0, build=PASS            │
│  CHECKPOINT AFTER:  tsc=0, build=PASS            │
├──────────────────────────────────────────────────┤
│  DIAGNOSTIC: [what was read]                     │
│  CHANGES: [file | what changed | why]            │
│  LOCKED FILES: UNTOUCHED                         │
├──────────────────────────────────────────────────┤
│  FLAGS                                           │
│  Gaps / Risks / Suggestions                      │
├──────────────────────────────────────────────────┤
│  tsc: 0 | build: PASS | Commit: [hash]          │
└──────────────────────────────────────────────────┘
```

---

# ════════════════════════════════════════════════════════════════
# END OF CLAUDE.md — LEGACY-LOOP LANDING SKILL PACK
# ════════════════════════════════════════════════════════════════
