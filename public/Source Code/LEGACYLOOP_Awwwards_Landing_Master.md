# LEGACYLOOP — AWWWARDS-LEVEL LANDING PAGE
## Master Reference | Verified URLs | Production Code | Claude Code Prompt
**March 2026 | Built to top-10 internet standard | $100K aesthetic on a startup budget**

---

# PART 1: THE AWWWARDS DESIGN LANGUAGE

## What separates an Awwwards site from everything else

Awwwards judges on four criteria: Design, Usability, Creativity, Content.
The sites that win all four do these things specifically:

1. **Butter-smooth scroll** — not browser scroll. Physics-based, weighted, cinematic.
2. **Typography that moves** — words reveal character by character, opacity tied to scroll
3. **Purposeful animation** — every motion has a reason. Nothing decorates. Everything communicates.
4. **Depth on a flat screen** — layered elements at different scroll speeds, parallax, blur, glow
5. **Micro-interactions** — buttons respond magnetically, cards breathe, cursors react
6. **Restraint** — the best Awwwards sites know what NOT to animate
7. **Story** — the page has an arc. You begin somewhere and arrive somewhere.

For LegacyLoop this means:
- The scroll feels like turning pages in a premium magazine
- The headline doesn't just appear — it assembles itself
- The MegaBot section feels like a command center coming online
- The estate section feels like walking into a gallery
- Every hover feels intentional and satisfying

---

# PART 2: THE EXACT AWWWARDS DESIGN ELEMENTS TO USE

## The 12 effects that define world-class sites right now

These are the techniques appearing in 2024–2025 Awwwards honorees, site of the year nominees, and developer award winners. Every one is achievable in Next.js without WebGL.

---

### EFFECT 1: SMOOTH SCROLL (Lenis)
**The single biggest upgrade you can make.**
Every Awwwards site uses physics-based smooth scroll.
Native browser scroll feels cheap by comparison.

Reference: https://lenis.darkroom.engineering
Used by: virtually every Awwwards winner since 2023

```bash
npm install lenis
```

```tsx
// app/landing/layout.tsx or inside page component
'use client'
import Lenis from 'lenis'
import { useEffect } from 'react'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
```

---

### EFFECT 2: WORD-BY-WORD SCROLL OPACITY REVEAL
**Seen on 50%+ of Awwwards winners since 2023.**
Text appears to "write itself" as you scroll into the section.
The headline or paragraph fades in word by word, tied to scroll position.

Reference: https://blog.olivierlarose.com/tutorials/text-gradient-scroll-opacity-v2

```tsx
'use client'
import { useRef, useEffect, useState } from 'react'

function ScrollRevealText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const words = text.split(' ')

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight * 0.6)
      ))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <p ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em', ...style }}>
      {words.map((word, i) => {
        const wordProgress = Math.max(0, Math.min(1,
          (scrollProgress * words.length - i) / 1.5
        ))
        return (
          <span key={i} style={{
            opacity: 0.15 + wordProgress * 0.85,
            transform: `translateY(${(1 - wordProgress) * 8}px)`,
            transition: 'none',
            color: '#B0B8C4',
          }}>
            {word}
          </span>
        )
      })}
    </p>
  )
}
```

---

### EFFECT 3: MAGNETIC BUTTON
**Used on nearly every premium agency site.**
The CTA button pulls toward your cursor slightly when you hover near it.
Feels alive. Feels premium. Converts better.

Reference: Used by studios at https://www.awwwards.com/websites/gsap/

```tsx
'use client'
import { useRef, useState } from 'react'

function MagneticButton({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = (e.clientX - centerX) * 0.35
    const distY = (e.clientY - centerY) * 0.35
    setPosition({ x: distX, y: distY })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease',
        ...style
      }}
    >
      {children}
    </button>
  )
}
```

---

### EFFECT 4: STAGGERED CARD REVEAL ON SCROLL
**The standard for feature/bot sections on premium sites.**
Cards appear one after another with a cascade effect as you scroll in.

