'use client'

// ─────────────────────────────────────────────────────────────────────────────
// /estate — the Estate Stewardship consultation route (landing flagship seed).
//
// CMD-LANE-A2 V20 · 2026-07-29 · Agent A. HELD DARK behind NEXT_PUBLIC_ESTATE_INTAKE_ENABLED.
// A steady hand for a grieving family: consult-first, no prices, no packages, no outcome promises.
// This is the top of a HUMAN process — Ryan reviews every inquiry personally and calls the family.
//
// STATE MODEL (privacy STOP · shared with A-1's ruling):
//   flag OFF (default, SHIPPED state) → dignified consult placeholder + link into the waitlist walkthrough.
//   flag ON  (post CEO privacy ruling) → the intake form renders and POSTs to the existing pipeline.
// Reuses the deployed app /api/waitlist (CORS-allowed for legacy-loop.com · #16 no second pipeline):
//   sellerType=estate · servicePreference=whiteGlove (→ existing LOUD Intent-Gate) · source=landing-estate-card.
//   Non-PII fixed-chip answers compose the `note`; phone/city/free-text are sent but the route ignores
//   them (dark-safe: no new personal-data class flows until deliberately wired — see A-1 privacy trace).
//
// LAW #51: the callback window is the LITERAL placeholder "[X]" — never invent a duration or a date.
// Estate register: gold (#D4AF37), calm pacing, generous whitespace. Senior floors: 16px+, 44px targets.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const INTAKE_ENABLED = process.env.NEXT_PUBLIC_ESTATE_INTAKE_ENABLED === 'true'
const GOLD = '#D4AF37'
const APP_WAITLIST = 'https://app.legacy-loop.com/api/waitlist'

const SITUATIONS = [
  { v: 'settling_estate', l: "Settling a loved one's estate" },
  { v: 'downsizing', l: 'Downsizing my own home' },
  { v: 'helping_parent', l: 'Helping a parent transition' },
  { v: 'moving', l: 'Moving or relocating' },
  { v: 'other', l: 'Something else' },
]
const TIMING = [
  { v: 'no_rush', l: 'No rush — planning ahead' },
  { v: 'few_months', l: 'The next few months' },
  { v: 'few_weeks', l: 'The next few weeks' },
  { v: 'urgent', l: 'As soon as possible' },
]
const VOLUME = [
  { v: 'under_50', l: 'A few dozen items' },
  { v: '50_200', l: '50 – 200 items' },
  { v: '200_500', l: '200 – 500 items' },
  { v: 'whole_home', l: 'A whole home or more' },
]
const ITEM_TYPES = ['Furniture', 'Antiques', 'Jewelry', 'Collectibles', 'Art', 'Vehicles', 'Tools & equipment', 'Everyday household']
const CALL_TIMES = [
  { v: 'morning', l: 'Mornings' },
  { v: 'afternoon', l: 'Afternoons' },
  { v: 'evening', l: 'Evenings' },
  { v: 'any', l: 'Any time' },
]

const page: React.CSSProperties = { minHeight: '100vh', background: '#0B0B0F', color: '#F1F5F9', padding: '64px 20px', fontFamily: 'var(--font-plus-jakarta, system-ui)' }
const shell: React.CSSProperties = { maxWidth: 640, margin: '0 auto' }
const label: React.CSSProperties = { display: 'block', fontSize: 16, fontWeight: 600, color: '#F1F5F9', marginBottom: 8 }
const input: React.CSSProperties = { width: '100%', minHeight: 48, padding: '12px 14px', fontSize: 16, color: '#F1F5F9', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, boxSizing: 'border-box', fontFamily: 'inherit' }
const field: React.CSSProperties = { marginBottom: 24 }
function chip(on: boolean): React.CSSProperties {
  return { minHeight: 44, padding: '10px 16px', fontSize: 15, fontWeight: on ? 700 : 500, cursor: 'pointer', borderRadius: 12, textAlign: 'left', color: on ? GOLD : '#CBD5E1', background: on ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.14)'}`, transition: 'all 0.15s ease' }
}

function EstateEyebrow() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: 'rgba(212,175,55,0.12)', color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        In development · by consultation
      </span>
      <h1 style={{ fontFamily: 'var(--font-exo2, inherit)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.15 }}>The Estate Stewardship Program</h1>
      <p style={{ color: '#CBD5E1', maxWidth: 520, margin: '0 auto', lineHeight: 1.7, fontSize: 17 }}>
        For a full estate, we start with a conversation — then a plan built around your home, your timeline,
        and what matters most. There is nothing to pay and nothing to sign.
      </p>
    </div>
  )
}

