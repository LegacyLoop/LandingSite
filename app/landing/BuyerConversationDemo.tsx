'use client'
// ─────────────────────────────────────────────────────────────────────────────
// BuyerConversationDemo — the live, self-typing BuyerBot conversation (B05 moat).
// CMD-LANDING-PASS3 · W3-POLISH · target 1a. The moat's selling element: a stranger
// watches a message arrive, BuyerBot evaluate it, reply, and a match resolve.
//
// TRUTH FENCE (docs/CANONICAL_FACTS.md · read before editing this file):
//   • DETERMINISTIC scripted data only — this NEVER calls production AI.
//   • Every scripted line is QA'd as if it were AI output under review:
//       - the inbound line is an INTEREST SIGNAL with a SOURCE, never a confirmed buyer
//       - BuyerBot's line is a SUGGESTION the seller reviews — no price, no confidence
//         score, no fabricated per-feature average (§6 AI-confidence · §5 traction)
//       - the resolve reads "Ready for your review" — it NEVER animates "sent" as real
//   • Labeled "Illustrative preview". Manual-mode label is always on screen.
//
// A11Y: the animated visual is aria-hidden; a parallel visually-hidden transcript
// carries the full conversation to screen readers, and a real <button> replays it
// (keyboard-focusable, visible focus ring). Reduced-motion / touch render the resolved
// end-state immediately (no typing, no timers). translate/opacity only. NO EMOJI.
//
// Motion vocabulary: Amaterasu dossier staging — expo + out-quart cinematic easing.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Icon from './Icon'

const EASE_QUART = [0.165, 0.84, 0.44, 1] as const

// The script. Truth-checked line by line (see header). Nothing here overclaims.
const CONVO = {
  signal: {
    text: 'Someone nearby is searching for vintage guitars, 60s–70s.',
    source: 'Marketplace signal',
  },
  botReply: 'That lines up with your listing — looks like a real collector. Want me to surface them to you?',
  match: {
    who: 'Collector',
    what: 'Follows 60s–70s guitars · nearby',
    source: 'Interest signal',
  },
} as const

const SR_TRANSCRIPT =
  'Illustrative BuyerBot preview. An interest signal arrives from a marketplace: ' +
  'someone nearby is searching for vintage guitars from the 60s to 70s. ' +
  'BuyerBot evaluates it and suggests: that lines up with your listing, looks like a ' +
  'real collector, want me to surface them to you? A match resolves: a collector who ' +
  'follows 60s to 70s guitars, nearby, from an interest signal. ' +
  'Manual mode — nothing is sent; you review and approve every contact.'

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

// Deterministic typewriter. active=false → empty; reduced → full immediately.
function useTypewriter(text: string, active: boolean, reduced: boolean, cps = 40) {
  const [n, setN] = useState(reduced ? text.length : 0)
  useEffect(() => {
    if (reduced) {
      setN(text.length)
      return
    }
    if (!active) {
      setN(0)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, 1000 / cps)
    return () => clearInterval(id)
  }, [text, active, reduced, cps])
  return text.slice(0, n)
}

// stage: 0 idle · 1 signal in · 2 BuyerBot evaluating · 3 typing reply · 4 match resolved
function ThinkingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#22D3EE', display: 'inline-block' }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.16 }}
        />
      ))}
    </span>
  )
}

