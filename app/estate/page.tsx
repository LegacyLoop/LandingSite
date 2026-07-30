'use client'

// ─────────────────────────────────────────────────────────────────────────────
// /estate — the Estate Stewardship consultation route (landing flagship).
//
// CMD-ESTATE-EXPERIENCE-V2 V20 · 2026-07-30 · Agent A. Rebuilds the A-2 single-page
// seed into the guided, one-question-per-view intake (question set v2, CEO-approved).
// A steady hand for a grieving family: consult-first, no prices, no packages, no
// outcome promises. This is the top of a HUMAN process — Ryan reviews every inquiry
// personally and calls the family.
//
// STATE MODEL (privacy STOP · shared with A-1's ruling):
//   flag OFF (default, SHIPPED state) → dignified consult placeholder + link into the waitlist.
//   flag ON  (Devin flips at G1 privacy + G2 mailbox green) → the guided intake renders and POSTs.
// Reuses the deployed app /api/waitlist (CORS-allowed for legacy-loop.com · #16 no second pipeline):
//   sellerType=estate · servicePreference=whiteGlove (→ existing LOUD Intent-Gate) · source=landing-estate-card.
//   The note leads with the "who is this for" answer so the executor/family distinction is the FIRST
//   line of the notification email (CEO 1b — an executor and a grieving spouse need different first calls).
//
// PRIVACY (A-1 trace): phone / town / ZIP / free-text are personal-data classes not yet covered by the
//   published privacy policy. They are gated behind INCLUDE_PII_FIELDS so they can be cleanly hidden at
//   go-live if the CEO ruling lands that way — hiding them never breaks the flow or the submit.
//
// LAW #51: the callback window is the LITERAL placeholder "[X]" — never invent a duration or a date.
// Estate register: gold (#D4AF37), calm pacing, generous whitespace. Senior floors: 16px+, 44px targets.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const INTAKE_ENABLED = process.env.NEXT_PUBLIC_ESTATE_INTAKE_ENABLED === 'true'
// Personal-data classes awaiting privacy-policy coverage. Flip to false at go-live to
// cleanly drop phone / town / ZIP / free-text from render AND payload (dark-safe).
const INCLUDE_PII_FIELDS = true
const GOLD = '#D4AF37'
const APP_WAITLIST = 'https://app.legacy-loop.com/api/waitlist'

type Opt = { v: string; l: string; sub?: string }

const SITUATIONS: Opt[] = [
  { v: 'estate_loss', l: 'Settling an estate after a loss', sub: 'We move at your pace' },
  { v: 'downsizing', l: 'Downsizing my own home', sub: 'Less to carry into the next chapter' },
  { v: 'clearing_family_home', l: 'Clearing a family home', sub: 'A house full of years' },
  { v: 'group_sale', l: 'A group or neighborhood sale', sub: 'Several families together' },
  { v: 'exploring', l: 'Just exploring for now', sub: 'No pressure at all' },
]
const WHO_FOR: Opt[] = [
  { v: 'me_family', l: 'Me and my family' },
  { v: 'executor', l: "An estate I'm responsible for", sub: 'Executor, trustee, or personal representative' },
  { v: 'several_families', l: 'Several families together' },
]
const PROPERTY: Opt[] = [
  { v: 'house', l: 'A house' },
  { v: 'apartment', l: 'An apartment or condo' },
  { v: 'storage', l: 'Storage unit(s)' },
  { v: 'multiple', l: 'Multiple locations' },
]
const VOLUME: Opt[] = [
  { v: 'few_items', l: 'A few significant items' },
  { v: 'room_or_two', l: 'A room or two' },
  { v: 'most_household', l: 'Most of a household' },
  { v: 'entire_home', l: 'An entire home and more' },
]
const ITEM_TYPES = ['Furniture', 'Antiques & collectibles', 'Vehicles', 'Tools & equipment', 'Everyday household']
const TIMING: Opt[] = [
  { v: 'asap', l: 'As soon as possible' },
  { v: 'few_weeks', l: 'In the next few weeks' },
  { v: 'coming_months', l: 'In the coming months' },
  { v: 'no_date', l: 'No date yet' },
]
const INVOLVEMENT: Opt[] = [
  { v: 'full_service', l: 'Do it all for me', sub: 'We carry the whole sale' },
  { v: 'key_steps', l: 'Help me at the key steps', sub: 'A hand where it matters' },
  { v: 'self_drive', l: "I'll drive it with your tools", sub: 'You lead, we assist' },
]
const FAMILIES: Opt[] = [
  { v: '2_3', l: '2–3 families' },
  { v: '4_6', l: '4–6 families' },
  { v: '7_8', l: '7–8 families' },
]
const CALL_TIMES: Opt[] = [
  { v: 'morning', l: 'Mornings' },
  { v: 'afternoon', l: 'Afternoons' },
  { v: 'evening', l: 'Evenings' },
  { v: 'any', l: 'Any time' },
]

