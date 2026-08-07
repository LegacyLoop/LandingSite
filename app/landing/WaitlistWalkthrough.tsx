'use client'

// ════════════════════════════════════════════════════════════════
// CMD-WAITLIST-WALKTHROUGH V20 · Track A
// Guided "Find My Plan" flow: situation -> help level -> scale ->
// recommended offering -> pre-filled signup. Clones the app's proven
// onboarding-quiz engine SHAPE (typed steps + score buckets +
// reduce-to-winner + results anatomy), re-implemented for the landing
// with zero new deps. Two registers driven by the score:
//   estate  -> dignity mode (gold #D4A017, restrained, warm)
//   energetic -> teal #00BCD4 (garage / neighborhood / exploring)
// Contract preserved: POST -> app.legacy-loop.com/api/waitlist ->
// /thank-you redirect (Ads conversion) · dup ?already=1 · real counter.
// Honesty: every price lives in the ONE OFFERINGS object below — zero
// dollar literals in JSX. CTAs are waitlist-only. Counter never faked.
// ════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from 'react'
import FoundingCountLine from './FoundingCountLine'
import { PRICING_TIERS } from './landing-content'

// ── Types ───────────────────────────────────────────────────────────

type Register = 'estate' | 'energetic'

export interface Offering {
  id: string
  name: string
  price: string
  priceSuffix?: string
  wasPrice?: string
  priceNote?: string
  commission: string
  tagline: string
  features: string[]
  register: Register
  // Derived payload signals (superset-compatible with the flat form).
  // VOCABULARY LAW (Track B whitelist): sellerType garage|estate|neighborhood ·
  // servicePreference diy|assisted|whiteGlove · reason estate|declutter|exploring|neighborhood ·
  // tierInterest founding|diy|power|estate|undecided · offering = id (exact SKU).
  tierInterest: string
  sellerType: string
  servicePreference: string
  reason: string
}

interface Scores {
  estate: number
  garage: number
  neighborhood: number
  whiteGlove: number
  diy: number
}

interface Answers {
  situation?: 'estate' | 'downsize' | 'neighborhood' | 'exploring'
  help?: 'full' | 'assist' | 'diy'
  count?: 'few' | 'room' | 'most' | 'entire'
  family?: 'f2' | 'f4' | 'f6'
  timeline?: 'asap' | 'weeks' | 'months'
  appraisal?: string[]
}

interface LiveCount {
  claimed: number
  cohortSize: number
  spotsLeft: number
}

interface WaitlistWalkthroughProps {
  live: LiveCount | null
  isMobile: boolean
  onExit: () => void
}

// ── The ONE pricing object — all 9 offerings (WCS §3 tokens) ─────────
// W4: the SaaS tiers (free/diy/power/estateManager) now READ their price and commission from
// the typed PRICING_TIERS (the single pricing source) — no retyped tier facts, no manual
// byte-true sync. Estate uses its LIVE rate (4%), never the planned canon 0%. Estate service
// offerings (estateCare/wgProfessional/neighborhood) carry no price (K-1 · consult-first).
const _tier = (slug: string) => PRICING_TIERS.find((t) => t.slug === slug)
const saasPrice = (slug: string): string => { const t = _tier(slug); return t ? `$${t.foundingPrice}` : '$0' }
const saasCommission = (slug: string): string => { const t = _tier(slug); const r = t?.liveRate ?? t?.rate; return r ? `${r} commission` : '' }

