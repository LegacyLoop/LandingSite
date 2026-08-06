'use client'
// ─────────────────────────────────────────────────────────────────────────────
// ScrollSequenceCanvas — canvas image-sequence scrub (CMD-LANDING-PASS3 · W3)
//
// The Apple-grade "you drive the reveal" primitive. A frame sequence is painted
// to a <canvas>, the frame index tied to a scroll MotionValue. Used for the hero
// (driven by the hero section's own Framer scroll progress — NO pin, so the proven
// iPad WAAPI hardening in HeroSection is left completely untouched).
//
// COST DISCIPLINE:
//  · Desktop, motion-on: preloads the sequence in tiered batches; draws the nearest
//    loaded frame so early scroll never blocks on a not-yet-loaded frame.
//  · Touch OR reduced-motion: renders ONE static poster <img> — mobile never
//    downloads the multi-MB sequence, and reduced-motion users get a still.
//  · No GSAP here (Framer scroll already gives progress). GSAP enters at the
//    pinned B03 scrub where true pin/scrub is required.
// NO EMOJI.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState, useCallback } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

interface ScrollSequenceCanvasProps {
  progress: MotionValue<number>
  frameBase: string // e.g. '/sequences/hero/frame_'
  frameCount: number
  pad?: number // zero-pad width of the frame index (default 3)
  ext?: string // frame extension (default 'webp')
  posterFrame?: number // 1-based frame used as the touch/reduced still (default 1)
  reduced: boolean
  isTouch: boolean
  alt: string
  style?: React.CSSProperties
}

function frameSrc(base: string, i: number, pad: number, ext: string): string {
  return `${base}${String(i).padStart(pad, '0')}.${ext}`
}

// Cover-fit (object-fit: cover) a source image into a w×h canvas region.
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const ir = img.width / img.height
  const cr = w / h
  let dw: number
  let dh: number
  if (ir > cr) {
    dh = h
    dw = h * ir
  } else {
    dw = w
    dh = w / ir
  }
  const dx = (w - dw) / 2
  const dy = (h - dh) / 2
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, dx, dy, dw, dh)
}

export default function ScrollSequenceCanvas({
  progress,
  frameBase,
  frameCount,
  pad = 3,
  ext = 'webp',
  posterFrame = 1,
  reduced,
  isTouch,
  alt,
  style,
}: ScrollSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef<boolean[]>([])
  const rafRef = useRef<number | null>(null)
  // Static path (touch / reduced) renders an <img>; only that ONE poster loads.
  const staticMode = reduced || isTouch
  // `reduced`/`isTouch` resolve in post-mount effects (they start false). We must NOT
  // begin loading the sequence until they are known, or a phone briefly downloads it.
  // `ready` flips true one tick after mount — by then the touch/reduced flip has landed,
  // so the poster <img> holds the first paint and the canvas mounts ONLY on desktop-motion.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  // If the sequence can't be painted (frame 0 fails, or no 2D context), fall back to
  // the poster <img> ON DESKTOP TOO — the canvas path must never leave a blank hero.
  const [loadError, setLoadError] = useState(false)

  // Draw the frame nearest to `targetIndex` that has finished loading.
  const drawNearest = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      // No 2D context (context-lost / memory pressure): stop trying, show the poster.
      setLoadError(true)
      return
    }
    const loaded = loadedRef.current
    let i = Math.max(0, Math.min(frameCount - 1, Math.round(targetIndex)))
    if (!loaded[i]) {
      // walk outward to the closest loaded frame so scroll never stalls on a gap
      // (also skips any frame that failed to load — see onerror below)
      let found = -1
      const maxOut = Math.max(i, frameCount - 1 - i)
      for (let d = 1; d <= maxOut; d++) {
        if (i - d >= 0 && loaded[i - d]) { found = i - d; break }
        if (i + d < frameCount && loaded[i + d]) { found = i + d; break }
      }
      if (found === -1) return
      i = found
    }
    const img = imagesRef.current[i]
    if (img) drawCover(ctx, img, canvas.width, canvas.height)
  }, [frameCount])

  // Size the canvas backing store to its display box × dpr, then redraw.
  const sizeCanvas = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    drawNearest(targetIndex)
  }, [drawNearest])

  useEffect(() => {
    if (!ready || staticMode || loadError) return
    let cancelled = false
    const images: HTMLImageElement[] = new Array(frameCount)
    const loaded: boolean[] = new Array(frameCount).fill(false)
    imagesRef.current = images
    loadedRef.current = loaded

    let failures = 0
    const load = (i: number) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        loaded[i] = true
        if (i === 0 && !cancelled) {
          // frame 0 may load before the canvas is attached — retry next frame if so
          if (canvasRef.current) sizeCanvas(0)
          else requestAnimationFrame(() => { if (!cancelled) sizeCanvas(0) })
        }
      }
      img.onerror = () => {
        // leave loaded[i] false so drawNearest walks past this gap. If frame 0 (the
        // first paint) fails, or too many frames fail, drop to the poster <img>.
        failures += 1
        if ((i === 0 || failures > frameCount / 2) && !cancelled) setLoadError(true)
      }
      img.src = frameSrc(frameBase, i + 1, pad, ext)
      images[i] = img
    }

    // Tiered: first frame immediately, then the rest in small batches so the
    // network isn't hit with frameCount parallel requests at once.
    load(0)
    let batchStart = 1
    const BATCH = 8
    const pump = () => {
      if (cancelled) return
      const end = Math.min(batchStart + BATCH, frameCount)
      for (let i = batchStart; i < end; i++) load(i)
      batchStart = end
      if (batchStart < frameCount) {
        rafRef.current = requestAnimationFrame(pump)
      }
    }
    rafRef.current = requestAnimationFrame(pump)

    sizeCanvas(progress.get() * (frameCount - 1))
    const onResize = () => sizeCanvas(progress.get() * (frameCount - 1))
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [ready, staticMode, loadError, frameBase, frameCount, pad, ext, progress, sizeCanvas])

  useMotionValueEvent(progress, 'change', (v) => {
    if (!ready || staticMode || loadError) return
    drawNearest(v * (frameCount - 1))
  })

  if (!ready || staticMode || loadError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={frameSrc(frameBase, posterFrame, pad, ext)}
        alt={alt}
        onError={(e) => {
          // The poster is the last-resort surface — never show a broken-image icon.
          // Hide it and let the section's own background/scrim carry the beat.
          e.currentTarget.style.visibility = 'hidden'
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  )
}