// ── styling (inline, senior floors) ──────────────────────────────────────────
const pageStyle: React.CSSProperties = { minHeight: '100vh', background: '#0B0B0F', color: '#F1F5F9', padding: '56px 20px 80px', fontFamily: 'var(--font-body, system-ui)' }
const shell: React.CSSProperties = { maxWidth: 620, margin: '0 auto' }
const qTitle: React.CSSProperties = { fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', margin: '0 0 6px' }
const qHint: React.CSSProperties = { color: '#94A3B8', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 600, color: '#F1F5F9', marginBottom: 8 }
const inputStyle: React.CSSProperties = { width: '100%', minHeight: 50, padding: '13px 15px', fontSize: 16, color: '#F1F5F9', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, boxSizing: 'border-box', fontFamily: 'inherit' }

function chipStyle(on: boolean, big = false): React.CSSProperties {
  return {
    display: 'flex', flexDirection: 'column', gap: 2, width: '100%',
    minHeight: big ? 60 : 48, padding: big ? '14px 18px' : '12px 16px',
    fontSize: 16, fontWeight: on ? 700 : 500, cursor: 'pointer', textAlign: 'left',
    borderRadius: 14, color: on ? GOLD : '#E2E8F0',
    background: on ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.035)',
    border: `1px solid ${on ? 'rgba(212,175,55,0.55)' : 'rgba(255,255,255,0.12)'}`,
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  }
}

function EstateHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: 'rgba(212,175,55,0.12)', color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        In development · by consultation
      </span>
      <h1 style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>The Estate Stewardship Program</h1>
      <p style={{ color: '#CBD5E1', maxWidth: 520, margin: '0 auto', lineHeight: 1.7, fontSize: 17 }}>
        For a full estate, we start with a conversation — then a plan built around your home, your timeline,
        and what matters most. There is nothing to pay and nothing to sign.
      </p>
    </div>
  )
}

