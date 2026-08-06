'use client'
// ─────────────────────────────────────────────────────────────────────────────
// MegaBotConstellation — Option C, the crafted six-node constellation (W3-B)
//
// Replaces the interim static SVG. Six engines ring the MegaBot hub; on enter, the
// four COUNCIL vote-lines DRAW IN (pathLength) to the hub and the nodes scale in,
// staggered. Council rings pulse; the hub breathes. Original visual language, our
// own — resolution-independent, no third-party asset. Reduced-motion renders a fully
// STATIC SVG (branch below) so the honest six/four truth is always visible — no
// dependence on a post-mount reduced flip. NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Engine {
  name: string
  color: string
  council: boolean
}

const CX = 300
const CY = 165
const R = 120
const ARIA = "Six AI engines power the platform; the four MegaBot council engines vote on your item's price"

function layout(engines: Engine[]) {
  return engines.map((e, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180)
    return { ...e, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }
  })
}

const svgStyle = { width: '100%', maxWidth: 560, height: 'auto' } as const
const hubTextStyle = { fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', fill: '#C4B5FD' } as const
const nodeTextStyle = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 12.5, fill: '#F1F5F9' } as const

// Static branch — every element at full visibility, no motion. Used for
// prefers-reduced-motion (and as the honest DOM baseline).
function StaticConstellation({ engines }: { engines: Engine[] }) {
  const nodes = layout(engines)
  return (
    <svg viewBox="0 0 600 330" role="img" aria-label={ARIA} style={svgStyle}>
      {nodes.map((n, i) => (
        <line key={`l${i}`} x1={CX} y1={CY} x2={n.x} y2={n.y} stroke={n.council ? 'rgba(139,92,246,0.5)' : 'rgba(0,188,212,0.28)'} strokeWidth={n.council ? 1.5 : 1} strokeDasharray={n.council ? undefined : '3 5'} />
      ))}
      <circle cx={CX} cy={CY} r={26} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.55)" strokeWidth="1.4" />
      <text x={CX} y={CY + 4} textAnchor="middle" style={hubTextStyle}>MegaBot</text>
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          {n.council && <circle cx={n.x} cy={n.y} r={17} fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1.2" />}
          <circle cx={n.x} cy={n.y} r={12} fill={`${n.color}22`} stroke={n.color} strokeWidth="1.6" />
          <text x={n.x} y={n.y > CY ? n.y + 30 : n.y - 22} textAnchor="middle" style={nodeTextStyle}>{n.name}</text>
        </g>
      ))}
    </svg>
  )
}

// Animated branch — vote-lines draw in, nodes scale in staggered, council rings
// pulse, hub breathes. whileInView so it fires when scrolled into view.
function AnimatedConstellation({ engines }: { engines: Engine[] }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const nodes = layout(engines)
  return (
    <svg ref={ref} viewBox="0 0 600 330" role="img" aria-label={ARIA} style={svgStyle}>
      {nodes.map((n, i) => (
        <motion.line
          key={`l${i}`}
          x1={CX}
          y1={CY}
          x2={n.x}
          y2={n.y}
          stroke={n.council ? 'rgba(139,92,246,0.5)' : 'rgba(0,188,212,0.28)'}
          strokeWidth={n.council ? 1.5 : 1}
          strokeDasharray={n.council ? undefined : '3 5'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
        />
      ))}
      <motion.circle cx={CX} cy={CY} r={26} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.55)" strokeWidth="1.4" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
      <text x={CX} y={CY + 4} textAnchor="middle" style={hubTextStyle}>MegaBot</text>
      {nodes.map((n, i) => (
        <motion.g
          key={`n${i}`}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
        >
          {n.council && (
            <motion.circle cx={n.x} cy={n.y} r={17} fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1.2" animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }} />
          )}
          <circle cx={n.x} cy={n.y} r={12} fill={`${n.color}22`} stroke={n.color} strokeWidth="1.6" />
          <text x={n.x} y={n.y > CY ? n.y + 30 : n.y - 22} textAnchor="middle" style={nodeTextStyle}>{n.name}</text>
        </motion.g>
      ))}
    </svg>
  )
}

export default function MegaBotConstellation({ engines, reduced }: { engines: Engine[]; reduced: boolean }) {
  return reduced ? <StaticConstellation engines={engines} /> : <AnimatedConstellation engines={engines} />
}
