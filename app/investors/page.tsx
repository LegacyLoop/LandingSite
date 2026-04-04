'use client'

import { useState, useEffect, useRef } from 'react'

function useWindowWidth() {
  const [w, setW] = useState(1200)
  useEffect(() => {
    setW(window.innerWidth)
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

function AnimatedStat({ target, prefix = '', suffix = '', duration = 2200, style: extraStyle }: { target: number; prefix?: string; suffix?: string; duration?: number; style?: React.CSSProperties }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.unobserve(el) } }, { threshold: 0.6 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])
  useEffect(() => {
    if (!started) return
    const start = Date.now()
    const tick = () => { const elapsed = Date.now() - start; const progress = Math.min(elapsed / duration, 1); const eased = 1 - Math.pow(1 - progress, 4); setCount(Math.round(eased * target)); if (progress < 1) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  }, [started, target, duration])
  return <span ref={ref} style={extraStyle}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function InvestorsPage() {
  const width = useWindowWidth()
  const cols = width >= 1024 ? 'repeat(5, 1fr)' : width >= 640 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const stats = [
    { value: '$48B', label: 'Market Size' },
    { value: '85%+', label: 'AI Credit Margins' },
    { value: '5', label: 'Revenue Streams' },
    { value: '10+1', label: 'AI Bots + MegaBot' },
    { value: '50+', label: 'Platform Integrations' },
  ]

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(0,188,212,0.15)',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
    padding: 28,
    textAlign: 'center',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0,188,212,0.08)',
      }}>
        <div style={{ maxWidth: 1080, width: '100%', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/landing" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png" alt="LegacyLoop" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>Legacy-Loop</span>
          </a>
          <a href="/landing" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', textDecoration: 'none' }}>Back to Home</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 12, color: '#00BCD4', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>PARTNER WITH US</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 52px)', color: '#F1F5F9', margin: '16px 0 24px', lineHeight: 1.2 }}>
            We&apos;re Raising $50K&ndash;$150K in Seed Funding
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 18, color: '#CBD5E1', maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
            LegacyLoop is positioned to become the infrastructure layer of the resale economy. We&apos;re raising to scale from beta to national launch.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: cols, gap: 20 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={cardStyle}>
              <div style={{
                fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 28,
                background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Opportunity */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(24px, 3vw, 34px)', color: '#F1F5F9', marginBottom: 24, textAlign: 'center' }}>The Opportunity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: width < 640 ? '1fr' : 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
            <div style={cardStyle}>
              <AnimatedStat target={10000} suffix="+" style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 36, background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', marginTop: 8 }}>Americans turn 65 every day</p>
            </div>
            <div style={cardStyle}>
              <AnimatedStat target={48} prefix="$" suffix="B" style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 36, background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', marginTop: 8 }}>Estate and resale market</p>
            </div>
            <div style={cardStyle}>
              <AnimatedStat target={76} suffix="%" style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 36, background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', marginTop: 8 }}>Say pricing is their biggest frustration</p>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(24px, 3vw, 34px)', color: '#F1F5F9', marginBottom: 24, textAlign: 'center' }}>Why LegacyLoop</h2>
          {[
            { icon: '🤖', title: '10 AI Bots + MegaBot', desc: 'From item identification to video ad creation — every step automated with purpose-built AI.' },
            { icon: '🧠', title: '4-Engine MegaBot Consensus', desc: 'OpenAI, Claude, Gemini, and Grok run in parallel. When 4 AIs agree, you can trust the number.' },
            { icon: '📦', title: 'Full-Stack Resale Automation', desc: 'Photo to listing to shipping to payment. One platform replaces a dozen tools.' },
            { icon: '💛', title: 'Built for Families First', desc: 'Estate sales with dignity. Garage sales made simple. Veterans get 25% off. Nothing goes to waste.' },
            { icon: '📊', title: '5 Revenue Streams', desc: 'Subscriptions, commissions, AI credits, add-on services, and white-glove estate coordination.' },
          ].map((item) => (
            <div key={item.title} style={{ ...cardStyle, textAlign: 'left', display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: '#F1F5F9' }}>{item.title}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#CBD5E1', marginTop: 4, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(24px, 3vw, 34px)', color: '#F1F5F9', marginBottom: 16 }}>Interested in Partnering?</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: '#CBD5E1', marginBottom: 40, lineHeight: 1.65 }}>
            We&apos;d love to share our pitch deck and discuss how LegacyLoop is building the future of resale.
          </p>
          <a
            href="mailto:ryan@legacy-loop.com?subject=LegacyLoop%20Investor%20Inquiry"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #00bcd4, #009688)', color: '#fff',
              fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18,
              padding: '18px 48px', borderRadius: 12, textDecoration: 'none',
              boxShadow: '0 0 32px rgba(0,188,212,0.35), 0 4px 16px rgba(0,188,212,0.2)',
              minHeight: 44,
            }}
          >
            Request Our Pitch Deck
          </a>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', marginTop: 16 }}>
            Or email us directly: <a href="mailto:ryan@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>ryan@legacy-loop.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>
          &copy; 2026 LegacyLoop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy</a> | <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms</a>
        </p>
      </footer>
    </div>
  )
}
