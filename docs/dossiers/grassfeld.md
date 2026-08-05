# TECHNIQUE DOSSIER — Grassfeld

Source: https://grassfeld.com
Artifact: docs/dossiers/grassfeld.html [FETCHED · 365,526 bytes · curl 200]
WebFetch technique read: performed (labeled inline).
Bench roles: B04 bench (AI-import feature animation, all-Lottie, ~1/10 video weight) · B06 bench (external-account connection animation) · B09 PRIMARY (feature-nav pinned switcher — our three-pillar switcher answer).
CMD-LANDING-PASS3 · W0 recon · no markup/class/JS/media/copy lifted.

---

## WHAT IT IS — [KNOWN] canon facts

- [KNOWN · artifact-confirmed] `<title>Grassfeld - AI-Powered Budgeting App, with 45.000+ Banks Connected Worldwide</title>`. AI-powered personal budgeting app; connects bank accounts, predicts/organizes transactions.
- [KNOWN · artifact-confirmed] Built on Webflow (assets served from `cdn.prod.website-files.com`; `w-*` Webflow class conventions in markup).
- [KNOWN · artifact-confirmed] Uses Lottie heavily: 14 "lottie" references in the fetched HTML, including a hero Lottie placeholder asset. Uses GSAP: 5 references.
- [KNOWN · artifact-confirmed] Feature set exposed via a Features nav dropdown with per-feature routes (e.g. `/features/budget-planner-app`, `/features/tracking-income-and-expenses`, `/features/savings-app`). [WebFetch read] enumerated eight feature cards: Budgets, Bank Accounts & Transactions, Savings goals, Debts & Loans, Analytics, Financial reports, Documents & Loyalty cards, Grassfeld Intelligence.

## THE MECHANIC

Three distinct, separately-transferable mechanics:

1. **B04 — AI-import feature animation, ALL LOTTIE.**
   [artifact-confirmed Lottie usage] + [WebFetch read] The import section shows transaction rows resolving into categories with icon states (pizza / train / shopping cart / cloud / airplane) transitioning through states. The load-bearing insight (per brief): this is delivered as vector Lottie, ~one-tenth the byte weight of an equivalent screen-recording video. The premium motion is achieved WITHOUT shipping an mp4.

2. **B06 — external-account connection animation.**
   [artifact-confirmed copy] The page's connection story ("connects your bank accounts", "45.000+ Banks Connected", globe + bank-logo carousel). [WebFetch read] globe imagery + bank-logo carousel present. The mechanic: a "connect an external account" moment rendered as an animated, trust-building sequence (logos → globe → connected state).

3. **B09 PRIMARY — feature-nav pinned switcher (OUR THREE-PILLAR ANSWER).**
   [HONEST LABEL] The brief designates Grassfeld's feature-nav as the reference for a pinned-frame switcher: one viewport stays pinned, the visitor clicks between features, and the UI animates IN PLACE. IMPORTANT provenance caveat: the WebFetch pass on the homepage observed feature CARDS that link out to separate `/features/*` pages, and did NOT confirm a single pinned in-place switcher on the homepage itself. So B09 is a **design target modeled on Grassfeld's feature system**, not a verified-verbatim homepage behavior. Build it as the intended pattern; do not claim "Grassfeld does exactly this on its homepage."

## PROVENANCE — EVERY LINE

- Title / AI-budgeting / bank-connect → [artifact-confirmed] grep of grassfeld.html.
- Webflow host, `w-*` classes, website-files CDN → [artifact-confirmed] grep of grassfeld.html.
- 14 Lottie refs + hero Lottie placeholder + 5 GSAP refs → [artifact-confirmed] grep counts on grassfeld.html.
- Feature routes (`/features/...`) + Features dropdown → [artifact-confirmed] grep of grassfeld.html.
- Eight feature cards enumerated; import icon states; globe + bank-logo carousel → [WebFetch read] grassfeld.com, labeled.
- Pinned in-place single-viewport switcher on homepage → [NOT verified] design target per brief; flagged above.
- "1/10 video weight" → [KNOWN, brief] engineering rationale, not a measured figure from the artifact.