// ── flag OFF: dignified placeholder (the shipped/dark state) ──────────────────
function Placeholder() {
  return (
    <div style={pageStyle}>
      <div style={shell}>
        <EstateHeader />
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

// ── answer shape ──────────────────────────────────────────────────────────────
type Answers = {
  situation: string
  whoFor: string
  property: string
  town: string
  volume: string
  items: string[]
  timing: string
  involvement: string
  families: string
  message: string
  firstName: string
  lastName: string
  email: string
  phone: string
  callTime: string
}
const EMPTY: Answers = {
  situation: '', whoFor: '', property: '', town: '', volume: '', items: [], timing: '',
  involvement: '', families: '', message: '', firstName: '', lastName: '', email: '', phone: '', callTime: '',
}

type StepKey = 'situation' | 'whoFor' | 'property' | 'volume' | 'items' | 'timing' | 'involvement' | 'families' | 'message' | 'contact'

export default function EstatePage() {
  const reduced = useReducedMotion()
  const [a, setA] = useState<Answers>(EMPTY)
  const [step, setStep] = useState(0)
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = <K extends keyof Answers,>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }))
  const toggleItem = (t: string) => setA((p) => ({ ...p, items: p.items.includes(t) ? p.items.filter((x) => x !== t) : [...p.items, t] }))
  const lab = (opts: Opt[], v: string) => opts.find((o) => o.v === v)?.l ?? ''

  // Steps are ordered; the "families" step only exists for a group/neighborhood sale.
  // The free-text "message" step only exists while personal-data fields are included.
  const steps: StepKey[] = useMemo(() => {
    const isGroup = a.situation === 'group_sale' || a.whoFor === 'several_families'
    const base: StepKey[] = ['situation', 'whoFor', 'property', 'volume', 'items', 'timing', 'involvement']
    if (isGroup) base.push('families')
    if (INCLUDE_PII_FIELDS) base.push('message')
    base.push('contact')
    return base
  }, [a.situation, a.whoFor])

  const current = steps[Math.min(step, steps.length - 1)]
  const pct = Math.round(((step + 1) / steps.length) * 100)

  if (!INTAKE_ENABLED) return <Placeholder />

  const next = () => { setError(''); setStep((s) => Math.min(s + 1, steps.length - 1)) }
  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 0)) }

  // Per-step gate: only the "who is this for" identity and the final contact are required;
  // everything else can be skipped so nobody is trapped (senior law).
  const canAdvance = (): boolean => {
    if (current === 'situation') return !!a.situation
    if (current === 'whoFor') return !!a.whoFor
    return true
  }

  async function submit() {
    setError('')
    if (!a.firstName.trim()) return setError('Please tell us your first name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) return setError('Please enter an email we can reach you at.')

    // CEO 1b — the "who is this for" answer leads the note so it is the FIRST line of the
    // notification email, ahead of everything else. Then the rest, each labeled for a phone call.
    const noteParts = [
      a.whoFor && `FOR: ${lab(WHO_FOR, a.whoFor)}`,
      a.situation && `Situation: ${lab(SITUATIONS, a.situation)}`,
      a.property && `Property: ${lab(PROPERTY, a.property)}${INCLUDE_PII_FIELDS && a.town.trim() ? ` (${a.town.trim()})` : ''}`,
      a.volume && `How much: ${lab(VOLUME, a.volume)}`,
      a.items.length ? `Items: ${a.items.join(', ')}` : '',
      a.timing && `Timing: ${lab(TIMING, a.timing)}`,
      a.involvement && `Involvement: ${lab(INVOLVEMENT, a.involvement)}`,
      a.families && `Families: ${lab(FAMILIES, a.families)}`,
      INCLUDE_PII_FIELDS && a.callTime && `Best time to call: ${lab(CALL_TIMES, a.callTime)}`,
    ].filter(Boolean).join(' · ').slice(0, 500)

    setBusy(true)
    try {
      const res = await fetch(APP_WAITLIST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: a.firstName.trim(), lastName: a.lastName.trim(), email: a.email.trim(),
          tierInterest: 'estate', reason: 'estate', sellerType: 'estate',
          servicePreference: 'whiteGlove', source: 'landing-estate-card',
          note: noteParts,
          company,
          // Personal-data classes — gated by INCLUDE_PII_FIELDS. Sent only while included; the route
          // ignores them today (dark-safe · carried for go-live wiring once §10 privacy covers them).
          ...(INCLUDE_PII_FIELDS
            ? { phone: a.phone.trim(), callTime: a.callTime, city: a.town.trim(), message: a.message.trim().slice(0, 1000) }
            : {}),
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
      <div style={pageStyle}>
        <div style={shell}>
          <EstateHeader />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 18, padding: 32, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading, inherit)', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Thank you — this is in good hands.</div>
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

  const anim = reduced
    ? {}
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 }, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } }

  return (
    <div style={pageStyle}>
      <div style={shell}>
        <EstateHeader />

        {/* Progress rail — quiet, gold, senior-legible step count */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: '#94A3B8', textTransform: 'uppercase' }}>
              Step {Math.min(step + 1, steps.length)} of {steps.length}
            </span>
            <span style={{ fontFamily: 'var(--font-data, inherit)', fontSize: 13, fontWeight: 700, color: GOLD }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${GOLD}, #B8860B)`, transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1)' }} />
          </div>
        </div>

        {/* honeypot */}
        <div aria-hidden style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
          <label>Company<input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} {...anim}>
            {current === 'situation' && (
              <Group title="What's happening?" hint="However this began, we'll meet you where you are.">
                <Chips opts={SITUATIONS} value={a.situation} onPick={(v) => { set('situation', v); }} big />
              </Group>
            )}

            {current === 'whoFor' && (
              <Group title="Who is this for?" hint="It helps us know who we'll be speaking with first.">
                <Chips opts={WHO_FOR} value={a.whoFor} onPick={(v) => set('whoFor', v)} big />
              </Group>
            )}

            {current === 'property' && (
              <Group title="Tell us about the property" hint="A rough picture is plenty — we'll fill in the rest on the call.">
                <Chips opts={PROPERTY} value={a.property} onPick={(v) => set('property', v)} />
                {INCLUDE_PII_FIELDS && (
                  <div style={{ marginTop: 20 }}>
                    <label>
                      <span style={labelStyle}>Town / state <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional · Maine-first)</em></span>
                      <input style={inputStyle} value={a.town} onChange={(e) => set('town', e.target.value)} placeholder="e.g. Waterville, ME" autoComplete="address-level2" />
                    </label>
                  </div>
                )}
              </Group>
            )}

            {current === 'volume' && (
              <Group title="How much needs to go?" hint="Optional — an honest guess is fine.">
                <Chips opts={VOLUME} value={a.volume} onPick={(v) => set('volume', v)} />
              </Group>
            )}

            {current === 'items' && (
              <Group title="What kinds of things?" hint="Choose any that apply.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 10 }}>
                  {ITEM_TYPES.map((t) => (
                    <button type="button" key={t} onClick={() => toggleItem(t)} style={chipStyle(a.items.includes(t))} aria-pressed={a.items.includes(t)}>{t}</button>
                  ))}
                </div>
              </Group>
            )}

            {current === 'timing' && (
              <Group title="When does this need to happen?" hint="No wrong answer — we plan around you.">
                <Chips opts={TIMING} value={a.timing} onPick={(v) => set('timing', v)} />
              </Group>
            )}

            {current === 'involvement' && (
              <Group title="How hands-on do you want to be?" hint="From fully handled to fully in your hands — your call.">
                <Chips opts={INVOLVEMENT} value={a.involvement} onPick={(v) => set('involvement', v)} big />
              </Group>
            )}

            {current === 'families' && (
              <Group title="How many families?" hint="A group sale works best with a few homes together.">
                <Chips opts={FAMILIES} value={a.families} onPick={(v) => set('families', v)} />
              </Group>
            )}

            {current === 'message' && (
              <Group title="Anything you'd like us to know?" hint="Only if it helps — a name, a worry, a treasured piece. Optional.">
                <textarea
                  style={{ ...inputStyle, minHeight: 130, resize: 'vertical', lineHeight: 1.6 }}
                  value={a.message}
                  onChange={(e) => set('message', e.target.value)}
                  maxLength={1000}
                  placeholder="Take your time…"
                />
              </Group>
            )}

            {current === 'contact' && (
              <Group title="Where can Ryan reach you?" hint="A person reads every inquiry. No payment, no account — we'll reach out to talk.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
                  <label><span style={labelStyle}>First name</span><input style={inputStyle} value={a.firstName} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" required /></label>
                  <label><span style={labelStyle}>Last name <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><input style={inputStyle} value={a.lastName} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" /></label>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label><span style={labelStyle}>Email</span><input style={inputStyle} type="email" value={a.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required /></label>
                </div>
                {INCLUDE_PII_FIELDS && (
                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
                    <label><span style={labelStyle}>Phone <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span><input style={inputStyle} type="tel" value={a.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(207) 000-0000" autoComplete="tel" /></label>
                    <div>
                      <span style={labelStyle}>Best time to call <em style={{ color: '#94A3B8', fontStyle: 'normal', fontWeight: 400 }}>(optional)</em></span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(130px, 100%), 1fr))', gap: 8 }}>
                        {CALL_TIMES.map((c) => (
                          <button type="button" key={c.v} onClick={() => set('callTime', a.callTime === c.v ? '' : c.v)} style={chipStyle(a.callTime === c.v)} aria-pressed={a.callTime === c.v}>{c.l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Group>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <div role="alert" style={{ margin: '20px 0 0', padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: 15 }}>{error}</div>}

        {/* Nav — obvious Back, clear primary. 44px+ targets. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 32 }}>
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            style={{ minHeight: 48, padding: '12px 20px', fontSize: 16, fontWeight: 600, borderRadius: 12, cursor: step === 0 ? 'default' : 'pointer', color: step === 0 ? '#4B5563' : '#CBD5E1', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', opacity: step === 0 ? 0.5 : 1 }}
          >
            ← Back
          </button>

          {current === 'contact' ? (
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              style={{ flex: 1, maxWidth: 320, minHeight: 52, fontSize: 17, fontWeight: 800, color: '#0B0B0F', background: GOLD, border: 'none', borderRadius: 14, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}
            >
              {busy ? 'Sending…' : 'Send my estate inquiry'}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance()}
              style={{ flex: 1, maxWidth: 320, minHeight: 52, fontSize: 17, fontWeight: 800, color: '#0B0B0F', background: GOLD, border: 'none', borderRadius: 14, cursor: canAdvance() ? 'pointer' : 'default', opacity: canAdvance() ? 1 : 0.5 }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── small presentational helpers ──────────────────────────────────────────────
function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={qTitle}>{title}</h2>
      {hint && <p style={qHint}>{hint}</p>}
      {children}
    </div>
  )
}

function Chips({ opts, value, onPick, big = false }: { opts: Opt[]; value: string; onPick: (v: string) => void; big?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 10 }}>
      {opts.map((o) => {
        const on = value === o.v
        return (
          <button type="button" key={o.v} onClick={() => onPick(o.v)} style={chipStyle(on, big)} aria-pressed={on}>
            <span>{o.l}</span>
            {o.sub && <span style={{ fontSize: 13, fontWeight: 400, color: on ? 'rgba(212,175,55,0.85)' : '#94A3B8' }}>{o.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}
