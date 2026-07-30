#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// truth-gate.mjs — CMD-LANE-C-REGISTER-CI-GATE V20 · Agent C · 2026-07-29
//
// WHAT: Turns docs/TRUTH_REGISTER_2026-07-29.json into a permanent CI tripwire.
//       A claim the Truth Sweep removed must never silently return — in code,
//       metadata, JSON-LD, OG tags, alt/aria text, image FILENAMES, sitemap,
//       email templates, seed data or API strings. If a gated claim reappears,
//       CI goes RED and the message names the claim + file + register row.
//
// WHY A BASELINE (the data-driven core — read this before editing):
//       The register documents 475 claims; only a SUBSET has been removed so far
//       (Wave 0 + Wave 0.5). The rest are being cleaned by other lanes and are
//       LEGITIMATELY still in the tree today. If the gate banned every register
//       row it would fail on a clean HEAD and block the very lanes doing the
//       cleanup. So the gate enforces only the claims that are ALREADY GONE:
//
//         enforced = distinctive gateable rows whose claim is ABSENT at the
//                    authoring baseline (scripts/truth-gate-baseline.json)
//         deferred = gateable rows still present at baseline (pending lanes) —
//                    EMITTED, never hidden. When a lane removes one, prune it
//                    from the baseline (or run `--update-baseline`) and it
//                    becomes enforced automatically.
//
//       This is the NO-SILENT-CAPS contract (CEO-ratified): a gate that reports
//       its blind spots beats one that claims total coverage. Every row that is
//       NOT enforced is printed with the reason (deferred / too-generic).
//
// USAGE:
//   node scripts/truth-gate.mjs                 # ENFORCE — exit 1 on any violation (CI default)
//   node scripts/truth-gate.mjs --report        # classify every row, exit 0 (audit)
//   node scripts/truth-gate.mjs --update-baseline  # regenerate the present-at-HEAD baseline
//   node scripts/truth-gate.mjs --repo=LANDING  # scan as the landing repo (vendored copy uses this)
//
// EXCLUSIONS (a banned string legitimately lives in these — never scanned):
//   - docs/TRUTH_REGISTER_2026-07-29.json        (the register itself)
//   - docs/TRUTH_REGISTER_2026-07-29.md          (human register)
//   - docs/CANONICAL_FACTS.md                    (the "what is true" half — quotes banned words to ban them)
//   - this script + the baseline file            (the gate's own code)
//   - _INFLIGHT_SPEC.md, handoff/**              (specs / vendored handoff)
//   - node_modules, .git, .next, graphify-out, dist, coverage, .turbo
//   - "WAVE 0 / WAVE 0.5 TRUTH SWEEP" comment lines AND their block-comment
//     continuation lines (line-level exclusion misses continuations — e.g.
//     app/components/Footer.tsx:7-8 — so block comments containing the marker
//     are stripped whole before scanning).
//
// ADD A NEW BAN: it is a one-line sidecar edit, never a code change. Add a row to
//   the register with verdict FALSE/HARMFUL/MISLEADING/UNVERIFIABLE and an action
//   of DELETE/REPLACE/REWRITE/HARDEN. Optionally set "gatePattern" on the row to
//   override the auto-derived needle (use for code-shaped or long paraphrased
//   claims where the literal claim text is a poor match).
//
// ZERO new dependencies. Node ESM only.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// Paths are env-overridable so the vendored landing copy can point at its own
// synced register / baseline without editing code (see handoff/landing-truth-gate/README.md).
const REGISTER_PATH = process.env.TRUTH_REGISTER || 'docs/TRUTH_REGISTER_2026-07-29.json';
const BASELINE_PATH = process.env.TRUTH_BASELINE || 'scripts/truth-gate-baseline.json';
const SELF = relative(process.cwd(), fileURLToPath(import.meta.url)) || 'scripts/truth-gate.mjs';

const args = new Set(process.argv.slice(2));
const REPORT = args.has('--report');
const UPDATE_BASELINE = args.has('--update-baseline');
const REPO = (() => {
  for (const a of args) { const m = /^--repo=(APP|LANDING)$/.exec(a); if (m) return m[1]; }
  return 'APP';
})();