```tsx
'use client'
import { useRef, useState, useEffect } from 'react'

function StaggerCard({
  children,
  index,
  style
}: {
  children: React.ReactNode
  index: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 80}ms`,
        ...style
      }}
    >
      {children}
    </div>
  )
}
```

---

### EFFECT 5: SPLIT HEADLINE — CHARACTER REVEAL
**The hero headline doesn't appear — it assembles.**
Characters drop in from above with a stagger. Used on Arc, Linear, Vercel heroes.

Reference: Inspired by https://dennissnellenberg.com (Awwwards winner)

```tsx
'use client'
import { useState, useEffect } from 'react'

function SplitHeadline({ text, style }: { text: string; style?: React.CSSProperties }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <h1 style={{ overflow: 'hidden', ...style }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(100%)',
            transition: `opacity 0.6s ease ${i * 18}ms, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${i * 18}ms`,
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  )
}
```

---

### EFFECT 6: ANIMATED GRADIENT ORB BACKGROUND
**The atmospheric depth effect behind hero sections.**
Seen on Vercel, Neon, Trigger.dev, and every 2024 Awwwards honoree hero.
Radial glows that shift slowly, creating a sense of depth and intelligence.

```tsx
// Drop this inside the page as position:absolute behind all content
function GradientBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Primary orb — teal, top center */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '700px',
        background: 'radial-gradient(ellipse at center, rgba(0,188,212,0.09) 0%, transparent 65%)',
        animation: 'orbFloat1 12s ease-in-out infinite',
      }} />
      {/* Secondary orb — deep teal, right side */}
      <div style={{
        position: 'absolute',
        top: '35%',
        right: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(0,150,136,0.06) 0%, transparent 65%)',
        animation: 'orbFloat2 16s ease-in-out infinite',
      }} />
      {/* Subtle amber orb for estate warmth — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(212,160,23,0.04) 0%, transparent 65%)',
        animation: 'orbFloat3 20s ease-in-out infinite',
      }} />
    </div>
  )
}

// Add to your global CSS or <style> tag in layout:
/*
@keyframes orbFloat1 {
  0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
  50% { transform: translateX(-50%) translateY(-30px) scale(1.05); }
}
@keyframes orbFloat2 {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(20px) scale(0.95); }
}
@keyframes orbFloat3 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
*/
```

---

### EFFECT 7: NOISE TEXTURE OVERLAY
**The detail that separates amateur from agency.**
A subtle grain texture over the dark background prevents it from looking flat.
Apple uses it. Vercel uses it. Every premium dark site uses it.

```tsx
// Single div, position:fixed, covers everything
function NoiseOverlay() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
    }} />
  )
}
```

---

### EFFECT 8: HORIZONTAL SCROLLING MARQUEE (Infinite Ticker)
**Seen on: Framer, Webflow, Linear, and dozens of Awwwards sites.**
Used for "trusted by" logos, feature keywords, or platform names.
For LegacyLoop: "eBay • Mercari • Poshmark • OfferUp • Etsy • Facebook Marketplace • Craigslist • Instagram •"

```tsx
function MarqueeTicker({ items }: { items: string[] }) {
  const doubled = [...items, ...items]

  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '20px 0' }}>
      <div style={{
        display: 'inline-flex',
        gap: '48px',
        animation: 'marquee 30s linear infinite',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {item} <span style={{ color: '#00BCD4', margin: '0 8px' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/*
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
*/
```

---

### EFFECT 9: GLOWING TEAL BORDER CARD (Hover State)
**The premium card interaction on Linear, Neon, Liveblocks.**
On hover, a bright teal border glow emanates from the card edge.

```tsx
function GlowCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: hovered
          ? '1px solid rgba(0,188,212,0.5)'
          : '1px solid rgba(0,188,212,0.12)',
        boxShadow: hovered
          ? '0 0 30px rgba(0,188,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 0 0 rgba(0,188,212,0)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        ...style
      }}
    >
      {children}
    </div>
  )
}
```

---

### EFFECT 10: SECTION CLIP-PATH TRANSITION
**The cinematic section-to-section transition used on Awwwards heroes.**
As you scroll past the hero, the next section reveals via a diagonal clip.

```tsx
// Apply to the section immediately after hero
const clipSection = {
  clipPath: 'polygon(0 5%, 100% 0%, 100% 100%, 0% 100%)',
  marginTop: '-80px',
  paddingTop: '120px',
}
```

---

### EFFECT 11: ANIMATED COUNTING STATS
**The scroll-into-view number that counts up dramatically.**
10,000+ ticks up from 0 when you scroll to it. Holds attention.

```tsx
'use client'
import { useRef, useState, useEffect } from 'react'

