# LEGACYLOOP — MASTER LANDING PAGE HANDOFF
## Complete Passoff: Claude Cowork → Claude Code
### Version 1.0 | March 31, 2026 | Ryan Hallee, Founder | CONFIDENTIAL

---

# PART 1 — CLAUDE COWORK PROMPT
## Paste This As Your First Message In Claude Cowork

---

You are my dedicated senior build partner and diagnostic specialist for LegacyLoop.

Your job in this session is to:
1. Read every file I have
2. Cross-reference everything
3. Find every gap
4. Fill what you can, flag what needs human action
5. Write the perfect Claude Code build command at the end

Do NOT skip any step. Do NOT assume anything. Read everything first.

---

## WHO I AM

Ryan Hallee, founder of LegacyLoop. Maine, USA.
Pre-revenue, demo-ready, seeking $50K–$150K seed investment.
Primary investor target: Dr. Clark.
The landing page must be investor-ready, launch-ready, and visually world-class.

---

## WHAT LEGACYLOOP IS

LegacyLoop is an AI-powered resale automation platform.
Mission: "Connecting Generations."
It serves two audiences:
1. Estate & Senior Path — seniors and families managing estate sales, life transitions, inherited items
2. Garage & Yard Sale Path — everyday households, movers, declutterers

The platform uses 4 AI engines (OpenAI GPT-4o, Anthropic Claude, Google Gemini, xAI Grok) running in parallel through a MegaBot consensus system to analyze items, generate listings for 14+ platforms, match buyers, automate negotiations, and handle shipping.

---

## FOLDERS TO READ — IN THIS EXACT ORDER

### FOLDER 1 — THE APP (Source of Truth for All Product Details)
Path: `/Users/ryanhallee/Desktop/Legacy-Loop-MVP`

Read everything. Specifically find and note:
- Every pricing tier: name, price range, commission %, item limit, photo limit
- Every credit pack: price and credit amount
- Every bot name, description, and tier it's available on
- Every add-on service: name, credit cost, status (working/coming soon)
- Every route in the app
- The exact URL structure for login and signup pages
- The app's color system and design tokens
- DEMO_MODE behavior
- The MegaBot system and how 4 AIs run in parallel
- The AI Messaging Agent (P5 — 3-panel inbox)
- The Shipping Center structure
- The Publish Hub and 14+ platform connections
- The Antique Alert system
- The Bundle Sale Engine
- The Financial Fairness Engine (commission rates per tier)

### FOLDER 2 — LANDING PAGE PLANNING DOCUMENTS
Path: `/Users/ryanhallee/Desktop/Legacy-Loop/Landing Page`

Read all subfolders:
- `Legacy-Loop Company Template Design Branding` — brand guidelines
- `Mission Vision` — the mission and vision documents
- `Logos` — all logo files (these are the ONLY logos to use — never generate or approximate)
- `Pictures & Videos for Landing Page` — all images and videos
- `Source Code` — all reference code and Awwwards research
- `App ScreenShots For Website` — 50+ app screenshots captured from the live app
- `Planning` — all planning documents
- `Legal` — legal documents

Key files to read carefully:
- `LEGACYLOOP_Awwwards_Landing_Master.md` — THE build specification. All 15 sections. All 5 phases. All copy. All effects.
- `LEGACYLOOP_Complete_Master_Code.md` — ALL pre-written component code. Lenis, magnetic buttons, scroll reveal, stagger cards, custom cursor, noise overlay, preloader, gradient orbs. Everything.
- `LEGACYLOOP_Real_Source_Code.md` — Reference implementations from real Awwwards sites with verified GitHub sources.
- All passoff documents (v5 is most current)
- UI Master Reference
- Brand Quick Reference
- Color Palette Reference
- Font Recommendations

### FOLDER 3 — THE LANDING PAGE PROJECT
Path: `/Users/ryanhallee/Desktop/legacy-loop-landing`

Check:
- Confirm `framer-motion` is installed (check package.json)
- Confirm `lenis` is installed (check package.json)
- Confirm `@studio-freight/lenis` is installed (check package.json)
- Confirm Next.js 16 with App Router is configured
- Confirm TypeScript is configured
- Confirm NO Tailwind (should not be in package.json or any config)
- List all files currently in `/public/`
- List all files currently in `/public/logos/`
- List all files currently in `/public/images/`
- List all files currently in `/public/images/hero/`
- List all files currently in `/public/images/paths/`
- List all files currently in `/public/images/features/`
- List all files currently in `/public/images/screenshots/`
- List all files currently in `/public/images/mission/`

---

## CROSS-REFERENCE CHECKLIST

After reading all folders, cross-reference these specifically:

### PRICING — Verify Every Number
The landing page must match the app exactly:

| Tier | Price | Commission | Items | Bots |
|------|-------|-----------|-------|------|
| Free | $0/mo | 12% | 3 | AnalyzeBot only |
| DIY Seller | $10–$20/mo (show as ~~$20~~ $10) | 8% | 25 | +4 bots |
| Power Seller | $25–$49/mo (show as ~~$49~~ $25) | 5% | 100 | +3 specialty bots |
| Estate Manager | $75–$99/mo (show as ~~$99~~ $75) | 4% | Unlimited | ALL 9 bots |

Credit Packs:
- $25 = 30 credits
- $50 = 65 credits
- $100 = 140 credits
- $200 = 300 credits

Fee model: 3.5% total — split 1.75% buyer + 1.75% seller
First AI analysis always free. 10 free credits on signup.