// ── Scanning target ──────────────────────────────────────────────────────────
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'graphify-out', 'dist', 'coverage', '.turbo', '.vercel']);
const TEXT_RE = /\.(tsx?|jsx?|mjs|cjs|json|md|mdx|css|scss|html|txt|svg|ya?ml|prisma|xml|webmanifest)$/i;
// A banned string legitimately appears in these — never scan them.
const EXCLUDE_FILES = new Set([
  REGISTER_PATH,
  'docs/TRUTH_REGISTER_2026-07-29.md',
  'docs/CANONICAL_FACTS.md',
  BASELINE_PATH,
  SELF,
  '_INFLIGHT_SPEC.md',
].map((p) => p.replace(/\\/g, '/')));
const EXCLUDE_PREFIX = ['handoff/', 'docs/audits/', 'docs/specs/'];

function walk(dir, acc) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const name of entries) {
    const p = join(dir, name);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p, acc); }
    else if (TEXT_RE.test(name)) acc.push(p);
  }
  return acc;
}

// ── Comment stripping (WAVE 0 / 0.5 TRUTH SWEEP removal notes quote banned words) ──
const SWEEP_MARKER = /WAVE 0(\.5)? TRUTH SWEEP|TRUTH SWEEP 2026-07-29/;
// Remove any block comment ( /* */ , {/* */} , <!-- --> ) whose body carries the
// sweep marker, then remove single-line comments carrying it. Continuation lines
// inside a stripped block go with it — the Footer.tsx:7-8 case.
function stripSweepComments(text) {
  let out = text;
  // Block comments ( /* */ , {/* */} , <!-- --> ): strip whole block if it carries the marker.
  out = out.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, (m) => (SWEEP_MARKER.test(m) ? ' ' : m));
  out = out.replace(/<!--[\s\S]*?-->/g, (m) => (SWEEP_MARKER.test(m) ? ' ' : m));
  // Line comments ( // and # ): a marker on ANY line of a CONTIGUOUS comment run
  // blanks the WHOLE run. Continuation lines carry no marker of their own (e.g.
  // Footer.tsx:6-10 — the marker is on line 6, "Veteran-Owned"/"SOC 2" sit on
  // lines 7-8), so a line-by-line check would leak them and silently defer the
  // very claims we mean to gate. Over-stripping adjacent comment lines is safe:
  // it only ever removes text (moves a claim toward ENFORCED, never toward masked).
  const lines = out.split('\n');
  const isLineComment = (l) => /^\s*(\/\/|#)/.test(l);
  let i = 0;
  while (i < lines.length) {
    if (!isLineComment(lines[i])) { i++; continue; }
    let j = i;
    while (j < lines.length && isLineComment(lines[j])) j++;
    if (lines.slice(i, j).some((l) => SWEEP_MARKER.test(l))) {
      for (let k = i; k < j; k++) lines[k] = '';
    }
    i = j;
  }
  return lines.join('\n');
}

