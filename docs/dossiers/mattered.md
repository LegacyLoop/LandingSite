# TECHNIQUE DOSSIER — Mattered Inbox (mattered.com)

> CMD-LANDING-PASS3 W0 recon. Bucket B06 (Message Center primary).
> No emoji. Provenance on every claim line. No markup/copy/media lifted.

---

## FETCH STATUS

- **[BLOCKED]** `curl` to `https://mattered.com` returned HTTP **403 Forbidden**
  (`<title>403 - Forbidden</title>`, `<meta name="robots" content="noindex">`,
  75,193 bytes of block-page HTML, NOT the real site).
  [PROVENANCE: local fetch `docs/dossiers/mattered.html`, head inspected 2026-08-05]
- Reason: origin refuses the datacenter/curl UA (edge WAF / bot rule). One pull only, per robots/ToS. Not retried.
- **WebFetch NOT run** against the real content (fetch was blocked; a WebFetch read
  of the same 403 origin would return the block page, not technique). Nothing below
  is claimed as observed-from-live-DOM; canon facts are [KNOWN] from the brief only.

---

## WHAT IT IS  [KNOWN — from CMD brief, not re-verified live]

- Mattered — an **email/message-center product** whose landing page IS a working-feeling
  email client. [KNOWN: brief]
- Awwwards **Honorable Mention, Jul 14 2025**; classified "App-Style single page." [KNOWN: brief]
- Our anchor for **B06 Message Center** — the "the interface is the website" pattern. [KNOWN: brief]

---

## THE MECHANIC  [KNOWN — brief-sourced; NOT DOM-verified this pass]

The described mechanic (could not confirm against live DOM — origin 403):

1. **The interface is the demo.** Sidebar nav (folders), tag filtering, starred items,
   a message list — a real-feeling inbox rendered inline on the page. [KNOWN: brief]
2. **State transitions instead of page loads.** Clicking a folder / tag / star swaps the
   visible content via client state, no navigation. [KNOWN: brief]
3. **Tag filtering as a live demo** — the filter actually filters the visible list. [KNOWN: brief]

Motion params (ms / easing / pin-vh / breakpoints / reduced-motion): **NOT AVAILABLE**
— cannot be measured because the fetch was blocked. Do not fabricate. [BLOCKED]

---

## THE RECIPE IN OUR STACK
### (Next 16 + React 19 + Framer Motion + Lenis + GSAP ScrollTrigger on a shared Lenis ticker + inline styles, no Tailwind)

Goal: a **pinned mini-inbox** on the landing that demonstrates Legacy-Loop's message
center (buyer offers, bot updates) as a self-contained, keyboard-accessible interactive
widget — the interface as its own proof.

**Structure (inline-styled, single component in `app/landing/page.tsx`):**
- One `MiniInbox` client component. Local `useState` for `activeFolder`, `activeTag`,
  `selectedId`, `starred:Set<string>`. Seed data is synthetic Legacy-Loop content
  (e.g. "Offer on Mid-Century Dresser", "AntiqueBot review complete") — never real user data.
- Left rail = folders (Inbox / Offers / Sold / Estate). Center = filtered list.
  Right = selected-message pane.

**State transitions (Framer Motion, not page loads):**
- Wrap the list in `<AnimatePresence mode="popLayout">`; each row keyed by id.
- Row variants: `initial {opacity:0, y:8}` -> `animate {opacity:1, y:0}` ->
  `exit {opacity:0, y:-8}`, `transition {duration:0.28, ease:[0.23,1,0.32,1]}`
  (our canonical spring-out cubic-bezier). Filtering a tag animates the delta only.
- Selecting a message: `layoutId` on the row title so it morphs into the detail-pane
  header (shared-layout transition) — one element changing shape, not a reload.

**Pin it while the user reads (GSAP ScrollTrigger on the SHARED Lenis ticker):**
- Register once, drive ScrollTrigger from the app-wide Lenis instance:
  `lenis.on('scroll', ScrollTrigger.update)` and
  `gsap.ticker.add((t)=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)`.
- `ScrollTrigger.create({ trigger:'#inbox', start:'top top', end:'+=120%', pin:true })`
  so the inbox holds while a short scripted "click Offers -> star -> open" auto-walk plays,
  then releases. Keep pin distance modest (pin-vh ~= 1.2 viewport) — Rule 1/5, do not fight the reader.

**Keyboard-accessible (mandatory — WCS Section 5, senior-friendly):**
- Folders/tags are real `<button>`s (44px min target). List is a `role="listbox"`,
  rows `role="option"` with `aria-selected`. Arrow-up/down move `selectedId`,
  Enter opens, `S` stars. Visible focus ring on every control.
- `useReducedMotion()` gate: when reduced, drop the auto-walk + layout morph, keep instant
  state swaps (still fully functional, no motion). ScrollTrigger pin disabled under reduced-motion.

**Honesty labels (Rule 4 — no fabricated traction):**
- Seed content reads as sample/preview, not "live inbox." If any count is shown, label it
  as illustrative. No fake unread badges implying real volume.

**Perf:** synthetic data only, no network; `will-change:transform,opacity` only on the
actively animating row; unpin cleanly on unmount (`ScrollTrigger.getAll().forEach(t=>t.kill())`).

---

## CARRY-FORWARD / FLAGS

- **[BLOCKED]** mattered.com = 403 to curl. If live technique detail is required, needs a
  browser-context fetch (Playwright/headed UA) in a follow-up — out of scope for a
  one-pull-each W0 recon. Not fabricated here.
- Recipe above is grounded in the brief's described mechanic + our own stack conventions,
  clearly labeled [KNOWN: brief] where not DOM-verified.

---

## W0 PLAYWRIGHT VERIFY — CANON URL MISMATCH FOUND (2026-08-05, [WATCHED])
Live browser load of mattered.com. [WATCHED] title: "Mattered — Lifecycle Marketing & Development
Agency"; hero copy "We build things that matter", CTAs GET IN TOUCH / BOOK A CALL, a case-study
teaser "Three Nails: +505% Email Revenue". NO inbox interface — no sidebar, no folders, no
tag-filtering, no email client. This is a MARKETING/DEV AGENCY, not the "Mattered Inbox" email-client
product the canon B06 describes.

FINDING (D-3 verify-at-source): the canon's B06 primary URL is a MISMATCH — same class as the
Truck'N Roll B07 mismatch (that URL is an entertainment-logistics company, not the freight/TMS
award-winner). The "interface-IS-the-website email client" mechanic has NO live [FETCHED]/[WATCHED]
source at this URL.

RESOLUTION (not a hard halt): the canon ITSELF states B06 is a category-first build — "our research
found ZERO Awwwards-recognized unified-inbox products" (Superhuman/Front/Missive/Beeper/Shortwave all
have zero award footprint). So there is no award reference to match, by design. The Message Center
mini-inbox (W4) is built ORIGINAL from first principles + the Grassfeld [FETCHED] connection-animation
sub-mechanic. The mechanic (four-platform threads filtering into one view, state transitions not page
loads, keyboard-accessible) is well-understood and buildable without a reference lift.
[WATCHED] motion note from the agency site (incidental): reveal easing cubic-bezier(0.16,1,0.3,1) +
material cubic-bezier(0.4,0,0.2,1) — same reveal family already seen on Cleo.

ACTION: flag both canon URL errors (Mattered B06, Truck'N Roll B07) to the authoring desk / CEO for
a canon correction. B06 proceeds as an original build per the canon's own category-first note.
