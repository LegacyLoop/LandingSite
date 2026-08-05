# TECHNIQUE DOSSIER — Off Menu

Source: https://offmenu.design
Artifact: docs/dossiers/offmenu.html [FETCHED · 49,298 bytes · curl 200]
WebFetch technique read: performed (labeled inline).
Bench roles: B04 (write-and-list primary) + B05 CO-PRIMARY (chatbot-as-CTA).
CMD-LANDING-PASS3 · W0 recon · no markup/class/JS/media/copy lifted.

---

## WHAT IT IS — [KNOWN] canon facts

- [KNOWN] SOTD (Site of the Day) Apr 23 2026. Score 7.37.
- [KNOWN] Author: Petr Knoll.
- [KNOWN] Stack cited in the brief: Next.js + GSAP + CSS.
- [KNOWN · artifact-confirmed] `<title>Off Menu — AI-Native Studio for Agentic Interfaces</title>`. Self-positions as an "AI-native studio."
- [KNOWN · artifact-confirmed] The page ships a real embedded AI assistant named "Remi." Verbatim intro copy present in HTML: "Hey — I'm Remi, Off Menu's AI assistant." Input placeholder: "Ask me anything..."
- [KNOWN · artifact-confirmed] Restrained token set. Theme classes `theme-dark` / `theme-light`; color custom props limited to a small foreground/border/halo family (`--color-foreground`, `--color-border`, `--color-halo`) plus `#000000`. This is the "elite without a rainbow" two-color discipline the brief flags.

## THE MECHANIC

Three interlocking mechanics; the brief elevates #3 (the conversational surface AS the CTA) to CO-PRIMARY.