// ── Normalisation (match despite JSX line-wrap + smart quotes) ─────────────────
function normalize(s) {
  return (s || '')
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
function stripWrap(s) {
  return (s || '').replace(/^["'`“”\s]+|["'`“”\s]+$/g, '');
}

// ── Derive the needle for a register row ───────────────────────────────────────
const GATE_VERDICTS = new Set(['FALSE', 'HARMFUL', 'MISLEADING', 'UNVERIFIABLE']);
const GATE_ACTIONS = new Set(['DELETE', 'REPLACE', 'REWRITE', 'HARDEN']);
const MIN_LEN = 12; // shorter is too generic to string-gate (e.g. "Save 20%", "Paid", "DHL")
const MIN_WORDS = 2;

function rowActionHead(row) {
  return (row.action || '').toUpperCase().split(/[\s/,]/)[0];
}
// Returns { needle } if gateable-by-string, else { skip: reason }.
function deriveNeedle(row) {
  if (row.gatePattern) return { needle: normalize(row.gatePattern), overridden: true };
  if (!GATE_VERDICTS.has(row.verdict)) return { skip: 'verdict-not-gated (' + row.verdict + ')' };
  if (!GATE_ACTIONS.has(rowActionHead(row))) return { skip: 'action-not-removal (' + (row.action || '') + ')' };
  const needle = normalize(stripWrap(row.claim || ''));
  const words = needle.split(' ').filter(Boolean).length;
  if (needle.length < MIN_LEN || words < MIN_WORDS) return { skip: 'too-generic', needle };
  return { needle };
}

// A stable, UNIQUE id per register row: its global index in register.rows.
// Unique by construction (no collisions), 1:1 with the baseline. The baseline is
// regenerated whenever the register changes, so index churn is a non-issue.
function rowId(globalIndex) {
  return `${REPO}#${globalIndex}`;
}

// ── Load register ──────────────────────────────────────────────────────────────
if (!existsSync(REGISTER_PATH)) {
  console.error(`truth-gate: register not found at ${REGISTER_PATH} (run from the repo root).`);
  process.exit(1);
}
const register = JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));
// Keep the GLOBAL index (position in register.rows) — it is the row's unique id.
const rows = register.rows
  .map((row, globalIndex) => ({ row, globalIndex }))
  .filter((e) => e.row.repo === REPO);

// ── Build the scanned corpus ────────────────────────────────────────────────────
const allFiles = walk('.', []).filter((f) => {
  const rel = relative('.', f).replace(/\\/g, '/');
  if (EXCLUDE_FILES.has(rel)) return false;
  if (EXCLUDE_PREFIX.some((p) => rel.startsWith(p))) return false;
  return true;
});
const corpus = allFiles.map((f) => {
  let raw = '';
  try { raw = readFileSync(f, 'utf8'); } catch { /* binary/unreadable */ }
  const rel = relative('.', f).replace(/\\/g, '/');
  const stripped = stripSweepComments(raw);
  return { file: rel, flat: normalize(stripped), lines: stripped.split('\n') };
});
// FILENAMES are a surface too (image alt/filename claims): index basenames.
const fileNames = allFiles.map((f) => normalize(basename(f)));

// Find the first file+line a needle occurs in the (comment-stripped) corpus.
function locate(needle) {
  for (const c of corpus) {
    if (c.flat.includes(needle)) {
      for (let i = 0; i < c.lines.length; i++) {
        if (normalize(c.lines[i]).includes(needle)) return { file: c.file, line: i + 1 };
      }
      return { file: c.file, line: 0 };
    }
  }
  for (const fn of fileNames) if (fn.includes(needle)) { const idx = fileNames.indexOf(fn); return { file: allFiles[idx], line: 0 }; }
  return null;
}

// ── Classify every row ───────────────────────────────────────────────────────
const gateable = [];     // { row, needle, id, hit(loc|null) }
const generic = [];      // too short/generic — emitted
const skipped = [];      // verdict/action not gated (KEEP/TRUE etc.)
for (const { row, globalIndex } of rows) {
  const d = deriveNeedle(row);
  if (d.skip === 'too-generic') { generic.push({ row, needle: d.needle }); continue; }
  if (d.skip) { skipped.push({ row, reason: d.skip }); continue; }
  const id = rowId(globalIndex);
  gateable.push({ row, needle: d.needle, id, overridden: !!d.overridden, hit: locate(d.needle) });
}

// ── Baseline (present-at-authoring; deferred rows live here) ────────────────────
function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null;
  try { return new Set(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).deferredIds || []); }
  catch { return null; }
}
if (UPDATE_BASELINE) {
  const deferredIds = gateable.filter((g) => g.hit).map((g) => g.id).sort();
  const payload = {
    _comment:
      'AUTO-GENERATED by `node scripts/truth-gate.mjs --update-baseline`. Each id is a gateable ' +
      'register claim that was STILL PRESENT in the tree when the baseline was taken (a claim ' +
      'another lane has not yet removed). These are DEFERRED — the gate does not fail on them. ' +
      'When a lane removes one, delete its id here (or rerun --update-baseline) and the gate will ' +
      'enforce it from then on. Shrinking this file tightens the gate.',
    repo: REPO,
    generatedAt: register.generated,
    appPin: register.appPin,
    deferredCount: deferredIds.length,
    deferredIds,
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`truth-gate: wrote ${BASELINE_PATH} with ${deferredIds.length} deferred (present-at-HEAD) rows.`);
  process.exit(0);
}
const baseline = loadBaseline();

