// ─────────────────────────────────────────────────────────────────────────────
// landing-content.ts — TYPED CONTENT LAYER (CMD-LANDING-PASS3 · W1)
//
// Marketing claims and the pricing/service data move OUT of the 8,800-line page and
// INTO this typed config. The CAPABILITY-STATUS TYPE is the point: a claim can never
// be presented as "live" unless it is tagged `live`. A future autonomous capability
// tagged `planned` renders with a Rule-4 marker and can never read as shipped.
//
// SOURCE-TRACE (R-10 / D-3):
//  · Founding prices + per-tier features -> app/landing/WaitlistWalkthrough.tsx OFFERINGS
//    (free $0/12% · DIY $10/8% · Power $25/5% · Estate Manager $75/4%). Founding-only.
//  · Capability statuses -> /Users/ryanhallee/legacy-loop-mvp/docs/CANONICAL_FACTS.md §6.
//
// W1 migrates the pricing/service grid + the capability/proof/listing data here. The rest
// of the page's inline copy migrates section-by-section in later waves (proposed split, §B8) —
// not a single 8.8k big-bang that would risk the protected animations.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

// The honesty type. Every user-facing capability sorts into exactly one.
export type CapabilityStatus =
  | 'live'         // works today, cite the route that proves it
  | 'manual'       // real, but the seller drives each action (BuyerBot contact, marketplace post)
  | 'assisted'     // AI does the work, seller confirms (listing prep, suggested replies)
  | 'planned'      // real roadmap, NOT functioning yet — Rule 4, never sold, always marked
  | 'unavailable'  // a state the system can report, e.g. a failed/blocked action

// Discriminated so the honesty contract is STRUCTURAL, not doc-only: any status that is
// not `live` REQUIRES a `note`. A `planned`/`manual` capability shipping with zero
// disclosure is now a compile error, not a copy-review miss.
interface CapabilityBase {
  id: string
  label: string
}
export type Capability =
  | (CapabilityBase & { status: 'live'; note?: string })
  | (CapabilityBase & { status: Exclude<CapabilityStatus, 'live'>; note: string })

// The truth registry the page reads from. Autonomous outreach is `planned`, never `live`.
export const CAPABILITIES = [
  { id: 'identify', label: 'AI item identification from a photo', status: 'live' },
  { id: 'price', label: 'MegaBot four-AI consensus price', status: 'live' },
  { id: 'listing', label: 'Marketplace listing prepared for you', status: 'assisted', note: 'We write it and prep the photos; you post it in one tap.' },
  { id: 'buyerbot', label: 'BuyerBot finds real interested buyers', status: 'manual', note: 'You approve every contact. Manual mode today.' },
  { id: 'messages', label: 'Every buyer conversation in one place', status: 'live' },
  { id: 'shipping', label: 'Live carrier rates and printed label', status: 'live', note: 'You choose the rate; we print the label.' },
  { id: 'outreach-auto', label: 'Autonomous buyer outreach', status: 'planned', note: 'Coming — not live. You always approve first.' },
  { id: 'estate', label: 'White-glove estate service', status: 'assisted', note: 'Consult-first. A conversation before anything is listed.' },
] as const satisfies readonly Capability[]

// Section anchors the proof-label TOC may scroll to. A typo'd anchor is now a compile
// error instead of a silent dead scroll target.
export type SectionAnchor = 'how-it-works' | 'megabot' | 'buyerbot' | 'shipping'

// ── THE FOUR PROOF LABELS — the page's table of contents (high on the page) ──
export interface ProofLabel {
  id: string
  label: string
  sub: string
  target: SectionAnchor // section id to scroll to
}
// FIND BUYER INTEREST carries the ratified BuyerBot fence ("you approve every contact") —
// it must NOT read as autonomous outreach. BuyerBot is `manual` in CAPABILITIES; the TOC
// label matches that truth, not a shipped-autonomy claim (Rule 4).
export const PROOF_LABELS = [
  { id: 'identify', label: 'IDENTIFY IT', sub: 'Snap a photo. Our AI knows what it is.', target: 'how-it-works' },
  { id: 'price', label: 'PRICE IT', sub: 'Six engines. Four vote on a fair price.', target: 'megabot' },
  { id: 'find-buyer', label: 'FIND BUYER INTEREST', sub: 'Surface likely buyers — you approve every contact.', target: 'buyerbot' },
  { id: 'ship', label: 'SHIP IT', sub: 'Real carrier rates. Parcel to freight.', target: 'shipping' },
] as const satisfies readonly ProofLabel[]

