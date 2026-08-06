'use client'
// ─────────────────────────────────────────────────────────────────────────────
// ConstellationField — the point-cloud for the B05 BuyerBot climax (W3-B)
//
// Amaterasu dossier, Framer-Motion interpretation (docs/dossiers/amaterasu.md §1):
// ~60 transform-parallax particles = "buyers out there in the market." A subset are
// FOUND buyers — brighter, haloed — the metaphor resolving. Desktop (pointer:fine)
// parallaxes the field toward the cursor via per-particle depth (WCS pillar 04 DEPTH);
// touch drifts ambiently (float keyframes); reduced-motion renders it static.
// translate3d only (no layout thrash). Deterministic seed so SSR/CSR match — no
// hydration jitter, no Math.random. NO WebGL (V2). NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useMemo, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'

interface ConstellationFieldProps {
  reduced: boolean
  isTouch: boolean
  count?: number
}

interface Particle {
  id: number
  x: number // percent
  y: number // percent
  size: number
  depth: number
  found: boolean
  driftDelay: number
}

// Deterministic LCG so server and client render identical positions.
function seededParticles(count: number): Particle[] {
  let s = 987654321
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size: 2 + rand() * 3.5,
    depth: 0.02 + rand() * 0.11,
    found: rand() > 0.82, // ~18% resolve into "found buyers"
    driftDelay: rand() * 6,
  }))
}

// One particle. Hooks live at the top level here (valid), so the parent can render a
// variable-length list without breaking rules-of-hooks.
function ParticleDot({
  p,
  sx,
  sy,
  reduced,
  isTouch,
}: {
  p: Particle
  sx: MotionValue<number>
  sy: MotionValue<number>
  reduced: boolean
  isTouch: boolean
}) {
  const magnitude = 42 * p.depth * 10 // depth 0.02..0.13 -> ~8..55px
  const tx = useTransform(sx, (v) => v * magnitude)
  const ty = useTransform(sy, (v) => v * magnitude)
  const dim = p.found ? p.size + 2 : p.size
  const base = {
    position: 'absolute' as const,
    left: `${p.x}%`,
    top: `${p.y}%`,
    width: dim,
    height: dim,
    borderRadius: '50%',
    background: p.found ? '#22D3EE' : 'rgba(0,188,212,0.5)',
    boxShadow: p.found ? '0 0 12px rgba(34,211,238,0.9), 0 0 24px rgba(34,211,238,0.4)' : 'none',
  }
  if (reduced) return <div aria-hidden style={base} />
  if (isTouch) {
    return (
      <div
        aria-hidden
        style={{ ...base, animation: `float${(p.id % 3) + 1} ${10 + (p.id % 5)}s ease-in-out ${p.driftDelay}s infinite` }}
      />
    )
  }
  return <motion.div aria-hidden style={{ ...base, x: tx, y: ty, willChange: 'transform' }} />
}

export default function ConstellationField({ reduced, isTouch, count = 60 }: ConstellationFieldProps) {
  const n = isTouch ? Math.round(count / 2) : count
  const particles = useMemo(() => seededParticles(n), [n])
  const fieldRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 20 })
  const sy = useSpring(py, { stiffness: 60, damping: 20 })

  // Track the pointer on WINDOW, not the field: the section's content sits on top of
  // the field (higher z-index) and would swallow a local onMouseMove, so the parallax
  // would rarely fire. Position is computed relative to the field's rect. Desktop only.
  useEffect(() => {
    if (reduced || isTouch) return
    const el = fieldRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        px.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
        py.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
        rafRef.current = null
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, isTouch, px, py])

  return (
    <div
      ref={fieldRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
      }}
    >
      {particles.map((p) => (
        <ParticleDot key={p.id} p={p} sx={sx} sy={sy} reduced={reduced} isTouch={isTouch} />
      ))}
    </div>
  )
}
