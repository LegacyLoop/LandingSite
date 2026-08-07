'use client'
// ─────────────────────────────────────────────────────────────────────────────
// FoundingCountLine — S4. ONE founding-count line, both surfaces (the landing page and the
// WaitlistWalkthrough) read from it, so the scarcity copy can never drift between them.
//
// FAIL-SAFE (L0-2 · CEO ruling · preserved): framing shows until the real claimed count
// reaches FOUNDING_LIVE_THRESHOLD; if the live API returns nothing (`live === null`), framing
// shows — the page never renders "0 of 100" (which reads as sold-out on our most important CTA).
// Threshold + framing come from the canon block in landing-content.ts (S2). NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { FOUNDING_LIVE_THRESHOLD, FOUNDING_FRAMING } from './landing-content'

export interface FoundingLive {
  claimed: number
  cohortSize: number
  spotsLeft: number
}

export default function FoundingCountLine({
  live,
  accent = '#00BCD4',
  center = false,
}: {
  live: FoundingLive | null
  accent?: string
  center?: boolean
}) {
  const showLive = live !== null && live.claimed >= FOUNDING_LIVE_THRESHOLD
  if (showLive) {
    return (
      <p style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 14, letterSpacing: '0.05em', color: accent, margin: 0, textAlign: center ? 'center' : undefined }}>
        {live.claimed} of {live.cohortSize} founding spots claimed
        <span style={{ color: '#94A3B8', fontWeight: 400 }}> &middot; {live.spotsLeft} still open</span>
      </p>
    )
  }
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13.5, color: '#94A3B8', margin: 0, textAlign: center ? 'center' : undefined }}>
      {FOUNDING_FRAMING}
    </p>
  )
}