// ── FOUNDING COUNTER RULE (L0-2 · CEO ruling) ──
// The total cohort, and the threshold below which the page shows FRAMING ONLY — never a
// live count that reads "0 of 100" (which reads as sold-out on our most important CTA).
// Server-render safe: framing is the SSR default; the live count appears only once the
// real claimed count reaches the threshold. No count-up-from-zero animation on this stat.
export const FOUNDING_COHORT = 100
export const FOUNDING_LIVE_THRESHOLD = 10
export const FOUNDING_FRAMING = 'Founding pricing — limited to the first 100 members.'

// ── LISTING STATE LABELS (B04 truth surface) — the page never implies "published"
//    when the live flow is a draft or a guided handoff. ──
export interface ListingState {
  id: string
  label: string
  status: CapabilityStatus
  note: string
}
export const LISTING_STATES: readonly ListingState[] = [
  { id: 'draft', label: 'Draft', status: 'live', note: 'Written and priced, ready for your review.' },
  { id: 'ready', label: 'Ready for review', status: 'live', note: 'Photos prepped; nothing posted yet.' },
  { id: 'needs-input', label: 'Needs seller input', status: 'live', note: 'One detail from you before it goes out.' },
  { id: 'published', label: 'Published', status: 'manual', note: 'Only after you post it in one tap.' },
  { id: 'unavailable', label: 'Not available', status: 'unavailable', note: 'A marketplace that does not permit automation is a guided handoff.' },
] as const satisfies readonly ListingState[]

// ── PRICING (FOUNDING ONLY · canon v1.0 · order Free · DIY · Power · Pro · Estate) ──
// Every value traces to LEGACYLOOP_PRICING_CANON_v1.0_RATIFIED_2026-08-07. Standard/at-launch
// prices are NOT rendered (P-5 · R-10). Founding pricing is "locked while the subscription
// stays active" (never "for life"). Per §0.1, the app is the follower: every `planned` cell
// is a ticket in the app's build queue, not a claim about today.
export interface PricingTier {
  slug: 'free' | 'diy' | 'power' | 'pro' | 'estateManager'
  name: string
  foundingPrice: string        // founding-only display (no standard column, P-5)
  blurb: string
  cta: string
  founding: boolean
  recommended: boolean
  zeroTier: boolean            // 0% commission tier (Pro, Estate) -> the processing sentence (P-2)
  rate: string                 // canon commission: '12%' | '8%' | '5%' | '0%'
  rateStatus: CapabilityStatus // 'live' for Free/DIY/Power; 'planned' for Pro and Estate 0%
  liveRate?: string            // where the live value differs from canon (Estate: '4%' today)
  planned?: boolean            // the whole tier is not built yet (Pro — no app tier exists)
}
export const PRICING_TIERS: readonly PricingTier[] = [
  { slug: 'free',          name: 'Free',           foundingPrice: '0',  blurb: 'Start selling with AI at zero cost.',                          cta: 'Start Free',         founding: false, recommended: false, zeroTier: false, rate: '12%', rateStatus: 'live' },
  { slug: 'diy',           name: 'DIY Seller',     foundingPrice: '10', blurb: 'AI pricing and core bots for the hands-on seller.',            cta: 'Lock Founding Rate', founding: true,  recommended: false, zeroTier: false, rate: '8%',  rateStatus: 'live' },
  { slug: 'power',         name: 'Power Seller',   foundingPrice: '25', blurb: 'MegaBot and every specialty bot for serious volume.',          cta: 'Lock Founding Rate', founding: true,  recommended: true,  zeroTier: false, rate: '5%',  rateStatus: 'live' },
  { slug: 'pro',           name: 'Pro Seller',     foundingPrice: '39', blurb: 'Unlimited listings and zero commission for the full-time seller.', cta: 'Lock Founding Rate', founding: true, recommended: false, zeroTier: true, rate: '0%', rateStatus: 'planned', planned: true },
  { slug: 'estateManager', name: 'Estate Manager', foundingPrice: '75', blurb: 'Every AI tool plus a branded store for a whole estate.',        cta: 'Lock Founding Rate', founding: true,  recommended: false, zeroTier: true,  rate: '0%',  rateStatus: 'planned', liveRate: '4%' },
]

// TierSlug is derived from PricingTier so the grid columns can never drift from the tiers:
// add a tier and every ServiceRow is forced to add its column (the compiler enforces P-7).
export type TierSlug = PricingTier['slug']

// ── S-b · THE DISCRIMINATED CELL (the load-bearing model). Carries the live value, an
// optional canon (planned) value, and a status. Where both exist the grid renders the canon
// value MARKED and the live value plainly beside it (P-6) — never one without the other,
// never blurred, never hand-written in JSX (LS-12). ──
export interface GridCell {
  live: string                 // what is true today
  planned?: string             // the canon value the app has not reached yet
  status: CapabilityStatus     // 'live' when planned is absent
}
const L = (v: string): GridCell => ({ live: v, status: 'live' })
const P = (canon: string, today = '—'): GridCell => ({ live: today, planned: canon, status: 'planned' })