### BOT NAMES — Verify Every Name and Description
1. 🔍 AnalyzeBot — 48+ attributes from one photo — ALL TIERS
2. 📊 PriceBot — Fair market value, regional intelligence — DIY+
3. 📷 PhotoBot — Photo quality scoring and tips — DIY+
4. 📝 ListBot — Listings for 14+ platforms simultaneously — DIY+
5. 🎯 BuyerBot — 6-12 buyer profiles before you list — DIY+
6. 🛰️ ReconBot — Real-time market monitoring — POWER+
7. ⏳ AntiqueBot — Never undersell a family heirloom — POWER+
8. ⭐ CollectiblesBot — Expert-level collectible analysis — POWER+
9. 🚗 CarBot — VIN decoding + condition grading — ESTATE MANAGER

### ADD-ON SERVICES — Verify Credit Costs
- AI Listing Optimizer — 10 credits — WORKING
- Buyer Outreach Blast — 8 credits — WORKING
- AI Market Intelligence Report — 15 credits — WORKING
- MegaBot Analysis — 5 credits — WORKING
- Expert Appraisal — 15 credits — COMING SOON
- Text Story — 5 credits — COMING SOON
- Audio Story — 10 credits — COMING SOON
- Video Story — 15 credits — COMING SOON
- Priority Processing — 10 credits — COMING SOON
- Inventory Report PDF — 20 credits — COMING SOON
- Print Story Book — 50 credits — PREMIUM
- Legacy Archive USB — 30 credits — PREMIUM
- White Glove Coordination — 100 credits — ESTATE MANAGER

### PLATFORM CONNECTIONS — Verify Count
The landing page claims 14+ platforms. Verify this count is accurate against the app.

### AI ENGINES — Verify Names
OpenAI GPT-4o | Anthropic Claude | Google Gemini | xAI Grok

---

## ASSET INVENTORY

Check what exists vs what is needed:

### VIDEOS (Should be in /public/ or Landing Page folder)
- [ ] hero-loop.mp4 — logo animation video, H.264, no audio
- [ ] hero-loop.webm — logo animation video, VP9, no audio
- [ ] vintage-item-valuation.mp4 — vintage item video, H.264, no audio
- [ ] vintage-item-valuation.webm — vintage item video, VP9, no audio

### LOGOS (Should be in /public/logos/)
Files from `/Users/ryanhallee/Desktop/Legacy-Loop/Landing Page/Logos`:
- [ ] LegacyLoop-Logo-Master-01.png — teal mark only
- [ ] LegacyLoop-Logo-Master-02.png — teal mark, more canvas
- [ ] LegacyLoop-Logo-Master-03.png — full stacked lockup (mark + wordmark + tagline)
- [ ] LegacyLoop-Logo-Master-04.png — horizontal lockup with circle ring
- [ ] LegacyLoop-Logo-Master-05.png — teal mark, tightest crop
- [ ] LegacyLoop-Logo-Master-06.png — Facebook banner format
- [ ] White version with transparent background — NEEDED for nav bar

### IMAGES (Should be in /public/images/)
All generated in Google ImageFX (Imagen 3) / Leonardo AI / Google VideoFX.
These are for BACKGROUNDS and DESIGN EFFECTS only.
The actual LegacyLoop logo is always placed in code on top — never baked into AI images.

Check what exists in Pictures & Videos folder and report:
- 3D sculpture renders (_A_hyper-realistic_3D files)
- Teal light energy renders (_A_single_glowing files)
- Cinematic background renders (_Vast_deep_dark files)
- Estate/antique item photos (_A_beautifully_lit, _Interior_of_a files)
- Documentary/emotional photos (_Documentary-style files)
- Gemini generated images (Gemini_Generated_Image files)
- Veo video frames (_Begin_with_this, _Take_this files)

### APP SCREENSHOTS (In /App ScreenShots For Website/)
Ryan captured 50+ screenshots. List what categories exist:
- Dashboard views
- Bot result screens
- Messaging agent views
- Listing generator views
- Pricing/subscription pages
- Other screens

---

## CRITICAL RULES — NEVER VIOLATE

1. ALL styles use inline style={{}} ONLY — NO Tailwind, NO external CSS, NO className for styling
2. The only CSS file is globals.css — only for @keyframes and CSS variables
3. NEVER generate, approximate, or recreate the LegacyLoop logo programmatically
4. ONLY use logo files from /public/logos/ — exact PNGs
5. AI-generated images are BACKGROUNDS only — logo is always a separate code layer on top
6. NEVER claim revenue or users we don't have — use "Early Access", "Join the first 100", "Pre-Launch"
7. framer-motion and lenis are the ONLY animation libraries — no GSAP, no other libraries
8. The landing page file is app/landing/page.tsx — do NOT touch app/page.tsx
9. Build in 5 phases — verify TypeScript after each phase before proceeding
10. prefers-reduced-motion must be respected — disable all animations when set

---

## DESIGN SYSTEM — LOCKED

### Colors
```
Background: #0D1117 (base) → gradient to #1A1F2E
Primary accent: #00BCD4 (teal)
Deep accent: #009688
CTA gradient: linear-gradient(135deg, #00BCD4, #009688)
Card background: rgba(255,255,255,0.03)
Card border: 1px solid rgba(0,188,212,0.15)
Text primary: #FFFFFF
Text secondary: #B0B8C4
Text muted: #6B7280
Success/earnings: #4CAF50
Warning/stale: #FF9800
Error/urgent: #EF5350
Antique/premium: #F5A623
Estate warm accent: #D4A017
AI/MegaBot: #8B5CF6
```

