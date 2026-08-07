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

// ── PRICING TIERS (FOUNDING ONLY, R-10) — the price cards read from here. ──
export interface PricingTier {
  slug: 'free' | 'diy' | 'power' | 'estateManager'
  name: string
  foundingPrice: string   // display string, founding-only (no at-launch figures, R-10)
  commission: string
  blurb: string
  cta: string
  founding: boolean
  recommended: boolean
}
export const PRICING_TIERS = [
  { slug: 'free', name: 'Free', foundingPrice: '0', commission: '12%', blurb: 'Start selling with AI at zero cost.', cta: 'Start Free', founding: false, recommended: false },
  { slug: 'diy', name: 'DIY Seller', foundingPrice: '10', commission: '8%', blurb: 'AI pricing and core bots for the hands-on seller.', cta: 'Lock Founding Rate', founding: true, recommended: false },
  { slug: 'power', name: 'Power Seller', foundingPrice: '25', commission: '5%', blurb: 'MegaBot and every specialty bot for serious volume.', cta: 'Lock Founding Rate', founding: true, recommended: true },
  { slug: 'estateManager', name: 'Estate Manager', foundingPrice: '75', commission: '4%', blurb: 'Every AI tool for managing an entire estate yourself.', cta: 'Lock Founding Rate', founding: true, recommended: false },
] as const satisfies readonly PricingTier[]

// ── SERVICE GRID (the regression, restored, §7.1) — what each tier INCLUDES, at a glance.
//    A row per capability, a value per tier. Sourced from the same OFFERINGS features. ──
// TierSlug is derived from PricingTier so the grid columns can never drift from the tiers:
// add a tier and every ServiceRow is forced to add its column. `(string & {})` keeps free-form
// cell values ("20 / mo", "5 core") legal while type-checking the yes/no axis.
export type TierSlug = PricingTier['slug']
export type GridValue = 'yes' | 'no' | (string & {})
export type ServiceRow = { feature: string } & Record<TierSlug, GridValue>
export const SERVICE_GRID = [
  { feature: 'AI item identification', free: 'yes', diy: 'yes', power: 'yes', estateManager: 'yes' },
  { feature: 'Public store page', free: 'yes', diy: 'yes', power: 'yes', estateManager: 'yes' },
  { feature: 'Listing prep for every marketplace', free: 'no', diy: 'yes', power: 'yes', estateManager: 'yes' },
  { feature: 'Enhanced AI pricing', free: 'no', diy: 'yes', power: 'yes', estateManager: 'yes' },
  { feature: 'Specialty bots', free: 'no', diy: '5 core', power: 'All', estateManager: 'All + CarBot' },
  { feature: 'MegaBot four-AI consensus', free: 'no', diy: 'no', power: 'yes', estateManager: 'yes' },
  { feature: 'BuyerBot buyer matching', free: 'no', diy: 'yes', power: 'yes', estateManager: 'yes' },
  { feature: 'Included credits', free: 'no', diy: '20 / mo', power: '50 / mo', estateManager: '100 / mo' },
  { feature: 'Advanced analytics', free: 'no', diy: 'no', power: 'yes', estateManager: 'yes' },
  { feature: 'Branded store page', free: 'no', diy: 'no', power: 'no', estateManager: 'yes' },
  { feature: 'Support', free: 'Email', diy: 'Priority email', power: 'Phone', estateManager: 'Priority' },
  { feature: 'Commission on sales', free: '12%', diy: '8%', power: '5%', estateManager: '4%' },
] as const satisfies readonly ServiceRow[]

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
