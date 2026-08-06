'use client'
// ─────────────────────────────────────────────────────────────────────────────
// PinnedEvalBeat — B03 "it knows what it is" (CMD-LANDING-PASS3 · W3 · eval-unpinned)
//
// The AI-evaluation beat, Cleo-class outcome-as-motion: a canvas image-sequence of the
// valuation scrubs on the section's OWN scroll (NON-pinned, no GSAP — the end-to-end
// eval unpinned it so it no longer stacks against the journey pin) while an evaluation
// HUD resolves (analyzing -> identified -> hands to MegaBot). Sets up the MegaBot
// consensus section below — that hand-tuned section is NOT touched. The canvas reuses
// ScrollSequenceCanvas; touch/reduced fall back to a static poster. NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import ScrollSequenceCanvas from './ScrollSequenceCanvas'

interface PinnedEvalBeatProps {
  reduced: boolean
  isTouch: boolean
}

const PHASES = [
  { key: 'analyzing', label: 'Analyzing the item', sub: 'Reading the photo — shape, material, markings.' },
  { key: 'identified', label: 'Identified', sub: 'The AI knows what it is.' },
  { key: 'scoring', label: 'Handing to MegaBot', sub: 'The four-engine council takes it from here.' },
]

export default function PinnedEvalBeat({ reduced, isTouch }: PinnedEvalBeatProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)
  // NON-PINNED (eval reorder): the eval scrubs on the section's OWN scroll as it passes
  // the viewport — no GSAP pin, so it never stacks against the journey pin above and the
  // scroll never "catches." Progress 0 (entering) -> 1 (leaving). Reduced = static final.
  const { scrollYProgress: progress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  useMotionValueEvent(progress, 'change', (v) => {
    if (reduced) return
    const next = v < 0.4 ? 0 : v < 0.72 ? 1 : 2
    setPhase((prev) => (prev === next ? prev : next))
  })

  // App-UI parallax (5B.2): the HUD card drifts and the scan bar fills with scrub.
  const cardY = useTransform(progress, [0, 1], [36, -28])
  const barScale = useTransform(progress, [0, 1], [0.1, 1])
  // Reduced-motion shows the resolved final state, no drift.
  const shownPhase = reduced ? 2 : phase

  return (
    <section
      ref={sectionRef}
      id="ai-evaluation"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 560,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}
    >
      {/* Canvas image-sequence backdrop (poster <img> on touch/reduced) */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
        <ScrollSequenceCanvas
          progress={progress}
          frameBase="/sequences/eval/frame_"
          frameCount={90}
          posterFrame={80}
          reduced={reduced}
          isTouch={isTouch}
          alt="Legacy-Loop AI evaluating an item and revealing what it is worth"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
      {/* Scrim for AA contrast over the moving frames */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0.72) 45%, rgba(13,17,23,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Evaluation HUD — outcome-as-motion */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{
            y: reduced ? 0 : cardY,
            maxWidth: 460,
            padding: '28px 30px',
            borderRadius: 20,
            background: 'rgba(13,17,23,0.55)',
            border: '1px solid rgba(0,188,212,0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 14 }}>
            AI Evaluation
          </div>
          {/* phase steps */}
          <div style={{ display: 'grid', gap: 12 }}>
            {PHASES.map((p, i) => {
              const active = i === shownPhase
              const done = i < shownPhase
              return (
                <div key={p.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', opacity: active || done ? 1 : 0.4, transition: 'opacity 0.3s ease' }}>
                  <span
                    aria-hidden
                    style={{
                      marginTop: 5,
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: active ? '#22D3EE' : done ? '#22C55E' : 'rgba(255,255,255,0.25)',
                      boxShadow: active ? '0 0 12px rgba(34,211,238,0.7)' : 'none',
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16, color: '#F1F5F9' }}>{p.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.5 }}>{p.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* scan bar */}
          <div style={{ marginTop: 20, height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                borderRadius: 6,
                transformOrigin: 'left',
                scaleX: reduced ? 1 : barScale,
                background: 'linear-gradient(90deg, #00bcd4, #22D3EE)',
              }}
            />
          </div>
          <div style={{ marginTop: 14, fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#94A3B8' }}>
            One photo in. A fair, checked price out.
          </div>
        </motion.div>
      </div>
    </section>
  )
}
