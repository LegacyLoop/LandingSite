'use client'
// ─────────────────────────────────────────────────────────────────────────────
// JourneyChapter — the five-step pinned journey (CMD-LANDING-PASS3 · W3-B, F-3)
//
// Replaces the "2003 PowerPoint" four-steps. Grassfeld switcher + Telescope App-UI
// parallax: the section PINS, and as you scroll the ACTIVE STEP advances through a
// device-framed stage that switches its crafted UI per step. FIVE steps, with SHIP
// & GET PAID (TMS, parcel to freight) given real weight — the CEO's own catch.
// Crafted UI beats, NOT raw video. GSAP dynamically imported (code-split); Lenis
// bridged for smooth pin. Below tablet / reduced-motion: no pin — the five steps
// render stacked, each with its stage, on normal scroll. NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { getLenis } from './lenis-instance'
import Icon from './Icon'

interface JourneyChapterProps {
  reduced: boolean
  isTouch: boolean
  width: number
}

interface Step {
  key: string
  n: number
  title: string
  desc: string
  icon: string
}

const STEPS: Step[] = [
  { key: 'upload', n: 1, title: 'Upload a photo', desc: 'Snap it on your phone. The AI takes it from there.', icon: 'camera' },
  { key: 'analyze', n: 2, title: 'AI analysis', desc: 'It reads the make, the era, the condition in seconds.', icon: 'brain' },
  { key: 'price', n: 3, title: 'Fair pricing', desc: 'MegaBot puts four AI engines on the number and agrees a fair range.', icon: 'chart' },
  { key: 'buyer', n: 4, title: 'Find the buyer', desc: 'BuyerBot surfaces real interested buyers. You approve every contact.', icon: 'target' },
  { key: 'ship', n: 5, title: 'Ship & get paid', desc: 'Real carrier rates, parcel to freight. Print the label, get paid.', icon: 'box' },
]

// ── the crafted per-step stage UI (no video) ──────────────────────────────────
function Row({ children, dim = false }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: dim ? 'rgba(255,255,255,0.02)' : 'rgba(0,188,212,0.06)', border: `1px solid ${dim ? 'rgba(255,255,255,0.07)' : 'rgba(0,188,212,0.2)'}` }}>
      {children}
    </div>
  )
}

function StepStage({ step }: { step: string }) {
  const label = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: '#F1F5F9' } as const
  const sub = { fontFamily: 'var(--font-body)', fontSize: 12, color: '#94A3B8' } as const
  const num = { fontFamily: 'var(--font-data)', fontWeight: 700, color: '#22D3EE' } as const
  if (step === 'upload') {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '28px 16px', borderRadius: 14, border: '1.5px dashed rgba(0,188,212,0.4)', background: 'rgba(0,188,212,0.04)' }}>
          <Icon name="camera" size={30} color="#22D3EE" />
          <div style={label}>Add a photo</div>
          <div style={sub}>Point, shoot, done.</div>
        </div>
        <Row><span style={{ ...num, fontSize: 12 }}>JPG</span><span style={sub}>guitar_frontroom.jpg</span><span style={{ marginLeft: 'auto', color: '#22C55E' }}><Icon name="check" size={16} /></span></Row>
      </div>
    )
  }
  if (step === 'analyze') {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ position: 'relative', height: 96, borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(0,188,212,0.12), rgba(139,92,246,0.1))', border: '1px solid rgba(0,188,212,0.2)' }}>
          <motion.div aria-hidden initial={{ y: '-100%' }} animate={{ y: '100%' }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(34,211,238,0.35), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 12, ...label }}>Reading the item…</div>
        </div>
        <Row><Icon name="check" size={16} color="#22C55E" /><span style={label}>Acoustic guitar</span><span style={{ ...sub, marginLeft: 'auto' }}>1970s · good</span></Row>
      </div>
    )
  }
  if (step === 'price') {
    const engines = [
      { n: 'OpenAI', c: '#22c55e', w: '72%' },
      { n: 'Claude', c: '#a78bfa', w: '80%' },
      { n: 'Gemini', c: '#3b82f6', w: '76%' },
      { n: 'Grok', c: '#f97316', w: '78%' },
    ]
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {engines.map((e) => (
          <div key={e.n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ ...sub, width: 52, color: e.c }}>{e.n}</span>
            <div style={{ flex: 1, height: 7, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: e.w }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }} style={{ height: '100%', borderRadius: 6, background: e.c }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.3)' }}>
          <span style={label}>Fair range</span>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 20, color: '#F1F5F9', marginLeft: 'auto' }}>$180&ndash;$240</span>
        </div>
        <div style={{ ...sub, textAlign: 'right' }}>illustrative · your item, your number</div>
      </div>
    )
  }
  if (step === 'buyer') {
    const buyers = [
      { t: 'Collector, vintage guitars', s: 'from a marketplace signal' },
      { t: 'Local musician', s: 'nearby, actively looking' },
    ]
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {buyers.map((b) => (
          <Row key={b.t}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,188,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="target" size={15} color="#22D3EE" /></div>
            <div><div style={label}>{b.t}</div><div style={sub}>{b.s}</div></div>
          </Row>
        ))}
        <div style={{ ...sub, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Icon name="shield" size={13} color="#22C55E" /> Manual mode &mdash; you approve every contact.
        </div>
      </div>
    )
  }
  // ship — the TMS beat, real weight
  const carriers = [
    { n: 'USPS', c: '#333366', p: '$8.20', k: 'Ground, 1-3 days' },
    { n: 'UPS', c: '#351c15', p: '$11.40', k: 'Ground' },
    { n: 'FedEx', c: '#4d148c', p: '$12.05', k: 'Home' },
  ]
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {carriers.map((c, i) => (
        <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: i === 0 ? 'rgba(0,188,212,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? 'rgba(0,188,212,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: c.c, boxShadow: `0 0 0 1px rgba(255,255,255,0.15)` }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#F1F5F9', width: 54 }}>{c.n}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: '#94A3B8' }}>{c.k}</span>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginLeft: 'auto' }}>{c.p}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}>
        <Icon name="box" size={15} color="#D4AF37" />
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#F1F5F9' }}>Too big to box?</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: '#94A3B8', marginLeft: 'auto' }}>Freight &amp; LTL, handled</span>
      </div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#22C55E' }}>
        <Icon name="check" size={15} color="#22C55E" /> Label printed &middot; parcel or freight, straight out of the sale.
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#94A3B8', textAlign: 'right' }}>example rates &middot; live rates at checkout</div>
    </div>
  )
}

// The device-framed stage container that switches content per active step.
function Stage({ step, parallax }: { step: string; parallax: number | MotionValue<number> }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <motion.div
        style={{
          y: parallax,
          padding: 12,
          borderRadius: 30,
          background: 'linear-gradient(150deg, #1c2230 0%, #0b0d13 60%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 50px rgba(0,188,212,0.08)',
          transform: 'translateZ(0)',
        }}
      >
        <div style={{ borderRadius: 22, background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)', padding: 18, minHeight: 300 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22D3EE' }} />
            <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: '#8B949E', textTransform: 'uppercase' }}>Legacy-Loop</span>
          </div>
          <AnimatedStageBody step={step} />
        </div>
      </motion.div>
    </div>
  )
}