export const OFFERINGS: Record<string, Offering> = {
  free: {
    id: 'free',
    name: 'Free',
    price: saasPrice('free'),
    priceSuffix: '/mo',
    commission: saasCommission('free'),
    tagline: 'Start selling with AI at zero cost.',
    features: ['Basic AI identification', 'Public store page', 'Email support'],
    register: 'energetic',
    tierInterest: 'diy',
    sellerType: 'garage',
    servicePreference: 'diy',
    reason: 'exploring',
  },
  diy: {
    id: 'diy',
    name: 'DIY Seller',
    price: saasPrice('diy'),
    priceSuffix: '/mo',
    commission: saasCommission('diy'),
    tagline: 'AI pricing and core bots for the hands-on seller.',
    features: ['Enhanced AI pricing', '5 core bots included', '20 credits/month included', 'BuyerBot matching', 'Priority email support'],
    register: 'energetic',
    tierInterest: 'diy',
    sellerType: 'garage',
    servicePreference: 'diy',
    reason: 'declutter',
  },
  power: {
    id: 'power',
    name: 'Power Seller',
    price: saasPrice('power'),
    priceSuffix: '/mo',
    commission: saasCommission('power'),
    tagline: 'MegaBot and every specialty bot for serious volume.',
    features: ['MegaBot (credit-based)', 'All specialty bots', '50 credits/month included', 'Advanced analytics', 'Phone support'],
    register: 'energetic',
    tierInterest: 'power',
    sellerType: 'garage',
    servicePreference: 'diy',
    reason: 'declutter',
  },
  estateManager: {
    id: 'estateManager',
    name: 'Estate Manager',
    price: saasPrice('estateManager'),
    priceSuffix: '/mo',
    commission: saasCommission('estateManager'),
    tagline: 'Manage an entire estate yourself with every AI tool.',
    // CMD-LANDING-MASTER-ARC (FIX 5): "Dedicated account manager" (staffing claim, solo pre-revenue)
    // + "API access" (unverified) removed; "White-label store" -> "Branded store page". Truth-safe,
    // consistent with the restored pricing section.
    features: ['All bots including CarBot', '100 credits/month included', 'Branded store page', 'Priority support', 'Full estate tools'],
    register: 'estate',
    tierInterest: 'estate',
    sellerType: 'estate',
    servicePreference: 'diy',
    reason: 'estate',
  },
  estateCare: {
    id: 'estateCare',
    name: 'Estate Care',
    // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · CEO R4 · Rule 4): estate price ($75/mo · the
    // "$75–$299/mo Starter/Plus/Unlimited" plans) removed — estate services are consult-first, not
    // purchasable (CANONICAL_FACTS §8). Archived LANDING-A.
    price: 'By consultation',
    commission: '',
    tagline: 'AI-guided estate help, planned with you — a conversation first.',
    features: ['Priority AI processing', 'BuyerBot buyer matching', 'Advanced analytics dashboard', 'Phone & email support'],
    register: 'estate',
    tierInterest: 'estate',
    sellerType: 'estate',
    servicePreference: 'assisted',
    reason: 'estate',
  },
  wgEssentials: {
    id: 'wgEssentials',
    name: 'Estate Essentials',
    // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · Rule 4): price $1,750 / was $2,500 / 25% commission removed — consult-first. Archived LANDING-A.
    price: 'By consultation',
    commission: '',
    tagline: 'We photograph, list, and sell — planned with you, a conversation first.',
    features: ['Item photography', 'AI listing creation', 'Buyer outreach', 'Shipping coordination', 'Donation management'],
    register: 'estate',
    tierInterest: 'estate',
    sellerType: 'estate',
    servicePreference: 'whiteGlove',
    reason: 'estate',
  },
  wgProfessional: {
    id: 'wgProfessional',
    name: 'Estate Professional',
    // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · Rule 4): price $3,500 / was $5,000 / 30% commission removed — consult-first. Archived LANDING-A.
    price: 'By consultation',
    commission: '',
    tagline: 'A guided estate sale, carried with you from start to finish.',
    features: ['Everything in Essentials', 'Buyer negotiation', 'Premium listing placement', 'Dedicated estate manager', 'Full reporting'],
    register: 'estate',
    tierInterest: 'estate',
    sellerType: 'estate',
    servicePreference: 'whiteGlove',
    reason: 'estate',
  },
  wgLegacy: {
    id: 'wgLegacy',
    name: 'Estate Legacy',
    // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · Rule 4): price $7,000 / was $10,000 / 35% commission removed — consult-first. Archived LANDING-A.
    price: 'By consultation',
    commission: '',
    tagline: 'Full white-glove estate care for an entire household.',
    features: ['Everything in Professional', 'White-glove concierge', 'Family coordination tools', 'Archive and documentation', 'Priority support'],
    register: 'estate',
    tierInterest: 'estate',
    sellerType: 'estate',
    servicePreference: 'whiteGlove',
    reason: 'estate',
  },
  neighborhood: {
    id: 'neighborhood',
    name: 'Neighborhood Bundle',
    // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · Rule 4): price $239 / was $399 / "$89 each" / 20% commission removed — consult-first. Archived LANDING-A.
    price: 'By consultation',
    priceNote: '2–8 families per bundle',
    commission: '',
    tagline: 'One coordinated sale for the whole street.',
    features: ['On-site planning with all families', 'AI pricing for every item', 'Custom event flyer + email campaign', 'Professional photography', 'Individual family sales reports'],
    register: 'energetic',
    tierInterest: 'founding',
    sellerType: 'neighborhood',
    servicePreference: 'whiteGlove',
    reason: 'neighborhood',
  },
}

// ── Step data (typed · score buckets, app-quiz shape) ────────────────

interface StepOption {
  id: string
  text: string
  sub?: string
  icon: IconName
  points: Partial<Scores>
}

type IconName = 'estate' | 'box' | 'community' | 'compass' | 'hands' | 'handshake' | 'tools' | 'clock'

