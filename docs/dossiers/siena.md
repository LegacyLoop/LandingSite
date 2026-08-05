# TECHNIQUE DOSSIER — Siena

Source: https://siena.cx
Artifact: docs/dossiers/siena.html [FETCHED · 1,083,482 bytes · curl 200]
WebFetch technique read: performed (labeled inline).
Bench role: B05 bench (the AI-Chat element = live self-typing conversation embedded in the page).
CMD-LANDING-PASS3 · W0 recon · no markup/class/JS/media/copy lifted.

---

## WHAT IT IS — [KNOWN] canon facts

- [KNOWN · artifact-confirmed] `<title>Empathic AI Agents for commerce | Siena AI</title>`. Product = "empathic AI agents for commerce" (customer-service automation for e-commerce brands).
- [KNOWN · artifact-confirmed] Content-rich marketing page (~1MB HTML, 349 `<p>` tags) — heavy prose + embedded product demos.
- [KNOWN · WebFetch read] The page embeds a demonstrative chat that plays a scripted customer-service exchange as an animated sequence.

## THE MECHANIC

**Embedded live-typing conversation as proof-of-capability.**
[WebFetch read — the load-bearing observation for this bench:]
- A message "arrives" from a customer, then the AI agent evaluates and responds, staged as a sequence (message in → evaluation → contextual reply), not a static screenshot.
- The scripted exchange observed by WebFetch (paraphrased, not lifted verbatim as design copy): a customer says they forgot to apply a discount code on yesterday's order; the agent replies that it has the order pulled up, offers to apply the code and refund the difference, and follows with a personalized product suggestion based on purchase history.
- A numbered indicator ("25") suggested this is ONE of several rotating example scenarios.
- The presentation sells "conversational naturalness + personalization" by SHOWING the agent reason and act, in-line, rather than describing it.

Difference from Off Menu's chatbot-as-CTA: Siena's chat is a **demonstration** (watch the agent work) rather than an **entry point** (talk to us). Off Menu = CTA. Siena = proof theatre. Our BuyerBot section wants Siena's proof-theatre framing under a strict truth fence.

## PROVENANCE — EVERY LINE

- Title / "empathic AI agents for commerce" → [artifact-confirmed] grep of siena.html.
- 349 `<p>` / ~1MB content weight → [artifact-confirmed] counts on siena.html.
- Message-arrives → bot-evaluates → bot-responds animated sequence; discount-code scenario; "25" scenario indicator; personalized follow-up → [WebFetch read] siena.cx, labeled. Not independently re-derived from raw markup this pass.

---

## THE RECIPE IN OUR STACK
Next 16 · React 19 · Framer Motion 12 · Lenis · inline `style={{}}` · NO Tailwind. Deterministic, backend-free.

### B05 bench — self-typing conversation as PROOF (not a live agent)

Goal: a section that SHOWS Legacy-Loop's assistant working an item end-to-end, as an animated typed exchange, to build trust — under our pre-revenue truth fence.

Mechanic build:
- A chat transcript component that plays a scripted, deterministic exchange. Reuse the Off Menu-dossier self-typing engine (state index + `setTimeout` chain gated by `useInView`); this dossier adds the **evaluation beat** Siena uses.
- Three-beat rhythm per turn (the Siena signature):
  1. Inbound bubble appears (the "message arrives").
  2. A brief "evaluating" state — a labeled thinking indicator, e.g. an eyebrow "MegaBot reviewing…" with a 3-dot pulse (reuse `consensusFill` / `pulseGlow` @keyframes) for ~700–900ms.
  3. Outbound bubble resolves with the agent's reply.
- Rotate scenarios like Siena's numbered examples: a small counter (Barlow Condensed) + prev/next chips let the visitor step scenarios (e.g. "Vintage lamp", "Estate lot", "Antique flag"). Each scenario is a hardcoded SCRIPT array. Cross-fade with `AnimatePresence mode="wait"`.

Example SCRIPT shape (illustrative — not final copy):
```
{ id:"lamp",
  turns:[
   {from:"user", text:"What's this brass lamp worth?"},
   {from:"eval", label:"MegaBot reviewing comps"},
   {from:"bot",  text:"Mid-century brass, ~$60–$90 based on 14 sold comps. Draft listing ready."},
  ]}
```

TRUTH FENCE (verbatim — WCS §9, pre-revenue, and the BuyerBot honesty rule):
- Eyebrow label on the section, verbatim: **"Illustrative preview"**.
- If BuyerBot is shown here, the fence line is verbatim: **"BuyerBot finds real interested buyers. You approve every contact. Manual today."** (matches the rabbit-r1 truth-anchor dossier — do not imply autonomous outreach).
- Never present the scripted numbers (prices, comp counts) as live data. If a number appears, it is illustrative; keep it plausibly modest, never inflated.

A11y / senior:
- `role="log"` + `aria-live="polite"` on the transcript; scenario stepper buttons ≥44px with visible labels.
- `prefers-reduced-motion`: render the full transcript of the current scenario instantly, no typing beats; stepper still works.
- Copy size floors per WCS §5 (body ≥13px, data ≥15px).

### Do NOT do this pass
- No live LLM / backend (frontend-only site).
- Do not imply the agent is answering the visitor's real item — it's a scripted demonstration.
- Do not overstate: no autonomous-outreach claims (BuyerBot fence above).