function AnimatedStageBody({ step }: { step: string }) {
  return (
    <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
      <StepStage step={step} />
    </motion.div>
  )
}

export default function JourneyChapter({ reduced, isTouch, width }: JourneyChapterProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useMotionValue(0)
  const [active, setActive] = useState(0)
  const canPin = !reduced && !isTouch && width >= 900
  const parallax = useTransform(progress, [0, 1], [10, -10])
  const parallaxStatic = 0

  useEffect(() => {
    if (!canPin || !sectionRef.current) return
    let cancelled = false
    let killer: (() => void) | null = null
    ;(async () => {
      try {
        const [{ gsap }, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
        const ScrollTrigger = (stMod as { ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }).ScrollTrigger
        if (cancelled || !sectionRef.current) return
        gsap.registerPlugin(ScrollTrigger)
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=' + STEPS.length * 68 + '%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => progress.set(self.progress),
        })
        const lenis = getLenis()
        const onScroll = () => ScrollTrigger.update()
        if (lenis) lenis.on('scroll', onScroll)
        const refresh = () => ScrollTrigger.refresh()
        const t = window.setTimeout(refresh, 300)
        window.addEventListener('resize', refresh)
        killer = () => {
          window.clearTimeout(t)
          window.removeEventListener('resize', refresh)
          if (lenis) lenis.off('scroll', onScroll)
          st.kill()
        }
      } catch (err) {
        console.error('[JourneyChapter] gsap failed; static fallback', err)
      }
    })()
    return () => {
      cancelled = true
      if (killer) killer()
    }
  }, [canPin, progress])

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))
    setActive((prev) => (prev === idx ? prev : idx))
  })

  // ── PINNED (desktop) ────────────────────────────────────────────────────────
  if (canPin) {
    return (
      <section ref={sectionRef} id="how-it-works" style={{ position: 'relative', height: '100vh', minHeight: 620, overflow: 'hidden', display: 'flex', alignItems: 'center', zIndex: 5 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 56, alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 12 }}>THE PROCESS</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(28px, 3.5vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.08, color: '#F1F5F9', margin: '0 0 28px' }}>
              From photo to paid, in five steps.
            </h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {STEPS.map((s, i) => {
                const on = i === active
                const done = i < active
                return (
                  <div key={s.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: on ? 'rgba(0,188,212,0.08)' : 'transparent', border: `1px solid ${on ? 'rgba(0,188,212,0.3)' : 'transparent'}`, transition: 'background 0.35s ease, border-color 0.35s ease' }}>
                    <div style={{ width: 30, height: 30, minWidth: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 14, background: on || done ? '#00BCD4' : 'rgba(255,255,255,0.06)', color: on || done ? '#0D1117' : '#8B949E', transition: 'background 0.35s ease, color 0.35s ease' }}>{s.n}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: on ? '#F1F5F9' : '#8B949E', transition: 'color 0.35s ease' }}>{s.title}</div>
                      <motion.p initial={false} animate={{ opacity: on ? 1 : 0, height: on ? 'auto' : 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden', fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#CBD5E1', lineHeight: 1.55, margin: 0 }}>{s.desc}</motion.p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Stage step={STEPS[active].key} parallax={parallax} />
        </div>
      </section>
    )
  }

  // ── STACKED (mobile / reduced) — no pin, every step visible on normal scroll ──
  return (
    <section id="how-it-works" style={{ position: 'relative', zIndex: 5, padding: width < 480 ? '64px 16px' : '90px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 12, textAlign: 'center' }}>THE PROCESS</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(26px, 7vw, 38px)', letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F1F5F9', margin: '0 auto 36px', textAlign: 'center' }}>
          From photo to paid, in five steps.
        </h2>
        <div style={{ display: 'grid', gap: 28 }}>
          {STEPS.map((s) => (
            <div key={s.key} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 34, height: 34, minWidth: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 16, background: '#00BCD4', color: '#0D1117' }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: '#F1F5F9' }}>{s.title}</div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#CBD5E1', lineHeight: 1.55, margin: '2px 0 0' }}>{s.desc}</p>
                </div>
              </div>
              <Stage step={s.key} parallax={parallaxStatic} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