export default function BuyerConversationDemo({
  reduced,
  isTouch,
}: {
  reduced: boolean
  isTouch: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const still = reduced || isTouch
  const [stage, setStage] = useState(still ? 4 : 0)
  const [runId, setRunId] = useState(0)

  // Timeline chain — only runs on a real, in-view, motion-enabled desktop/laptop.
  useEffect(() => {
    if (still) {
      setStage(4)
      return
    }
    if (!inView) {
      setStage(0)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    setStage(1)
    timers.push(setTimeout(() => setStage(2), 950))
    timers.push(setTimeout(() => setStage(3), 2050))
    return () => timers.forEach(clearTimeout)
  }, [inView, still, runId])

  const typed = useTypewriter(CONVO.botReply, stage >= 3, still)
  const typingDone = typed.length >= CONVO.botReply.length

  // Resolve the match a beat after the reply finishes typing.
  useEffect(() => {
    if (still || stage !== 3 || !typingDone) return
    const t = setTimeout(() => setStage(4), 500)
    return () => clearTimeout(t)
  }, [stage, typingDone, still])

  const replay = () => {
    setStage(0)
    setRunId((r) => r + 1)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Illustrative BuyerBot preview"
      style={{
        position: 'relative',
        padding: '20px 20px 16px',
        borderRadius: 20,
        background: 'rgba(13,17,23,0.62)',
        border: '1px solid rgba(0,188,212,0.28)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        overflow: 'hidden',
      }}
    >
      {/* Screen-reader transcript — always the full, honest conversation. */}
      <p style={visuallyHidden}>{SR_TRANSCRIPT}</p>

      {/* ── Header: identity + the honesty label ── */}
      <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ position: 'relative', width: 10, height: 10, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }}>
          {!reduced && (
            <motion.span
              style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid #22C55E' }}
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </span>
        <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F1F5F9' }}>
          BuyerBot
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-data)',
            fontWeight: 600,
            fontSize: 9.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#94A3B8',
            background: 'rgba(148,163,184,0.1)',
            border: '1px solid rgba(148,163,184,0.28)',
            borderRadius: 6,
            padding: '4px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          Illustrative preview
        </span>
      </div>

      {/* ── The conversation. Min-height reserves the resolved layout to avoid CLS. ── */}
      <div aria-hidden style={{ display: 'grid', gap: 10, minHeight: 232, alignContent: 'start' }}>
        {/* 1 · Inbound interest signal (left, muted) */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={still ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE_QUART }}
              style={{ maxWidth: '86%', justifySelf: 'start' }}
            >
              <div style={{ padding: '11px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: '#E2E8F0' }}>{CONVO.signal.text}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, paddingLeft: 2 }}>
                <Icon name="search" size={12} color="#94A3B8" />
                <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94A3B8' }}>
                  {CONVO.signal.source}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2/3 · BuyerBot: evaluating → typed reply (right, teal). Same bubble morphs. */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={still ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE_QUART }}
              style={{ maxWidth: '90%', justifySelf: 'end' }}
            >
              <div
                style={{
                  padding: '11px 14px',
                  borderRadius: '14px 4px 14px 14px',
                  background: 'rgba(0,188,212,0.09)',
                  border: '1px solid rgba(0,188,212,0.3)',
                  boxShadow: '0 0 24px rgba(0,188,212,0.08)',
                  minHeight: 42,
                }}
              >
                {stage === 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ThinkingDots />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#94A3B8' }}>evaluating the match</span>
                  </div>
                ) : (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: '#F1F5F9' }}>
                    {typed}
                    {!still && !typingDone && (
                      <motion.span
                        style={{ display: 'inline-block', width: 2, height: 15, marginLeft: 1, verticalAlign: 'text-bottom', background: '#22D3EE' }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 · The match resolves — halo locks. "Ready for your review", never "sent". */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={still ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_QUART }}
              style={{ position: 'relative', marginTop: 2 }}
            >
              {/* halo lock pulse */}
              {!still && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 0.6, 0], scale: [0.9, 1.06, 1.12] }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: -1, borderRadius: 14, border: '1px solid rgba(34,211,238,0.6)', pointerEvents: 'none' }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 13, background: 'rgba(0,188,212,0.07)', border: '1px solid rgba(0,188,212,0.32)' }}>
                <span style={{ width: 36, height: 36, minWidth: 36, borderRadius: '50%', background: 'rgba(0,188,212,0.15)', border: '1px solid rgba(0,188,212,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="target" size={17} color="#22D3EE" />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#F1F5F9' }}>{CONVO.match.who}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#94A3B8' }}>{CONVO.match.what}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#22D3EE', background: 'rgba(0,188,212,0.1)', border: '1px solid rgba(0,188,212,0.28)', borderRadius: 6, padding: '4px 7px', whiteSpace: 'nowrap' }}>
                  {CONVO.match.source}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, paddingLeft: 2 }}>
                <Icon name="check" size={13} color="#22C55E" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#CBD5E1' }}>Ready for your review</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer: the standing manual-mode truth + a real replay control ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Icon name="shield" size={14} color="#22C55E" />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.4, color: '#CBD5E1' }}>
          Manual mode &mdash; nothing is sent. You approve every contact.
        </span>
        {!still && (
          <button
            type="button"
            onClick={replay}
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              minHeight: 44,
              padding: '8px 12px',
              borderRadius: 9,
              background: 'transparent',
              border: '1px solid rgba(0,188,212,0.3)',
              color: '#22D3EE',
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <Icon name="bolt" size={13} color="#22D3EE" />
            Replay
          </button>
        )}
      </div>
    </div>
  )
}