### Typography
```
Display/Hero: Exo 2, weight 700-800, 56-72px
H1: Exo 2, 700, 40-48px
H2: Exo 2, 700, 28-34px
Body Large: Plus Jakarta Sans, 400, 17-18px, line-height 1.65
Body: Plus Jakarta Sans, 400, 15-16px
Labels: Plus Jakarta Sans, 500, 13-14px
Badges: Barlow Condensed, 600, 11-13px
Metrics: Barlow Condensed, 700, 28-48px
Tagline: Barlow Condensed, 600, letter-spacing 4px, uppercase
Body minimum: 17px (senior accessibility — non-negotiable)
```

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
```

### Cards
```
Background: rgba(255,255,255,0.03)
Backdrop filter: blur(12px)
Border: 1px solid rgba(0,188,212,0.15)
Border radius: 16px
Hover: border rgba(0,188,212,0.5), translateY(-4px), glow shadow
Transition: cubic-bezier(0.23, 1, 0.32, 1)
```

### Buttons
```
Primary: linear-gradient(135deg, #00BCD4, #009688), white text, borderRadius 12px
Shadow: 0 0 30px rgba(0,188,212,0.3)
Min height: 44px (senior touch target)
Hover: translateY(-1px), expanded shadow
Active: scale(0.98)
```

---

## AESTHETIC STANDARD

Tesla center console meets Christie's auction house online.
Premium. Intelligent. Dignified. Clear.

Reference stack:
- Linear (linear.app) — dark SaaS gold standard
- Stripe Dashboard — financial clarity
- Vercel Dashboard — deployment pipeline
- Grok by xAI — dark AI interface
- Perplexity AI — structured AI output
- Superhuman — premium inbox
- SpaceX — technical precision

Two emotional registers that coexist:
- High-tech/Intelligent: teal, dark slate, glassmorphism, precision, speed
- Warm/Dignified: estate sections use amber tones, softer copy, more breathing room

QA Standard: Ask before shipping any section:
1. Would Dr. Clark (investor) immediately understand what this company does?
2. Would a 70-year-old estate seller know exactly what to do?
If no to either — rebuild it.

---

## THE 12 AWWWARDS EFFECTS — ALL REQUIRED

Every one of these must be implemented. Code exists in LEGACYLOOP_Complete_Master_Code.md:

1. **Lenis Smooth Scroll** — physics-based, duration 1.2, exponential easing
2. **Word-by-Word Scroll Opacity Reveal** — Framer Motion useScroll + useTransform
3. **Magnetic CTA Button** — cursor pull 35% strength, cubic-bezier spring return
4. **Staggered Card Reveal** — IntersectionObserver, index * 80ms delay, translateY(32px) → 0
5. **Custom Cursor with Blend Mode** — white circle, mixBlendMode: difference, smoothed position
6. **Page Preloader** — 1200ms, LegacyLoop wordmark in teal, loading bar, AnimatePresence fade out
7. **Animated Gradient Orbs** — 3 orbs position:fixed, float animations, pointer-events:none
8. **Noise Texture Overlay** — SVG feTurbulence, opacity 0.04, position:fixed
9. **Marketplace Ticker** — infinite marquee, 30s linear, pause on hover
10. **Animated Stat Counters** — count-up on scroll enter, ease-out quart, 2200ms
11. **Sticky Nav Blur Transition** — transparent at top, rgba(13,17,23,0.9) + blur(24px) after 20px scroll
12. **Glow Card Interactions** — hover border brightens, box-shadow glow, translateY(-4px)

Source: LEGACYLOOP_Complete_Master_Code.md has production-ready code for every one of these.

---

## THE 15 LANDING PAGE SECTIONS

Build in this exact order. Full spec in LEGACYLOOP_Awwwards_Landing_Master.md.

### SECTION 1 — Navigation Bar
- Logo: LegacyLoop-Logo-Master-04.png (horizontal lockup) — left side
- Center links: How It Works | Bots | Pricing | Investors (smooth scroll)
- Right: "Login" button → https://app.legacy-loop.com/login
- Behavior: transparent on load, glassmorphism blur after 20px scroll
- Height: 64px, position sticky, z-index high

### SECTION 2 — Hero (100vh)
- Background: hero-loop.webm video (with hero-loop.mp4 as Safari fallback)
- If video unavailable: animated gradient orbs only (graceful fallback)
- Eyebrow badge: "🤖 AI-Powered Resale Platform — Early Access" (teal pill)
- Headline: "Connecting Generations." — character-by-character reveal animation
- Subheadline: "The platform that makes selling simple, fair, and dignified." — fade in after headline
- Primary CTA: "Start Your Legacy" — MAGNETIC button, teal gradient, glow — links to https://app.legacy-loop.com/signup
- Ghost CTA: "See How It Works" — teal border, scrolls to #how-it-works
- Scroll bounce indicator at bottom center

### SECTION 3 — Marketplace Ticker (immediately below hero)
Infinite horizontal marquee:
"eBay • Mercari • Poshmark • OfferUp • Etsy • Facebook Marketplace • Craigslist • Instagram • Nextdoor •"
Speed: 30s linear infinite. Pause on hover. Duplicate for seamless loop.

### SECTION 4 — Market Opportunity
- Eyebrow: "THE OPPORTUNITY"
- 3 animated stat cards (staggered reveal):
  - 10,000+ — "Americans turn 65 every day"
  - $48B — "Estate and resale market"
  - 76% — "Of sellers say pricing is their biggest frustration"
- ScrollRevealText: "Managing an estate should not require becoming an eBay expert. LegacyLoop was built for this moment."

### SECTION 5 — MegaBot Advantage (id="megabot")
- Eyebrow: "THE CROWN JEWEL"
- Headline: "Four AI Engines. One Fair Price."
- Subheadline: "Our proprietary MegaBot runs OpenAI, Claude, Gemini, and Grok simultaneously. When 4 AIs agree on your item's value, you can trust the number."
- 4 engine cards (staggered GlowCards):
  - 🔍 OpenAI GPT-4o — "Vision & Identification" — "Sees 48+ attributes from a single photo"
  - 💎 Anthropic Claude — "Craftsmanship & Detail" — "Evaluates quality, materials, and hidden value"
  - 📊 Google Gemini — "Market Intelligence" — "Real-time market conditions across platforms"
  - ⚡ xAI Grok — "Speed & Patterns" — "Detects pricing anomalies in milliseconds"
- Consensus bar: teal fill 87%, label "87% AI Agreement" with glow
- Below: "Cost per 4-AI analysis: less than a cup of coffee. Margin: 85%+"

### SECTION 6 — How It Works (id="how-it-works")
- Eyebrow: "THE PROCESS"
- Headline: "From Photo to Sold in Four Steps"
- Vertical timeline with teal connector line + numbered teal circles:
  - Step 1: 📷 Upload a Photo — "Snap a picture of any item. Our AI does the rest."
  - Step 2: 🧠 AI Analysis & Pricing — "MegaBot analyzes 48+ attributes and cross-references live market data."
  - Step 3: 📣 List & Match Buyers — "Optimized listings publish to 14+ platforms. BuyerBot finds your best prospects."
  - Step 4: 📦 Ship & Get Paid — "AI handles negotiations. Shipping is automated. You collect payment."
- Each step: GlowCard, staggered reveal

### SECTION 7 — 9 AI Agents (id="bots")
- Eyebrow: "YOUR AI TEAM"
- Headline: "Nine Specialized AI Agents. All Working For You."
- 3x3 GlowCard grid, staggered reveal:
  1. 🔍 AnalyzeBot — "48+ attributes from one photo" — badge: ALL TIERS
  2. 📊 PriceBot — "Fair market value, regional intelligence" — badge: DIY+
  3. 📷 PhotoBot — "Photo quality scoring and tips" — badge: DIY+
  4. 📝 ListBot — "Listings for 14+ platforms" — badge: DIY+
  5. 🎯 BuyerBot — "6-12 buyer profiles before you list" — badge: DIY+
  6. 🛰️ ReconBot — "Real-time market monitoring" — badge: POWER+
  7. ⏳ AntiqueBot — "Never undersell a family heirloom" — badge: POWER+
  8. ⭐ CollectiblesBot — "Expert-level collectible analysis" — badge: POWER+
  9. 🚗 CarBot — "VIN decoding + condition grading" — badge: ESTATE

### SECTION 8 — Pricing (id="pricing")
- Eyebrow: "SIMPLE HONEST PRICING"
- Headline: "Simple, Honest Pricing"
- Subheadline: "Processing fees are charged to the buyer. Never to you."
- 4 tier cards. DIY Seller highlighted (scale 1.03, brighter border, "MOST POPULAR" badge):
  - FREE: $0/mo | 12% commission | 3 items | AnalyzeBot only | "Get Started Free" → /signup
  - DIY SELLER: ~~$20~~ $10/mo | 8% | 25 items | +4 bots | "Start Selling" (RECOMMENDED) → /signup
  - POWER SELLER: ~~$49~~ $25/mo | 5% | 100 items | +3 specialty bots | "Go Pro" → /signup
  - ESTATE MANAGER: ~~$99~~ $75/mo | 4% | Unlimited | ALL 9 bots | "Manage Estates" → /signup
- Credit packs row: "$25/30cr • $50/65cr • $100/140cr • $200/300cr"
- Footer note: "First AI analysis is always free. 10 free credits when you sign up."

### SECTION 9 — Built for Estates (warm amber tone shift)
- Eyebrow: "FOR FAMILIES"
- Headline: "Selling Should Not Add to the Grief."
- Body: "When a loved one passes, families face an overwhelming task. LegacyLoop was built for this moment."
- 4 amber-tinted GlowCards:
  - 🏺 "Antique detection that prevents underselling heirlooms"
  - 🌐 "Post your entire estate to 14+ platforms in one click"
  - 💬 "AI Messaging Agent handles buyer conversations"
  - 🤝 "White-glove service available for full estate liquidation"
- Background: use warm estate image if available, otherwise amber gradient orb emphasis

### SECTION 10 — App Screenshots / Product Preview
- Headline: "See It In Action"
- 2-3 large angled/floating app screenshots from /public/images/screenshots/
- Show: dashboard, MegaBot results, or messaging agent
- These prove the product is real and built

### SECTION 11 — Social Proof / Early Access
- AnimatedStat: 47 — "Beta signups and counting"
- "Pre-Launch Pricing: 47 of 100 founding member spots remaining"
- "Built in Maine. Serving America."
- Heroes Discount badge: "🎖️ 25% off for veterans and first responders"

### SECTION 12 — Technology Credibility
- Eyebrow: "THE INFRASTRUCTURE"
- Headline: "Enterprise-Grade. Built to Scale."
- 4 mini GlowCards:
  - ⚡ Next.js 16 — "React framework trusted by Netflix, TikTok, Notion"
  - 🔷 TypeScript — "137+ routes. Zero type errors. Type-safe end to end."
  - 🤖 Real AI APIs — "Every analysis is live AI. No fake data. No demos."
  - 📦 Shippo — "Real carrier rates. Real labels. USPS, UPS, FedEx."
- ScrollRevealText: "5 revenue streams. 85%+ margins on AI credits. Built for scale."

### SECTION 13 — Investor Relations (id="investors")
- Eyebrow: "PARTNER WITH US"
- Headline: "We're Seeking $50K–$150K in Seed Funding"
- Body: "LegacyLoop is positioned to become the infrastructure layer of the resale economy. We're raising to scale from beta to national launch."
- 5 stat cards: "$48B Market" | "85%+ Margins" | "5 Revenue Streams" | "9 AI Agents" | "14+ Platforms"
- CTA button: "Request Our Pitch Deck" → mailto:investors@legacy-loop.com?subject=LegacyLoop Investor Inquiry

### SECTION 14 — Final CTA
- Headline: "Your Items Have Value. We Help You Prove It."
- Subheadline: "Start for free. No credit card required."
- Email capture input + "Join Early Access" button
- Subtext: "Join 47+ sellers already on the waitlist"
- CTA → https://app.legacy-loop.com/signup

### SECTION 15 — Footer
- Logo: LegacyLoop-Logo-Master-03.png (stacked lockup) left
- Tagline: "Connecting Generations" muted below logo
- Links: How It Works | Bots | Pricing | Investors | Login
- Email: hello@legacy-loop.com
- "© 2026 LegacyLoop LLC. All rights reserved."
- "Built with heart in Maine. 🌲"

---

## URL CONNECTIONS — EXACT

All CTAs and nav links must use these exact URLs:

| Action | URL |
|--------|-----|
| Login | https://app.legacy-loop.com/login |
| Sign Up / Get Started | https://app.legacy-loop.com/signup |
| Investor Email | mailto:investors@legacy-loop.com?subject=LegacyLoop Investor Inquiry |
| Contact | hello@legacy-loop.com |
| Website | legacy-loop.com |

---

## VIDEO CODE — EXACT IMPLEMENTATION

```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0
  }}