const SITUATION_OPTIONS: StepOption[] = [
  { id: 'estate', text: 'An estate or a loved one’s belongings', sub: 'A passing, downsizing a parent, or settling a home', icon: 'hands', points: { estate: 10, whiteGlove: 3 } },
  { id: 'downsize', text: 'Downsizing or decluttering my home', sub: 'Freeing up space and turning items into cash', icon: 'box', points: { garage: 8, diy: 5 } },
  { id: 'neighborhood', text: 'A neighborhood or group sale', sub: 'Several families selling together', icon: 'community', points: { neighborhood: 10, diy: 2 } },
  { id: 'exploring', text: 'Just exploring for now', sub: 'Seeing what Legacy-Loop can do', icon: 'compass', points: { diy: 6 } },
]

const HELP_OPTIONS: StepOption[] = [
  { id: 'full', text: 'Do it all for me', sub: 'A person handles photos, listings, buyers, shipping', icon: 'hands', points: { whiteGlove: 10 } },
  { id: 'assist', text: 'Help with the hard parts', sub: 'AI tools plus a hand where it gets complicated', icon: 'handshake', points: { whiteGlove: 4, diy: 4 } },
  { id: 'diy', text: 'I’ll do it myself with AI tools', sub: 'Give me the software and I’ll run the sale', icon: 'tools', points: { diy: 10 } },
]

const COUNT_OPTIONS: StepOption[] = [
  { id: 'few', text: 'Just a few', sub: '1–20 items', icon: 'box', points: { garage: 8, diy: 6 } },
  { id: 'room', text: 'A room or two', sub: '20–75 items', icon: 'box', points: { garage: 5, estate: 3, diy: 4 } },
  { id: 'most', text: 'Most of a home', sub: '75–200 items', icon: 'estate', points: { estate: 8, whiteGlove: 3 } },
  { id: 'entire', text: 'An entire estate', sub: '200+ items', icon: 'estate', points: { estate: 10, whiteGlove: 6 } },
]

const FAMILY_OPTIONS: StepOption[] = [
  { id: 'f2', text: '2–3 families', sub: 'A small block sale', icon: 'community', points: { neighborhood: 8 } },
  { id: 'f4', text: '4–5 families', sub: 'A busy weekend event', icon: 'community', points: { neighborhood: 10 } },
  { id: 'f6', text: '6–8 families', sub: 'The whole street', icon: 'community', points: { neighborhood: 10 } },
]

// Estate-only timeline micro-step (mirrors app quiz L119-122). ASAP boosts white-glove.
const TIMELINE_OPTIONS: StepOption[] = [
  { id: 'asap', text: 'As soon as possible', sub: 'A deadline or a settlement to close', icon: 'clock', points: { whiteGlove: 6, estate: 3 } },
  { id: 'weeks', text: 'Over the next few weeks', sub: 'Steady, no rush', icon: 'clock', points: { estate: 3 } },
  { id: 'months', text: 'We have time', sub: 'At your pace', icon: 'clock', points: { estate: 2, diy: 3 } },
]

// Estate-only, OPTIONAL appraisal chips on the result (non-blocking multi-select).
const APPRAISAL_CHIPS: { id: string; label: string }[] = [
  { id: 'antiques', label: 'Antiques' },
  { id: 'jewelry', label: 'Fine jewelry' },
  { id: 'art', label: 'Art' },
  { id: 'vehicle', label: 'A vehicle' },
]

// ── Icons (brand SVG · no emoji · stroke currentColor) ───────────────

function StepIcon({ name, color }: { name: IconName; color: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'estate':
      return <svg {...common}><path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-5h4v5" /></svg>
    case 'box':
      return <svg {...common}><path d="M21 8 12 3 3 8v8l9 5 9-5Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></svg>
    case 'community':
      return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-3-5" /></svg>
    case 'compass':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
    case 'hands':
      return <svg {...common}><path d="M12 21s-7-4.35-9.5-8.5C1 9.5 3 6 6 6c1.9 0 3.2 1.1 4 2.3C10.8 7.1 12.1 6 14 6c3 0 5 3.5 3.5 6.5C15 16.65 12 21 12 21Z" /></svg>
    case 'handshake':
      return <svg {...common}><path d="m11 17 2 2 4-4" /><path d="M3 12l4-4 4 3 3-3 4 4" /><path d="M7 8V5h4M13 8l2-3h3v4" /></svg>
    case 'tools':
      return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3Z" /></svg>
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    default:
      return null
  }
}

// ── Register palettes ────────────────────────────────────────────────