---

## THE RECIPE IN OUR STACK
Next 16 · React 19 · Framer Motion 12 · Lenis · inline `style={{}}` · NO Tailwind · NO Webflow · NO GSAP.

### B09 PRIMARY — the pinned three-pillar feature-switcher

Goal: one pinned viewport; visitor taps between our three pillars (e.g. Photo→List / MegaBot review / BuyerBot); the panel animates in place instead of scrolling to three separate blocks. Our three-pillar answer.

Layout:
- A tall section (~180–220vh) that acts as the scroll track. Inside it, a `position: sticky; top: 0` inner frame that pins for the duration (this is our "one pinned frame"). No `position:fixed` — use sticky so it releases cleanly and never traps mobile scroll.
- Left (or top on mobile ≤600px): three tab controls (the pillar names). Right/below: the pinned stage where the active pillar's visual animates.

Two drive modes — pick ONE, do not stack:
- **Tap-driven (recommended, senior-friendly):** three real `<button>` tabs (≥44px), `activeIndex` state, `AnimatePresence mode="wait"` cross-fades the stage. `initial={{opacity:0,y:16}}` → `animate={{opacity:1,y:0}}` → `exit={{opacity:0,y:-16}}`, `duration:0.5, ease:[0.23,1,0.32,1]`. This is the accessible default and works with keyboard + reduced-motion.
- **Scroll-driven (optional enhancement):** while pinned, map Lenis/`useScroll` progress → activeIndex (0→1→2) so scrolling auto-advances pillars. If used, the tabs must STILL be clickable and must jump scroll position to the matching segment. Gate entirely off on `prefers-reduced-motion` (fall back to three normal stacked blocks).

Stage content per pillar: an inline animated composition (see B04 recipe below), NOT a video.

A11y:
- Tabs: `role="tablist"` / `role="tab"` / `aria-selected`; stage `role="tabpanel"` `aria-labelledby` the active tab.
- Sticky frame must not overlap the fixed StickyNav — account for nav height in `top`.
- Reduced-motion: render all three as static, fully-visible stacked sections (no pin, no cross-fade).

### B04 — AI-import animation WITHOUT video (Lottie-equivalent on our stack)

We don't ship Lottie or GSAP. Reproduce the "vector, tiny weight" win with Framer + inline SVG/DOM:
- Build the "photo → identified → priced → listed" sequence as a staged DOM/SVG animation. Rows are divs; category/status icons are inline SVG. Animate `opacity` + `translateY` + a checkmark `pathLength` draw (Framer `motion.path` `initial={{pathLength:0}}`→`animate={{pathLength:1}}`).
- Sequence with a `staggerChildren`/timeline of Framer variants; loop with a controlled `useAnimationControls` restart when in view.
- Weight discipline (the actual Grassfeld lesson): NO mp4/webm for this feature demo. Pure vector/DOM keeps it well under a video's byte cost and stays crisp at any DPR. This directly serves our LCP target (<2.5s, CLAUDE §9) — no video decode on a feature panel.
- Numbers inside (prices, counts) in Barlow Condensed per WCS §4.

### B06 — external-account / marketplace-connection animation

Our analog isn't "connect a bank" — it's "connect your marketplaces" (eBay / Poshmark / Mercari / FB Marketplace). Same mechanic:
- A ring/grid of platform logo chips animating into a "connected" state around a central Legacy-Loop mark, with a subtle draw-in line from each chip to center (Framer `motion.line`/`pathLength`).
- Restrained: one accent glow on connect (`--accent-glow`), success uses `--success` #22c55e (NOT #4caf50, WCS §3).
- Use existing MarketplaceTicker platform names as the source list — do not invent partner claims (pre-revenue integrity, WCS §9). If a platform integration isn't real yet, frame as "designed to connect," never "connected."

### Do NOT do this pass
- Do not add Lottie or GSAP — Framer + inline SVG only (stack law, CLAUDE §2).
- Do not claim Grassfeld's homepage has a single pinned switcher (unverified) or that our marketplace integrations are live.
- Do not ship an mp4 for the import demo — the whole point is vector weight.
