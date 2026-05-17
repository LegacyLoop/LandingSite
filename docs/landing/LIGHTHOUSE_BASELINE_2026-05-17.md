# Lighthouse Baseline · legacy-loop.com · 2026-05-17

> Baseline capture point for Wave 18 Track A perf optimization.
> CMD-LANDING-LIGHTHOUSE-BASELINE V20 R29 · Wave 18 Slot F · P3
> Re-run schedule: post-Fire 1 + 2 + 3 + 4 deploy on `main`.

## Capture Conditions

| Field | Value |
|---|---|
| URL | https://legacy-loop.com |
| Date | 2026-05-17 |
| Branch | main |
| Commit at capture | b93e22e (post Wave 18 Slot E backdrop-filter PC optimize) |
| Browser | Chrome __VERSION__ |
| Lighthouse | __VERSION__ (DevTools panel) |
| Network throttle | Default Lighthouse "Slow 4G" / "No throttling" (CEO note which) |
| CPU throttle | Default Lighthouse 4x slowdown |
| Cache | Cleared before run · `Cmd+Shift+R` then incognito |
| Run count | 3 runs · median values recorded below |

## Capture Targets

CEO runs the audit from Chrome DevTools (Lighthouse panel) on
both **Desktop** and **Mobile** form factors. Median of 3 runs.

### Desktop (Chrome · default desktop preset)

| Metric | Value | Score | Target | Notes |
|---|---|---|---|---|
| Performance score | __ / 100 | — | ≥ 90 | |
| LCP (Largest Contentful Paint) | __ s | __ | < 2.5s | Hero video first-frame |
| FCP (First Contentful Paint) | __ s | __ | < 1.8s | |
| CLS (Cumulative Layout Shift) | __ | __ | < 0.1 | |
| TBT (Total Blocking Time) | __ ms | __ | < 200ms | Backdrop-filter target |
| Speed Index | __ s | __ | < 3.4s | |
| TTFB (Time to First Byte) | __ ms | __ | < 800ms | Vercel edge cache |
| Accessibility score | __ / 100 | — | ≥ 95 | |
| Best Practices | __ / 100 | — | ≥ 95 | |
| SEO | __ / 100 | — | = 100 | |

### Mobile (Chrome · default mobile preset · Moto G Power emulation)

| Metric | Value | Score | Target | Notes |
|---|---|---|---|---|
| Performance score | __ / 100 | — | ≥ 80 | |
| LCP | __ s | __ | < 2.5s | iPad fix gate |
| FCP | __ s | __ | < 1.8s | |
| CLS | __ | __ | < 0.1 | |
| TBT | __ ms | __ | < 350ms | |
| Speed Index | __ s | __ | < 3.4s | |
| TTFB | __ ms | __ | < 800ms | |
| Accessibility | __ / 100 | — | ≥ 95 | Senior-friendly mandate |
| Best Practices | __ / 100 | — | ≥ 95 | |
| SEO | __ / 100 | — | = 100 | |

## P0 Flag Conditions

Open a P0 fix immediately if any of:

- [ ] Desktop LCP > 4.0s
- [ ] Mobile LCP > 4.0s
- [ ] Desktop CLS > 0.1
- [ ] Mobile CLS > 0.1
- [ ] Desktop Performance < 70
- [ ] Mobile Performance < 50
- [ ] Accessibility < 90 on either form factor

## Diagnostic — Top 3 Lighthouse Audit Failures

CEO paste exact audit names from Lighthouse "Opportunities" + "Diagnostics" panels:

### Desktop
1. ____ (estimated savings: __ s / __ KB)
2. ____ (estimated savings: __ s / __ KB)
3. ____ (estimated savings: __ s / __ KB)

### Mobile
1. ____ (estimated savings: __ s / __ KB)
2. ____ (estimated savings: __ s / __ KB)
3. ____ (estimated savings: __ s / __ KB)

## Wave 18 Pre-Fire State Context

These fires shipped before this baseline was captured. Lighthouse run
reflects their cumulative effect; subsequent re-runs measure delta from
this point onward, not from pre-Wave-18 state.

| Fire | Commit | Title | Expected impact |
|---|---|---|---|
| Slot B | c8c113e | CMD-LANDING-TOUCH-DETECT-CANONICAL | Windows: parallax + GlowCard + StaggeredWords now fire on PC → restores animations not measured by Lighthouse (perceived perf, not metric) |
| Slot D | fc2c915 | CMD-LANDING-VIDEO-WEBM-FALLBACK-COMPLETE | Firefox: GS Subsection Girl + GS Hero now resolve correctly → eliminates silent 404s on Firefox WebM-preferred clients |
| Slot E | b93e22e | CMD-LANDING-BACKDROP-FILTER-PC-OPTIMIZE | TBT: blur(24px) → blur(12px) on 10 sticky-nav surfaces · prefers-reduced-transparency opt-out · expected −50-150ms TBT on integrated GPU |

## Delta-Improvement Targets · Next Wave

After Wave 18 closes and Wave 19 fires, re-run Lighthouse and target:

| Metric | Baseline | Target delta | Target absolute |
|---|---|---|---|
| Desktop LCP | __ s | −15% | __ s |
| Desktop TBT | __ ms | −30% | __ ms |
| Desktop Performance | __ | +5 pts | __ |
| Mobile LCP | __ s | −20% | __ s |
| Mobile TBT | __ ms | −40% | __ ms |
| Mobile Performance | __ | +10 pts | __ |

## CEO Capture Procedure

1. Open Chrome on Mac (not Windows — that's the perf-degraded target)
2. New incognito window
3. Navigate to https://legacy-loop.com
4. Open DevTools (`Cmd+Opt+I`) → **Lighthouse** panel
5. Settings:
   - Categories: Performance · Accessibility · Best Practices · SEO
   - Device: **Desktop** (run 1)
   - Mode: Navigation (default)
   - Throttling: Simulated throttling (default)
6. Click "Analyze page load" · wait ~30s
7. Note all 6 metrics in Desktop table above
8. Click "Diagnostics" + "Opportunities" → paste top 3 audit failures
9. Re-run 2 more times · take median
10. Repeat steps 5-9 with Device: **Mobile**
11. Run on Windows PC for cross-check (Chrome + Edge)
12. Save Lighthouse JSON reports to `docs/landing/lighthouse-reports/`
    (filenames: `desktop-mac-run1.json` etc.)

## Re-Run Schedule

| Trigger | Owner | Deliverable |
|---|---|---|
| End of Wave 18 (all fires deployed + verified) | CEO | Re-run + delta-doc commit |
| Post-Wave 19 P0 fixes shipped | CEO | Re-run + delta-doc commit |
| Pre-investor demo (whenever first scheduled) | CEO | Re-run + delta-doc commit |
| Quarterly thereafter | CEO + Jarvis | Trend-doc append |

## Notes

- Vercel edge-cache hit rate may skew TTFB on first run after deploy.
  Always run after cache warms (one navigation after deploy completes).
- iPad Safari is NOT captured by Lighthouse Mobile (Moto G Power preset
  is Android Chrome). iPad perf verified separately via real-device QA.
- Senior-friendly mandate (CLAUDE.md §10) sets Accessibility ≥ 95 floor.
  Failures below 95 block ship regardless of perf scores.