const PALETTE: Record<Register, { accent: string; dim: string; border: string; glow: string; grad: string }> = {
  estate: {
    accent: '#D4A017',
    dim: 'rgba(212,160,23,0.10)',
    border: 'rgba(212,160,23,0.35)',
    glow: 'rgba(212,160,23,0.25)',
    grad: 'linear-gradient(90deg, #D4A017, #F0C75E)',
  },
  energetic: {
    accent: '#00BCD4',
    dim: 'rgba(0,188,212,0.10)',
    border: 'rgba(0,188,212,0.35)',
    glow: 'rgba(0,188,212,0.35)',
    grad: 'linear-gradient(90deg, #00BCD4, #22D3EE)',
  },
}

// ── Scoring helpers (cloned from app quiz :259-265) ──────────────────

function addPoints(scores: Scores, points: Partial<Scores>): Scores {
  const next: Scores = { ...scores }
  for (const key of Object.keys(points) as Array<keyof Scores>) {
    next[key] = next[key] + (points[key] ?? 0)
  }
  return next
}

function confidenceOf(scores: Scores): number {
  const vals = Object.values(scores).filter((v) => v > 0)
  if (vals.length === 0) return 80
  const max = Math.max(...vals)
  const sum = vals.reduce((a, b) => a + b, 0)
  return Math.min(96, Math.round(60 + (max / sum) * 40))
}

// ── Reduce-to-winner: answers -> recommended offering + alternatives ──

function recommend(a: Answers): { primary: string; alternates: string[] } {
  const { situation, help, count } = a

  if (situation === 'neighborhood') {
    return { primary: 'neighborhood', alternates: ['estateCare', 'diy'] }
  }

  if (situation === 'exploring') {
    if (count === 'most' || count === 'entire') return { primary: 'power', alternates: ['diy', 'estateManager'] }
    if (count === 'room') return { primary: 'diy', alternates: ['free', 'power'] }
    return { primary: 'free', alternates: ['diy', 'power'] }
  }

  if (situation === 'estate') {
    if (help === 'full') {
      if (count === 'entire') return { primary: 'wgLegacy', alternates: ['wgProfessional', 'wgEssentials'] }
      if (count === 'most') return { primary: 'wgProfessional', alternates: ['wgLegacy', 'wgEssentials'] }
      return { primary: 'wgEssentials', alternates: ['wgProfessional', 'estateCare'] }
    }
    if (help === 'assist') {
      // ASAP on an estate escalates to white-glove (deadline-driven settlements).
      if (a.timeline === 'asap') return { primary: 'wgEssentials', alternates: ['estateCare', 'wgProfessional'] }
      return { primary: 'estateCare', alternates: ['estateManager', 'wgEssentials'] }
    }
    // diy
    if (count === 'most' || count === 'entire') return { primary: 'estateManager', alternates: ['estateCare', 'power'] }
    return { primary: 'estateCare', alternates: ['estateManager', 'diy'] }
  }

  // downsize
  if (help === 'full') return { primary: 'wgEssentials', alternates: ['estateCare', 'wgProfessional'] }
  if (help === 'assist') return { primary: 'power', alternates: ['diy', 'estateManager'] }
  if (count === 'few') return { primary: 'diy', alternates: ['free', 'power'] }
  return { primary: 'power', alternates: ['diy', 'estateManager'] }
}

// Echo the visitor's own answers back on the results card
const SITUATION_LABEL: Record<NonNullable<Answers['situation']>, string> = {
  estate: 'an estate or a loved one’s belongings',
  downsize: 'downsizing your home',
  neighborhood: 'a neighborhood or group sale',
  exploring: 'exploring what’s possible',
}
const HELP_LABEL: Record<NonNullable<Answers['help']>, string> = {
  full: 'you’d like us to do it all for you',
  assist: 'you want help with the hard parts',
  diy: 'you’ll run the sale yourself with AI',
}
const COUNT_LABEL: Record<NonNullable<Answers['count']>, string> = {
  few: 'just a few items',
  room: 'a room or two',
  most: 'most of a home',
  entire: 'an entire estate',
}
const FAMILY_LABEL: Record<NonNullable<Answers['family']>, string> = {
  f2: '2–3 families',
  f4: '4–5 families',
  f6: '6–8 families',
}

// ── Small utilities ──────────────────────────────────────────────────

function haptic() {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)
  } catch {
    /* haptics unsupported — silent */
  }
}

