# TECHNIQUE DOSSIER — rabbit r1

Source: https://www.rabbit.tech/rabbit-r1
Artifact: docs/dossiers/rabbit-r1.html [FETCHED · 86,173 bytes · curl 200]
WebFetch technique read: performed (labeled inline).
Bench role: B05 TRUTH ANCHOR (three-stage maturity framing that keeps our BuyerBot fence honest).
CMD-LANDING-PASS3 · W0 recon · no markup/class/JS/media/copy lifted.

---

## WHAT IT IS — [KNOWN] canon facts

- [KNOWN · artifact-confirmed] `<title>rabbit r1 - your AI assistant device</title>`. A physical AI assistant device.
- [KNOWN · artifact-confirmed] Built on Next.js (`/_next/image` asset pipeline in markup).
- [KNOWN · artifact-confirmed] Ships distinct capability tiers on the page: a base assistant ("quick answers… translations… recordings and smart summaries"), a third-party **agents** section (`r1_agents_websection`), and **DLAM** — a Large Action Model section (`DLAM_mobile` / `DLAM_desktop` assets).

## THE MECHANIC — three-stage maturity framing (the reason this is the TRUTH ANCHOR)

rabbit's page is useful to us NOT for a visual effect but for how it stages capability honesty across three maturity levels. Mapped from artifact copy:

1. **ASSISTANT — gives an answer.**
   [artifact-confirmed copy, paraphrased] "quick answers to your questions, translations on the go, on-device recordings and smart summaries — all powered by the latest AI models." Pure Q&A; no action taken in the world.

2. **AGENT — prepares / is directed to an action.**
   [artifact-confirmed copy, paraphrased] Third-party agents on the device; the site is explicit that "You must independently set up any third-party agent before accessing it," "rabbit does not provide support for third-party agents," and use "is entirely at your own risk." I.e. the agent tier is framed as user-configured and user-directed, NOT a hands-off promise.

3. **AUTONOMOUS EXECUTION — executes an approved/initiated action.**
   [artifact-confirmed copy, paraphrased] DLAM (Large Action Model): "plug it in, talk or type your prompt, and watch the magic happen." Even here, execution is USER-INITIATED (talk or type your prompt) — not unattended autonomy.

Honesty scaffolding rabbit pairs with the framing [artifact-confirmed, paraphrased]: "We cannot guarantee that answers, services, or other output from this device will be accurate, reliable, appropriate, or complete," plus repeated "at your own risk / verify accuracy" disclaimers. The lesson: the more agentic the claim, the louder the fence.

## WHY IT ANCHORS OUR BuyerBot FENCE

Maps our BuyerBot to the correct maturity rung so we never over-claim:
- BuyerBot is at the ASSISTANT/AGENT boundary, NOT autonomous execution.
- Verbatim fence (per brief): **"finds real interested buyers, you approve every contact. Manual today."**
- Every degree of agency implied MUST be met with a matching disclaimer + a human-approval gate — exactly rabbit's pattern.

## PROVENANCE — EVERY LINE

- Title / Next.js pipeline / agents section / DLAM section → [artifact-confirmed] grep of rabbit-r1.html.
- Assistant copy (answers/translations/summaries) → [artifact-confirmed] plain-text extraction of rabbit-r1.html.
- Third-party agent disclaimers ("set up… on your own", "at your own risk", "no support") → [artifact-confirmed] plain-text extraction.
- DLAM "plug it in, talk or type your prompt, and watch the magic happen" → [artifact-confirmed] plain-text extraction.
- "cannot guarantee… accurate/reliable" disclaimer → [artifact-confirmed] plain-text extraction.
- Three-stage mapping onto assistant/agent/autonomous → [WebFetch read + brief], synthesized/labeled. WebFetch noted rabbit does NOT sharply separate "prepare" vs "execute" — so the three-rung ladder is partly OUR framing imposed on their copy, flagged honestly.

---

## THE RECIPE IN OUR STACK
Next 16 · React 19 · Framer Motion 12 · Lenis · inline `style={{}}` · NO Tailwind. This is COPY/IA doctrine + a small visual, not a heavy effect.

### The three-rung capability ladder (honest agentic framing)

Render our AI capabilities as three explicitly-labeled rungs so the visitor (and an investor) reads exactly how far each bot goes:

1. **Answers** — "MegaBot identifies, prices, and drafts the listing." (assistant tier — no world-action)
2. **Prepares** — "BuyerBot finds real interested buyers and drafts outreach for you." (agent tier — prepares, does not send)
3. **You approve** — "Nothing is sent until you approve every contact. Manual today." (human gate — the execution stays with the human)

Visual (restrained, WCS pillar 03 PURPOSE):
- A three-step horizontal ladder/stepper. Each rung: label (Exo 2), one line of body (Plus Jakarta Sans), and a state chip. Rung 3's chip uses `--warning` #f59e0b (NOT #ff9800, WCS §3) or a neutral "You" chip to signal the human gate — never a green "auto/done" for anything unattended.
- Staggered reveal on scroll (index*80ms, our WCS §2/04 recipe). No autonomy animation — do not animate a "sending" action, because we don't send autonomously.

TRUTH FENCE (verbatim, non-negotiable — WCS §9 + brief):
- BuyerBot line, verbatim: **"finds real interested buyers, you approve every contact. Manual today."**
- Pair any agentic claim with its disclaimer inline (rabbit's louder-fence lesson). Never imply unattended outreach, purchases, or sends.
- Pre-revenue integrity: "Manual today" is a truth marker, not a roadmap promise — keep it.

A11y / senior:
- Ladder is semantic `<ol>`; chips have text labels, not color-only (WCS §5 error/state rule).
- ≥44px if any rung is tappable; body ≥13px, data ≥15px.

### Do NOT do this pass
- No "autonomous"/"hands-free"/"it does it all for you" language anywhere near BuyerBot.
- No green success state on an action a human hasn't approved.
- Do not present the three rungs as all-shipped — mark what's "Manual today."