function AnimatedStat({
  end,
  suffix = '',
  prefix = '',
  duration = 2200,
  style
}: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  style?: React.CSSProperties
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startTime = Date.now()
    const frame = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease out quart
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [started, end, duration])

  return (
    <span ref={ref} style={style}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
```

---

### EFFECT 12: PRELOADER / PAGE ENTRY ANIMATION
**The first 1.5 seconds of an Awwwards site.**
A brief, elegant entry sequence before content is visible.
Signals premium immediately.

```tsx
'use client'
import { useState, useEffect } from 'react'

function PagePreloader() {
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 800)
    const t2 = setTimeout(() => setVisible(false), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0D1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: loaded ? 0 : 1,
      transition: 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
      pointerEvents: loaded ? 'none' : 'all',
    }}>
      <div style={{
        color: '#00BCD4',
        fontSize: '18px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        opacity: loaded ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        LegacyLoop
      </div>
    </div>
  )
}
```

---

# PART 3: REAL URLS — AWWWARDS CATEGORIES TO BROWSE

Go to these URLs on awwwards.com. Screenshot what speaks to you. Feed to Claude Code.

| URL | What to Study |
|---|---|
| https://www.awwwards.com/websites/dark/ | All dark-themed winning sites |
| https://www.awwwards.com/websites/gsap/ | Best GSAP animation sites |
| https://www.awwwards.com/websites/scrolling/ | Best scroll interaction sites |
| https://www.awwwards.com/websites/animation/ | Best animation overall |
| https://www.awwwards.com/awwwards/collections/ai-powered-web-projects/ | AI-powered web projects curated by Awwwards |
| https://www.awwwards.com/websites/2025/ | All 2025 nominees |
| https://www.awwwards.com/annual-awards-2024/ | 2024 award winners |
| https://www.awwwards.com/websites/sites_of_the_year/ | All-time site of the year winners |

---

## Specific sites from Awwwards to study

These have been identified as matching the LegacyLoop aesthetic profile:

| Site | URL | Why It Matters for LegacyLoop |
|---|---|---|
| **Igloo Inc** | https://igloo.inc | 2025 SOTY — immersive 3D scroll + easy nav coexisting. This is the balance we want. |
| **Lusion v3** | https://lusion.co | Developer award 2024. Dark, premium, WebGL. Shows depth possible without complexity |
| **Neon.tech** | https://neon.tech | Closest color match to our palette. Teal on dark. Study every section. |
| **Vercel** | https://vercel.com | The dark SaaS hero standard. Study the gradient text, stat cards, section spacing |
| **Linear** | https://linear.app | The premium product shell. Study nav, cards, motion timing |
| **Resend** | https://resend.com | Study the footer, how-it-works section, minimal copy style |
| **Liveblocks** | https://liveblocks.io | Study the glow button, feature section energy, teal/dark accent use |
| **Clerk** | https://clerk.com | Study the pricing page — the best tier card layout in SaaS |
| **Trigger.dev** | https://trigger.dev | Developer credibility section. Shows how to present tech stack with pride |
| **Raycast** | https://www.raycast.com | Study the sticky nav behavior and product feature reveals |

---

## Best animation tutorial sites to pull working code from

These blogs have free open-source implementations of every Awwwards animation pattern:

| Site | URL | What They Cover |
|---|---|---|
| **Olivier Larose** | https://blog.olivierlarose.com | Best free tutorials: page transitions, text opacity scroll, smooth scroll, project galleries |
| **Made With GSAP** | https://madewithgsap.com | 50 premium GSAP effects — scroll, drag, mouse move, infinite |
| **GSAP ScrollTrigger examples** | https://greensock.com/scrolltrigger/ | Official examples of every scroll trigger pattern |
| **Framer Motion docs** | https://www.framer.com/motion/ | React-native animation — all the patterns used above |
| **Lenis docs** | https://lenis.darkroom.engineering | Smooth scroll implementation for Next.js |
| **Codrops** | https://tympanus.net/codrops/ | Free experimental web techniques — text effects, transitions, cursors |

---

# PART 4: THE COMPLETE CLAUDE CODE BUILD PROMPT

**Copy everything inside the triple backticks below and paste it as your first message in Claude Code.**

---

```
You are the lead frontend engineer for LegacyLoop. You are building a landing page that belongs in the top 10 most impressive marketing websites on the internet right now. Think Awwwards site of the year. Think Vercel meets Christie's. Your standard is not "good for a startup." Your standard is "this looks like 8 engineers spent 6 months on it."

