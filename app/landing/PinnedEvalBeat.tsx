'use client'
// ─────────────────────────────────────────────────────────────────────────────
// PinnedEvalBeat — B03 "it knows what it is" (CMD-LANDING-PASS3 · W3)
//
// The AI-evaluation beat, Cleo-class outcome-as-motion: the section PINS and, as
// you scroll, a canvas image-sequence of the valuation plays while an evaluation
// HUD resolves (analyzing -> identified -> scoring). Leads into the existing
// MegaBot consensus section below — that hand-tuned section is NOT touched.
//
// GSAP ScrollTrigger is DYNAMICALLY IMPORTED here (code-split, below-fold chunk) —
// it is never in the initial bundle. Pin discipline: ~120vh per pinned beat,
// disabled below tablet (static), reduced-motion = unpinned static. The canvas
// reuses ScrollSequenceCanvas, driven by a MotionValue bridged from ScrollTrigger.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion'
import ScrollSequenceCanvas from './ScrollSequenceCanvas'
import { getLenis } from './lenis-instance'

interface PinnedEvalBeatProps {
  reduced: boolean
  isTouch: boolean
  width: number
}

const PHASES = [
  { key: 'analyzing', label: 'Analyzing the item', sub: 'Reading the photo — shape, material, markings.' },
  { key: 'identified', label: 'Identified', sub: 'The AI knows what it is.' },
  { key: 'scoring', label: 'Handing to MegaBot', sub: 'The four-engine council takes it from here.' },
]

export default function PinnedEvalBeat({ reduced, isTouch, width }: PinnedEvalBeatProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useMotionValue(0)
  const [phase, setPhase] = useState(0)
  // Pin only where it earns its frame budget: desktop-motion, tablet and up.
  const canPin = !reduced && !isTouch && width >= 768

  useEffect(() => {
    if (!canPin || !sectionRef.current) return
    let cancelled = false
    let killer: (() => void) | null = null
    ;(async () => {
      try {
        const [{ gsap }, stMod] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        // The dynamic-import namespace types .ScrollTrigger as the plugin class; this
        // cast narrows to that known export (no `any`, matches the runtime shape).
        const ScrollTrigger = (stMod as { ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }).ScrollTrigger
        if (cancelled || !sectionRef.current) return
        gsap.registerPlugin(ScrollTrigger)

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => progress.set(self.progress),
        })

        // Bridge to Lenis: it runs autoRaf:false on its own rAF, so ScrollTrigger must
        // be told to update on every Lenis scroll frame or the pin reads a stale scroll
        // position and judders. This is THE integration that makes the pin butter-smooth.
        const lenis = getLenis()
        const onLenisScroll = () => ScrollTrigger.update()
        if (lenis) lenis.on('scroll', onLenisScroll)

        // Re-measure the pin start/end + spacer once late layout (fonts, frames) settles,
        // and on resize/orientation — otherwise the spacer mis-sizes MegaBotSection below.
        const refresh = () => ScrollTrigger.refresh()
        const refreshTimer = window.setTimeout(refresh, 300)
        window.addEventListener('resize', refresh)
        window.addEventListener('orientationchange', refresh)

        killer = () => {
          window.clearTimeout(refreshTimer)
          window.removeEventListener('resize', refresh)
          window.removeEventListener('orientationchange', refresh)
          if (lenis) lenis.off('scroll', onLenisScroll)
          st.kill()
        }
      } catch (err) {
        // Chunk load / gsap failure: the section degrades to a normal-scroll block —
        // the canvas + HUD still render. Surface it (post-deploy chunk 404s are real)
        // and resolve the HUD to its final state so the payoff copy still shows.
        console.error('[PinnedEvalBeat] gsap/ScrollTrigger failed; static fallback', err)
        if (!cancelled) setPhase(2)
      }
    })()
    return () => {
      cancelled = true
      if (killer) killer()
    }
  }, [canPin, progress])

  useMotionValueEvent(progress, 'change', (v) => {
    const next = v < 0.4 ? 0 : v < 0.75 ? 1 : 2
    setPhase((prev) => (prev === next ? prev : next))
  })

  // App-UI parallax (5B.2): the HUD card drifts and the scan bar fills with scrub.
  const cardY = useTransform(progress, [0, 1], [36, -28])
  const barScale = useTransform(progress, [0, 1], [0.04, 1])
  // Static (reduced / touch / mobile) shows the resolved final state.
  const shownPhase = canPin ? phase : 2

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
            y: canPin ? cardY : 0,
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
                scaleX: canPin ? barScale : 1,
                background: 'linear-gradient(90deg, #00bcd4, #22D3EE)',
              }}
            />
          </div>
          <div style={{ marginTop: 14, fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#94A3B8' }}>
            A free AI hands you a listing. Legacy-Loop brings you the buyer.
          </div>
        </motion.div>
      </div>
    </section>
  )
}
