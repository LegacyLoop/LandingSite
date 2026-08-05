# TECHNIQUE DOSSIER — Brunello Cucinelli AI E-commerce

- **URL:** https://shop.brunellocucinelli.ai
- **Corpus role:** B02 snap-it / AI-intake primary — upload + visual search AS the opening interaction; intent-led flow; loading states that explain what is happening. SOTD Jul 9 2026 (makemepulse). [KNOWN]
- **Artifact:** `docs/dossiers/brunello-cucinelli-ai.html` — [FETCHED] 10,634 bytes. Real HTML document, but it is a **Next.js SSR/RSC shell**: `<head>` + hydration payload only; the visible product UI (upload / visual-search hero) mounts from client chunks and is **not present in the static markup**.
- **WebFetch:** [WATCHED/partial] — returned only the page title ("Brunello Cucinelli AI e-commerce"); confirms the SPA-shell nature (no server-rendered hero copy to read).
- **Provenance legend:** [KNOWN] corpus canon · [FETCHED] read from the saved shell · [WATCHED] WebFetch pass · nothing invented.

---

## WHAT IT IS
[KNOWN] A luxury-house AI storefront whose **opening interaction is capture-first**: the visitor uploads / "snaps" an image and the site runs **visual search** as the primary entry point (not a search bar, not a category grid). Intent-led: the flow is driven by *what the visitor brought*, not by navigation. Awwwards SOTD Jul 9 2026 via makemepulse (a motion-craft studio — implies bespoke, high-polish transitions).

[FETCHED] Stack confirmed from the shell:
- **Next.js** — `/_next/static/chunks/*`, RSC hydration stream (`self.__next_f.push([...])`), `OutletBoundary` / `ViewportBoundary` / `MetadataBoundary` (App Router RSC markers).
- **Fonts (preloaded):** `GT Eesti Pro Display` (light) + `Quarto` (light) — a grotesque + a high-contrast serif = the luxury pairing (parallels our Exo 2 / Barlow split conceptually).
- Client-hydrated SPA: the hero, upload widget, and loading states live in JS chunks — hence invisible to curl/WebFetch.

## FETCH STATUS — HONEST
[FETCHED] The document is real (not a Cloudflare wall), but it is a **JS-hydrated shell**: the load-bearing interaction (snap/upload + visual search + AI loading states) is client-rendered and could not be read statically. The MECHANIC below is [KNOWN] corpus canon; the RECIPE is our-stack reconstruction, labelled as such. A Playwright pass would capture the real transition/loading timings. **Banked as a gap.**

---

## THE MECHANIC (target behaviours)
[KNOWN]

1. **Upload / snap-it as the hero.** The first meaningful action is give-us-an-image. The upload affordance IS the hero, replacing the usual headline+CTA. Drag-drop or camera/file pick.
2. **Visual search as the opening interaction.** The uploaded image becomes the query; results are matched products. The AI's job (find matches) runs immediately, front-and-center.
3. **Loading states that EXPLAIN.** The wait is narrated — the UI says what the AI is doing ("analysing the piece", "matching fabric / silhouette", "finding your matches") rather than a blank spinner. The loading state is content, not dead time.
4. **Intent-led flow.** Everything downstream is shaped by the upload — the visitor's intent leads; the site follows.
5. **makemepulse polish** — bespoke, weighted transitions between capture → analysing → results (not stock fades).

---

## THE RECIPE IN OUR STACK
(Next 16 + Framer Motion 12 + Lenis + inline `style={{}}`, no Tailwind)

This is **directly our "snap a photo → AI values it" thesis.** The mechanic is a three-state machine — `idle → analysing → result` — with the *analysing* state doing narrative work.

### Pattern A — Upload-as-hero (the opening interaction)
- Hero region IS a dropzone: `<input type="file" accept="image/*" capture="environment">` (camera on mobile) behind a large tap target (≥44px, senior doctrine), plus drag-drop handlers.
- On file: transition the hero out of `idle` and into `analysing` with `AnimatePresence` (`mode="wait"`) so the capture UI cross-fades to the loading narrative.
```tsx
const [phase, setPhase] = useState<"idle"|"analysing"|"result">("idle");
<AnimatePresence mode="wait">
  {phase === "idle" && <motion.div key="idle" exit={{ opacity:0, y:-12 }} .../>}
  {phase === "analysing" && <AnalysingNarrative key="load" .../>}
  {phase === "result" && <Results key="res" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} .../>}
</AnimatePresence>
```

### Pattern B — Loading states that EXPLAIN (the key craft)
The wait narrates the AI's steps on a timed sequence — reuse our MegaBot "4-AI consensus" beats:
```tsx
const steps = ["Reading the photo", "Identifying the item",
               "Finding comparable sales", "Estimating value"];
// advance an index on a timer OR on real progress events; each line:
<motion.span
  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, ease: [0.22, 0.9, 0.26, 1] }}>{steps[i]}</motion.span>
```
- Pair with a determinate progress element (not an infinite spinner) so the wait feels purposeful.
- A subtle scanning shimmer over the uploaded thumbnail (our existing `shimmer` keyframe) reinforces "the AI is looking at *your* item."

### Pattern C — Capture → result transition (makemepulse-grade)
- `AnimatePresence mode="wait"` with a weighted exit (`ease [0.22,0.9,0.26,1]`, ~0.5–0.7s) so the analysing state doesn't just pop to results — it *resolves*.
- The uploaded image can persist and animate to a smaller anchor position (shared-layout / `layoutId`) while results stagger in around it — ties result to intent.

### Pattern D — Results reveal
Staggered card grid (our shipped pattern): `staggerChildren: 0.08`, `opacity 0→1`, `y 32→0`, 0.6s `cubic-bezier(0.23,1,0.32,1)`.

### Reduced motion — MANDATORY
`useReducedMotion()`: collapse the phase transitions to instant state swaps, keep the *explanatory text* (accessibility win — the narration matters more than the motion), drop the shimmer.

### Type
GT-Eesti-ish grotesque + Quarto-ish serif → our Exo 2 (headings) + we already put Barlow Condensed on every number (the valuation figure). Keep the estate/luxury tone via `--estate-warm` gold on the result value.

### The transferable idea
**Make the upload the hero and make the wait talk.** The opening interaction is *give us your item*; the loading state is *narrated AI work* (read → identify → compare → value), not a spinner. This is exactly our photo→valuation core loop — a three-phase `AnimatePresence` machine where the *analysing* phase carries the story. Directly applicable to our HowItWorks / MegaBot / Waitlist "try it" surfaces.

### FOLLOW-UP (banked)
Hero is client-hydrated (invisible to static fetch). To capture makemepulse's real transition timings + the exact loading-state choreography: Playwright with a real UA, trigger an upload, record the phase transitions.