// enforced = gateable rows NOT deferred by the baseline.
// A row with no baseline entry that is present == a returned/never-removed claim we enforce.
const isDeferred = (g) => baseline ? baseline.has(g.id) : !!g.hit; // no baseline yet => defer anything present
const enforced = gateable.filter((g) => !isDeferred(g));
const deferred = gateable.filter((g) => isDeferred(g));
const violations = enforced.filter((g) => g.hit);

// ── Output ───────────────────────────────────────────────────────────────────
const bar = '─'.repeat(78);
console.log(bar);
console.log(`TRUTH GATE · repo=${REPO} · register ${register.generated} (pin ${register.appPin})`);
console.log(`rows(${REPO})=${rows.length}  scanned files=${allFiles.length}`);
console.log(`  enforced (tripwires): ${enforced.length}`);
console.log(`  deferred (still present, pending other lanes — EMITTED, not hidden): ${deferred.length}`);
console.log(`  ungated · too generic to string-gate (EMITTED): ${generic.length}`);
console.log(`  not gated (verdict KEEP/TRUE or non-removal action): ${skipped.length}`);
console.log(`  baseline file: ${baseline ? BASELINE_PATH + ' (' + baseline.size + ' ids)' : 'NONE — deferring all present rows'}`);
console.log(bar);

if (REPORT) {
  console.log('\nUNGATED · too generic (need a Stage-0/route-level or Playwright check, not a string gate):');
  for (const g of generic) console.log(`  · [${g.row.verdict}] "${g.needle}"  (${g.row.surface} @ ${g.row.fileLine})`);
  console.log('\nDEFERRED · gateable but still present at baseline (a lane must remove, then prune the baseline):');
  for (const g of deferred) console.log(`  · [${g.row.verdict}] "${g.needle.slice(0, 70)}"  @ ${g.row.fileLine}`);
  console.log('\nENFORCED · confirmed-removed tripwires (reintroduction => CI RED):');
  for (const g of enforced) console.log(`  · [${g.row.verdict}] "${g.needle.slice(0, 70)}"`);
  console.log(`\n(report mode — exit 0. ${violations.length} enforced claim(s) currently present.)`);
  if (violations.length) reportViolations(violations);
  process.exit(0);
}

if (violations.length === 0) {
  console.log(`PASS · no removed claim has returned. ${enforced.length} tripwires armed, ${deferred.length} deferred emitted.`);
  process.exit(0);
}
reportViolations(violations);
process.exit(1);

function reportViolations(vs) {
  console.error(`\nFAIL · ${vs.length} removed claim(s) have RETURNED to the tree:\n`);
  for (const g of vs) {
    const loc = g.hit ? `${g.hit.file}${g.hit.line ? ':' + g.hit.line : ''}` : '(filename)';
    console.error(`  ✗ CLAIM:    "${g.needle}"`);
    console.error(`    FOUND AT: ${loc}`);
    console.error(`    REGISTER: ${g.row.surface} · verdict ${g.row.verdict} · original ${g.row.fileLine}`);
    if (g.row.replacement) console.error(`    USE:      ${g.row.replacement}`);
    console.error(`    ORPHAN-CHECK: if you meant to keep this removed, also drop any now-dead`);
    console.error(`                  import/var/prop/test the reintroduction dragged back in.`);
    console.error('');
  }
  console.error(`This claim was removed by the Truth Sweep and is banned by docs/${REGISTER_PATH.split('/').pop()}.`);
  console.error(`If it is now legitimately TRUE, update docs/CANONICAL_FACTS.md in the SAME commit and`);
  console.error(`reclassify the register row — never just silence the gate.`);
}
