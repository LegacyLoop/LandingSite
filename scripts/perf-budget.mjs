#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// perf-budget.mjs — INITIAL-JS BUDGET GATE (CMD-LANDING-PASS3 · W2)
//
// The motion substrate is only worth laying if it stays cheap. This gate makes
// the playbook's "initial JS under 200KB gzipped" budget a BUILD-FAIL, not an
// advisory: any wave that pushes the shared initial JS over budget fails CI with
// the per-chunk breakdown, so the cost is seen before it ships.
//
// WHAT IT MEASURES: the SHARED initial JS every route loads — build-manifest's
// rootMainFiles + polyfillFiles — gzipped. Turbopack (Next 16) does not expose a
// clean per-route First-Load split, so this measures the shared baseline (the
// number the budget is written against) rather than silently claiming per-route
// coverage. NO-SILENT-CAPS: what is and isn't counted is printed every run.
//
// Zero dependencies (Node builtins only). Run AFTER `next build`.
// Usage: node scripts/perf-budget.mjs   (exit 1 = over budget)
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const BUDGET_KB = 200
const NEXT_DIR = '.next'

let manifest
try {
  manifest = JSON.parse(readFileSync(join(NEXT_DIR, 'build-manifest.json'), 'utf8'))
} catch {
  console.error('perf-budget: no .next/build-manifest.json — run `next build` first.')
  process.exit(2)
}

// A manifest that parses to a non-object (null, number) or whose entry lists are not
// arrays must FAIL LOUD — never coerce a malformed manifest into an empty measure and pass.
if (!manifest || typeof manifest !== 'object') {
  console.error('perf-budget: build-manifest.json did not parse to an object — refusing to pass a blind gate.')
  process.exit(2)
}
const root = manifest.rootMainFiles
const poly = manifest.polyfillFiles
if (!Array.isArray(root) || !Array.isArray(poly)) {
  console.error('perf-budget: rootMainFiles/polyfillFiles missing or not arrays — refusing to pass a blind gate.')
  process.exit(2)
}

const files = [...new Set([...root, ...poly])]
if (files.length === 0) {
  console.error('perf-budget: manifest had zero shared entry files — refusing to pass a blind gate.')
  process.exit(2)
}

let totalGz = 0
const rows = []
for (const f of files) {
  try {
    const gz = gzipSync(readFileSync(join(NEXT_DIR, f))).length
    totalGz += gz
    rows.push({ f, gz })
  } catch {
    // A listed file we cannot read is a real problem — fail loud, do not skip silently.
    console.error(`perf-budget: manifest lists ${f} but it could not be read.`)
    process.exit(2)
  }
}

rows.sort((a, b) => b.gz - a.gz)
console.log('──────────────────────────────────────────────────────────────')
console.log('PERF BUDGET · shared initial JS (rootMainFiles + polyfills, gzipped)')
console.log('──────────────────────────────────────────────────────────────')
for (const { f, gz } of rows) {
  console.log(`${(gz / 1024).toFixed(1).padStart(8)}KB  ${f}`)
}
const totalKb = totalGz / 1024
console.log('──────────────────────────────────────────────────────────────')
console.log(`TOTAL ${totalKb.toFixed(1)}KB  ·  BUDGET ${BUDGET_KB}KB  ·  HEADROOM ${(BUDGET_KB - totalKb).toFixed(1)}KB`)
console.log('NOTE: measures the SHARED baseline every route loads; per-route splits')
console.log('are not counted (Turbopack does not expose them cleanly).')

if (totalKb > BUDGET_KB) {
  console.error(`\nFAIL · shared initial JS ${totalKb.toFixed(1)}KB exceeds ${BUDGET_KB}KB budget.`)
  process.exit(1)
}
console.log(`\nPASS · under budget by ${(BUDGET_KB - totalKb).toFixed(1)}KB.`)
