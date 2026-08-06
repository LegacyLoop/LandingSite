// ─────────────────────────────────────────────────────────────────────────────
// motion.ts — SHARED MOTION SUBSTRATE (CMD-LANDING-PASS3 · W2)
//
// The timing layer, laid ONCE. A single shared easing + one duration scale + one
// stagger + one spacing scale is what makes a page read as authored rather than
// assembled. Every section that moves reads from here — no hand-typed cubic-beziers.
//
// AUDIT-TRACE (R-10 / audit-first): these are the values ALREADY dominant in
// page.tsx (cubic-bezier(0.23,1,0.32,1) — 23 uses; durations clustered at
// 0.6/0.7/0.8; 80ms card stagger per WORLD_CLASS_STANDARDS §2.04). W2 codifies
// the de-facto standard into one source; it does not invent new motion.
//
// STACK NOTE (§12 stated decision): substrate stays on the SHIPPED Framer Motion
// + Lenis stack. GSAP ScrollTrigger is DEFERRED to the first W3 beat that needs
// true pin/scrub — adding it now spends the <200KB initial-JS budget with no beat
// to justify it (Law 2: preserve what works). Lenis config below is the verified
// WORLD_CLASS_STANDARDS §2.01 recipe.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import type { Variants, Transition } from 'framer-motion'

// The ONE easing. Framer wants a 4-tuple; CSS wants the string. Same curve, both forms.
export const EASE = [0.23, 1, 0.32, 1] as const
export const EASE_CSS = 'cubic-bezier(0.23, 1, 0.32, 1)'
// Symmetric in/out — for scrubbed / pinned beats only (the lone existing outlier).
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const
export const EASE_INOUT_CSS = 'cubic-bezier(0.76, 0, 0.24, 1)'

// One duration scale (seconds). Names, not magic numbers, at every call site.
export const DUR = {
  fast: 0.4,
  base: 0.6,
  slow: 0.7,
  slower: 0.8,
  hero: 1.2,
} as const

// One stagger step (seconds) — 80ms per the staggered-card-reveal standard.
export const STAGGER = 0.08

// One spacing scale (px) — section rhythm, so beats breathe consistently.
export const SPACE = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  section: 96,
} as const

// Verified Lenis config (WORLD_CLASS_STANDARDS §2.01). Import where Lenis inits.
export const LENIS_CONFIG = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const

// The shared entrance. `reduced` OR `touch` collapses it to an instant, fully-visible
// state. reduced → no transform/opacity animation. touch → the iPad-safe house pattern
// (page.tsx:4537): whileInView rides IntersectionObserver, which is unreliable on iPad
// Safari; if it never fires, the hidden state MUST already be visible or the content
// silently disappears. So on touch, hidden == show == visible. Content is always THERE.
export function reveal(reduced: boolean, index = 0, touch = false): Variants {
  if (reduced || touch) {
    return {
      hidden: { opacity: 1, y: 0 },
      show: { opacity: 1, y: 0, transition: { duration: 0 } },
    }
  }
  return {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: DUR.base, ease: EASE, delay: index * STAGGER },
    },
  }
}

// A bare transition token for ad-hoc motion.* that should match the house rhythm.
export function houseTransition(reduced: boolean, duration: number = DUR.base): Transition {
  return reduced ? { duration: 0 } : { duration, ease: EASE }
}
