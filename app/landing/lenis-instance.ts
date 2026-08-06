// ─────────────────────────────────────────────────────────────────────────────
// lenis-instance.ts — shared Lenis singleton (CMD-LANDING-PASS3 · W3)
//
// The Lenis smooth-scroll instance is created in page.tsx with autoRaf:false on its
// own rAF loop. Code-split beats that load GSAP ScrollTrigger (e.g. the B03 pinned
// scrub) MUST bridge to that instance — `lenis.on('scroll', ScrollTrigger.update)` —
// or the pin reads a stale window.scrollY and judders. This singleton is the bridge:
// page.tsx sets it on init; a beat reads it on demand. Null on touch (no Lenis) and
// before init — callers must null-check.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(l: Lenis | null): void {
  instance = l
}

export function getLenis(): Lenis | null {
  return instance
}