>
  <source src="/hero-loop.webm" type="video/webm" />
  <source src="/hero-loop.mp4" type="video/mp4" />
</video>
```

WebM loads first (Chrome, Firefox, Edge). MP4 is Safari fallback.
If neither exists, the gradient orb background shows instead — graceful fallback.

---

## BUILD SEQUENCE — 5 PHASES

### PHASE 1 — FOUNDATION (Build first, verify before Phase 2)
- globals.css: inject all @keyframes (orbFloat1/2/3, ticker/marquee, scrollBounce, shimmer, borderSpin)
- globals.css: inject Google Fonts import
- globals.css: inject spring easing CSS variable
- globals.css: body { cursor: none } for custom cursor
- Initialize Lenis smooth scroll in page component useEffect (dynamic import — prevents SSR crash)
- CustomCursor component (blend mode, white circle, teal dot)
- GradientBackground component (3 animated orbs, position:fixed, z-index 0)
- NoiseOverlay component (SVG feTurbulence, opacity 0.04, position:fixed)
- Preloader component (1200ms, LegacyLoop teal text, loading bar, AnimatePresence)
- Base page wrapper with background #0D1117
- Run: npx tsc --noEmit && npm run build → must pass before Phase 2

### PHASE 2 — HERO + NAV
- Sticky nav with blur transition
- Hero section with video background
- Character-by-character headline reveal
- Magnetic primary CTA button
- Ghost secondary CTA
- Scroll bounce indicator
- Marketplace ticker marquee
- Run: npx tsc --noEmit && npm run build → must pass before Phase 3

### PHASE 3 — PROOF + MEGABOT + HOW IT WORKS
- Market Opportunity section with animated stats
- ScrollRevealText component
- MegaBot section with 4 engine GlowCards
- Consensus bar animation
- How It Works vertical timeline
- Run: npx tsc --noEmit && npm run build → must pass before Phase 4

### PHASE 4 — BOTS + PRICING + ESTATE
- 9 AI Agents 3x3 grid
- Pricing 4-tier cards with DIY highlighted
- Credit packs row
- Estate section with amber tone shift
- App Screenshots section
- Social proof / early access section
- Run: npx tsc --noEmit && npm run build → must pass before Phase 5

### PHASE 5 — TECH + INVESTORS + FOOTER + POLISH
- Technology credibility section
- Investor relations section
- Final CTA with email capture
- Footer
- Smooth anchor scroll for all nav links
- Meta tags: title, description, og:title, og:description
- prefers-reduced-motion: disable all animations
- Final full build verification
- Run: npx tsc --noEmit && npm run build → must pass before reporting done

---

## COPY STANDARDS

- Pre-revenue, demo-ready. Never claim traction we don't have.
- Language: "Join the first 100" / "Early Access" / "Pre-Launch Pricing" / "47 beta signups"
- Estate sections: warm, empathetic, human. Slower pace. More breathing room. Amber tones.
- Tech sections: precise, confident, intelligent. No hype.
- Integrity is a brand value. Never fake. Never exaggerate.
- Senior-friendly language: clear, no jargon, action-oriented
- Investor language: specific, credible, data-driven

---

## GAP REPORT — WHAT TO FLAG

After reading everything, report on:

1. Any pricing mismatch between app and landing page docs
2. Any bot name or description mismatch
3. Any missing asset files (logos, images, videos)
4. Whether white logo version exists
5. Whether app screenshots are organized and usable
6. Whether framer-motion and lenis are correctly installed
7. Any TypeScript conflicts or missing types
8. Any section that has missing copy or unclear direction
9. Any risk to the build you can identify
10. Anything else that could cause Claude Code to fail or produce wrong output

---

## AFTER GAP REPORT — WRITE THE CLAUDE CODE BUILD COMMAND

After reporting all gaps, write the complete Claude Code build command.

The command must:
1. Start with the LEGACYLOOP_Awwwards_Landing_Master.md build specification
2. Reference all component code from LEGACYLOOP_Complete_Master_Code.md
3. Use all design tokens from UI Master Reference and Brand Quick Reference
4. Reference all asset paths correctly
5. Use Command Template v8 format (verification checkpoint, locked files list, build parts, verification checklist, report format)
6. Build in exactly 5 phases as specified above
7. Require TypeScript verification after each phase
8. Never use Tailwind, external CSS, or className for styling
9. Never touch app/page.tsx or any other existing routes

---

# PART 2 — CLAUDE CODE BUILD COMMAND
## Use This After Cowork Completes Diagnostics and Fills All Gaps

---

PASTE THIS AS YOUR FIRST MESSAGE IN CLAUDE CODE:

---

You are my dedicated senior full-stack developer and execution partner for LegacyLoop.

PROJECT: LegacyLoop Landing Page
FILE: app/landing/page.tsx (NEW FILE — do not touch app/page.tsx)
TASK: Build the complete Awwwards-level landing page in 5 phases

---

## CRITICAL RULES — NEVER VIOLATE

1. ALL styles use inline style={{}} ONLY — NEVER Tailwind, NEVER external CSS, NEVER className for styling
2. The ONLY CSS file you touch is app/globals.css — ONLY for @keyframes and CSS custom properties
3. NEVER generate, recreate, or approximate the LegacyLoop logo programmatically
4. ONLY use logo files from /public/logos/ as <img> src attributes
5. AI-generated images are backgrounds only — logo is always a separate code element on top
6. framer-motion and lenis are the ONLY animation libraries
7. Build in 5 phases — run npx tsc --noEmit && npm run build after EACH phase
8. Fix ALL TypeScript errors before proceeding to the next phase
9. NEVER claim fake traction — use "47 beta signups", "Early Access", "Join the first 100"
10. prefers-reduced-motion must disable all animations

---

## TECH STACK

Next.js 16 + TypeScript + App Router
Path: /Users/ryanhallee/Desktop/legacy-loop-landing
Installed: framer-motion, lenis
No Tailwind. No external CSS. No icon libraries. Emojis only for icons.

---

## DESIGN TOKENS

```
Background: #0D1117
Gradient: linear-gradient(160deg, #0A0A0F 0%, #0D0F1A 50%, #0A0C14 100%)
Primary accent: #00BCD4
Deep accent: #009688
CTA gradient: linear-gradient(135deg, #00BCD4, #009688)
Card bg: rgba(255,255,255,0.03)
Card border: 1px solid rgba(0,188,212,0.15)
Card hover border: rgba(0,188,212,0.5)
Text primary: #FFFFFF
Text secondary: #B0B8C4
Text muted: #6B7280
Success: #4CAF50
Warning: #FF9800
Error: #EF5350
Antique gold: #F5A623
Estate amber: #D4A017
AI/MegaBot purple: #8B5CF6
Button shadow: 0 0 30px rgba(0,188,212,0.3)
```

---

## ASSET PATHS

```
/public/logos/LegacyLoop-Logo-Master-01.png   (teal mark)
/public/logos/LegacyLoop-Logo-Master-03.png   (stacked lockup — hero/footer)
/public/logos/LegacyLoop-Logo-Master-04.png   (horizontal — nav bar)
/public/logos/LegacyLoop-Logo-Master-05.png   (tight mark — favicon use)
/public/hero-loop.webm                         (hero video — primary)
/public/hero-loop.mp4                          (hero video — Safari fallback)
/public/vintage-item-valuation.webm            (feature video)
/public/vintage-item-valuation.mp4             (feature video fallback)
/public/images/screenshots/                    (50+ app screenshots)
/public/images/                                (all AI-generated background images)
```

---

## SECTION VERIFICATION CHECKPOINT

Run BEFORE starting:
```bash
echo '=== CHECKPOINT ==='
ls public/logos/
ls public/images/
ls public/ | grep hero
cat package.json | grep -E "framer|lenis"
npx tsc --noEmit 2>&1 | tail -5
echo '=== CHECKPOINT COMPLETE ==='
```

---

## PHASE 1 — FOUNDATION

### globals.css additions:
```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');

@keyframes float1 {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-40px); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(30px) scale(0.95); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
  50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
body { cursor: none; }
:root {
  --spring-easing: linear(0, 0.006, 0.024, 0.055, 0.097, 0.148, 0.209, 0.276, 0.347, 0.42, 0.494, 0.567, 0.637, 0.703, 0.762, 0.815, 0.86, 0.897, 0.926, 0.948, 0.963, 0.974, 0.981, 0.986, 0.989, 0.992, 0.994, 0.996, 0.997, 0.998, 0.999, 1);
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### app/landing/page.tsx structure:
```
'use client'

All imports at top
Lenis initialization in useEffect (dynamic import)
CustomCursor component
GradientBackground component (3 floating orbs)
NoiseOverlay component (SVG feTurbulence)
Preloader component (AnimatePresence, 1200ms)
Main page export with all 15 sections
```

Full component code available in:
LEGACYLOOP_Complete_Master_Code.md — Components 1-12
LEGACYLOOP_Real_Source_Code.md — Verified reference implementations

**After Phase 1: npx tsc --noEmit && npm run build → must pass**

---

## PHASE 2 — HERO + NAV

### Sticky Navigation:
- Position: fixed, top 0, full width, z-index 1000
- Transparent on load, transitions to rgba(13,17,23,0.9) + blur(24px) after 20px scroll
- Left: <img src="/logos/LegacyLoop-Logo-Master-04.png" height="36" />
- Center: smooth scroll links — How It Works | Bots | Pricing | Investors
- Right: Login button → https://app.legacy-loop.com/login
- Transition: all 0.4s ease

### Hero Section (height: 100vh):
- Background video:
  ```jsx
  <video autoPlay muted loop playsInline style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}>
    <source src="/hero-loop.webm" type="video/webm" />
    <source src="/hero-loop.mp4" type="video/mp4" />
  </video>
  ```
- Dark overlay: rgba(13,17,23,0.65) position absolute over video
- Gradient orbs still visible through overlay
- Content centered, z-index 1 above video
- Eyebrow badge: "🤖 AI-Powered Resale Platform — Early Access"
- Headline: "Connecting Generations." — character reveal animation
- Subheadline: "The platform that makes selling simple, fair, and dignified."
- Primary CTA: MAGNETIC "Start Your Legacy" → https://app.legacy-loop.com/signup
- Ghost CTA: "See How It Works" → scrolls to #how-it-works
- Scroll bounce indicator

### Marketplace Ticker:
- Immediately below hero
- "eBay • Mercari • Poshmark • OfferUp • Etsy • Facebook Marketplace • Craigslist • Instagram • Nextdoor •"
- Duplicated for seamless loop
- 30s linear infinite, pause on hover

**After Phase 2: npx tsc --noEmit && npm run build → must pass**

---

## PHASE 3 — PROOF + MEGABOT + HOW IT WORKS

Build per full spec in LEGACYLOOP_Awwwards_Landing_Master.md Phases 3.
All AnimatedStat components, ScrollRevealText, GlowCard, stagger reveals.

**After Phase 3: npx tsc --noEmit && npm run build → must pass**

---

## PHASE 4 — BOTS + PRICING + ESTATE + SCREENSHOTS

### Bot Grid — Exact Names and Descriptions:
1. 🔍 AnalyzeBot — "48+ attributes from one photo" — ALL TIERS
2. 📊 PriceBot — "Fair market value, regional intelligence" — DIY+
3. 📷 PhotoBot — "Photo quality scoring and tips" — DIY+
4. 📝 ListBot — "Listings for 14+ platforms" — DIY+
5. 🎯 BuyerBot — "6-12 buyer profiles before you list" — DIY+
6. 🛰️ ReconBot — "Real-time market monitoring" — POWER+
7. ⏳ AntiqueBot — "Never undersell a family heirloom" — POWER+
8. ⭐ CollectiblesBot — "Expert-level collectible analysis" — POWER+
9. 🚗 CarBot — "VIN decoding + condition grading" — ESTATE

### Pricing — Exact Values (NEVER change):
- Free: $0/mo | 12% commission | 3 items
- DIY Seller: ~~$20~~ $10/mo | 8% | 25 items | MOST POPULAR
- Power Seller: ~~$49~~ $25/mo | 5% | 100 items
- Estate Manager: ~~$99~~ $75/mo | 4% | Unlimited

Credit Packs: $25/30cr • $50/65cr • $100/140cr • $200/300cr

App Screenshots section: pick 2-3 best from /public/images/screenshots/
Show as angled floating cards with subtle drop shadow

**After Phase 4: npx tsc --noEmit && npm run build → must pass**

---

## PHASE 5 — TECH + INVESTORS + FOOTER + POLISH

Build per full spec in LEGACYLOOP_Awwwards_Landing_Master.md Phase 5.

Final checklist before reporting done:
- [ ] All 15 sections visible at localhost:3001
- [ ] Lenis smooth scroll working
- [ ] Custom cursor visible and blending
- [ ] Preloader appears and fades out
- [ ] Gradient orbs animating
- [ ] Nav blur transition on scroll
- [ ] Hero video playing (or graceful fallback)
- [ ] Ticker scrolling
- [ ] Stat counters animating on scroll
- [ ] Magnetic CTA button responding to cursor
- [ ] Card hover states working
- [ ] All smooth scroll nav links working
- [ ] All CTA buttons pointing to correct URLs
- [ ] Login → https://app.legacy-loop.com/login
- [ ] Sign Up → https://app.legacy-loop.com/signup
- [ ] Investor email → investors@legacy-loop.com
- [ ] Logos displaying from /public/logos/ — never generated
- [ ] prefers-reduced-motion disabling animations
- [ ] Meta tags set
- [ ] npx tsc --noEmit → 0 errors
- [ ] npm run build → pass

**After Phase 5: npx tsc --noEmit && npm run build → must pass**

---

## REQUIRED REPORT FORMAT

After each phase:

```
PHASE [N] COMPLETE

TypeScript: [0 errors / list errors]
Build: [pass / fail]
Sections built: [list]
Components created: [list]
Files modified: [list]
New files: [list]

FLAGS:
[Any gaps, missing assets, risks, or opportunities noticed]

READY FOR PHASE [N+1]: [yes / no]
```

---

## REFERENCE DOCUMENTS (Read before building)

1. LEGACYLOOP_Awwwards_Landing_Master.md — Complete build specification
2. LEGACYLOOP_Complete_Master_Code.md — All component implementations
3. LEGACYLOOP_Real_Source_Code.md — Verified Awwwards source references
4. LEGACYLOOP_UI_MASTER_REFERENCE.md — Complete design system
5. LegacyLoop_Brand_Quick_Reference.pdf — Color and typography tokens
6. LegacyLoop_Color_Palette_Reference.pdf — Full color system with PMS
7. LegacyLoop_Font_Recommendations.pdf — Typography system
8. LegacyLoop_Complete_Passoff_v5.pdf — App features, pricing, bot details

All files are in: /Users/ryanhallee/Desktop/Legacy-Loop/Landing Page/

---

# PART 3 — DOMAIN CONNECTION PLAN
## After Build Is Complete and Verified

---

## Step 1 — Deploy to Vercel

In your legacy-loop-landing terminal:
```bash
npx vercel --prod
```

Or connect via Vercel dashboard → Import from GitHub.
You'll get a URL like: legacy-loop-landing.vercel.app

## Step 2 — Add Domain in Vercel

Vercel Dashboard → Your project → Settings → Domains
Add: legacy-loop.com
Add: www.legacy-loop.com

Vercel will show you DNS records to add.

## Step 3 — Update DNS in Squarespace

Go to: squarespace.com → Domains → legacy-loop.com → DNS Settings

Add these records:
```
Type: A     | Host: @   | Value: 76.76.21.21
Type: CNAME | Host: www | Value: cname.vercel-dns.com
```

## Step 4 — App Subdomain (Later)

When MVP is production-ready:
```
Type: CNAME | Host: app | Value: [your MVP vercel deployment].vercel.app
```

This makes app.legacy-loop.com point to your Next.js app.
All Login and Signup buttons on the landing page point here.

## Propagation

DNS propagates in 30 min – 48 hours. Usually under 1 hour.
After propagation: legacy-loop.com shows the landing page.
app.legacy-loop.com shows the app.

---

# PART 4 — FINAL ASSET STATUS TRACKER
## Check Everything Off Before Build Day

```
VIDEOS
[ ] hero-loop.mp4 → /public/
[ ] hero-loop.webm → /public/
[ ] vintage-item-valuation.mp4 → /public/
[ ] vintage-item-valuation.webm → /public/

LOGOS
[ ] LegacyLoop-Logo-Master-01.png → /public/logos/
[ ] LegacyLoop-Logo-Master-02.png → /public/logos/
[ ] LegacyLoop-Logo-Master-03.png → /public/logos/
[ ] LegacyLoop-Logo-Master-04.png → /public/logos/
[ ] LegacyLoop-Logo-Master-05.png → /public/logos/
[ ] White transparent version → /public/logos/ (still needed)
[ ] favicon.ico or favicon.png → /public/ (still needed)

IMAGES (from /Landing Page/Pictures & Videos)
[ ] Best 3D sculpture renders → /public/images/hero/
[ ] Teal light energy renders → /public/images/hero/
[ ] Cinematic dark backgrounds → /public/images/hero/
[ ] Estate room images → /public/images/paths/
[ ] Garage/bright images → /public/images/paths/
[ ] AI/tech visuals → /public/images/features/
[ ] Antique/item visuals → /public/images/features/
[ ] Legacy/emotional images → /public/images/mission/

APP SCREENSHOTS
[ ] Dashboard overview → /public/images/screenshots/
[ ] Bot results screen → /public/images/screenshots/
[ ] Messaging agent → /public/images/screenshots/
[ ] Listing generator → /public/images/screenshots/
[ ] Pricing page → /public/images/screenshots/

PROJECT SETUP
[ ] Next.js 16 + TypeScript ✅
[ ] App Router ✅
[ ] No Tailwind ✅
[ ] framer-motion installed ✅
[ ] lenis installed ✅
[ ] All /public/ subfolders created ✅
[ ] Dev server running on localhost:3001 ✅
```

---

# PART 5 — EVERYTHING RYAN HAS BUILT
## For Claude Cowork and Claude Code Context

---

## THE APP (Legacy-Loop-MVP) — What Exists

- 171+ API routes
- 4 AI engines: OpenAI GPT-4o, Anthropic Claude, Google Gemini, xAI Grok
- MegaBot 4-engine parallel consensus system
- 9 specialized AI bots (all locked and working)
- AI Messaging Agent — full 3-panel inbox command center (P5-A through P5-H)
- Add-On Store with 16 add-ons seeded
- 3 working add-ons (4-AI parallel): Listing Optimizer, Buyer Outreach, Market Report
- Add-On Enrichment Layer (12 parallel DB queries)
- Bundle Sale Engine (3 types)
- Financial Fairness Engine (pro-rate, cancel, commission)
- CRON job (Vercel native, every 30 min)
- Offer engine with counter-offer and barter/trade
- Shipping Center (USPS, UPS, FedEx, LTL)
- Publish Hub (14+ platforms, copy mode)
- Seller dashboard
- Credit system with 4 credit packs
- Tiered membership with 4 tiers
- Square payments (sandbox, switching to production after LLC)
- SendGrid email
- Demo mode (DEMO_MODE=true bypasses all gates)

## THE LANDING PAGE PROJECT — What Exists

- Next.js 16 + TypeScript + App Router
- framer-motion installed
- lenis installed
- All /public/ folder structure created
- 4 video files encoded (2 MP4, 2 WebM)
- All logo files uploaded
- 50+ app screenshots captured
- All AI-generated background images downloaded
- Complete build specification in LEGACYLOOP_Awwwards_Landing_Master.md
- All component code pre-written in LEGACYLOOP_Complete_Master_Code.md
- Reference source code in LEGACYLOOP_Real_Source_Code.md

## THE BRAND SYSTEM — What Exists

- Full color palette with HEX, PMS, RGB for every color
- 3-font typography system: Exo 2 + Plus Jakarta Sans + Barlow Condensed
- Button system with gradients and states
- Card system with glassmorphism
- Semantic colors for every feature type
- Document template
- UI Master Reference (complete design system)
- Brand Quick Reference (one-page summary)

---

*LegacyLoop | Master Landing Page Handoff | Ryan Hallee, Founder | March 31, 2026 | CONFIDENTIAL*
*This document is the single source of truth for the landing page build.*
*Claude Cowork reads this and diagnoses. Claude Code reads this and builds.*