---

WHAT LEGACYLOOP IS

LegacyLoop is a real, fully-built AI-powered resale automation platform.
Mission: "Connecting Generations."
Founded in Maine by Ryan Hallee. Built with faith, grit, and a calling to serve families, seniors, veterans, and communities in need.

Two user paths: Estate Sales (seniors, families, life transitions) and Garage & Yard Sales (everyday sellers).

What the app actually contains — verified, live, working:
- 137+ routes in Next.js
- 9 specialized AI bots (AnalyzeBot, PriceBot, PhotoBot, ListBot, BuyerBot, ReconBot, AntiqueBot, CollectiblesBot, CarBot)
- 4-engine MegaBot consensus system (OpenAI + Claude + Gemini + Grok in parallel, $0.03-$0.09/run, 85%+ margin)
- Real Shippo shipping — USPS, UPS, FedEx, 8 box presets, LTL freight, local pickup
- 16 add-on marketplace services including White Glove Estate Coordination
- AI Messaging Agent — only resale platform with this
- Bundle Sale Engine, Offer Engine, Financial Fairness Engine
- Publish Hub → 14+ marketplaces (eBay, FB Marketplace, Craigslist, Mercari, OfferUp, Etsy, Poshmark, Instagram, Nextdoor, FB Groups, and more)
- Square payments

Subscription tiers (verified):
- Free: $0/mo | 12% commission | 3 items | AnalyzeBot only
- DIY Seller: $10-20/mo | 8% commission | 25 items | +PriceBot +PhotoBot +ListBot +BuyerBot
- Power Seller: $25-49/mo | 5% commission | 100 items | +ReconBot +AntiqueBot +CollectiblesBot
- Estate Manager: $75-99/mo | 4% commission | unlimited items | ALL 9 bots

AI Credit Packs: $25/30cr | $50/65cr | $100/140cr | $200/300cr
Bonuses: 10 credits signup | 25 credits first sale | 50 credits referral
Heroes Discount: 25% off subscriptions for veterans and first responders
Processing fee: 3.5% charged to BUYER via Square — never to the seller
Estate white-glove: $2,500–$10,000 + 25-35% commission
5 revenue streams: Subscriptions, Commissions, AI Credits, Add-Ons, Estate Services

---

ABSOLUTE STYLING RULE — NON-NEGOTIABLE

ALL styles use inline style={{}} ONLY.
NO Tailwind classes. NO external CSS files. NO className for styling.
This is the locked app pattern. Do not break it.

The only exception: animation keyframes (@keyframes) must go in a <style> tag injected into the document. Use a useEffect to inject them into document.head, or add them to app/globals.css if it already exists. Do not create new CSS files.

---

LOCKED DESIGN TOKENS