1. **Generative / self-composing surface.**
   [WebFetch read — HONEST LABEL] The WebFetch pass did NOT observe a typewriter/self-assembling text effect in the static markup, and no GSAP timeline is inline in the fetched HTML (GSAP loads as an external script per the brief's stack note). So the "content composing itself on screen" claim is [KNOWN — from the brief/SOTD citation], NOT independently verified from the artifact. Treat as a directional target, not a confirmed on-page observation.

2. **Restrained two-color system.**
   [artifact-confirmed] Foreground/background/halo tokens only. No accent-rainbow. The premium signal comes from contrast + halo glow, not hue variety. This is directly transferable and is the safest lift.

3. **The conversational surface AS the conversion element (CO-PRIMARY).**
   [artifact-confirmed] The chat is not a bottom-right bubble widget. In the HTML it is a first-class page region:
   - A positioned `chat-window` region, a `chat-trigger`, a `chat-input` (rounded pill with icon + `<textarea placeholder="Ask me anything...">`), a `chat-background`, and a `chat-intro-video`.
   - It uses CSS anchor positioning (`anchor-name: --chat-position` / `--chat-trigger`) so the window anchors to the trigger — a deliberate, layout-level placement, not a floating overlay.
   - [WebFetch read] Remi opens with a greeting and offers three scripted choice chips ("Where should I start?", "What do you do?", "I have a project") — i.e., the CTA is "talk to the studio," and the entry points are pre-scripted, deterministic prompts.

## PROVENANCE — EVERY LINE

- SOTD date / score / author / stack → [KNOWN] from CMD brief citation (Awwwards SOTD record + brief).
- Title, "AI-native studio" → [artifact-confirmed] grep of offmenu.html `<title>`.
- Remi assistant, "Hey — I'm Remi...", "Ask me anything..." → [artifact-confirmed] grep of offmenu.html.
- chat-window / chat-trigger / chat-input / chat-intro-video / anchor-name tokens → [artifact-confirmed] grep of offmenu.html.
- theme-dark/theme-light + foreground/border/halo tokens + #000000 → [artifact-confirmed] grep of offmenu.html.
- Three scripted choice chips → [WebFetch read] offmenu.design, labeled.
- Self-composing/generative text effect → [KNOWN, brief only] NOT artifact-verified; flagged above.

---

## THE RECIPE IN OUR STACK
Next 16 · React 19 · Framer Motion 12 · Lenis · inline `style={{}}` · NO Tailwind · CSS vars via globals.css.

### B05 CO-PRIMARY — the self-typing chatbot-as-CTA (deterministic scripted preview)

Goal: a conversational surface that IS the primary CTA — visitor sees a scripted, self-typing exchange, then can send their own line into the waitlist. Not a live LLM. A deterministic, illustrative preview with a hard truth fence.

Structure (all inline, one client component):
- A pinned/anchored chat panel region (NOT a corner bubble). Give it a real place in the section grid: assistant greeting + a stacked message list + a rounded pill input (icon + textarea + send). Rounded-full pill per our SECTION 3 pill radius `9999px`; card radius 16px on the panel.
- Colors: use OUR two-token discipline to echo the "elite without a rainbow" mechanic — `--bg-card-solid` panel, `--accent` (#00BCD4) for the bot bubble border/glow, `--text-primary` for copy. No new tokens (Build Law 3 additive; SECTION 3 "do not invent tokens").
- Fonts: message copy in Plus Jakarta Sans; any number/count in Barlow Condensed.

Deterministic self-typing sequence (Framer Motion, NOT an API):
```
const SCRIPT = [
  { from: "user", text: "I've got a house full of my mom's things — where do I even start?" },
  { from: "bot",  text: "Snap a photo of any item. I'll identify it, price it against live comps, and draft the listing." },
  { from: "bot",  text: "Antiques get flagged for a deeper review so nothing valuable gets undersold." },
];
```
- Drive it with a single state index + `useEffect` timers (setTimeout chain), gated by `useInView` so it only starts when scrolled into view.
- Per-message: Framer `motion.div` with `initial={{opacity:0, y:8}}` → `animate={{opacity:1, y:0}}`, `transition={{duration:0.4, ease:[0.23,1,0.32,1]}}` (matches our staggered-reveal easing, WCS §2/04).
- The "typing" feel: show a 3-dot pulse bubble (reuse `pulseGlow` @keyframes) for ~700ms before each bot line resolves. Do NOT actually char-stream unless reduced-motion is off; on `prefers-reduced-motion` render the full transcript instantly, no timers.
- Live input: the textarea is real and focusable (44px+ target, senior rule), but on submit it does NOT hit an LLM — it captures the text as "interest context" and routes into the existing WaitlistSection (consult-first coherence; matches the repo's prior "carry tier interest into the waitlist" pattern).

TRUTH FENCE (verbatim, non-negotiable — WCS §9 integrity, pre-revenue):
- Label the panel visibly: **"Illustrative preview"** (small caps eyebrow above the chat, `--text-muted`, 11px+ per senior floor).
- Fence line under the input, verbatim: **"This is a scripted preview of how Legacy-Loop guides you. Send a note and we'll add you to Early Access."**
- Never imply a live agent is answering in real time. No "AI is thinking about YOUR item" language on the scripted lines.

A11y / senior:
- `role="log"` + `aria-live="polite"` on the message list so screen readers announce each arriving line.
- Input has a visible `<label>` (not placeholder-only). 44px min touch target on send.
- All timers cleared on unmount; reduced-motion path renders static transcript.

### Bonus lift — the two-color discipline (cheap, high-signal)
Audit the target section to ensure it reads as foreground + accent + halo only. The Off Menu signal is restraint: one accent (our teal), a halo glow (`--accent-glow` rgba(0,188,212,0.35)) on the active bubble, everything else foreground/muted. Do not add estate-gold OR megabot-purple into this section — keep it two-tone to earn the "elite" read.

### Do NOT do this pass
- No live LLM wiring (backend-free site; AGENTS/CLAUDE law).
- No GSAP (our stack is Framer; do not add a second animation lib).
- Do not claim the generative/self-composing effect as "verified from Off Menu" — it's brief-cited only.