function useReducedMotionLocal(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// ── Component ────────────────────────────────────────────────────────

type Phase = 'situation' | 'help' | 'scale' | 'timeline' | 'results' | 'signup'

export default function WaitlistWalkthrough({ live, isMobile, onExit }: WaitlistWalkthroughProps) {
  const reduced = useReducedMotionLocal()

  const [phase, setPhase] = useState<Phase>('situation')
  const [answers, setAnswers] = useState<Answers>({})
  const [scores, setScores] = useState<Scores>({ estate: 0, garage: 0, neighborhood: 0, whiteGlove: 0, diy: 0 })
  const [fading, setFading] = useState(false)

  // Signup fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const register: Register = answers.situation === 'estate' ? 'estate' : 'energetic'
  const pal = PALETTE[register]

  const rec = useMemo(() => recommend(answers), [answers])
  const primary = OFFERINGS[rec.primary]
  const confidence = confidenceOf(scores)

  // Precision detail carried in `note` (family size · appraisal flags · urgency).
  const walkthroughNote = useMemo(() => {
    const parts: string[] = []
    if (answers.situation === 'neighborhood' && answers.family) parts.push(FAMILY_LABEL[answers.family])
    if (answers.timeline === 'asap') parts.push('Timeline: ASAP')
    if (answers.appraisal && answers.appraisal.length > 0) {
      const labels = answers.appraisal
        .map((id) => APPRAISAL_CHIPS.find((c) => c.id === id)?.label ?? id)
        .join(', ')
      parts.push(`Appraisal: ${labels}`)
    }
    return parts.join(' · ')
  }, [answers.situation, answers.family, answers.timeline, answers.appraisal])

  // Dynamic step order (drives the "Step n of N" header). Estate earns one more
  // beat (timeline · settlements are deadline-driven); garage/exploring stay short.
  const order: Phase[] = useMemo(() => {
    if (answers.situation === 'estate') {
      return ['situation', 'help', 'scale', 'timeline', 'results', 'signup']
    }
    if (answers.situation === 'downsize') {
      return ['situation', 'help', 'scale', 'results', 'signup']
    }
    return ['situation', 'scale', 'results', 'signup']
  }, [answers.situation])
  const stepIndex = Math.max(0, order.indexOf(phase))
  const progressPct = Math.round(((stepIndex + (phase === 'signup' ? 1 : 0)) / (order.length - 1)) * 100)

  const transition = (next: Phase) => {
    if (reduced) {
      setPhase(next)
      return
    }
    setFading(true)
    setTimeout(() => {
      setPhase(next)
      setFading(false)
    }, 220)
  }

  const pickSituation = (opt: StepOption) => {
    haptic()
    const sit = opt.id as NonNullable<Answers['situation']>
    setAnswers({ situation: sit })
    setScores(addPoints({ estate: 0, garage: 0, neighborhood: 0, whiteGlove: 0, diy: 0 }, opt.points))
    setTimeout(() => transition(sit === 'estate' || sit === 'downsize' ? 'help' : 'scale'), reduced ? 0 : 260)
  }

  const pickHelp = (opt: StepOption) => {
    haptic()
    setAnswers((prev) => ({ ...prev, help: opt.id as NonNullable<Answers['help']> }))
    setScores((prev) => addPoints(prev, opt.points))
    setTimeout(() => transition('scale'), reduced ? 0 : 260)
  }

  const pickCount = (opt: StepOption) => {
    haptic()
    setAnswers((prev) => ({ ...prev, count: opt.id as NonNullable<Answers['count']> }))
    setScores((prev) => addPoints(prev, opt.points))
    // Estate earns the timeline beat; everyone else goes straight to results.
    const next: Phase = answers.situation === 'estate' ? 'timeline' : 'results'
    setTimeout(() => transition(next), reduced ? 0 : 260)
  }

  const pickTimeline = (opt: StepOption) => {
    haptic()
    setAnswers((prev) => ({ ...prev, timeline: opt.id as NonNullable<Answers['timeline']> }))
    setScores((prev) => addPoints(prev, opt.points))
    setTimeout(() => transition('results'), reduced ? 0 : 260)
  }

  const pickFamily = (opt: StepOption) => {
    haptic()
    setAnswers((prev) => ({ ...prev, family: opt.id as NonNullable<Answers['family']> }))
    setScores((prev) => addPoints(prev, opt.points))
    setTimeout(() => transition('results'), reduced ? 0 : 260)
  }

  const toggleAppraisal = (id: string) => {
    haptic()
    setAnswers((prev) => {
      const cur = prev.appraisal ?? []
      return { ...prev, appraisal: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }
    })
  }

  const goBack = () => {
    haptic()
    if (phase === 'situation') {
      onExit()
      return
    }
    if (phase === 'help') {
      transition('situation')
      return
    }
    if (phase === 'scale') {
      transition(answers.situation === 'estate' || answers.situation === 'downsize' ? 'help' : 'situation')
      return
    }
    if (phase === 'timeline') {
      transition('scale')
      return
    }
    if (phase === 'results') {
      transition(answers.situation === 'estate' ? 'timeline' : 'scale')
      return
    }
    if (phase === 'signup') {
      transition('results')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || isSubmitting) return
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch('https://app.legacy-loop.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          tierInterest: primary.tierInterest,
          reason: primary.reason,
          zip,
          sellerType: primary.sellerType,
          servicePreference: primary.servicePreference,
          offering: primary.id,
          ...(walkthroughNote ? { note: walkthroughNote } : {}),
          source: 'landing-walkthrough',
        }),
      })
      const data = await res.json().catch(() => ({} as { ok?: boolean; already?: boolean; error?: string }))
      if (res.ok && data.ok) {
        window.location.assign(data.already ? '/thank-you?already=1' : '/thank-you')
        return
      }
      setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('We could not reach the server. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Shared styles ──────────────────────────────────────────────────

  const cardWrap: React.CSSProperties = {
    opacity: fading ? 0 : 1,
    transform: fading && !reduced ? 'translateX(12px)' : 'translateX(0)',
    transition: reduced ? 'none' : 'opacity 0.22s ease, transform 0.22s ease',
  }

  const answerCard = (opt: StepOption, onPick: (o: StepOption) => void): React.ReactElement => (
    <button
      key={opt.id}
      type="button"
      onClick={() => onPick(opt)}
      aria-label={opt.text}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: '16px 18px',
        minHeight: 64,
        borderRadius: 14,
        border: `1.5px solid rgba(255,255,255,0.10)`,
        background: 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = pal.border
        e.currentTarget.style.background = pal.dim
        if (!reduced) e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = pal.border
        e.currentTarget.style.boxShadow = `0 0 0 3px ${pal.glow}`
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 46,
          height: 46,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: pal.dim,
          border: `1px solid ${pal.border}`,
        }}
      >
        <StepIcon name={opt.icon} color={pal.accent} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 16,
            color: '#F1F5F9',
            lineHeight: 1.3,
          }}
        >
          {opt.text}
        </span>
        {opt.sub && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 13,
              color: '#94A3B8',
              lineHeight: 1.4,
              marginTop: 3,
            }}
          >
            {opt.sub}
          </span>
        )}
      </span>
      <span aria-hidden style={{ flexShrink: 0, color: pal.accent, fontSize: 18, opacity: 0.7 }}>
        &rarr;
      </span>
    </button>
  )

  const stepHeading = (title: string, subtitle?: string): React.ReactElement => (
    <div style={{ marginBottom: 22, textAlign: 'left' }}>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 'clamp(20px, 4.5vw, 26px)',
          color: '#F1F5F9',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', margin: '8px 0 0', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  )

  const inputStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    padding: '14px 18px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.04)',
    color: '#F1F5F9',
    outline: 'none',
    minHeight: 48,
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, background 0.3s ease',
  }
  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = pal.border
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
  }
  const blurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
  }

  const backButton = (label: string): React.ReactElement => (
    <button
      type="button"
      onClick={goBack}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 44,
        padding: '8px 14px',
        background: 'none',
        border: 'none',
        color: '#94A3B8',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <span aria-hidden>&larr;</span> {label}
    </button>
  )

  // ── Results card sub-render ────────────────────────────────────────

  const renderOfferingCard = (offering: Offering, isPrimary: boolean): React.ReactElement => {
    const p = PALETTE[offering.register]
    return (
      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${isPrimary ? p.border : 'rgba(255,255,255,0.10)'}`,
          background: isPrimary ? p.dim : 'rgba(255,255,255,0.02)',
          padding: isPrimary ? '26px 24px' : '18px 20px',
          boxShadow: isPrimary ? `0 0 40px ${p.glow}` : 'none',
          textAlign: 'left',
        }}
      >
        {isPrimary && (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: p.accent,
              marginBottom: 10,
            }}
          >
            Recommended for you
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: isPrimary ? 22 : 17,
              color: '#F1F5F9',
            }}
          >
            {offering.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 800,
              fontSize: isPrimary ? 40 : 28,
              lineHeight: 1,
              background: `linear-gradient(135deg, ${p.accent}, #FFFFFF)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {offering.price}
          </span>
          {offering.priceSuffix && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>{offering.priceSuffix}</span>
          )}
          {offering.wasPrice && (
            <s style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>{offering.wasPrice}</s>
          )}
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 13, color: p.accent, letterSpacing: '0.02em' }}>
            {offering.commission}
          </span>
        </div>
        {offering.priceNote && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#94A3B8', margin: '2px 0 0', lineHeight: 1.5 }}>
            {offering.priceNote}
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#CBD5E1', margin: '12px 0 0', lineHeight: 1.55 }}>
          {offering.tagline}
        </p>
        {isPrimary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {offering.features.map((f) => (
              <span key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', lineHeight: 1.5 }}>
                <span aria-hidden style={{ color: p.accent, fontWeight: 700, flexShrink: 0 }}>&#10003;</span>
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Build "Why we recommend this" — echo the visitor's own answers
  const whyPoints: string[] = useMemo(() => {
    const out: string[] = []
    if (answers.situation) out.push(`You told us this is about ${SITUATION_LABEL[answers.situation]}.`)
    if (answers.help) out.push(`You said ${HELP_LABEL[answers.help]}.`)
    if (answers.count) out.push(`You have about ${COUNT_LABEL[answers.count]} to sell.`)
    if (answers.family) out.push(`You’re coordinating ${FAMILY_LABEL[answers.family]}.`)
    return out
  }, [answers])

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'left' }}>
      {/* Progress header (clone of app quiz :546-588) */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94A3B8',
            }}
          >
            {phase === 'results'
              ? 'Your recommendation'
              : phase === 'signup'
                ? 'Reserve your spot'
                : `${register === 'estate' ? 'At your pace · ' : ''}Step ${stepIndex + 1} of ${order.length - 1}`}
          </span>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12, color: pal.accent }}>
            {progressPct}% complete
          </span>
        </div>
        <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPct}%`,
              height: '100%',
              background: pal.grad,
              borderRadius: 999,
              transition: reduced ? 'none' : 'width 0.4s ease',
              boxShadow: progressPct > 0 ? `0 0 8px ${pal.glow}` : 'none',
            }}
          />
        </div>
      </div>

      <div style={cardWrap}>
        {/* STEP 1 — situation */}
        {phase === 'situation' && (
          <div>
            {stepHeading('What’s happening in your life right now?', 'Two minutes and we’ll point you to the right service, tier, and price.')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SITUATION_OPTIONS.map((opt) => answerCard(opt, pickSituation))}
            </div>
          </div>
        )}

        {/* STEP 2 — help level */}
        {phase === 'help' && (
          <div>
            {stepHeading(
              register === 'estate' ? 'How would you like us to help?' : 'How hands-on do you want to be?',
              register === 'estate' ? 'No pressure — we’ll carry as much of the heavy part as you want.' : undefined,
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {HELP_OPTIONS.map((opt) => answerCard(opt, pickHelp))}
            </div>
            <div style={{ marginTop: 16 }}>{backButton('Back')}</div>
          </div>
        )}

        {/* STEP 3 — scale (item count OR family count) */}
        {phase === 'scale' && (
          <div>
            {answers.situation === 'neighborhood'
              ? stepHeading('How many families are joining?', 'The Neighborhood Bundle covers 2–8 families in one coordinated sale.')
              : stepHeading('About how much are you selling?', register === 'estate' ? 'A rough sense is plenty — your pace, no pressure.' : 'Ballpark is fine.')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(answers.situation === 'neighborhood' ? FAMILY_OPTIONS : COUNT_OPTIONS).map((opt) =>
                answerCard(opt, answers.situation === 'neighborhood' ? pickFamily : pickCount),
              )}
            </div>
            <div style={{ marginTop: 16 }}>{backButton('Back')}</div>
          </div>
        )}

        {/* STEP 3b — timeline (ESTATE path only · deadline-driven) */}
        {phase === 'timeline' && (
          <div>
            {stepHeading('What’s your timeline?', 'Estate settlements often run on a deadline — we’ll match your pace.')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIMELINE_OPTIONS.map((opt) => answerCard(opt, pickTimeline))}
            </div>
            <div style={{ marginTop: 16 }}>{backButton('Back')}</div>
          </div>
        )}

        {/* STEP 4 — results */}
        {phase === 'results' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: pal.accent,
                  marginBottom: 10,
                }}
              >
                {register === 'estate' ? 'For your family' : 'Your match'}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 'clamp(20px, 4.5vw, 26px)',
                  color: '#F1F5F9',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {register === 'estate'
                  ? 'Here’s the gentlest path for what you’re facing.'
                  : 'Here’s the plan that fits you best.'}
              </h3>

              {/* Confidence — warmth cue only (not presented as a hard stat) */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#94A3B8' }}>How well this fits</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 14, color: pal.accent }}>{confidence}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${confidence}%`, height: '100%', background: pal.grad, borderRadius: 999, transition: reduced ? 'none' : 'width 0.6s ease' }} />
                </div>
              </div>
            </div>

            {renderOfferingCard(primary, true)}

            {/* NEIGHBORHOOD — family-count now drives a live detail (no dead data) */}
            {answers.situation === 'neighborhood' && answers.family && (
              <div
                style={{
                  marginTop: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: pal.dim,
                  border: `1px solid ${pal.border}`,
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: pal.accent }}>{FAMILY_LABEL[answers.family]}</span>
                  {answers.family === 'f2'
                    ? ' fit the base bundle — one coordinated sale, one flyer, one buyer list.'
                    : ' — the base bundle covers the first two, additional families join at $89 each.'}
                </p>
              </div>
            )}

            {/* ESTATE — optional, dignified appraisal chips (non-blocking) */}
            {answers.situation === 'estate' && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Do any of these apply? <span style={{ color: '#94A3B8' }}>(optional)</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {APPRAISAL_CHIPS.map((chip) => {
                    const on = (answers.appraisal ?? []).includes(chip.id)
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => toggleAppraisal(chip.id)}
                        aria-pressed={on}
                        style={{
                          minHeight: 44,
                          padding: '8px 16px',
                          borderRadius: 999,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontWeight: on ? 600 : 500,
                          fontSize: 14,
                          color: on ? pal.accent : '#CBD5E1',
                          background: on ? pal.dim : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${on ? pal.border : 'rgba(255,255,255,0.12)'}`,
                          boxShadow: on ? `0 0 0 3px ${pal.glow}` : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {chip.label}
                      </button>
                    )
                  })}
                </div>
                {(answers.appraisal ?? []).length > 0 && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: pal.accent, margin: '12px 0 0', lineHeight: 1.55 }}>
                    We’ll flag potentially valuable items for a deeper AI review, so you can price them with more confidence.
                  </p>
                )}
              </div>
            )}

            {/* Why we recommend this — the visitor's own answers echoed */}
            {whyPoints.length > 0 && (
              <div
                style={{
                  marginTop: 18,
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, color: '#F1F5F9', marginBottom: 10 }}>
                  Why we recommend this
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {whyPoints.map((w) => (
                    <span key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1', lineHeight: 1.5 }}>
                      <span aria-hidden style={{ color: pal.accent, flexShrink: 0 }}>&bull;</span>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Real founding counter — S4: the one shared FoundingCountLine (fail-safe:
                framing until the real claimed count reaches the threshold; never "0 of 100"). */}
            <div style={{ margin: '20px 0 0' }}>
              <FoundingCountLine live={live} accent={pal.accent} center />
            </div>

            {/* Primary CTA — waitlist-honest */}
            <button
              type="button"
              onClick={() => {
                haptic()
                transition('signup')
              }}
              style={{
                width: '100%',
                marginTop: 20,
                minHeight: 54,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 16,
                color: register === 'estate' ? '#0D1117' : '#FFFFFF',
                background: register === 'estate' ? 'linear-gradient(135deg, #D4A017, #B8860B)' : 'linear-gradient(135deg, #00BCD4, #009688)',
                boxShadow: `0 0 32px ${pal.glow}`,
                transition: 'transform 0.2s ease, filter 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!reduced) e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.filter = 'brightness(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              Reserve My Spot — Join the Waitlist &rarr;
            </button>

            {/* Alternatives */}
            {rec.alternates.length > 0 && (
              <div style={{ marginTop: 22 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>
                  Other options that could fit:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {rec.alternates.map((id) => (
                    <div key={id}>{renderOfferingCard(OFFERINGS[id], false)}</div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 18 }}>{backButton('Back')}</div>
          </div>
        )}

        {/* STEP 5 — signup (fields pre-derived) */}
        {phase === 'signup' && (
          <div>
            {stepHeading(
              register === 'estate' ? 'We’ll hold your place — gently.' : 'Lock in your founding spot.',
              `You’re reserving your founding spot for ${primary.name}. Pre-launch pricing is locked while your subscription stays active.`,
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
                <input
                  type="text"
                  placeholder="First name"
                  aria-label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
                <input
                  type="text"
                  placeholder="Last name (optional)"
                  aria-label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="ZIP (optional)"
                aria-label="ZIP code (optional)"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                maxLength={10}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#94A3B8', margin: '-2px 0 4px', lineHeight: 1.5 }}>
                Adding your ZIP lets us tune pricing to your regional market.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  minHeight: 54,
                  borderRadius: 14,
                  border: 'none',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: register === 'estate' ? '#0D1117' : '#FFFFFF',
                  background: register === 'estate'
                    ? 'linear-gradient(135deg, #D4A017, #B8860B)'
                    : 'linear-gradient(135deg, #00BCD4, #009688)',
                  boxShadow: `0 0 32px ${pal.glow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'transform 0.2s ease, filter 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !reduced) e.currentTarget.style.transform = 'scale(1.02)'
                  if (!isSubmitting) e.currentTarget.style.filter = 'brightness(1.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.filter = 'brightness(1)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }} aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Reserving your spot...
                  </>
                ) : (
                  'Reserve My Spot →'
                )}
              </button>

              {error && (
                <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#fca5a5', margin: '4px 0 0', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#94A3B8', margin: '4px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
                No account needed. We&apos;ll email you from hello@legacy-loop.com — check your inbox (the first email may land in Promotions).
              </p>
            </form>
            <div style={{ marginTop: 14 }}>{backButton('Back to my recommendation')}</div>
          </div>
        )}
      </div>
    </div>
  )
}