Background: #0D1117 (base) with gradient to #1A1F2E
Primary accent: #00BCD4 (teal)
Deep accent: #009688
CTA gradient: linear-gradient(135deg, #00bcd4, #009688)
Card bg: rgba(255,255,255,0.03)
Card border: 1px solid rgba(0,188,212,0.15)
Card radius: 16px
Backdrop filter: blur(12px)
Text primary: #FFFFFF
Text secondary: #B0B8C4
Text muted: #6B7280
Success: #4CAF50
Warning: #FF9800
Error: #EF5350
Antique/premium: #F5A623
Estate warm sections: #D4A017

Body minimum: 16px. Hero: clamp(48px, 7vw, 80px) bold. Icons: emoji only.
Buttons: teal gradient, 12px radius, glow shadow, 44px min height.
Cards: glassmorphism always. Hover: border brightens + translateY(-4px).

---

AWWWARDS-LEVEL QUALITY REQUIREMENTS

This page MUST implement all of the following. These are not optional.

1. SMOOTH SCROLL — Install and initialize Lenis
   npm install lenis
   Initialize in a useEffect at the top of the page component.
   Duration: 1.2, easing: exponential ease-out.

2. GRADIENT ORB BACKGROUND — position:fixed behind all content
   Three radial gradient orbs: teal top-center, deep teal right, subtle amber bottom-left.
   All three animate with slow floating keyframes (12-20s ease-in-out infinite).

3. NOISE TEXTURE OVERLAY — position:fixed, opacity 0.035
   SVG fractalNoise texture covers the entire page.
   Prevents the dark background from looking flat.

4. PAGE PRELOADER — 800ms elegant entry
   Dark background with "LegacyLoop" text in teal.
   Fades out at 800ms. Unmounts at 1400ms.

5. HERO HEADLINE — character-by-character reveal
   Each character animates in from below with a stagger.
   No JS text-split libraries. Pure inline span mapping.

6. SCROLL OPACITY TEXT REVEAL
   Use in the "Connecting generations" statement section.
   Words fade in tied to scroll position.
   Each word: opacity 0.15 → 1.0 as it enters the viewport.

7. STAGGERED CARD REVEALS
   Bot cards, stat cards, pricing cards — all use IntersectionObserver.
   Stagger delay: index * 80ms.
   Enter: opacity 0 → 1, translateY(32px) → 0.

8. MAGNETIC CTA BUTTON
   Primary "Start Your Legacy" button is magnetic.
   onMouseMove pulls button toward cursor (35% strength).
   onMouseLeave springs back with cubic-bezier(0.23, 1, 0.32, 1).

9. MARKETPLACE MARQUEE TICKER
   Infinite horizontal scroll of marketplace names:
   "eBay • Mercari • Poshmark • OfferUp • Etsy • Facebook Marketplace • Craigslist • Instagram • Nextdoor"
   Speed: 30s linear infinite. Pause on hover.

10. ANIMATED STAT COUNTERS
    All stat numbers (10,000+, $48B, 76%, 47 beta) count up when scrolled into view.
    Ease: ease-out quart. Duration: 2200ms.

11. STICKY NAV WITH BLUR TRANSITION
    Transparent at page top.
    rgba(13,17,23,0.9) + blur(24px) after 20px scroll.
    Logo left (teal bold). Nav links center (smooth scroll to sections). Login CTA right.
    Transition: all 0.4s ease.

12. GLOW CARD INTERACTIONS
    On hover: border brightens to rgba(0,188,212,0.5), box-shadow glow, translateY(-4px).
    All transitions: cubic-bezier(0.23, 1, 0.32, 1).

---

FILE TARGET

Create: app/landing/page.tsx
This is a new file. Do NOT touch app/page.tsx or any existing routes.
'use client' component. All inline style={{}}.

---

BUILD SEQUENCE — 5 PHASES

Build one phase, verify TypeScript and build, then proceed.

PHASE 1 — FOUNDATION
- Inject @keyframes into document.head via useEffect (orbFloat1/2/3, marquee, scrollBounce, shimmer)
- Initialize Lenis smooth scroll
- GradientBackground component (3 animated orbs, position:fixed)
- NoiseOverlay component (position:fixed, opacity 0.035)
- PagePreloader component (800ms → fade → unmount at 1400ms)
- Base page wrapper with background #0D1117

PHASE 2 — HERO + NAV
- Sticky nav (transparent → blur transition on scroll)
  Left: "LegacyLoop" in teal bold
  Center: "How It Works" | "Bots" | "Pricing" | "Investors" (smooth scroll links)
  Right: "Login" button (teal gradient, glow)
- Hero section (100vh):
  - Eyebrow badge: "🤖 AI-Powered Resale Platform — Early Access" (teal pill)
  - Headline: "Connecting Generations." — character-by-character reveal
  - Subheadline: "The platform that makes selling simple, fair, and dignified." — fade in after headline
  - Primary CTA: "Start Your Legacy" (MAGNETIC button, teal gradient glow)
  - Ghost CTA: "See How It Works" (teal border, scrolls to #how-it-works)
  - Scroll bounce indicator at bottom
- Marketplace ticker immediately below hero fold:
  "eBay • Mercari • Poshmark • OfferUp • Etsy • Facebook Marketplace • Craigslist • Instagram • Nextdoor •"

PHASE 3 — PROOF + MEGABOT + HOW IT WORKS
- Section: Market Opportunity
  - Eyebrow: "THE OPPORTUNITY"
  - 3 animated stat cards (staggered reveal):
    - AnimatedStat: 10,000+ | "Americans turn 65 every day"
    - AnimatedStat: $48B | "Estate and resale market"
    - AnimatedStat: 76% | "Of sellers say pricing is their biggest frustration"
  - ScrollRevealText: "Managing an estate should not require becoming an eBay expert. LegacyLoop was built for this moment."

- Section: MegaBot Advantage (id="megabot")
  - Eyebrow: "THE CROWN JEWEL"
  - Headline: "Four AI Engines. One Fair Price."
  - Subheadline: "Our proprietary MegaBot runs OpenAI, Claude, Gemini, and Grok simultaneously. When 4 AIs agree on your item's value, you can trust the number."
  - 4 engine cards (staggered, GlowCard):
    - 🔍 OpenAI — "Vision & Identification" — "Sees 48+ attributes from a single photo"
    - 💎 Claude — "Craftsmanship & Detail" — "Evaluates quality, materials, and hidden value"
    - 📊 Gemini — "Market Intelligence" — "Real-time market conditions across platforms"
    - ⚡ Grok — "Speed & Patterns" — "Detects pricing anomalies in milliseconds"
  - Consensus bar: teal fill at 87%, label "87% AI Agreement" with glow
  - Below: "Cost per 4-AI analysis: less than a cup of coffee. Margin: 85%+"

- Section: How It Works (id="how-it-works")
  - Eyebrow: "THE PROCESS"
  - Headline: "From Photo to Sold in Four Steps"
  - Vertical timeline with teal connector line:
    Step 1: 📷 Upload a Photo
    Step 2: 🧠 AI Analysis & Pricing
    Step 3: 📣 List & Match Buyers
    Step 4: 📦 Ship & Get Paid
  - Each step: numbered teal circle + GlowCard + staggered reveal

PHASE 4 — BOT ARMY + PRICING + ESTATE
- Section: 9 AI Agents (id="bots")
  - Eyebrow: "YOUR AI TEAM"
  - Headline: "Nine Specialized AI Agents. All Working For You."
  - 3x3 grid, GlowCard, staggered:
    1. 🔍 AnalyzeBot — "48+ attributes from one photo" — badge: ALL TIERS
    2. 📊 PriceBot — "Fair market value, regional intelligence" — badge: DIY+
    3. 📷 PhotoBot — "Photo quality scoring and tips" — badge: DIY+
    4. 📝 ListBot — "Listings for 14+ platforms" — badge: DIY+
    5. 🎯 BuyerBot — "6-12 buyer profiles before you list" — badge: DIY+
    6. 🛰️ ReconBot — "Real-time market monitoring" — badge: POWER+
    7. ⏳ AntiqueBot — "Never undersell a family heirloom" — badge: POWER+
    8. ⭐ CollectiblesBot — "Expert-level collectible analysis" — badge: POWER+
    9. 🚗 CarBot — "VIN decoding + condition grading" — badge: ESTATE

- Section: Pricing (id="pricing")
  - Eyebrow: "SIMPLE HONEST PRICING"
  - Headline: "Simple, Honest Pricing"
  - Subheadline: "Processing fees are charged to the buyer. Never to you."
  - 4 tier cards. DIY Seller is highlighted (scale 1.03, brighter border, "MOST POPULAR" badge):
    FREE: $0/mo | 12% | 3 items | AnalyzeBot only | "Get Started Free"
    DIY SELLER: ~~$20~~ $10/mo | 8% | 25 items | +4 bots | "Start Selling" (RECOMMENDED)
    POWER SELLER: ~~$49~~ $25/mo | 5% | 100 items | +3 specialty bots | "Go Pro"
    ESTATE MANAGER: ~~$99~~ $75/mo | 4% | Unlimited | ALL 9 bots | "Manage Estates"
  - Credit packs row below: "$25/30cr • $50/65cr • $100/140cr • $200/300cr"
  - Footer note: "First AI analysis is always free. 10 free credits when you sign up."

- Section: Built for Estates (warm amber tone shift)
  - Eyebrow: "FOR FAMILIES"
  - Headline: "Selling Should Not Add to the Grief."
  - Body: "When a loved one passes, families face an overwhelming task. LegacyLoop was built for this moment."
  - 4 amber-tinted GlowCards:
    🏺 "Antique detection that prevents underselling heirlooms"
    🌐 "Post your entire estate to 14+ platforms in one click"
    💬 "AI Messaging Agent handles buyer conversations"
    🤝 "White-glove service available for full estate liquidation"

- Section: Social Proof / Early Access
  - AnimatedStat: 47 | "Beta signups and counting"
  - "Pre-Launch Pricing: 47 of 100 spots remaining"
  - "Built in Maine. Serving America."
  - Heroes Discount badge: "🎖️ 25% off for veterans and first responders"

PHASE 5 — TECH + INVESTORS + FOOTER + POLISH
- Section: Technology Credibility
  - Eyebrow: "THE INFRASTRUCTURE"
  - Headline: "Enterprise-Grade. Built to Scale."
  - 4 mini GlowCards:
    ⚡ Next.js — "React framework trusted by Netflix, TikTok, Notion"
    🔷 TypeScript — "137+ routes. Zero type errors. Type-safe end to end."
    🤖 Real AI APIs — "Every analysis is live AI. No fake data. No demos."
    📦 Shippo — "Real carrier rates. Real labels. USPS, UPS, FedEx."
  - ScrollRevealText: "5 revenue streams. 85%+ margins on AI credits. Built for scale."

- Section: Investor Relations (id="investors")
  - Eyebrow: "PARTNER WITH US"
  - Headline: "We're Seeking $50K–$150K in Seed Funding"
  - Body: "LegacyLoop is positioned to become the infrastructure layer of the resale economy. We're raising to scale from beta to national launch."
  - 5 stat cards: "$48B Market" | "85%+ Margins" | "5 Revenue Streams" | "9 AI Agents" | "14+ Platforms"
  - CTA: "Request Our Pitch Deck" → mailto:investors@legacy-loop.com?subject=LegacyLoop Investor Inquiry

- Footer:
  - Logo: "LegacyLoop" teal bold + "Connecting Generations" muted
  - Links: How It Works | Bots | Pricing | Investors | Login
  - Email: hello@legacy-loop.com
  - "© 2026 LegacyLoop LLC. All rights reserved."
  - "Built with heart in Maine. 🌲"

- Final Polish:
  - Smooth anchor scroll for all nav links
  - Video hero fallback: if hero-loop.webm exists in /public, use it. If not, gradient background only.
  - Meta tags: title, description, og:title, og:description
  - prefers-reduced-motion: disable all animations when set
  - Run npx tsc --noEmit && npm run build. Fix all errors before reporting done.

---

COPY STANDARDS

Pre-revenue, demo-ready. Never claim traction we don't have.
Language: "Join the first 100" / "Early Access" / "Pre-Launch Pricing"
Estate sections: warm, empathetic, human. Slower pace. More space.
Tech sections: precise, confident, intelligent. No hype.
Integrity is a brand value. Never fake. Never exaggerate.

---

QA STANDARD

Before any section is done, ask:
1. Would an investor immediately understand what this company does?
2. Would a 70-year-old estate seller know exactly what to do without being told?

If no to either — fix it.

The bar: Tesla center console meets Christie's auction house.
Premium. Intelligent. Dignified. Clear.

---

START WITH PHASE 1. Do not skip it. The foundation effects (Lenis, orbs, noise, preloader, keyframes) must be in place before the hero is built. They are what makes the page feel Awwwards-level before a single section is written.

After each phase: run npx tsc --noEmit && npm run build. Report the result. Fix all errors before proceeding.
```

---

*LegacyLoop | Awwwards-Level Landing Page Master Reference | March 2026*
*Verified against Build Plan v2, Mission & Vision, locked design system*
*Animation techniques sourced from: Olivier Larose, GSAP docs, Lenis docs, Awwwards 2023-2025*