export type ServiceRow = { feature: string } & Record<TierSlug, GridCell>
export interface PricingGroup { title: string; rows: readonly ServiceRow[] }

// Six consumer groups (R-1), ~12 visible rows. Values VERIFIED AT SOURCE in the app repo
// 2026-08-07 (READ-ONLY): BOT_ACCESS lib/constants/pricing.ts:165-217 · TIER_LIMITS :96-138.
// P-6 reconciliation: independent verification matches Devin's map, zero delta. Free's bot
// access is analyzeBot only today, so nearly every Free capability is `planned` (canon) with
// its live value beside it. Pro is a `planned` COLUMN (no app tier exists yet). P-8: the
// MegaBot row reads "Credits" in every column and the word "included" never appears.
export const PRICING_GROUPS: readonly PricingGroup[] = [
  { title: 'Your AI team', rows: [
    { feature: 'AI item identification', free: L('Yes'), diy: L('Yes'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
    { feature: 'AI pricing on live comps', free: P('Yes', 'No'), diy: L('Yes'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
    { feature: 'AI listing copy written for you', free: P('Yes', 'No'), diy: L('Yes'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
    { feature: 'Specialty bots', free: L('ID only'), diy: L('5 core'), power: L('All'), pro: P('All'), estateManager: L('All + CarBot') },
    { feature: 'MegaBot four-AI council', free: P('Credits'), diy: L('Credits'), power: L('Credits'), pro: P('Credits'), estateManager: L('Credits') },
  ] },
  { title: 'What you can list', rows: [
    { feature: 'Active listings at once', free: L('3'), diy: L('25'), power: L('100'), pro: P('Unlimited'), estateManager: L('Unlimited') },
  ] },
  { title: 'Finding buyers', rows: [
    { feature: 'BuyerBot buyer matching', free: P('Yes', 'No'), diy: L('Yes'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
  ] },
  { title: 'Fees', rows: [
    { feature: 'Commission on sales', free: L('12%'), diy: L('8%'), power: L('5%'), pro: P('0%'), estateManager: { live: '4%', planned: '0%', status: 'planned' } },
  ] },
  { title: 'Your store', rows: [
    { feature: 'Public store page', free: L('Yes'), diy: L('Yes'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
    { feature: 'Branded store page', free: L('No'), diy: L('No'), power: L('No'), pro: P('No'), estateManager: L('Yes') },
  ] },
  { title: 'Service', rows: [
    { feature: 'Advanced analytics', free: L('No'), diy: L('No'), power: L('Yes'), pro: P('Yes'), estateManager: L('Yes') },
    { feature: 'Support', free: L('Email'), diy: L('Priority email'), power: L('Phone'), pro: P('Priority'), estateManager: L('Priority') },
  ] },
]

// The "Compare all plans" expander depth. Monthly-credit grants are canon values; a live
// per-tier monthly grant is NOT cited in the app today, so they render `planned` (FLAGGED
// for app confirmation). Pro photos-per-item is canon-TBD, so it renders no number (LS-11).
export const PRICING_EXPANDER: readonly ServiceRow[] = [
  { feature: 'Photos per item', free: L('2'), diy: L('5'), power: L('8'), pro: P('With the app'), estateManager: L('15') },
  { feature: 'Included credits / month', free: L('0'), diy: P('20 / mo'), power: P('50 / mo'), pro: P('75 / mo'), estateManager: P('100 / mo') },
]

// ── PRIVACY & OUTREACH DISCLOSURE (folded into B08) — short, honest, linkable. ──
export interface DisclosureItem {
  q: string
  a: string
}
export const PRIVACY_DISCLOSURE = [
  { q: 'What gets searched', a: 'Public marketplace and social signals to find likely buyers for your item. No private accounts are accessed without your connection.' },
  { q: 'What data is collected', a: 'Your item photos, the listing you approve, and the marketplaces you connect. We never sell your data.' },
  { q: 'How public posts are used', a: 'Only to surface buyer interest you can review. A lead is an interest signal, not a confirmed buyer, and shows its source.' },
  { q: 'Which accounts you connect', a: 'You choose. Each connected marketplace is named, and you can disconnect any of them at any time.' },
  { q: 'What you approve', a: 'Every outreach. BuyerBot is manual today — nothing is sent until you say so. Where a platform does not permit automation, it is a guided handoff.' },
  { q: 'How buyer information is protected', a: 'Buyer names and message content are never sold, never used for training, and never shown beyond the conversation.' },
] as const satisfies readonly DisclosureItem[]