function Placeholder() {
  return (
    <div style={page}>
      <div style={shell}>
        <EstateEyebrow />
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 18, padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#CBD5E1', lineHeight: 1.7, fontSize: 16, marginTop: 0 }}>
            We are onboarding estate families personally while the program is built out. Tell us about your
            situation and Ryan will reach out to talk it through.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <a href="/landing#waitlist" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none', color: '#0B0B0F', background: GOLD }}>
              Request a consultation
            </a>
            <a href="mailto:support@legacy-loop.com?subject=Estate%20Consultation" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', color: '#F1F5F9', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}>
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EstatePage() {
  const [situation, setSituation] = useState('')
  const [timing, setTiming] = useState('')
  const [volume, setVolume] = useState('')
  const [items, setItems] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [callTime, setCallTime] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (!INTAKE_ENABLED) return <Placeholder />

  const toggle = (t: string) => setItems((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))
  const lab = (o: { v: string; l: string }[], v: string) => o.find((x) => x.v === v)?.l ?? ''

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim()) return setError('Please tell us your first name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Please enter an email we can reach you at.')
    if (!situation) return setError('Please choose what best fits your situation.')
    const note = [
      situation && `Situation: ${lab(SITUATIONS, situation)}`,
      timing && `Timing: ${lab(TIMING, timing)}`,
      volume && `Volume: ${lab(VOLUME, volume)}`,
      items.length ? `Items: ${items.join(', ')}` : '',
    ].filter(Boolean).join(' · ').slice(0, 200)
    setBusy(true)
    try {
      const res = await fetch(APP_WAITLIST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(),
          tierInterest: 'estate', reason: 'estate', sellerType: 'estate',
          servicePreference: 'whiteGlove', source: 'landing-estate-card',
          zip: zip.trim(), note, company,
          // ignored-by-route (dark-safe · carried for go-live wiring):
          phone: phone.trim(), callTime, city: city.trim(), message: message.trim().slice(0, 1000),
        }),
      })
      if (!res.ok) throw new Error('bad status')
      setDone(true)
    } catch {
      setError('Something went wrong sending that. Please email support@legacy-loop.com.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div style={page}>
        <div style={shell}>
          <EstateEyebrow />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 18, padding: 32, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-exo2, inherit)', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Thank you — this is in good hands.</div>
            {/* LAW #51: [X] is a LITERAL placeholder — the real callback window is CEO-set, never invented here. */}
            <p style={{ color: '#CBD5E1', lineHeight: 1.7, fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
              Ryan will personally review what you shared and call you within [X]. There is nothing to pay and
              nothing to sign — this is a conversation first.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={page}>
      <form onSubmit={submit} style={shell} noValidate>
        <EstateEyebrow />

        {/* honeypot */}
        <div aria-hidden style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
          <label>Company<input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
        </div>

        <div style={field}>
          <span style={label}>What best describes your situation?</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8 }}>
            {SITUATIONS.map((s) => <button type="button" key={s.v} onClick={() => setSituation(s.v)} style={chip(situation === s.v)} aria-pressed={situation === s.v}>{s.l}</button>)}
          </div>
        </div>

        <div style={field}>
          <span style={label}>How soon are you hoping to start? <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 8 }}>
            {TIMING.map((t) => <button type="button" key={t.v} onClick={() => setTiming(timing === t.v ? '' : t.v)} style={chip(timing === t.v)} aria-pressed={timing === t.v}>{t.l}</button>)}
          </div>
        </div>

        <div style={field}>
          <span style={label}>Roughly how much is there to sell? <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 8 }}>
            {VOLUME.map((v) => <button type="button" key={v.v} onClick={() => setVolume(volume === v.v ? '' : v.v)} style={chip(volume === v.v)} aria-pressed={volume === v.v}>{v.l}</button>)}
          </div>
        </div>

        <div style={field}>
          <span style={label}>What kinds of things? <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(choose any)</em></span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 8 }}>
            {ITEM_TYPES.map((t) => <button type="button" key={t} onClick={() => toggle(t)} style={chip(items.includes(t))} aria-pressed={items.includes(t)}>{t}</button>)}
          </div>
        </div>

        <div style={{ ...field, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16 }}>
          <label><span style={label}>Town / City <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(Maine-first)</em></span><input style={input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Waterville" autoComplete="address-level2" /></label>
          <label><span style={label}>ZIP <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><input style={input} value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" placeholder="04901" autoComplete="postal-code" /></label>
        </div>

        <div style={{ ...field, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16 }}>
          <label><span style={label}>First name</span><input style={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required /></label>
          <label><span style={label}>Last name <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><input style={input} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></label>
        </div>

        <div style={field}><label><span style={label}>Email</span><input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label></div>

        <div style={{ ...field, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16 }}>
          <label><span style={label}>Phone <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><input style={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(207) 000-0000" autoComplete="tel" /></label>
          <div>
            <span style={label}>Best time to call <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))', gap: 8 }}>
              {CALL_TIMES.map((c) => <button type="button" key={c.v} onClick={() => setCallTime(callTime === c.v ? '' : c.v)} style={chip(callTime === c.v)} aria-pressed={callTime === c.v}>{c.l}</button>)}
            </div>
          </div>
        </div>

        <div style={field}><label><span style={label}>Anything you'd like us to know? <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><textarea style={{ ...input, minHeight: 96, resize: 'vertical' }} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} /></label></div>

        {error && <div role="alert" style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: 15 }}>{error}</div>}

        <button type="submit" disabled={busy} style={{ width: '100%', minHeight: 52, fontSize: 17, fontWeight: 800, color: '#0B0B0F', background: GOLD, border: 'none', borderRadius: 14, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Sending…' : 'Send my estate inquiry'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 12, lineHeight: 1.6 }}>A person reads every inquiry. No payment, no account required — we'll reach out to talk.</p>
      </form>
    </div>
  )
}
