'use client'
// ─────────────────────────────────────────────────────────────────────────────
// CinematicMoment — R-6 device-framed cinematic beat (CMD-LANDING-PASS3 · W3)
//
// The full R-6 treatment Pass 2 lacked: a clip does not sit in the page, it BELONGS
// to the beat. Poster-to-video crossfade · an APERTURE reveal (the frame irises open
// on enter) · a device frame on the product moment · a scrim so copy holds WCAG AA
// over motion · a considered in AND out. Ambient loop: muted, playsInline, preload
// none, IntersectionObserver-gated so nothing decodes off-screen. Reduced-motion OR
// touch: the poster only — the video never mounts.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'

interface CinematicMomentProps {
  base: string // asset stem under /videos (e.g. 'loop-guitar' -> loop-guitar.mp4/.webm/-poster.jpg)
  alt: string
  isTouch: boolean
  accent?: 'teal' | 'gold' // frame glow register — gold for the estate/dignified beats
}

export default function CinematicMoment({ base, alt, isTouch, accent = 'teal' }: CinematicMomentProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [playing, setPlaying] = useState(false)
  const canPlay = inView && !reduced && !isTouch
  const glow = accent === 'gold' ? 'rgba(212,175,55,0.14)' : 'rgba(0,188,212,0.1)'

  useEffect(() => {
    if (canPlay && videoRef.current) videoRef.current.play().catch(() => {})
  }, [canPlay])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 300,
        margin: '0 auto',
        // The device frame: a phone body. translateZ(0) stops iOS glass flicker.
        padding: 10,
        borderRadius: 44,
        background: 'linear-gradient(150deg, #1c2230 0%, #0b0d13 60%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 50px ${glow}, inset 0 0 0 2px rgba(0,0,0,0.6)`,
        transform: 'translateZ(0)',
      }}
    >
      {/* Aperture reveal: the screen irises open on enter (clip-path inset), a
          considered IN. Reduced/touch skip straight to open. */}
      <motion.div
        initial={reduced ? false : { clipPath: 'inset(12% 12% 12% 12% round 34px)', opacity: 0.4 }}
        animate={
          inView
            ? { clipPath: 'inset(0% 0% 0% 0% round 34px)', opacity: 1 }
            : undefined
        }
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'relative',
          borderRadius: 34,
          overflow: 'hidden',
          aspectRatio: '9 / 16',
          background: '#0B0B0F',
        }}
      >
        {/* Notch — device realism */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 78,
            height: 20,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 3,
          }}
        />
        {/* Poster — crossfades out once the video paints */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/videos/${base}-poster.jpg`}
          alt={alt}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: playing ? 0 : 1,
            transition: 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
        {canPlay && (
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            preload="none"
            aria-hidden
            onPlaying={() => setPlaying(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={`/videos/${base}.webm`} type="video/webm" />
            <source src={`/videos/${base}.mp4`} type="video/mp4" />
          </video>
        )}
        {/* Scrim: bottom-weighted for any overlaid caption to hold AA */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 55%, rgba(11,11,15,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  )
}
