'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import WaitlistWalkthrough, { OFFERINGS } from './WaitlistWalkthrough'

// CMD-WAITLIST-INTAKE-ELEVATE — a captured "reserve this offering" intent,
// lifted to the landing page so section CTAs (white-glove / estate care /
// neighborhood) carry the exact SKU into the waitlist form. In-page state only
// (no JSON-in-URL). `source` distinguishes which door the visitor came through.
interface OfferingIntent {
  offering: string
  source: string
  note?: string
}

/* ==============================================
   PHASE 1 — FOUNDATION (Effects Layer)
   ============================================== */

// ---------- PRELOADER ----------
// Uses plain CSS transitions — NOT AnimatePresence.
// AnimatePresence exit animations fail on iPad Safari,
// causing the preloader to permanently block the page.
function Preloader({ isLoaded }: { isLoaded: boolean }) {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const duration = 1200
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  // When isLoaded, fade out then fully hide after transition
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setHidden(true), 700)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Nuclear failsafe: if preloader is still visible after 5s, force-remove it.
  // This catches Chrome iPad and any other edge case where CSS animation +
  // JS state both fail to dismiss the preloader.
  useEffect(() => {
    const nuke = setTimeout(() => setHidden(true), 5000)
    return () => clearTimeout(nuke)
  }, [])

  if (hidden) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: '#0D1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        opacity: isLoaded ? 0 : 1,
        pointerEvents: isLoaded ? 'none' : 'auto',
        transition: 'opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        // CSS-only failsafe: even if ALL JavaScript fails,
        // this animation guarantees the preloader disappears in 4s
        animation: 'preloaderFallback 4s ease-in-out forwards',
        WebkitAnimation: 'preloaderFallback 4s ease-in-out forwards',
      }}
    >
      <img
        src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png"
        alt="Legacy-Loop"
        style={{
          width: 72,
          height: 72,
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 16px rgba(0,188,212,0.4))',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-data)',
          fontWeight: 600,
          fontSize: 14,
          color: '#00BCD4',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
        }}
      >
        LEGACYLOOP
      </span>
      <div
        style={{
          width: 160,
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #00BCD4, #009688)',
            borderRadius: 2,
            transition: 'width 0.05s linear',
          }}
        />
      </div>
    </div>
  )
}

// ---------- CUSTOM CURSOR (Desktop Only) ----------
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const lerped = useRef({ x: 0, y: 0 })
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Desktop detection · two MQ flags (canonical CSS Media Queries L4):
    //   pointer: fine  → primary pointer is precise (mouse / trackpad)
    //   hover: hover   → primary pointer can hover (mouse · NOT touch)
    // BOTH must be true. Avoids navigator.maxTouchPoints which
    // false-positives on Windows 11 PCs · Chrome reports maxTouchPoints>0
    // whenever touch drivers are installed · even on pure-mouse desktops ·
    // causing cursor to disappear entirely.
    const pointerMq = window.matchMedia('(pointer: fine)')
    const hoverMq = window.matchMedia('(hover: hover)')
    const compute = () => pointerMq.matches && hoverMq.matches
    setIsDesktop(compute())
    const handler = () => setIsDesktop(compute())
    pointerMq.addEventListener('change', handler)
    hoverMq.addEventListener('change', handler)
    return () => {
      pointerMq.removeEventListener('change', handler)
      hoverMq.removeEventListener('change', handler)
    }
  }, [])

  useEffect(() => {
    // Class-gate companion to globals.css media rule. Only when JS
    // confirms desktop AND component is mounted · add class to <body>
    // which permits CSS `body.custom-cursor-active { cursor: none }`
    // to actually hide the OS cursor. If JS fails or component bails ·
    // class never set · OS cursor stays visible (safe fallback).
    if (!isDesktop) return
    document.body.classList.add('custom-cursor-active')
    return () => {
      document.body.classList.remove('custom-cursor-active')
    }
  }, [isDesktop])

  useEffect(() => {
    if (!isDesktop) return
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      lerped.current.x += (pos.current.x - lerped.current.x) * 0.12
      lerped.current.y += (pos.current.y - lerped.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${lerped.current.x}px, ${lerped.current.y}px, 0)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true)
      }
    }
    const onOut = () => setIsHovering(false)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [isDesktop])

  if (!isDesktop) return null

  const size = isHovering ? 56 : 32
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: -size / 2,
          left: -size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#00BCD4',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
    </>
  )
}

// ---------- GRADIENT ORB BACKGROUND ----------
function GradientBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          width: 1000,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)',
          animation: 'float1 14s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,150,136,0.05) 0%, transparent 70%)',
          animation: 'float2 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '-5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)',
          animation: 'float3 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

// ---------- NOISE TEXTURE OVERLAY ----------
// Source: Apple, Vercel — SVG feTurbulence technique
// Separate SVG defs + filter applied to div for cross-browser compat
function NoiseOverlay() {
  return (
    <>
      <svg
        style={{ position: 'absolute', width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.04,
          filter: 'url(#noiseFilter)',
          background: 'rgba(255,255,255,1)',
        }}
      />
    </>
  )
}

/* ==============================================
   PHASE 2 — NAV + HERO + TICKER
   ============================================== */

// ---------- HELPERS ----------
function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrollY
}

function useWindowWidth() {
  const [w, setW] = useState(1200)
  useEffect(() => {
    setW(window.innerWidth)
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

/** Detect touch device via CSS Media Queries Level 4 (hover/pointer).
 *  Touch = NOT (hover:hover AND pointer:fine). Clones the canonical pattern
 *  used by CustomCursor() above. Avoids navigator.maxTouchPoints which
 *  false-positives on Windows 11 PCs running Chrome with touch drivers
 *  installed — those report maxTouchPoints>0 even on pure-mouse desktops,
 *  triggering the iPad fallback path and cancelling parallax / GlowCard
 *  reveal / StaggeredWords animations on Windows.
 *
 *  Critical for iPad Safari: framer-motion v12 WAAPI animations frequently
 *  get stuck at their initial state on iPad, leaving elements invisible.
 *  Any component that animates opacity from 0 to 1 outside data-hero-content
 *  should use this to skip the animation entirely on touch devices. */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const compute = () => !hoverMq.matches
    setIsTouch(compute())
    const handler = () => setIsTouch(compute())
    hoverMq.addEventListener('change', handler)
    return () => hoverMq.removeEventListener('change', handler)
  }, [])
  return isTouch
}

/** Responsive section padding — scales for 320→1280+ */
function useSectionPadding(width: number) {
  if (width < 480) return { padding: '64px 16px' }
  if (width < 768) return { padding: '80px 20px' }
  if (width < 1024) return { padding: '100px 28px' }
  return { padding: '120px 32px' }
}

/** Auto-play video when it enters viewport — fixes mobile autoplay restrictions */
function AutoPlayVideo({ style, sources, ...props }: { style: React.CSSProperties; sources: { src: string; type: string }[] } & Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'style'>) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(video)

    // Also try playing on first user interaction as fallback
    const handleInteraction = () => {
      if (video.paused) video.play().catch(() => {})
    }
    document.addEventListener('touchstart', handleInteraction, { once: true, passive: true })
    document.addEventListener('scroll', handleInteraction, { once: true, passive: true })

    return () => {
      observer.disconnect()
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={style}
      onError={(e) => {
        // Silent no-op: iOS Safari fires transient media errors during
        // autoplay ramp-up (Low Power Mode, decode buffer stalls, cellular
        // range-request mismatch). The prior `display: none` kill-switch
        // permanently hid the video for the rest of the session. Poster
        // covers the fail window; the element stays in the DOM so playback
        // recovers on the next decode cycle.
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[AutoPlayVideo] transient media error', e)
        }
      }}
      {...props}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// ---------- GLOW CARD (Reusable) ----------
function GlowCard({
  children,
  style: extraStyle,
  hoverBorderColor = 'rgba(0,188,212,0.5)',
  defaultBorderColor = 'rgba(0,188,212,0.15)',
  delay = 0,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  hoverBorderColor?: string
  defaultBorderColor?: string
  delay?: number
}) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // On touch devices (iPad, phones), show immediately — IntersectionObserver
    // combined with Lenis smooth scroll fails to trigger on iPad Safari/Chrome,
    // leaving all GlowCard content permanently at opacity: 0
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    // Fallback: ensure visibility after 3s even if observer doesn't fire
    const fallback = setTimeout(() => setVisible(true), 3000)
    return () => { observer.disconnect(); clearTimeout(fallback) }
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? hoverBorderColor : defaultBorderColor}`,
        borderRadius: 16,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: 'clamp(18px, 3vw, 28px)',
        // Explicit properties — 'all' transitions backdrop-filter which causes
        // GPU compositing bugs on iPad Safari, making cards invisible
        transition: [
          `opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${visible ? delay : 0}ms`,
          `transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${visible ? delay : 0}ms`,
          'border-color 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          'box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        ].join(', '),
        transform: visible
          ? hovered
            ? 'translateY(-4px)'
            : 'translateY(0) scale(1)'
          : 'translateY(28px) scale(0.97)',
        opacity: visible ? 1 : 0,
        boxShadow: hovered
          ? '0 0 30px rgba(0,188,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          : 'none',
        // CSS animation fallback: guarantees card becomes visible even if
        // all JS visibility triggers fail (covers iPad edge cases)
        animation: `glowCardReveal 0.6s ease ${delay + 500}ms forwards`,
        WebkitAnimation: `glowCardReveal 0.6s ease ${delay + 500}ms forwards`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

// ---------- MAGNETIC BUTTON ----------
function MagneticButton({
  children,
  href,
  onClick,
  style: extraStyle,
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  style?: React.CSSProperties
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      x.set((e.clientX - cx) * 0.35)
      y.set((e.clientY - cy) * 0.35)
    },
    [x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00bcd4, #009688)',
        color: '#fff',
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 'clamp(15px, 2.5vw, 18px)',
        padding: 'clamp(14px, 2vw, 18px) clamp(28px, 5vw, 42px)',
        borderRadius: 12,
        border: 'none',
        minHeight: 44,
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow:
          '0 0 32px rgba(0,188,212,0.35), 0 4px 16px rgba(0,188,212,0.2)',
        transition: 'box-shadow 0.4s ease',
        ...extraStyle,
      }}
      whileHover={{
        boxShadow:
          '0 0 60px rgba(0,188,212,0.55), 0 8px 30px rgba(0,188,212,0.3)',
      }}
    >
      {children}
    </motion.a>
  )
}

// ---------- CHAR-BY-CHAR HEADLINE REVEAL ----------
// Source: Dennis Snellenberg Awwwards winner, Olivier Larose rebuild
// Uses CSS transition + overflow hidden wrapper per char
function CharReveal({
  text,
  isLoaded,
  gradient,
  style: extraStyle,
}: {
  text: string
  isLoaded: boolean
  gradient?: boolean
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Touch devices: show text immediately — no animation delay
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setMounted(true)
      return
    }
    if (isLoaded && !reduced) {
      const t = setTimeout(() => setMounted(true), 300)
      return () => clearTimeout(t)
    }
    if (isLoaded && reduced) {
      setMounted(true)
    }
  }, [isLoaded, reduced])

  const charGradient: React.CSSProperties = gradient
    ? {
        background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : {}

  return (
    <span style={{ display: 'inline-block', ...extraStyle }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(110%)',
              transition: reduced
                ? 'opacity 0.3s ease'
                : `opacity 0.01s linear ${i * 22}ms, transform 0.75s cubic-bezier(0.23, 1, 0.32, 1) ${i * 22}ms`,
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              width: char === ' ' ? '0.3em' : undefined,
              ...charGradient,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  )
}

// ---------- SCROLL REVEAL TEXT ----------
// Source: Olivier Larose — github.com/olivierlarose/text-opacity-scroll
// Ghost text holds layout, animated overlay reveals on scroll
function ScrollRevealText({
  text,
  style: extraStyle,
}: {
  text: string
  style?: React.CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.2'],
  })
  const words = text.split(' ')

  return (
    <div ref={containerRef} style={{ position: 'relative', ...extraStyle }}>
      <p
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <ScrollWord
              key={i}
              word={word}
              scrollYProgress={scrollYProgress}
              range={[start, end]}
            />
          )
        })}
      </p>
    </div>
  )
}

function ScrollWord({
  word,
  scrollYProgress,
  range,
}: {
  word: string
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const opacity = useTransform(scrollYProgress, range, [0.1, 1])
  const y = useTransform(scrollYProgress, range, [6, 0])

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        marginRight: '0.32em',
      }}
    >
      {/* Ghost text — holds layout space */}
      <span style={{ opacity: 0.1, userSelect: 'none' }}>{word}</span>
      {/* Animated overlay */}
      <motion.span
        style={{
          opacity,
          y,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {word}
      </motion.span>
    </span>
  )
}

// ---------- ANIMATED STAT ----------
function AnimatedStat({
  target,
  prefix = '',
  suffix = '',
  duration = 2200,
  onComplete,
  style: extraStyle,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  onComplete?: () => void
  style?: React.CSSProperties
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // On touch devices, start immediately — IO can fail with Lenis smooth scroll
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setStarted(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const start = Date.now()
    let fired = false
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else if (!fired) {
        fired = true
        onCompleteRef.current?.()
      }
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])

  return (
    <span ref={ref} style={extraStyle}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ---------- TILT CARD (3D Perspective on Mouse) ----------
// Source: Awwwards studios — mouse-reactive 3D rotation with glint
function TiltCard({
  children,
  style: extraStyle,
  intensity = 12,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg)')
  const [glint, setGlint] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rotateX = (y - 0.5) * -intensity
      const rotateY = (x - 0.5) * intensity
      setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`)
      setGlint({ x: x * 100, y: y * 100 })
    },
    [intensity]
  )

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)')
    setGlint({ x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        ...extraStyle,
      }}
    >
      {children}
      {/* Glint highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${glint.x}% ${glint.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          pointerEvents: 'none',
          transition: 'background 0.2s ease',
        }}
      />
    </div>
  )
}

// ---------- KINETIC HEADLINE (Word Swap) ----------
// Source: Premium SaaS sites — cycling word animation.
// On touch devices, AnimatePresence's enter/exit animations can stall
// on iPad Safari (documented in April 16 passoff — same class of WAAPI
// bug that forced the Preloader off AnimatePresence). Touch path uses
// a simple CSS opacity transition with no enter/exit overlap, so words
// cycle reliably without stacking or disappearing.
function KineticHeadline({
  words,
  style: extraStyle,
}: {
  words: string[]
  style?: React.CSSProperties
}) {
  const [index, setIndex] = useState(0)
  const isTouch = useIsTouch()

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [words.length])

  const wrapStyle: React.CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    verticalAlign: 'top',
    height: '1.5em',
    lineHeight: 1.5,
    ...extraStyle,
  }
  const textStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  if (isTouch) {
    // Touch-safe path: keyed span with a plain CSS opacity transition.
    // React remounts the span on key change so the transition runs
    // from mount — no AnimatePresence, no WAAPI exit.
    return (
      <span style={wrapStyle}>
        <span
          key={words[index]}
          style={{
            ...textStyle,
            animation: 'fadeScaleIn 0.4s ease both',
          }}
        >
          {words[index]}
        </span>
      </span>
    )
  }

  return (
    <span style={wrapStyle}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={textStyle}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ---------- STICKY NAV ----------
function StickyNav({ isLoaded }: { isLoaded: boolean }) {
  const scrollY = useScrollY()
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const scrolled = scrollY > 20
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'AI Agents', target: 'bots' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'Download', target: 'download' },
    { label: 'Help', target: '__help' },
    { label: 'Join Waitlist', target: 'waitlist' },
  ]

  const scrollTo = (id: string) => {
    if (id === '__help') {
      // Special sentinel — open the Help Center modal via custom event
      window.dispatchEvent(new CustomEvent('legacyloop:open-help'))
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  if (!isLoaded) return null

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: scrolled ? 'rgba(13,17,23,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px) saturate(150%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(150%)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(0,188,212,0.08)'
            : '1px solid transparent',
          // Explicit properties — 'all' transitions backdrop-filter which
          // causes GPU compositing bugs on iPad Safari
          transition: 'background 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
            padding: width < 375 ? '0 12px' : width < 480 ? '0 16px' : isTablet ? '0 20px' : '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left — Logo */}
          <img
            src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-04.png"
            alt="Legacy-Loop"
            style={{
              height: isTablet ? 36 : 48,
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Center — Nav Links (desktop only, not tablet) */}
          {!isMobile && !isTablet && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 32,
              }}
            >
              {navLinks.map((link) => (
                <span
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 14,
                    color: '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = '#CBD5E1')
                  }
                >
                  {link.label}
                </span>
              ))}
            </div>
          )}

          {/* Right — Login + CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 12 : 16 }}>
            {!isMobile && !isTablet && (
              <a
                href="https://app.legacy-loop.com/auth/login"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#CBD5E1',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = '#FFFFFF')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = '#CBD5E1')
                }
              >
                Login
              </a>
            )}
            <a
              href="#waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #00bcd4, #009688)',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: isTablet ? 13 : 14,
                padding: isTablet ? '8px 14px' : '10px 24px',
                whiteSpace: 'nowrap' as const,
                borderRadius: 12,
                minHeight: 44,
                textDecoration: 'none',
                boxShadow:
                  '0 0 32px rgba(0,188,212,0.35), 0 4px 16px rgba(0,188,212,0.2)',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.boxShadow =
                  '0 0 60px rgba(0,188,212,0.55), 0 8px 30px rgba(0,188,212,0.3)')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.boxShadow =
                  '0 0 32px rgba(0,188,212,0.35), 0 4px 16px rgba(0,188,212,0.2)')
              }
            >
              Get Started
            </a>
            {(isMobile || isTablet) && (
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#CBD5E1',
                  fontSize: 24,
                  cursor: 'pointer',
                  padding: 8,
                  minHeight: 44,
                  minWidth: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile / Tablet Menu */}
      {(isMobile || isTablet) && menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'rgba(13,17,23,0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(0,188,212,0.08)',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {navLinks.map((link) => (
            <span
              key={link.target}
              onClick={() => scrollTo(link.target)}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 16,
                color: '#CBD5E1',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </span>
          ))}
          <a
            href="https://app.legacy-loop.com/auth/login"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 16,
              color: '#CBD5E1',
              textDecoration: 'none',
            }}
          >
            Login
          </a>
        </div>
      )}
    </>
  )
}

// ---------- FLOATING SECTION NAVIGATOR ----------
function SectionNavigator({ isLoaded }: { isLoaded: boolean }) {
  const width = useWindowWidth()
  const [activeSection, setActiveSection] = useState('hero')
  const [isHovered, setIsHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const sections = [
    { id: 'hero', label: 'Home', icon: '◆' },
    { id: 'garage-sale', label: 'Weekend', icon: '◆' },
    { id: 'megabot', label: 'MegaBot', icon: '◆' },
    { id: 'how-it-works', label: 'How It Works', icon: '◆' },
    { id: 'shipping', label: 'Shipping', icon: '◆' },
    { id: 'bots', label: 'AI Bots', icon: '◆' },
    { id: 'pricing', label: 'Pricing', icon: '◆' },
    { id: 'estate', label: 'Estates', icon: '◆' },
    { id: 'mission', label: 'Mission', icon: '◆' },
    { id: 'download', label: 'Download', icon: '◆' },
    { id: 'waitlist', label: 'Join', icon: '◆' },
  ]

  // Measure each section's "mid-active" scroll position as a percentage of
  // total page scroll. This is the exact scroll position where the section's
  // vertical midpoint crosses the viewport midpoint — i.e. when the section
  // is most actively in view. Using this as the dot's rail position keeps
  // the progress fill and the active dot in lockstep: the progress line
  // arrives at a dot exactly when the IntersectionObserver flags that
  // section as active. Without this, evenly-spaced dots drift out of sync
  // because sections have very different heights on the page.
  const [dotPercents, setDotPercents] = useState<Record<string, number>>({})
  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement
      const totalScroll = doc.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return
      const next: Record<string, number> = {}
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        // getBoundingClientRect + scrollY gives document-relative position
        // for any element regardless of offsetParent nesting. offsetTop
        // would measure from nearest positioned ancestor — breaks for nav
        // anchors that are <div>s nested inside a positioned <section>
        // (Mission anchor is the only such anchor today).
        const rect = el.getBoundingClientRect()
        const midScroll =
          rect.top + window.scrollY + el.offsetHeight / 2 - window.innerHeight / 2
        next[s.id] = Math.max(0, Math.min(1, midScroll / totalScroll))
      })
      setDotPercents(next)
    }
    // Mount + after-paint + delayed measure to catch late-loading content
    // (images, fonts, video metadata) that shifts section offsets.
    measure()
    const t1 = setTimeout(measure, 400)
    const t2 = setTimeout(measure, 1500)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    const observers: IntersectionObserver[] = []
    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section.id)
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  if (!isLoaded) return null

  const isMobile = width < 1024

  // ── MOBILE: bottom bar ──
  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          background: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,188,212,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Scroll progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            style={{
              height: '100%',
              width: progressHeight,
              background: 'linear-gradient(90deg, #00BCD4, #009688)',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: width < 380 ? '8px 4px 6px' : '10px 8px 8px',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id
            return (
              <div
                key={section.id}
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  padding: '2px 4px',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(135deg, #00BCD4, #009688)'
                      : 'rgba(255,255,255,0.2)',
                    boxShadow: isActive
                      ? '0 0 8px rgba(0,188,212,0.4)'
                      : 'none',
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: width < 340 ? 6 : width < 380 ? 7 : 8,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                    color: isActive ? '#00BCD4' : '#6B7280',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: width < 340 ? 30 : width < 380 ? 36 : 48,
                  }}
                >
                  {section.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── DESKTOP: full-viewport-height vertical rail ──
  // Spans 96px from top (under StickyNav) down to 72px from bottom,
  // so it covers ~85% of the visible viewport. Section markers are
  // evenly distributed via flex space-between so the spacing breathes
  // naturally at any viewport height. The continuous progress line on
  // the right is driven by scrollYProgress for smooth sub-frame tracking.
  // Labels always visible (brighten on hover/active); each row is a 44px
  // min tap/click target (Apple HIG compliant).
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: 28,
        top: 96,
        bottom: 72,
        width: 172,
        zIndex: 900,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Background rail — vertical hairline with soft top/bottom fades */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 6,
          top: 0,
          bottom: 0,
          width: 2,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 8%, rgba(255,255,255,0.08) 92%, transparent 100%)',
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Progress fill — scrollYProgress-driven, gradient + subtle teal glow */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          right: 6,
          top: 0,
          width: 2,
          height: progressHeight,
          background:
            'linear-gradient(180deg, #00BCD4 0%, #22D3EE 45%, #009688 100%)',
          borderRadius: 2,
          boxShadow:
            '0 0 8px rgba(0,188,212,0.55), 0 0 2px rgba(0,188,212,0.9)',
          transformOrigin: 'top center',
          pointerEvents: 'none',
        }}
      />

      {/* Section rows positioned absolutely at their section's actual
          proportional scroll position. This is what keeps the progress
          fill and the active dot in lockstep: the fill arrives at each
          dot exactly when that section becomes active. First-paint
          fallback: until dotPercents is measured, rows use even spacing
          via a short-lived index fallback. */}
      <div
        style={{
          height: '100%',
          position: 'relative',
        }}
      >
        {sections.map((section, i) => {
          const isActive = activeSection === section.id
          const measured = dotPercents[section.id]
          const fallback = i / (sections.length - 1)
          const topPercent =
            (measured !== undefined ? measured : fallback) * 100
          return (
            <button
              type="button"
              key={section.id}
              onClick={() => {
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              aria-label={`Jump to ${section.label}`}
              aria-current={isActive ? 'true' : undefined}
              style={{
                appearance: 'none',
                background: 'transparent',
                border: 'none',
                padding: '6px 0',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 14,
                cursor: 'pointer',
                position: 'absolute',
                right: 0,
                top: `${topPercent}%`,
                transform: 'translateY(-50%)',
                width: '100%',
                color: 'inherit',
                fontFamily: 'inherit',
                transition: 'top 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {/* Hairline tick that extends from the rail toward the label
                  when active or hovered — Olivier Larose / Lusion vocabulary */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  height: 1,
                  width: isActive ? 22 : isHovered ? 12 : 0,
                  background: isActive
                    ? '#00BCD4'
                    : 'rgba(255,255,255,0.35)',
                  transform: 'translateY(-50%)',
                  transition: 'width 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
                  pointerEvents: 'none',
                  opacity: isActive ? 1 : isHovered ? 0.8 : 0,
                }}
              />

              {/* Label — always visible; active/hovered brighten + bold */}
              <span
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: isActive ? 11 : 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                  color: isActive
                    ? '#00BCD4'
                    : isHovered
                    ? '#CBD5E1'
                    : '#6B7280',
                  transition:
                    'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                  whiteSpace: 'nowrap',
                  textShadow: isActive
                    ? '0 0 10px rgba(0,188,212,0.45)'
                    : 'none',
                  userSelect: 'none',
                }}
              >
                {section.label}
              </span>

              {/* Dot — fixed 14px wrapper so the rail alignment never
                  shifts when the inner dot scales on active state */}
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: isActive ? 12 : 6,
                    height: isActive ? 12 : 6,
                    borderRadius: '50%',
                    background: isActive
                      ? 'radial-gradient(circle at 30% 30%, #22D3EE 0%, #00BCD4 55%, #009688 100%)'
                      : 'rgba(255,255,255,0.28)',
                    boxShadow: isActive
                      ? '0 0 14px rgba(0,188,212,0.75), 0 0 28px rgba(0,188,212,0.35), inset 0 1px 0 rgba(255,255,255,0.35)'
                      : 'none',
                    border: isActive
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.08)',
                    transition:
                      'all 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
                    display: 'inline-block',
                  }}
                />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------- HERO SECTION ----------
function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  const width = useWindowWidth()
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  // Parallax — video drifts slower than scroll for cinematic depth
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  })
  const heroVideoY = useTransform(heroScroll, [0, 1], ['0%', '18%'])
  const heroVideoScale = useTransform(heroScroll, [0, 1], [1, 1.06])

  // Nuclear iPad fix: framer-motion v12 uses Web Animations API (WAAPI).
  // WAAPI animations sit ABOVE CSS !important in the cascade, so even our
  // globals.css override can't unstick them. On touch devices, cancel every
  // WAAPI animation inside the hero and force inline visibility.
  useEffect(() => {
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isTouch || !heroContentRef.current) return

    const forceVisible = () => {
      const root = heroContentRef.current
      if (!root) return
      const els = [root, ...Array.from(root.querySelectorAll('*'))]
      els.forEach((el) => {
        // Cancel stuck WAAPI animations from framer-motion
        if (el.getAnimations) {
          el.getAnimations().forEach((a) => a.cancel())
        }
        const htmlEl = el as HTMLElement
        htmlEl.style.opacity = '1'
        htmlEl.style.transform = 'none'
      })
    }

    // Double rAF: wait for framer-motion to finish WAAPI setup, then override
    requestAnimationFrame(() => requestAnimationFrame(forceVisible))
  }, [isLoaded])

  return (
    <section
      ref={heroSectionRef}
      id="hero"
      data-fullvh
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: width < 480 ? '100px 16px 60px' : width < 768 ? '110px 20px 70px' : '120px 24px 80px',
        textAlign: 'center',
      }}
    >
      {/* Video Background — parallax + delayed cinematic fade-in on
          desktop. On touch devices (iPad/mobile) the cinematic fade
          is SKIPPED: framer-motion v12 WAAPI animations get stuck on
          iPad Safari for elements outside data-hero-content, and the
          nuclear fix below doesn't walk this wrapper. Skipping the
          animation entirely makes the video visible immediately on
          touch — the "action logo in the background" issue Ryan
          reported. Parallax transforms still run via style (not
          animate) so they're unaffected by WAAPI stalls. */}
      {/* Style-only motion.div matches GS hero's proven-working pattern.
          No framer-motion initial/animate/transition — those presence-
          tracking props cause iOS Safari to mis-composite child <video>
          elements (verified empirically: brand hero was the only video
          site with these props and the only one broken on iPhone).
          2.2s-delayed cinematic reveal preserved via native CSS
          @keyframes heroVideoReveal in globals.css — identical delay,
          duration, easing, fill-mode to the prior framer-motion path. */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          y: reduced ? 0 : heroVideoY,
          scale: reduced ? 1 : heroVideoScale,
          willChange: 'transform',
          animation: reduced
            ? 'none'
            : 'heroVideoReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 2.2s both',
        }}
      >
        <AutoPlayVideo
          preload="metadata"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.12,
          }}
          sources={[
            { src: '/hero-loop.webm', type: 'video/webm' },
            { src: '/hero-loop.mp4', type: 'video/mp4' },
          ]}
        />
      </motion.div>

      {/* Fallback bg image — always layered underneath */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/hero/hero-bg-glow.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
          zIndex: 0,
        }}
      />

      {/* Radial glow accent behind logo area */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,188,212,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        ref={heroContentRef}
        data-hero-content
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 800,
        }}
      >
        {/* Logo — stacked lockup, true transparent PNG */}
        <motion.img
          src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-03.png"
          alt="Legacy-Loop — Connecting Generations"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{
            maxWidth: width < 480 ? 220 : 300,
            objectFit: 'contain',
            marginBottom: 24,
            // Touch-only: drop static logo to 75% so the hero-loop.mp4
            // (same crescent shape glowing in teal behind it) reads
            // through. Using filter:opacity() instead of opacity so the
            // value survives the WAAPI nuclear fix at :1702-1723 — that
            // loop force-sets style.opacity='1' on every heroContentRef
            // descendant on touch (CMD-TABLET-DEBUG-V3 protection) but
            // does not touch style.filter. Desktop unchanged.
            filter: isTouch ? 'opacity(0.75)' : undefined,
          }}
        />

        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-data)',
            fontWeight: 600,
            fontSize: width < 340 ? 8 : width < 375 ? 10 : 12,
            color: '#00BCD4',
            background: 'rgba(0,188,212,0.1)',
            border: '1px solid rgba(0,188,212,0.3)',
            padding: width < 340 ? '4px 10px' : width < 375 ? '5px 12px' : '6px 16px',
            borderRadius: 20,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: 16,
          }}
        >
          AI-POWERED RESALE PLATFORM — EARLY ACCESS
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: width < 340 ? 24 : width < 400 ? 28 : 'clamp(32px, 5.5vw, 68px)',
            lineHeight: 1.1,
            letterSpacing: width < 400 ? '-0.5px' : '-1px',
            margin: 0,
            color: '#F1F5F9',
            textAlign: 'center',
          }}
        >
          {reduced ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Connecting Generations.
            </motion.span>
          ) : (
            <CharReveal
              text="Connecting Generations."
              isLoaded={isLoaded}
              gradient
            />
          )}
        </h1>

        {/* Subheadline with kinetic word */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 18,
            color: '#CBD5E1',
            maxWidth: 560,
            lineHeight: 1.65,
            marginTop: 24,
          }}
        >
          The platform that makes selling{' '}
          <KineticHeadline
            words={['Simple.', 'Fair.', 'Dignified.', 'Smarter.', 'Faster.']}
            style={{ fontWeight: 600 }}
          />
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            marginTop: 40,
          }}
        >
          <MagneticButton href="#waitlist">
            Start Your Legacy
          </MagneticButton>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('how-it-works')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: '#00BCD4',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              padding: '14px 28px',
              borderRadius: 12,
              border: '1px solid rgba(0,188,212,0.4)',
              minHeight: 44,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.borderColor =
                'rgba(0,188,212,0.8)'
              ;(e.target as HTMLElement).style.background =
                'rgba(0,188,212,0.05)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.borderColor =
                'rgba(0,188,212,0.4)'
              ;(e.target as HTMLElement).style.background = 'transparent'
            }}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Waitlist scroll link — visible within 3 seconds */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.0 }}
          style={{ marginTop: 20, textAlign: 'center' }}
        >
          <a
            href="#waitlist"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              color: '#00BCD4',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.textDecoration = 'none'
            }}
          >
            → Reserve Founding Member Pricing
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator — delayed fade-in closes the load sequence on
          desktop. On touch: skip the animation (same WAAPI-stuck risk
          as the video wrapper). */}
      <motion.div
        initial={isTouch ? false : { opacity: 0, y: -8 }}
        animate={
          isTouch ? undefined : isLoaded ? { opacity: 0.5, y: 0 } : {}
        }
        transition={{ delay: 2.6, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          animation: 'scrollBounce 2s ease-in-out infinite',
          zIndex: 5,
          opacity: isTouch ? 0.5 : undefined,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  )
}

// ---------- STAGGERED WORDS (per-word entrance on scroll-into-view) ----------
// Awwwards standard: each word slides up from an overflow-hidden slot with
// a 40ms stagger. Used on section headlines that don't already carry a
// glitch/gradient effect. Respects prefers-reduced-motion.
function StaggeredWords({
  text,
  stagger = 0.04,
  delay = 0,
}: {
  text: string
  stagger?: number
  delay?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [touchFired, setTouchFired] = useState(false)
  const words = text.split(' ')

  // Touch-device fallback: useInView relies on IntersectionObserver which
  // can misfire on iPad Safari (especially with Lenis disabled + dynamic
  // viewport). Fire all words immediately after mount on touch so headlines
  // never stay invisible.
  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isTouch) return
    const t = setTimeout(() => setTouchFired(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (reduced) return <>{text}</>

  const revealed = inView || touchFired

  return (
    <span ref={ref} style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: i < words.length - 1 ? '0.25em' : 0,
            lineHeight: 1,
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: '100%' }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ---------- GLITCH WORD (Resn-style RGB split reveal) ----------
// Fires once when the word scrolls into view (threshold 0.6). Two offset
// color clones jitter in, then fade out leaving the clean gradient word.
// Safe fallback when reduced-motion is on. Optional isLoaded prop gates
// the scroll trigger (useful for hero sections sharing isLoaded state).
function GlitchWord({
  text,
  isLoaded = true,
  tintA = '#00BCD4',
  tintB = '#D4AF37',
}: {
  text: string
  isLoaded?: boolean
  tintA?: string
  tintB?: string
}) {
  const reduced = useReducedMotion()
  const [fired, setFired] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isLoaded || fired) return
    const el = ref.current
    if (!el) return

    // Touch devices: fire immediately — mirrors GlowCard's iPad-safety
    // pattern. IntersectionObserver + Lenis can miss on mobile Safari.
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      const t = setTimeout(() => setFired(true), 150)
      return () => clearTimeout(t)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setFired(true), 150)
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px', threshold: 0.1 }
    )
    observer.observe(el)
    // Fallback: if observer doesn't fire within 3s, fire anyway so the
    // text is never permanently invisible.
    const fallback = setTimeout(() => setFired(true), 3000)
    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [isLoaded, fired])

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${tintA} 0%, ${tintB} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  if (reduced) {
    return (
      <span
        ref={ref}
        style={{ ...gradientStyle, display: 'inline-block' }}
      >
        {text}
      </span>
    )
  }

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Channel A — offsets left, fades out */}
      <motion.span
        aria-hidden
        initial={{ x: 0, opacity: 0 }}
        animate={
          fired
            ? { x: [0, -4, 3, -1, 0], opacity: [0, 0.75, 0.5, 0.25, 0] }
            : {}
        }
        transition={{ duration: 0.6, times: [0, 0.25, 0.55, 0.8, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          color: tintA,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      >
        {text}
      </motion.span>
      {/* Channel B — offsets right, fades out */}
      <motion.span
        aria-hidden
        initial={{ x: 0, opacity: 0 }}
        animate={
          fired
            ? { x: [0, 4, -3, 1, 0], opacity: [0, 0.75, 0.5, 0.25, 0] }
            : {}
        }
        transition={{ duration: 0.6, times: [0, 0.25, 0.55, 0.8, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          color: tintB,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      >
        {text}
      </motion.span>
      {/* Base gradient — fades in with the glitch, stays */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={fired ? { opacity: 1 } : {}}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{ ...gradientStyle, position: 'relative', display: 'inline-block' }}
      >
        {text}
      </motion.span>
    </span>
  )
}

// ---------- LIVE PULSE PILL (Bloomberg-terminal HUD for V8 card) ----------
// Ticking timecode pill with pulsing dot. Signals the pricing is "live."
function LivePulsePill() {
  const [secs, setSecs] = useState(12)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setSecs((s) => (s + 1) % 60), 1000)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        borderRadius: 9999,
        background: 'rgba(34,197,94,0.12)',
        border: '1px solid rgba(34,197,94,0.35)',
        fontFamily: 'var(--font-data)',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: '#22C55E',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#22C55E',
          boxShadow: '0 0 8px rgba(34,197,94,0.7)',
          animation: reduced ? 'none' : 'pulse 1.4s ease-in-out infinite',
          display: 'inline-block',
        }}
      />
      EXAMPLE PRICING
    </span>
  )
}

// ---------- V8 PRICE PILL (sub-component for Garage Sale section) ----------
function V8Pill({
  label,
  target,
  tint,
  note,
  highlight,
  onComplete,
}: {
  label: string
  target: number
  tint: string
  note: string
  highlight?: boolean
  onComplete?: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px 14px 20px',
        background: highlight ? `${tint}14` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${highlight ? `${tint}66` : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, background 0.3s ease',
      }}
    >
      {/* Left color accent bar */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: tint,
          opacity: highlight ? 1 : 0.6,
        }}
      />

      {/* Label + note column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-data)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: tint,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: '#8B949E',
            lineHeight: 1.35,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {note}
        </div>
      </div>

      {/* Price value */}
      <div
        style={{
          fontFamily: 'var(--font-data)',
          fontWeight: 700,
          fontSize: 'clamp(22px, 3vw, 28px)',
          color: '#F1F5F9',
          lineHeight: 1,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
        }}
      >
        <span style={{ fontSize: '0.6em', color: '#8B949E' }}>$</span>
        <AnimatedStat target={target} onComplete={onComplete} />
      </div>
    </div>
  )
}

// ---------- GARAGE SALE — THE WEEKEND GOLDMINE (Young-Seller Hook) ----------
// Sits between HeroSection (brand intro) and MarketplaceTicker.
// Awwwards-level integration:
//   • Cinematic 16:9 hero video (left) + animated V8 price card (right)
//   • 3 proof chips + dual CTAs
//   • UGC 9:16 portrait video row below with ScrollRevealText quote
// Design refs: Apple hero-as-film + Linear product cards + Stripe data pills
function GarageSaleSection({ isLoaded }: { isLoaded: boolean }) {
  const width = useWindowWidth()
  const reduced = useReducedMotion()
  const isMobile = width < 900
  const isSmall = width < 600

  // Edge-bleed parallax on the 16:9 hero video (Active Theory pattern)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: videoScroll } = useScroll({
    target: videoContainerRef,
    offset: ['start end', 'end start'],
  })
  const videoY = useTransform(videoScroll, [0, 1], ['-5%', '5%'])
  const videoScale = useTransform(videoScroll, [0, 0.5, 1], [1.04, 1, 1.04])

  // Signature moment — gold "ignition" pulse fires when ACCEPT counter
  // hits its final value ($280). The screenshot-bait beat.
  const [ignited, setIgnited] = useState(false)

  return (
    <section
      id="garage-sale"
      style={{
        position: 'relative',
        padding: isSmall ? '80px 16px' : isMobile ? '100px 20px' : '120px 32px',
        overflow: 'hidden',
      }}
    >
      {/* Section-specific ambient glow — warm gold + teal to signal "goldmine" */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 28% 18%, rgba(212,160,23,0.05), transparent 70%), radial-gradient(ellipse 60% 50% at 72% 82%, rgba(0,188,212,0.06), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Corner crosshair markers — Lusion-grade studio framing */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isLoaded ? { opacity: 0.55, scale: 1 } : {}}
          transition={{
            delay: 0.3 + i * 0.08,
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#D4AF37" strokeWidth="1" />
        </motion.svg>
      ))}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1240,
          margin: '0 auto',
        }}
      >
        {/* HEADLINE BLOCK — with ghost GOLDMINE type behind + glitch reveal */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? 44 : 60,
            position: 'relative',
          }}
        >
          {/* Ghost oversized "GOLDMINE" word — Resn depth vocabulary */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: isMobile ? 20 : 30,
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-data)',
              fontSize: isMobile ? '20vw' : 'clamp(180px, 22vw, 360px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'rgba(212,175,55,0.045)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0,
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
            }}
          >
            GOLDMINE
          </span>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <SectionEyebrow text="THE WEEKEND GOLDMINE" />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(34px, 5.2vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                color: '#F1F5F9',
                textAlign: 'center',
                margin: '0 auto 20px',
                maxWidth: 860,
              }}
            >
              {reduced ? (
                <>
                  Turn your garage into a <GradientText>goldmine</GradientText>.
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 18 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.15,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    Turn your garage into a&nbsp;
                  </motion.span>
                  <GlitchWord text="goldmine" isLoaded={isLoaded} />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isLoaded ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    style={{ display: 'inline-block' }}
                  >
                    .
                  </motion.span>
                </>
              )}
            </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: isSmall ? 16 : 18,
              lineHeight: 1.65,
              color: '#CBD5E1',
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            Snap a photo. Know the price.{' '}
            <span style={{ color: '#F1F5F9', fontWeight: 600 }}>
              Priced before Saturday.
            </span>
          </p>
          </div>
        </div>

        {/* VIDEO + PRICE CARD SPLIT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.35fr 1fr',
            gap: isMobile ? 20 : 32,
            alignItems: 'center',
            marginBottom: isMobile ? 40 : 56,
          }}
        >
          {/* LEFT — 16:9 cinematic hero video with edge-bleed parallax */}
          <div
            ref={videoContainerRef}
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(0,188,212,0.2)',
              boxShadow:
                '0 0 48px rgba(0,188,212,0.08), 0 24px 56px rgba(0,0,0,0.45)',
              background: '#0D1117',
            }}
          >
            {/* Inner parallax wrapper — translates + breathes with scroll.
                Slightly oversized (110% height, -5% marginTop) so the y
                translation never exposes container background. */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                height: '110%',
                marginTop: '-5%',
                y: reduced ? 0 : videoY,
                scale: reduced ? 1 : videoScale,
                willChange: 'transform',
              }}
            >
              <AutoPlayVideo
                preload="metadata"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                sources={[
                  { src: '/LegacyLoop_Landing_GS_Hero.webm', type: 'video/webm' },
                  { src: '/LegacyLoop_Landing_GS_Hero.mp4', type: 'video/mp4' },
                ]}
              />
            </motion.div>
            {/* Subtle vignette for depth + keeps focus on center.
                Sibling to motion wrapper so it stays perfectly still. */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, transparent 55%, rgba(13,17,23,0.4) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* RIGHT — Animated V8 Price Card wrapped in IGNITE layer.
              When ACCEPT counter hits $280, a gold radial pulse fires
              behind the card + the card's shadow briefly glows gold.
              The screenshot-bait beat. */}
          <div style={{ position: 'relative' }}>
            {/* Gold ignition pulse — fires once when `ignited` flips true */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.6 }}
              animate={
                ignited && !reduced
                  ? {
                      opacity: [0, 0.55, 0],
                      scale: [0.6, 1.15, 1.25],
                    }
                  : {}
              }
              transition={{
                duration: 1.4,
                times: [0, 0.4, 1],
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{
                position: 'absolute',
                inset: -80,
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.12) 30%, transparent 65%)',
                filter: 'blur(32px)',
                pointerEvents: 'none',
                zIndex: 0,
                borderRadius: '50%',
              }}
            />
            {/* Conic border shimmer ring — subtle gold sweep on ignite */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={ignited && !reduced ? { opacity: [0, 0.65, 0] } : {}}
              transition={{
                duration: 1.4,
                times: [0, 0.35, 1],
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: 18,
                padding: 2,
                background:
                  'conic-gradient(from 220deg, transparent 0deg, rgba(212,175,55,0.8) 40deg, transparent 120deg, transparent 360deg)',
                pointerEvents: 'none',
                zIndex: 1,
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
          <GlowCard
            style={{
              padding: isSmall ? 18 : 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
              zIndex: 2,
              boxShadow:
                ignited && !reduced
                  ? '0 0 60px rgba(212,175,55,0.25), 0 20px 40px rgba(0,0,0,0.35)'
                  : undefined,
              transition: 'box-shadow 0.9s ease',
            }}
          >
            {/* Eyebrow row — LIVE HUD pill + V8 brand tag + hero item */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <LivePulsePill />
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase' as const,
                    color: '#00BCD4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  V8 PRICING
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 11,
                  color: '#8B949E',
                  whiteSpace: 'nowrap',
                }}
              >
                Nintendo 64 · Good
              </span>
            </div>

            <V8Pill
              label="LIST"
              target={380}
              tint="#00BCD4"
              note="Online ceiling — eBay / FB Marketplace"
            />
            <V8Pill
              label="ACCEPT"
              target={280}
              tint="#22C55E"
              note="Garage sale sticker — the sweet spot"
              highlight
              onComplete={() => setIgnited(true)}
            />
            <V8Pill
              label="FLOOR"
              target={220}
              tint="#F59E0B"
              note="Walk-away minimum — fast cash"
            />

            {/* Channel + location footer */}
            <div
              style={{
                marginTop: 6,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: '#CBD5E1',
                }}
              >
                <span style={{ color: '#00BCD4', fontSize: 10 }}>◆</span>
                <span>Channel: Garage sale w/ online backup</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: '#CBD5E1',
                }}
              >
                <span style={{ color: '#22C55E', fontSize: 11 }}>↑</span>
                <span>
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      color: '#22C55E',
                    }}
                  >
                    +21%
                  </span>{' '}
                  for your ZIP
                </span>
              </div>
            </div>
          </GlowCard>
          </div>
        </div>

        {/* PROOF POINTS — 3-up */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 10 : 14,
            marginBottom: isMobile ? 32 : 40,
          }}
        >
          {[
            { label: 'AI pricing in under 30 seconds', icon: '⚡' },
            { label: '3 prices per item — list, sale, floor', icon: '◆' },
            { label: 'Local ZIP market — not NYC', icon: '◉' },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: '#CBD5E1',
                minHeight: 44,
              }}
            >
              <span
                style={{
                  color: '#00BCD4',
                  fontFamily: 'var(--font-data)',
                  fontWeight: 700,
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </span>
              {p.label}
            </div>
          ))}
        </div>

        {/* CTA ROW */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginBottom: isMobile ? 56 : 88,
          }}
        >
          <MagneticButton href="#waitlist">
            Join the Free Waitlist
          </MagneticButton>
          <a
            href="#ugc-proof"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('ugc-proof')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              color: '#00BCD4',
              textDecoration: 'none',
              padding: '12px 22px',
              borderRadius: 10,
              border: '1px solid rgba(0,188,212,0.35)',
              minHeight: 44,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                'rgba(0,188,212,0.7)'
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                'rgba(0,188,212,0.05)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                'rgba(0,188,212,0.35)'
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                'transparent'
            }}
          >
            Watch her find it ↓
          </a>
        </div>

        {/* Hairline divider between hero and UGC row */}
        <div
          aria-hidden
          style={{
            maxWidth: 260,
            margin: isMobile ? '0 auto 48px' : '0 auto 72px',
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(0,188,212,0.28), transparent)',
          }}
        />

        {/* UGC PROOF ROW — real-people social layer */}
        <div
          id="ugc-proof"
          style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}
        >
          <SectionEyebrow text="WHAT A SATURDAY LOOKS LIKE" />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
            gap: isMobile ? 28 : 56,
            alignItems: 'center',
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          {/* LEFT — Portrait 9:16 UGC video in phone-frame mockup */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 260,
              margin: isMobile ? '0 auto' : undefined,
              aspectRatio: '9 / 16',
              borderRadius: 28,
              overflow: 'hidden',
              border: '8px solid #0D1117',
              outline: '1px solid rgba(0,188,212,0.25)',
              boxShadow:
                '0 0 40px rgba(0,188,212,0.1), 0 24px 56px rgba(0,0,0,0.55)',
              background: '#000',
            }}
          >
            <AutoPlayVideo
              preload="metadata"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              sources={[
                {
                  src: '/Legacyloop_Gs_Subsection_Girl_Web.webm',
                  type: 'video/webm',
                },
                {
                  src: '/Legacyloop_Gs_Subsection_Girl_Web.mp4',
                  type: 'video/mp4',
                },
              ]}
            />
            {/* iOS-style top notch bar */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 72,
                height: 6,
                background: 'rgba(0,0,0,0.7)',
                borderRadius: 3,
                zIndex: 2,
              }}
            />
          </div>

          {/* RIGHT — ScrollRevealText quote + mini CTA */}
          <div style={{ maxWidth: 520 }}>
            {reduced ? (
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  fontSize: isSmall ? 20 : 'clamp(22px, 2.8vw, 28px)',
                  lineHeight: 1.4,
                  color: '#F1F5F9',
                  margin: 0,
                }}
              >
                {/* WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · CANONICAL_FACTS §5): fabricated "$280
                    Polaroid / she priced her whole garage" customer story removed (zero customers). */}
                There's often{' '}
                <span
                  style={{
                    color: '#22C55E',
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                  }}
                >
                  real value
                </span>{' '}
                buried in a box of old things. Photograph the pile and price the whole garage in an afternoon.
              </p>
            ) : (
              <ScrollRevealText
                text="Photograph the pile. Get a price on every piece. Decide what goes and what stays."
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  fontSize: isSmall ? 20 : 'clamp(22px, 2.8vw, 28px)',
                  lineHeight: 1.4,
                  color: '#F1F5F9',
                }}
              />
            )}

            <a
              href="#waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 24,
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 15,
                color: '#00BCD4',
                textDecoration: 'none',
                minHeight: 44,
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.textDecoration =
                  'underline'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.textDecoration =
                  'none'
              }}
            >
              See your goldmine →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- MARKETPLACE TICKER ----------
function MarketplaceTicker() {
  const width = useWindowWidth()
  // CMD-LANDING-SHOWCASE-ARC (FIX 5 · D-2): the resale-market universe — where buyers
  // already are. Mercari US, Poshmark, and Depop removed (D-2 fence: they appear NOWHERE).
  // This is market context, never a claim that we auto-post to each.
  const platforms = [
    'eBay',
    'OfferUp',
    'Etsy',
    'Facebook Marketplace',
    'Craigslist',
    'Instagram',
    'Amazon',
    'TikTok Shop',
    'Reverb',
    'Pinterest',
  ]
  const doubled = [...platforms, ...platforms]

  return (
    <div
      style={{
        borderTop: '1px solid rgba(0,188,212,0.08)',
        borderBottom: '1px solid rgba(0,188,212,0.08)',
        padding: '16px 0',
        overflow: 'hidden',
        clipPath: width < 768 ? 'none' : 'polygon(0 5%, 100% 0%, 100% 100%, 0% 100%)',
        marginTop: width < 768 ? -40 : -80,
        paddingTop: width < 768 ? 20 : 40,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: 'flex',
          animation: 'ticker 35s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.animationPlayState =
            'running')
        }
      >
        {doubled.map((platform, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 500,
              fontSize: 13,
              color: '#6B7280',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {platform}
            <span style={{ color: '#00BCD4', fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ==============================================
   PHASE 3 — MARKET + MEGABOT + HOW IT WORKS + PRODUCT
   ============================================== */

// ---------- SECTION EYEBROW ----------
function SectionEyebrow({
  text,
  color = '#00BCD4',
}: {
  text: string
  color?: string
}) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-data)',
        fontWeight: 600,
        fontSize: 12,
        color,
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        textAlign: 'center',
        marginBottom: 16,
      }}
    >
      {text}
    </div>
  )
}

// ---------- SECTION HEADING ----------
function SectionHeading({
  children,
  style: extraStyle,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: 'clamp(36px, 5vw, 48px)',
        lineHeight: 1.2,
        letterSpacing: '-0.5px',
        color: '#F1F5F9',
        textAlign: 'center',
        margin: '0 0 24px',
        ...extraStyle,
      }}
    >
      {children}
    </h2>
  )
}

// ---------- GRADIENT TEXT (inline) ----------
function GradientText({
  children,
  style: extraStyle,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <span
      style={{
        background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        ...extraStyle,
      }}
    >
      {children}
    </span>
  )
}

// ---------- WHAT YOU GET — PLATFORM ADVANTAGE (was MarketOpportunity) ----------
// Flipped from investor/market-size stats to user-facing platform
// capability stats per Ryan's April 17 note: this is visible to the
// general public on the landing, so it must sell what Legacy-Loop
// gives YOU — not what the resale market is worth.
function MarketOpportunitySection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const reduced = useReducedMotion()
  const isMobile = width < 768
  const isSmall = width < 600
  // Responsive grid — 1 col <600 · 2 cols 600-1023 · 4 cols 1024+
  // Previous 4-cols-at-768 crammed each card to ~170px and wrapped
  // "Prices Per Item" / "Specialized Bots" across 2 lines.
  const cols =
    width < 600
      ? '1fr'
      : width < 1024
      ? 'repeat(2, 1fr)'
      : 'repeat(4, 1fr)'

  const stats = [
    {
      target: 4,
      heroLabel: 'AI Engines',
      line: 'OpenAI · Claude · Gemini · Grok',
      sub: 'One fair price, voted by 4-way consensus',
    },
    {
      target: 12,
      heroLabel: 'Specialized Bots',
      line: 'Pricing · Listing · Shipping · Intel',
      sub: 'Plus MegaBot consensus powering them all',
    },
    {
      // FIX 5 · D-2: banned names removed; "cross-listed everywhere" implied auto-posting
      // we do not do — we prep the listing, the seller posts it. Handoff framing, CEO-ratified.
      target: 12,
      heroLabel: 'Marketplaces',
      line: 'eBay · Etsy · Facebook · and more',
      sub: 'We prep every listing — you post in one tap.',
    },
    {
      target: 3,
      heroLabel: 'Prices Per Item',
      line: 'List · Accept · Floor',
      sub: 'Sell at whatever level works today',
    },
  ]

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Corner crosshair markers — studio framing consistent with Path A */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.2 + i * 0.08,
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#00BCD4" strokeWidth="1" />
        </motion.svg>
      ))}

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Ghost oversized "ADVANTAGE" word — depth vocabulary */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: isMobile ? -10 : -30,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-data)',
            fontSize: isMobile ? '18vw' : 'clamp(150px, 18vw, 300px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(0,188,212,0.04)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          ADVANTAGE
        </span>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <SectionEyebrow text="WHAT YOU GET" />
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(34px, 5vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              color: '#F1F5F9',
              textAlign: 'center',
              margin: '0 auto 20px',
              maxWidth: 760,
            }}
          >
            Built to{' '}
            <GlitchWord text="sell for you." />
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: isSmall ? 16 : 18,
              lineHeight: 1.65,
              color: '#CBD5E1',
              maxWidth: 640,
              margin: '0 auto 48px',
            }}
          >
            No other platform stacks this much AI precision with this little
            friction. Every number below is working for you, on every sell.
          </p>
        </div>

        {/* 4-up stat cards — each represents a platform advantage */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: isMobile ? 14 : 18,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {stats.map((stat, i) => (
            <GlowCard key={stat.heroLabel} delay={i * 90}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 10,
                  textAlign: 'left',
                }}
              >
                {/* Hero number — huge, gradient, count-up */}
                <AnimatedStat
                  target={stat.target}
                  duration={1800}
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 800,
                    fontSize: 'clamp(56px, 7vw, 80px)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #00BCD4 0%, #FFFFFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                  }}
                />
                {/* Hero label */}
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#F1F5F9',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  {stat.heroLabel}
                </div>
                {/* Primary line — what they are */}
                <div
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 11,
                    color: '#00BCD4',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    lineHeight: 1.4,
                  }}
                >
                  {stat.line}
                </div>
                {/* Sub-line — why it matters */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 13,
                    color: '#94A3B8',
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
                  {stat.sub}
                </p>
              </div>
            </GlowCard>
          ))}
        </div>

        {/* Closing punch line — scroll-reveal word-by-word */}
        {reduced ? (
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(20px, 3vw, 28px)',
              lineHeight: 1.4,
              color: '#F1F5F9',
              textAlign: 'center',
              maxWidth: 800,
              margin: '64px auto 0',
            }}
          >
            Every price is a consensus. Every listing is prepped for you. You
            keep the wheel.
          </p>
        ) : (
          <ScrollRevealText
            text="Every price is a consensus. Every listing is prepped for you. You keep the wheel."
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(20px, 3vw, 28px)',
              lineHeight: 1.4,
              color: '#F1F5F9',
              textAlign: 'center',
              maxWidth: 800,
              margin: '64px auto 0',
            }}
          />
        )}
      </div>
    </section>
  )
}

// ---------- MEGABOT SECTION ----------
function MegaBotSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const reduced = useReducedMotion()
  const cols = width < 768 ? '1fr' : 'repeat(2, 1fr)'
  const [fillActive, setFillActive] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  // Parallax — purple ambient glow drifts against scroll for atmospheric depth
  const megabotSectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress: mbScroll } = useScroll({
    target: megabotSectionRef,
    offset: ['start end', 'end start'],
  })
  const mbGlowY = useTransform(mbScroll, [0, 1], ['-20%', '20%'])
  const mbGlowX = useTransform(mbScroll, [0, 1], ['0%', '8%'])

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setFillActive(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFillActive(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const engines = [
    {
      emoji: '🔍',
      name: 'OpenAI',
      role: 'Vision & Identification',
      detail: 'Reads dozens of details from a single photo',
      color: '#00BCD4',
    },
    {
      emoji: '💎',
      name: 'Claude',
      role: 'Craftsmanship & Detail',
      detail: 'Evaluates quality, materials, and hidden value',
      color: '#8B5CF6',
    },
    {
      emoji: '📊',
      name: 'Gemini',
      role: 'Market Intelligence',
      detail: 'Real-time market conditions across platforms',
      color: '#F59E0B',
    },
    {
      emoji: '⚡',
      name: 'Grok',
      role: 'Speed & Patterns',
      detail: 'Detects pricing anomalies in milliseconds',
      color: '#94A3B8',
    },
  ]

  return (
    <section
      ref={megabotSectionRef}
      id="megabot"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Subtle purple ambient glow — parallax drift for atmospheric depth */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
          y: reduced ? 0 : mbGlowY,
          x: reduced ? 0 : mbGlowX,
          willChange: 'transform',
        }}
      />

      {/* Corner crosshair markers — Lusion studio framing (purple tint) */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.2 + i * 0.08,
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#8B5CF6" strokeWidth="1" />
        </motion.svg>
      ))}

      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Ghost oversized "MEGABOT" word — depth vocabulary */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: width < 768 ? -10 : -30,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-data)',
            fontSize: width < 768 ? '22vw' : 'clamp(160px, 20vw, 340px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(139,92,246,0.05)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          MEGABOT
        </span>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Live consensus HUD pill — signals the 4-AI engine is active */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 9999,
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.35)',
                fontFamily: 'var(--font-data)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: '#C4B5FD',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#8B5CF6',
                  boxShadow: '0 0 8px rgba(139,92,246,0.7)',
                  animation: 'pulse 1.4s ease-in-out infinite',
                }}
              />
              4 AIs · Consensus active
            </span>
          </div>

          <SectionEyebrow text="THE CROWN JEWEL" color="#8B5CF6" />
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              color: '#F1F5F9',
              textAlign: 'center',
              margin: '0 0 24px',
            }}
          >
            Four AI Engines.{' '}
            <GlitchWord text="One Fair Price." tintA="#8B5CF6" tintB="#00BCD4" />
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 17,
              color: '#CBD5E1',
              maxWidth: 640,
              margin: '0 auto 48px',
              textAlign: 'center',
              lineHeight: 1.65,
            }}
          >
            Our proprietary MegaBot runs OpenAI, Claude, Gemini, and Grok
            simultaneously. When 4 AIs agree on your item&apos;s value, you can
            trust the number.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img
            src="/Pictures & Videos for Landing Page/_Four_identical_translucent_202603311353-Trans.png"
            alt="Four AI engines connected by light beams — MegaBot consensus visualization"
            loading="lazy"
            style={{
              maxWidth: 560,
              width: '100%',
              borderRadius: 0,
              mixBlendMode: 'screen' as const,
            }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
          }}
        >
          {engines.map((engine, i) => (
            <GlowCard key={engine.name} delay={i * 80}>
              <div
                style={{
                  borderLeft: `3px solid ${engine.color}`,
                  paddingLeft: 16,
                }}
              >
                <span style={{ fontSize: 24 }}>{engine.emoji}</span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 17,
                    color: '#F1F5F9',
                    marginTop: 8,
                  }}
                >
                  {engine.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 14,
                    color: engine.color,
                    marginTop: 2,
                  }}
                >
                  {engine.role}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 14,
                    color: '#CBD5E1',
                    marginTop: 4,
                  }}
                >
                  {engine.detail}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

        {/* Consensus Bar */}
        <div ref={barRef} style={{ marginTop: 48, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 16,
              color: '#00BCD4',
              textShadow: '0 0 20px rgba(0,188,212,0.3)',
              marginBottom: 12,
            }}
          >
            {/* WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · CANONICAL_FACTS §6): "87% Average AI Agreement" removed — never measured. */}
            Four AIs. One consensus price.
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              height: 12,
              maxWidth: 600,
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00bcd4, #009688)',
                borderRadius: 8,
                width: fillActive ? '100%' : '0%',
                transition: 'width 2s ease-out',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 14,
              color: '#94A3B8',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {/* WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · CANONICAL_FACTS §5): cost/coffee + "Margin: 85%+" financial claim removed. */}
            Every price is the consensus of four independent AI engines.
          </p>
        </div>
      </div>
    </section>
  )
}

// ---------- HOW IT WORKS ----------
function HowItWorksSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isTouch = useIsTouch()
  const steps = [
    // FIX 5 · D-2 truth fences: honest capability language on every step.
    // Step 3 carries the CEO-ratified handoff line verbatim (never "publishes everywhere").
    {
      num: 1,
      emoji: '📷',
      title: 'Upload a Photo',
      desc: 'Snap a photo. Our AI identifies and prices it.',
    },
    {
      num: 2,
      emoji: '🧠',
      title: 'AI Analysis & Pricing',
      desc: 'Our AI reads your item in seconds. MegaBot confirms the price.',
    },
    {
      num: 3,
      emoji: '📣',
      title: 'List & Find Buyers',
      desc: 'We write the listing, price it, and prep the photos. You post it in one tap.',
    },
    {
      num: 4,
      emoji: '📦',
      title: 'Ship & Get Paid',
      desc: 'Compare real carrier rates, print the label, get paid.',
    },
  ]

  return (
    <section
      id="how-it-works"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Entry variant: SCALE-FROM-0.92 — breaks uniform fade-up rhythm.
            Touch-safe: initial state = final state on touch so if
            whileInView doesn't fire on iPad, content is visible anyway.
            Desktop still gets the scale entrance animation. */}
        <motion.div
          initial={isTouch ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionEyebrow text="THE PROCESS" />
          <SectionHeading>
            <StaggeredWords text="From Photo to Sold in Four Steps" />
          </SectionHeading>
        </motion.div>

        <div
          style={{
            position: 'relative',
            marginTop: 48,
          }}
        >
          {/* Connector Line */}
          {width >= 640 && (
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 20,
                bottom: 20,
                width: 2,
                background: 'rgba(0,188,212,0.3)',
                zIndex: 0,
              }}
            />
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {steps.map((step, i) => (
              <GlowCard key={step.num} delay={i * 80}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      borderRadius: '50%',
                      background: '#00BCD4',
                      color: '#0D1117',
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: 18,
                        color: '#F1F5F9',
                      }}
                    >
                      {step.emoji} {step.title}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 400,
                        fontSize: 15,
                        color: '#CBD5E1',
                        marginTop: 4,
                        lineHeight: 1.55,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- AI SHIPPING CENTER ----------
function ShippingCenterSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768

  // FIX 5: carriers limited to the ones we actually integrate (USPS/UPS/FedEx);
  // DHL and Arta removed (not integrated — CANONICAL_FACTS §6, disposition §3).
  const carriers = [
    { name: 'USPS', emoji: '📬' },
    { name: 'UPS', emoji: '📦' },
    { name: 'FedEx', emoji: '🚚' },
  ]

  const features = [
    { emoji: '🤖', title: 'AI Rate Comparison', desc: 'Compares live rates from real carriers and surfaces the cheapest, fastest option for every shipment.' },
    { emoji: '📐', title: 'Parcel + LTL Freight', desc: 'From a vintage watch to a full dining set — small parcels and large freight, side by side.' },
    { emoji: '🏠', title: 'Local Pickup', desc: 'Coordinate local buyer pickup with built-in scheduling. No shipping needed.' },
    { emoji: '🏷️', title: 'Label + Tracking', desc: 'Print the label, share tracking, hand it off. You stay in control the whole way.' },
  ]

  return (
    <section
      id="shipping"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionEyebrow text="BUILT-IN LOGISTICS" />
        <SectionHeading>
          <StaggeredWords text="AI Shipping Center." />{' '}
          <GradientText>Real Carrier Rates. One Click.</GradientText>
        </SectionHeading>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          Shipping tools built right into the platform. Compare live carrier rates,
          print labels, and track shipments — without leaving Legacy-Loop.
        </p>

        {/* Carrier badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 48,
          }}
        >
          {carriers.map((c) => (
            <div
              key={c.name}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,188,212,0.2)',
                borderRadius: 12,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#F1F5F9',
                  letterSpacing: '0.03em',
                }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <GlowCard key={f.title} delay={i * 80}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.emoji}</span>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: 17,
                      color: '#F1F5F9',
                    }}
                  >
                    {f.title}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 400,
                      fontSize: 15,
                      color: '#CBD5E1',
                      marginTop: 4,
                      lineHeight: 1.55,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- PRODUCT PREVIEW ----------
function ProductPreviewSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  const noTransform = isMobile || isTablet
  const screenshots = [
    {
      src: '/images/screenshots/app-screenshot-01.png',
      alt: 'Legacy-Loop Dashboard — item management and AI analysis overview',
      transform: noTransform
        ? 'none'
        : 'perspective(1200px) rotateY(8deg) rotateX(2deg) scale(0.92)',
      zIndex: 1,
    },
    {
      src: '/images/screenshots/app-screenshot-03.png',
      alt: 'Legacy-Loop AI Bot Results — detailed item valuation and pricing',
      transform: noTransform ? 'none' : 'scale(1.02)',
      zIndex: 2,
    },
    {
      src: '/images/screenshots/app-screenshot-05.png',
      alt: 'Legacy-Loop Listing Manager — multi-platform listing creation',
      transform: noTransform
        ? 'none'
        : 'perspective(1200px) rotateY(-8deg) rotateX(2deg) scale(0.92)',
      zIndex: 1,
    },
  ]

  return (
    <section
      id="product"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionEyebrow text="THE PRODUCT" />
        <SectionHeading>
          <StaggeredWords text="See It In Action" />
        </SectionHeading>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            textAlign: 'center',
            maxWidth: 640,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          Real screenshots from the live Legacy-Loop platform. Every feature you
          see is built and working.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: (isMobile || isTablet) ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: (isMobile || isTablet) ? 24 : 16,
          }}
        >
          {screenshots.map((shot, i) => (
            <TiltCard
              key={i}
              intensity={isMobile ? 0 : 8}
              style={{
                transform: shot.transform,
                zIndex: shot.zIndex,
                maxWidth: (isMobile || isTablet) ? '100%' : '33%',
                flex: (isMobile || isTablet) ? 'none' : '1',
                boxShadow:
                  '0 25px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3)',
                border: '1px solid rgba(0,188,212,0.1)',
              }}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  display: 'block',
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </TiltCard>
          ))}
        </div>

        {/* Valuation Video */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <GlowCard
            style={{
              padding: 0,
              overflow: 'hidden',
              maxWidth: 680,
              margin: '0 auto',
              display: 'inline-block',
            }}
          >
            <AutoPlayVideo
              style={{
                width: '100%',
                display: 'block',
                borderRadius: 16,
              }}
              sources={[
                { src: '/vintage-item-valuation.webm', type: 'video/webm' },
                { src: '/vintage-item-valuation.mp4', type: 'video/mp4' },
              ]}
            />
          </GlowCard>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 14,
              color: '#94A3B8',
              marginTop: 16,
            }}
          >
            Watch our AI analyze and price a vintage item in real time.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ==============================================
   PHASE 4 — AI AGENTS + PRICING + ESTATE + SOCIAL
   ============================================== */

// ---------- 10 AI BOTS + MEGABOT ----------
function AIAgentsSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isTouch = useIsTouch()
  const cols =
    width >= 1200
      ? 'repeat(3, 1fr)'
      : width >= 640
        ? 'repeat(2, 1fr)'
        : '1fr'

  const bots = [
    {
      emoji: '🔍',
      name: 'AI AnalysisBot',
      desc: 'Dozens of details from one photo',
      tier: 'ALL TIERS',
      tierColor: '#00BCD4',
      tierBg: 'rgba(0,188,212,0.15)',
    },
    {
      emoji: '📊',
      name: 'PriceBot',
      desc: 'Fair market value, regional intelligence',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '📷',
      name: 'PhotoBot',
      desc: 'Photo quality scoring and tips',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '📝',
      name: 'ListingBot',
      desc: 'Listings prepped for every marketplace',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '🎯',
      name: 'BuyerBot',
      desc: 'Finds real interested buyers — you approve every contact',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '🛰️',
      name: 'ReconBot',
      desc: 'Real-time market monitoring',
      tier: 'POWER+',
      tierColor: '#8B5CF6',
      tierBg: 'rgba(139,92,246,0.15)',
    },
    {
      emoji: '⏳',
      name: 'AntiqueBot',
      // WAVE 0 TRUTH SWEEP 2026-07-29 (CMD-LANE-A2 · Rule 4): "Never undersell" outcome guarantee softened.
      desc: 'Flags likely antiques so a valuable heirloom is not missed',
      tier: 'POWER+',
      tierColor: '#8B5CF6',
      tierBg: 'rgba(139,92,246,0.15)',
    },
    {
      emoji: '⭐',
      name: 'CollectiblesBot',
      desc: 'Expert-level collectible analysis',
      tier: 'POWER+',
      tierColor: '#8B5CF6',
      tierBg: 'rgba(139,92,246,0.15)',
    },
    {
      emoji: '🎬',
      name: 'VideoBot Standard',
      desc: 'AI video ads for TikTok, Reels, Shorts (8cr)',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '🎬',
      name: 'VideoBot Pro',
      desc: 'Advanced video with custom branding (15cr)',
      tier: 'POWER+',
      tierColor: '#8B5CF6',
      tierBg: 'rgba(139,92,246,0.15)',
    },
    {
      emoji: '🎬',
      name: 'VideoBot MegaBot',
      desc: 'Full MegaBot-powered video production (25cr)',
      tier: 'ESTATE',
      tierColor: '#FBBF24',
      tierBg: 'rgba(251,191,36,0.15)',
    },
    {
      emoji: '🚗',
      name: 'CarBot',
      desc: 'VIN decoding + vehicle specialist',
      tier: 'ESTATE',
      tierColor: '#FBBF24',
      tierBg: 'rgba(251,191,36,0.15)',
    },
    {
      emoji: '📡',
      name: 'Intel Market + Ready',
      desc: 'Market intelligence and listing readiness',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '📡',
      name: 'Intel Sell + Alerts + Action',
      desc: 'Sell signals, price alerts, and action triggers',
      tier: 'POWER+',
      tierColor: '#8B5CF6',
      tierBg: 'rgba(139,92,246,0.15)',
    },
    {
      emoji: '💬',
      name: 'Ask Claude',
      desc: 'AI assistant for any question (0.25cr/q)',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '⚡',
      name: 'Priority Bot Queue',
      desc: 'Skip the line — bots process your items first',
      tier: 'ESTATE',
      tierColor: '#FBBF24',
      tierBg: 'rgba(251,191,36,0.15)',
    },
    {
      emoji: '🔔',
      name: 'High Value Alert',
      desc: 'Flags potentially valuable items for a closer look',
      tier: 'ALL TIERS',
      tierColor: '#00BCD4',
      tierBg: 'rgba(0,188,212,0.15)',
    },
  ]

  return (
    <section
      id="bots"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Entry variant: SLIDE-FROM-LEFT — cinematic horizontal sweep.
            Touch-safe: initial state = final state on touch. */}
        <motion.div
          initial={isTouch ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionEyebrow text="YOUR AI TEAM" />
          <SectionHeading>
            A Specialist For Every Step. Plus MegaBot.{' '}
            <GradientText>All Working For You.</GradientText>
          </SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 15,
              color: '#94A3B8',
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto 48px',
              lineHeight: 1.65,
            }}
          >
            MegaBot powers them all — our 4-engine consensus system that
            ensures every valuation is fair.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
          }}
        >
          {bots.map((bot, i) => (
            <GlowCard key={bot.name} delay={i * 60}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{bot.emoji}</div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 17,
                  color: '#F1F5F9',
                }}
              >
                {bot.name}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#CBD5E1',
                  marginTop: 4,
                }}
              >
                {bot.desc}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  padding: '3px 8px',
                  borderRadius: 4,
                  marginTop: 12,
                  background: bot.tierBg,
                  color: bot.tierColor,
                }}
              >
                {bot.tier}
              </span>
            </GlowCard>
          ))}
        </div>

        {/* MegaBot Callout */}
        <GlowCard
          defaultBorderColor="rgba(139,92,246,0.3)"
          hoverBorderColor="rgba(139,92,246,0.6)"
          style={{ marginTop: 32, textAlign: 'center' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 18,
              color: '#F1F5F9',
            }}
          >
            🧠 MegaBot — Master Consensus Engine
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 15,
              color: '#CBD5E1',
              marginTop: 8,
              lineHeight: 1.55,
            }}
          >
            The 11th bot. Runs all 10 bots together through OpenAI, Claude, Gemini, and
            Grok simultaneously. When 4 AI engines agree, you can trust the number.
          </p>
        </GlowCard>
      </div>
    </section>
  )
}

// ---------- PRICING (FOUNDING SUBSCRIPTION TIERS) ----------
// CMD-LANDING-MASTER-ARC V21 (FIX 5 · CEO R-1): the numberless placeholder is DEAD. The
// subscription pricing was never suspended — only the ESTATE side is consult-first. This is the
// founding pre-launch tier presentation, source-verified and elevated.
// NUMBERS TRACED TO SOURCE (app/landing/WaitlistWalkthrough.tsx OFFERINGS, the landing canon):
//   free $0 / 12% (WW:83,85) · DIY $10 / 8% (WW:97,101) · Power $25 / 5% (WW:113,116) ·
//   Estate Manager $75 / 4% (WW:128,132). Founding-100 framing per CANONICAL_FACTS §5.
// No fake-discount strikethroughs (that theater stays dead). Zero emoji / pictographs — feature
// ticks are inline SVG. Real CTAs carry the tier into the waitlist signup (offering intent).
function PricingSection({ setOfferingIntent }: { setOfferingIntent: (i: OfferingIntent) => void }) {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const reduced = useReducedMotion()
  const isMobile = width < 768
  const cols = width >= 1200 ? 'repeat(4, 1fr)' : width >= 640 ? 'repeat(2, 1fr)' : '1fr'

  // Carry the chosen tier into the waitlist and glide there — real CTA, no dead button, no new backend.
  const lockTier = (slug: string) => {
    setOfferingIntent({ offering: slug, source: 'landing-pricing' })
    document.getElementById('waitlist')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const tiers = [
    {
      slug: 'free',
      name: 'Free',
      price: '0',
      commission: '12%',
      founding: false,
      recommended: false,
      blurb: 'Start selling with AI at zero cost.',
      features: ['AI item identification', 'Public store page', 'List-ready photos and copy', 'Email support'],
      cta: 'Start Free',
    },
    {
      slug: 'diy',
      name: 'DIY Seller',
      price: '10',
      commission: '8%',
      founding: true,
      recommended: false,
      blurb: 'AI pricing and core bots for the hands-on seller.',
      features: ['Everything in Free', 'Enhanced AI pricing', '5 core bots included', '20 credits / month', 'BuyerBot matching'],
      cta: 'Lock Founding Rate',
    },
    {
      slug: 'power',
      name: 'Power Seller',
      price: '25',
      commission: '5%',
      founding: true,
      recommended: true,
      blurb: 'MegaBot and every specialty bot for serious volume.',
      features: ['Everything in DIY', 'MegaBot 4-AI consensus pricing', 'All specialty bots', '50 credits / month', 'Advanced analytics', 'Phone support'],
      cta: 'Lock Founding Rate',
    },
    {
      slug: 'estateManager',
      name: 'Estate Manager',
      price: '75',
      commission: '4%',
      founding: true,
      recommended: false,
      blurb: 'Every AI tool for managing an entire estate yourself.',
      features: ['Everything in Power', 'All bots including CarBot', '100 credits / month', 'Branded store page', 'Priority support'],
      cta: 'Lock Founding Rate',
    },
  ]

  return (
    <section
      id="pricing"
      style={{ ...sp, position: 'relative', zIndex: 5, overflow: 'hidden' }}
    >
      {/* Corner crosshair markers — studio framing */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'absolute', ...pos, pointerEvents: 'none', zIndex: 2 }}
        >
          <path d="M6 0v12M0 6h12" stroke="#00BCD4" strokeWidth="1" />
        </motion.svg>
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Ghost oversized "VALUE" word — depth vocabulary */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: width < 768 ? -10 : -30,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-data)',
            fontSize: width < 768 ? '22vw' : 'clamp(160px, 20vw, 340px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(0,188,212,0.04)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          VALUE
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow text="FOUNDING PRICING" />
          <SectionHeading>
            Lock Your Founding Rate.{' '}
            <GradientText>Keep It for Life.</GradientText>
          </SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 17,
              color: '#CBD5E1',
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto 56px',
              lineHeight: 1.7,
            }}
          >
            Join the first 100. Founding members lock pre-launch pricing for life — the rate you
            start at is the rate you keep, even after public launch.
          </p>

          {/* Tier grid — glow cards, staggered reveal, Barlow Condensed on every number */}
          <div
            style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: 'column',
              gridTemplateColumns: cols,
              gap: 20,
              alignItems: 'stretch',
            }}
          >
            {tiers.map((tier, i) => (
              <GlowCard
                key={tier.slug}
                delay={i * 80}
                defaultBorderColor={tier.recommended ? 'rgba(0,188,212,0.45)' : 'rgba(0,188,212,0.15)'}
                hoverBorderColor="rgba(0,188,212,0.55)"
                style={{ display: 'flex', flexDirection: 'column', padding: '28px 24px', position: 'relative' }}
              >
                {tier.recommended && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      background: 'linear-gradient(135deg, #00BCD4, #009688)',
                      color: '#0D1117',
                      padding: '4px 14px',
                      borderRadius: '0 0 8px 8px',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#F1F5F9',
                    marginTop: tier.recommended ? 10 : 0,
                    marginBottom: 4,
                  }}
                >
                  {tier.name}
                </div>

                {/* Founding marker (no fake-discount theater — a real lock, not a was-price) */}
                <div style={{ minHeight: 20, marginBottom: 10 }}>
                  {tier.founding && (
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: '#22D3EE',
                      }}
                    >
                      Founding rate
                    </span>
                  )}
                </div>

                {/* Price — Barlow Condensed */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 22, color: '#94A3B8' }}>$</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontWeight: 800,
                      fontSize: 48,
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, #22D3EE, #FFFFFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {tier.price}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>/mo</span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#94A3B8',
                    marginTop: 6,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: '#CBD5E1' }}>{tier.commission}</span> commission on sales
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: '#CBD5E1',
                    lineHeight: 1.55,
                    margin: '0 0 18px',
                  }}
                >
                  {tier.blurb}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24, flex: 1 }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M3.5 8.5l3 3 6-7" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => lockTier(tier.slug)}
                  aria-label={`${tier.cta} — ${tier.name}, and join the waitlist`}
                  style={{
                    width: '100%',
                    minHeight: 48,
                    borderRadius: 12,
                    border: tier.recommended ? '1px solid transparent' : '1px solid rgba(0,188,212,0.3)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 14,
                    color: tier.recommended ? '#0D1117' : '#22D3EE',
                    background: tier.recommended ? 'linear-gradient(135deg, #00BCD4, #009688)' : 'rgba(0,188,212,0.08)',
                    boxShadow: tier.recommended ? '0 0 24px rgba(0,188,212,0.2)' : 'none',
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)' }}
                >
                  {tier.cta}
                </button>
              </GlowCard>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              color: '#94A3B8',
              textAlign: 'center',
              margin: '40px 0 0',
              lineHeight: 1.6,
            }}
          >
            No credit card to start. Founding pricing is limited to the first 100 members.
          </p>
        </div>
      </div>
    </section>
  )
}

// ---------- ESTATE & COMMUNITY — EDUCATION + ONE DOOR ----------
// CMD-ESTATE-EXPERIENCE-V2 V20 (FIX 1 + FIX 3): the tab/pricing skeleton is gone.
// This section now teaches what the estate services ARE — what we lift off the family's
// shoulders, who shows up, what happens first — then opens ONE door into the consultation
// intake at /estate. No prices, no package buy-buttons, no fake urgency. Dignity register:
// gold (#D4A017), calm pacing, generous whitespace. G6: real capability + a single quiet
// "in development" marker, no roadmap show on a grief-adjacent page.
function EstateSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const reduced = useReducedMotion()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  // Parallax — generations-hands background drifts gently for senior-safe depth
  const estateSectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress: estateScroll } = useScroll({
    target: estateSectionRef,
    offset: ['start end', 'end start'],
  })
  const estateBgY = useTransform(estateScroll, [0, 1], ['-8%', '8%'])

  // What we lift off the family's shoulders — honest, live capabilities (CANONICAL_FACTS §6).
  const features = [
    { emoji: '🏺', text: 'Antique detection that helps you spot a valuable heirloom before it sells' },
    { emoji: '🌐', text: 'Listing copy prepared for every major marketplace, ready to post' },
    { emoji: '💬', text: 'AI Messaging Agent handles buyer conversations for you' },
    { emoji: '🚚', text: 'AI Shipping Center — live rates from USPS, UPS, and FedEx. Parcel, LTL freight, or local pickup' },
  ]

  // The three ways families work with us — EDUCATION, not pricing. No buttons, no badges.
  // Anchored to the Estate Stewardship Program source (what each service is, in plain words).
  const ways = [
    {
      name: 'White-Glove Estate Service',
      body: 'Our team comes to you. We catalogue, photograph, price, list, and sell every item — then handle the buyer conversations, shipping, and final coordination. You just say yes. Maine-first while we grow.',
    },
    {
      name: 'Estate Care',
      body: 'Prefer to stay hands-on? We start with a real conversation, then put AI identification and pricing behind every item — with one person you can call at each step.',
    },
    {
      name: 'Neighborhood Bundle',
      body: 'Several families on one street, selling together. One coordinated sale, shared photography and marketing, and an individual report for every home. Two to eight families.',
    },
  ]

  // What happens first — the human process. Modest by design (G6): no outcome promises,
  // no dates, no roadmap. Just the honest first three steps.
  const firstSteps = [
    { n: '01', title: 'You reach out', body: 'Tell us about the home and the timeline. Nothing to pay, nothing to sign.' },
    { n: '02', title: 'We talk it through', body: 'A real conversation — Ryan reviews every inquiry personally and calls you back.' },
    { n: '03', title: 'We build a plan', body: 'Shaped around your home, your pace, and what matters most to your family.' },
  ]

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
      id="estate"
      ref={estateSectionRef}
    >
      {/* Warm background image — gentle parallax drift for senior-safe depth */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/estate/generations-hands.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          zIndex: 0,
          y: reduced ? 0 : estateBgY,
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.85) 50%, rgba(13,17,23,0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Corner crosshair markers — estate-gold, restrained opacity (0.35) for the dignified register */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.35, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.2 + i * 0.1,
            duration: 0.9,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#D4A017" strokeWidth="1" />
        </motion.svg>
      ))}

      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Ghost oversized "LEGACY" word — dignified gold, very low opacity. No glitch, no HUD
            pill: the grief-aware register calls for restraint (Law 2, Pillar 03). */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: width < 768 ? -10 : -30,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-data)',
            fontSize: width < 768 ? '22vw' : 'clamp(160px, 20vw, 340px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(212,160,23,0.04)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          LEGACY
        </span>

        {/* FIX 3 — grief section reframed service-first: lead with what we lift, dignity intact. */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow text="FOR FAMILIES & COMMUNITIES" color="#D4A017" />
          <SectionHeading>Selling Should Not Add to the Grief.</SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 17,
              color: '#CBD5E1',
              maxWidth: 660,
              margin: '0 auto 48px',
              textAlign: 'center',
              lineHeight: 1.75,
            }}
          >
            When a loved one passes — or a home simply needs to change hands — the task can feel
            impossible: hundreds of items, real emotional weight, and no idea what anything is worth.
            You do not have to carry it alone. We come to you, identify and price every item, prepare
            the listings, handle the buyers, and coordinate shipping and donations. You just say yes.
          </p>
        </div>

        {/* What we lift off your shoulders — honest capability cards + the senior-on-tablet photo */}
        <div
          style={{
            display: (isMobile || isTablet) ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: (isMobile || isTablet) ? '1fr' : '1fr 420px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <GlowCard
                key={i}
                delay={i * 80}
                defaultBorderColor="rgba(212,160,23,0.2)"
                hoverBorderColor="rgba(212,160,23,0.4)"
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.emoji}</div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#CBD5E1',
                    lineHeight: 1.55,
                  }}
                >
                  {f.text}
                </p>
              </GlowCard>
            ))}
          </div>

          {/* Senior-using-tablet photo — visible on every viewport. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: isMobile || isTablet ? 8 : 0,
            }}
          >
            <img
              src="/images/estate/senior-tablet.png"
              alt="Senior woman using Legacy-Loop on a tablet to manage estate items"
              loading="lazy"
              style={{
                maxWidth: 420,
                width: '100%',
                borderRadius: 16,
                boxShadow:
                  '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(212,160,23,0.08)',
              }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* The three ways families work with us — EDUCATION cards (no prices, no buttons) */}
        <div style={{ marginTop: 80 }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(20px, 3vw, 26px)',
              color: '#F1F5F9',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Three ways families work with us
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: '#94A3B8',
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 40px',
              lineHeight: 1.65,
            }}
          >
            Every estate is different. We&rsquo;ll help you find the right fit on the call — there is no
            wrong door.
          </p>
          <div
            style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: 'column',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {ways.map((w, i) => (
              <GlowCard
                key={w.name}
                delay={i * 80}
                defaultBorderColor="rgba(212,160,23,0.2)"
                hoverBorderColor="rgba(212,160,23,0.4)"
                style={{ padding: '28px 24px' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#D4A017',
                    marginBottom: 12,
                    lineHeight: 1.25,
                  }}
                >
                  {w.name}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#CBD5E1',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {w.body}
                </p>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* What happens first — the human process, modest by design */}
        <div style={{ marginTop: 72 }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(20px, 3vw, 26px)',
              color: '#F1F5F9',
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            What happens first
          </h3>
          <div
            style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: 'column',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? 16 : 24,
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {firstSteps.map((s) => (
              <div key={s.n} style={{ textAlign: isMobile ? 'left' : 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: '0.1em',
                    color: 'rgba(212,160,23,0.7)',
                    marginBottom: 8,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 17,
                    color: '#F1F5F9',
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 14,
                    color: '#94A3B8',
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 260,
                    marginLeft: isMobile ? 0 : 'auto',
                    marginRight: isMobile ? 0 : 'auto',
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ONE door — the consultation intake at /estate. During the dark period /estate renders a
            dignified placeholder that routes into the waitlist; at go-live Devin flips the flag and
            the same URL becomes the guided intake. Both states are clean (FIX 6). */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <a
            href="/estate"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 52,
              padding: '15px 40px',
              borderRadius: 14,
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 17,
              textDecoration: 'none',
              color: '#0D1117',
              background: 'linear-gradient(135deg, #D4A017, #B8860B)',
              boxShadow: '0 0 30px rgba(212,160,23,0.18), 0 4px 14px rgba(212,160,23,0.12)',
            }}
          >
            Start with a conversation
          </a>
          {/* G6 — the single, quiet "in development" marker. No date, no roadmap. */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 14,
              color: '#94A3B8',
              marginTop: 18,
              lineHeight: 1.6,
              maxWidth: 520,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            The Estate Stewardship Program is being built out now — we&rsquo;re onboarding families
            personally in the meantime. There is nothing to pay and nothing to sign.
          </p>
        </div>
      </div>
    </section>
  )
}

// ---------- SOCIAL PROOF / EARLY ACCESS ----------
function SocialProofSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const [barActive, setBarActive] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setBarActive(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarActive(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <AnimatedStat
          target={100}
          style={{
            fontFamily: 'var(--font-data)',
            fontWeight: 700,
            fontSize: 'clamp(48px, 7vw, 72px)',
            background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            lineHeight: 1.1,
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 18,
            color: '#CBD5E1',
            marginTop: 8,
          }}
        >
          Founding spots open — locked-for-life pricing
        </p>

        <div ref={barRef} style={{ marginTop: 40 }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              color: '#CBD5E1',
              marginBottom: 12,
            }}
          >
            Pre-Launch Pricing: all 100 founding spots are open
          </p>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              height: 8,
              maxWidth: 400,
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00bcd4, #009688)',
                borderRadius: 8,
                width: barActive ? '100%' : '0%',
                transition: 'width 1.5s ease-out',
              }}
            />
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 18,
            color: '#F1F5F9',
            marginTop: 32,
          }}
        >
          Built in Maine. Serving America.
        </p>

        <GlowCard
          defaultBorderColor="rgba(34,197,94,0.3)"
          hoverBorderColor="rgba(34,197,94,0.5)"
          style={{ marginTop: 32, display: 'inline-block' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 16,
              color: '#F1F5F9',
            }}
          >
            🎖️ Veterans &amp; First Responders: 25% off subscriptions &bull; 20% off white-glove services &bull; 25% reduced commissions
          </p>
        </GlowCard>
      </div>
    </section>
  )
}

/* ==============================================
   PHASE 5 — TECH + INVESTORS + FOOTER
   ============================================== */

// ---------- TECHNOLOGY CREDIBILITY ----------
function TechSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isTouch = useIsTouch()
  const cols = width < 640 ? '1fr' : 'repeat(2, 1fr)'

  // CMD-ESTATE-EXPERIENCE-V2 V20 (FIX 4): product cards replace the stack cards
  // (Next.js / TypeScript / Real AI APIs). Honest capability copy per CANONICAL_FACTS §6;
  // the 4th card is a COMING marker (Rule 4) with CEO-ruling-G8 wording, verbatim.
  const items: { emoji: string; title: string; desc: string; muted?: boolean }[] = [
    {
      emoji: '🎯',
      title: 'BuyerBot',
      desc: 'Surfaces likely buyers and the marketplaces that fit each item, so your listing reaches the right audience.',
    },
    {
      emoji: '💬',
      title: 'Messaging Center',
      desc: 'Every buyer conversation — offers, questions, negotiations — in one organized place.',
    },
    {
      emoji: '📦',
      title: 'AI Shipping Center',
      desc: 'Live rates from USPS, UPS, and FedEx. Parcel, LTL freight, or local pickup — you choose, we print the label.',
    },
    {
      // CEO ruling G8 — VERBATIM, visible future marker, no regulated words, no date.
      emoji: '✨',
      title: 'Hands-free selling — coming soon',
      desc: 'AI runs the busywork; you approve every sale.',
      muted: true,
    },
  ]

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/ai/network-nodes.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(13,17,23,0.92)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Entry variant: CLIP-PATH WIPE — top-down reveal (AT pattern).
            Touch-safe: skip the clip-path reveal since it could stall on
            iPad leaving the whole intro invisible. Desktop still gets it. */}
        <motion.div
          initial={
            isTouch
              ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 }
              : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }
          }
          whileInView={{
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.95,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <SectionEyebrow text="THE PLATFORM" />
          <SectionHeading>
            <StaggeredWords text="Everything the Sale Needs." />
          </SectionHeading>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
            marginTop: 48,
          }}
        >
          {items.map((item, i) => (
            <GlowCard key={item.title} delay={i * 80} style={item.muted ? { opacity: 0.82 } : undefined}>
              <span style={{ fontSize: 24 }}>{item.emoji}</span>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 18,
                  color: item.muted ? '#94A3B8' : '#F1F5F9',
                  marginTop: 8,
                }}
              >
                {item.title}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 15,
                  color: item.muted ? '#94A3B8' : '#CBD5E1',
                  marginTop: 4,
                  lineHeight: 1.55,
                }}
              >
                {item.desc}
              </p>
            </GlowCard>
          ))}
        </div>

        <ScrollRevealText
          text="A full AI team + MegaBot. 4 consensus engines. One AI Shipping Center. Every tool you need — in one platform."
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'clamp(20px, 3vw, 28px)',
            lineHeight: 1.4,
            color: '#F1F5F9',
            textAlign: 'center',
            maxWidth: 800,
            margin: '64px auto 0',
          }}
        />
      </div>
    </section>
  )
}

// ---------- CINEMATIC VIDEO SHOWCASE + OUR STORY ----------
function VideoShowcaseSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768
  // Touch-only visibility upgrade for the Connecting Generations render.
  // 0.18 opacity reads as cinematic orbital depth on desktop glass but as
  // flat black on phone/tablet under sunlight. Lift to 0.35 on touch and
  // soften the top gradient 0.6 → 0.45. Desktop path is byte-for-byte
  // unchanged — isTouch is false during SSR + hydration, upgrades on mount.
  const isTouch = useIsTouch()
  const videoOpacity = isTouch ? 0.35 : 0.18
  const overlayTopAlpha = isTouch ? 0.45 : 0.6

  return (
    <>
      {/* PART 1 — Cinematic video hero with headline overlay */}
      <section
        id="showcase"
        data-fullvh
        style={{
          position: 'relative',
          zIndex: 5,
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...sp,
        }}
      >
        {/* Full-bleed video background. Poster covers the iOS autoplay
            ramp-up window and any transient decode error (see the silent
            onError in AutoPlayVideo). webm first for Chrome / Firefox /
            Android — smaller payload + better iOS fallback semantics.
            mp4 second for Safari. */}
        <AutoPlayVideo
          poster="/images/hero/story-hero-poster.jpg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoOpacity,
            zIndex: 0,
          }}
          sources={[
            { src: '/Legacy_Loop_Hero_Video_Connecting_Generations.webm', type: 'video/webm' },
            { src: '/Legacy_Loop_Hero_Video_Connecting_Generations.mp4', type: 'video/mp4' },
          ]}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(13,17,23,${overlayTopAlpha}) 0%, rgba(13,17,23,0.3) 35%, rgba(13,17,23,0.3) 65%, rgba(13,17,23,0.7) 100%)`,
            zIndex: 1,
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0,188,212,0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Headline content — floats over video */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 800,
            textAlign: 'center',
          }}
        >
          <SectionEyebrow text="OUR STORY" />
          <SectionHeading>
            <StaggeredWords text="Built with Purpose." />{' '}
            <GradientText>Powered by AI.</GradientText>
          </SectionHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 18,
              color: '#CBD5E1',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Legacy-Loop connects generations through technology built with heart.
            Every item tells a story. Every sale preserves a legacy.
          </p>
        </div>
      </section>

      {/* PART 2 — Feature cards + Mission (below video, on solid bg) */}
      <section
        style={{
          padding: isMobile ? '80px 24px' : '100px 32px',
          position: 'relative',
          zIndex: 5,
          overflow: 'hidden',
        }}
      >
        {/* Warm amber ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(212,160,23,0.03) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* 3 Feature Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 24,
              marginBottom: 80,
            }}
          >
            {[
              {
                emoji: '🏺',
                title: 'Estate Sales with Dignity',
                desc: 'Walk alongside families during life\u2019s biggest transitions. AI handles the complexity so they don\u2019t have to.',
              },
              {
                emoji: '🤖',
                title: '10 AI Bots + MegaBot',
                desc: 'From photo analysis to buyer matching to video ads. One platform replaces a dozen tools.',
              },
              {
                emoji: '🌲',
                title: 'Built in Maine. Serving America.',
                desc: 'Founded with faith, grit, and a calling to serve families, seniors, veterans, and communities in need.',
              },
            ].map((item, i) => (
              <GlowCard key={item.title} delay={i * 100}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>
                  {item.emoji}
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#F1F5F9',
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#CBD5E1',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </GlowCard>
            ))}
          </div>

          {/* Mission Statement — the heart of Legacy-Loop */}
          <div
            id="mission"
            style={{
              maxWidth: 800,
              margin: '0 auto',
              textAlign: 'center',
              scrollMarginTop: 96, // clears the sticky nav on scrollIntoView
            }}
          >
            <SectionEyebrow text="OUR MISSION" color="#D4A017" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(24px, 3.5vw, 34px)',
                color: '#F1F5F9',
                lineHeight: 1.3,
                margin: '0 0 32px',
              }}
            >
              More Than Technology.{' '}
              <span style={{ color: '#D4A017' }}>A Mission for Good.</span>
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 17,
                color: '#CBD5E1',
                lineHeight: 1.75,
                marginBottom: 48,
              }}
            >
              Legacy-Loop was built to honor something bigger than profit.
              We combine the power of artificial intelligence with compassionate human values
              to help families navigate life&apos;s transitions with dignity. Through every sale,
              donation, and partnership, we provide resources and hope to those who need it most.
            </p>

            {/* Values grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 16,
                marginBottom: 48,
              }}
            >
              {[
                { icon: '✝️', title: 'Faith-Driven', desc: 'Guided by purpose and conviction in every decision we make.' },
                { icon: '💛', title: 'Compassion', desc: 'Serving seniors, families, veterans, and communities with empathy.' },
                { icon: '🤝', title: 'Integrity', desc: 'Honest, ethical, and transparent in every interaction.' },
                { icon: '🎖️', title: 'Veterans First', desc: '25% off subscriptions, 20% off white-glove, 25% reduced commissions.' },
              ].map((value, i) => (
                <GlowCard
                  key={value.title}
                  delay={i * 80}
                  defaultBorderColor="rgba(212,160,23,0.12)"
                  hoverBorderColor="rgba(212,160,23,0.35)"
                  style={{ textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{value.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 600,
                          fontSize: 16,
                          color: '#F1F5F9',
                        }}
                      >
                        {value.title}
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: 400,
                          fontSize: 14,
                          color: '#94A3B8',
                          marginTop: 4,
                          lineHeight: 1.5,
                        }}
                      >
                        {value.desc}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Two Paths */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 20,
                marginBottom: 48,
              }}
            >
              <GlowCard
                defaultBorderColor="rgba(212,160,23,0.15)"
                hoverBorderColor="rgba(212,160,23,0.4)"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    color: '#D4A017',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  ESTATE &amp; SENIOR PATH
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 20,
                    color: '#F1F5F9',
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  Legacy Transitions
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    color: '#CBD5E1',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Warmth, dignity, patience, and trust. We walk alongside seniors and families
                  during life&apos;s most significant moments with compassion and care.
                </p>
              </GlowCard>
              <GlowCard
                defaultBorderColor="rgba(0,188,212,0.15)"
                hoverBorderColor="rgba(0,188,212,0.4)"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    color: '#00BCD4',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  GARAGE &amp; YARD SALE PATH
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 20,
                    color: '#F1F5F9',
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  Smart Everyday Selling
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    color: '#CBD5E1',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Energetic, modern, and clear. The smartest, easiest way for everyday
                  families to sell — fast, intelligent, and completely stress-free.
                </p>
              </GlowCard>
            </div>

            {/* Closing tagline */}
            <ScrollRevealText
              text="Connecting Generations — one family, one item, one act of generosity at a time."
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                lineHeight: 1.5,
                color: '#D4A017',
                textAlign: 'center',
                maxWidth: 700,
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}

// ---------- APP DOWNLOAD SECTION ----------
function AppDownloadSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const reduced = useReducedMotion()
  const isMobile = width < 768
  const isSmall = width < 600

  const [detectedPlatform, setDetectedPlatform] = useState<string>('WebApp')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDetectedPlatform('iOS')
    } else if (/Android/.test(ua)) {
      setDetectedPlatform('Android')
    } else if (/Mac/.test(ua) || /Win/.test(ua)) {
      setDetectedPlatform('Desktop')
    } else {
      setDetectedPlatform('WebApp')
    }
    setIsLoaded(true)
  }, [])

  const installCards = [
    {
      platform: 'iOS',
      emoji: '🍎',
      title: 'iPhone & iPad',
      subtitle: 'iOS Safari',
      steps: ['Open in Safari', 'Tap Share ⬆', 'Add to Home Screen', 'Tap "Add"'],
    },
    {
      platform: 'Android',
      emoji: '🤖',
      title: 'Android',
      subtitle: 'Chrome Browser',
      steps: ['Open in Chrome', 'Tap menu ⋮', 'Add to Home Screen', 'Tap "Install"'],
      featured: true,
    },
    {
      platform: 'Desktop',
      emoji: '💻',
      title: 'Mac & Windows',
      subtitle: 'Chrome or Edge',
      steps: ['Open in Chrome/Edge', 'Click ⊕ in address bar', 'Click "Install"', 'App opens standalone'],
    },
    {
      platform: 'WebApp',
      emoji: '🌐',
      title: 'Any Browser',
      subtitle: 'Zero install',
      steps: ['Open any browser', 'Visit app.legacy-loop.com', 'Log in — start selling', 'Works offline once loaded'],
    },
  ]

  return (
    <section
      id="download"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Corner crosshair markers — Lusion studio framing */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.2 + i * 0.08,
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#00BCD4" strokeWidth="1" />
        </motion.svg>
      ))}

      {/* Ambient glow — centered teal dome */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 40% at 50% 20%, rgba(0,188,212,0.06), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* HEADLINE BLOCK — with ghost POCKET typography */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? 40 : 56,
            position: 'relative',
          }}
        >
          {/* Ghost oversized "POCKET" word — Resn / AT depth vocabulary */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: isMobile ? 10 : 18,
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-data)',
              fontSize: isMobile ? '20vw' : 'clamp(160px, 20vw, 320px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'rgba(0,188,212,0.05)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0,
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
            }}
          >
            POCKET
          </span>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <SectionEyebrow text="AVAILABLE ON ALL DEVICES" />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(34px, 5.2vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                color: '#F1F5F9',
                textAlign: 'center',
                margin: '0 auto 20px',
                maxWidth: 860,
              }}
            >
              {reduced ? (
                <>
                  Legacy-Loop lives on your <GradientText>phone</GradientText>.
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    Legacy-Loop lives on your&nbsp;
                  </motion.span>
                  <GlitchWord text="phone" isLoaded={isLoaded} />
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    style={{ display: 'inline-block' }}
                  >
                    .
                  </motion.span>
                </>
              )}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: isSmall ? 16 : 18,
                lineHeight: 1.65,
                color: '#CBD5E1',
                maxWidth: 640,
                margin: '0 auto',
              }}
            >
              No App Store. No approval wait. Install in{' '}
              <span style={{ color: '#F1F5F9', fontWeight: 600 }}>
                3 seconds
              </span>{' '}
              — iPhone, Android, desktop, or any browser.
            </p>
          </div>
        </div>

        {/* 4-UP INSTALL CARD GRID — Android FEATURED with LIVE pill.
            Responsive: 1 col <600 · 2 cols 600-1023 · 4 cols 1024+.
            Previous 4-cols-at-768 layout crammed each card to ~170px
            and broke step text across 3 lines. 2-col tablet breathes. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              width < 600
                ? '1fr'
                : width < 1024
                ? 'repeat(2, 1fr)'
                : 'repeat(4, 1fr)',
            gap: isMobile ? 14 : 18,
            marginBottom: isMobile ? 48 : 64,
          }}
        >
          {installCards.map((card, i) => {
            const isDetected = card.platform === detectedPlatform
            const accent = card.featured ? '#22C55E' : '#00BCD4'
            const accentRgba = card.featured
              ? 'rgba(34,197,94,'
              : 'rgba(0,188,212,'
            return (
              <GlowCard
                key={card.platform}
                delay={i * 90}
                hoverBorderColor={`${accentRgba}0.55)`}
                defaultBorderColor={
                  card.featured
                    ? 'rgba(34,197,94,0.3)'
                    : isDetected
                    ? 'rgba(0,188,212,0.4)'
                    : 'rgba(0,188,212,0.15)'
                }
                style={{
                  padding: isSmall ? 18 : 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: card.featured
                    ? 'rgba(34,197,94,0.04)'
                    : isDetected
                    ? 'rgba(0,188,212,0.05)'
                    : 'rgba(255,255,255,0.03)',
                }}
              >
                {/* Top row — icon chip + pill indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {card.emoji}
                  </div>

                  {card.featured ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 8px',
                        borderRadius: 9999,
                        background: 'rgba(34,197,94,0.14)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        fontFamily: 'var(--font-data)',
                        fontWeight: 700,
                        fontSize: 9,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase' as const,
                        color: '#22C55E',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#22C55E',
                          boxShadow: '0 0 6px rgba(34,197,94,0.7)',
                          animation: reduced
                            ? 'none'
                            : 'pulse 1.4s ease-in-out infinite',
                        }}
                      />
                      Recommended
                    </span>
                  ) : isDetected ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontWeight: 700,
                        fontSize: 9,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase' as const,
                        color: '#00BCD4',
                        background: 'rgba(0,188,212,0.14)',
                        border: '1px solid rgba(0,188,212,0.4)',
                        padding: '3px 8px',
                        borderRadius: 9999,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Your device
                    </span>
                  ) : null}
                </div>

                {/* Title + subtitle */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: 17,
                      color: '#F1F5F9',
                      marginBottom: 2,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: '#8B949E',
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>

                {/* Steps */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  {card.steps.map((step, j) => (
                    <div
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-data)',
                          fontWeight: 700,
                          fontSize: 10,
                          color: accent,
                          background: `${accentRgba}0.12)`,
                          border: `1px solid ${accentRgba}0.3)`,
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {j + 1}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: '#CBD5E1',
                          lineHeight: 1.5,
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            )
          })}
        </div>

        {/* QR CODE + PHONE MOCKUP ROW — desktop only (mobile users already have their phone) */}
        {!isMobile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              alignItems: 'center',
              maxWidth: 860,
              margin: '0 auto 64px',
              padding: '48px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* LEFT — QR code with soft teal frame */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(0,188,212,0.2)',
                  boxShadow: '0 0 48px rgba(0,188,212,0.08)',
                }}
              >
                <QRCodeSVG
                  value="https://app.legacy-loop.com"
                  size={180}
                  bgColor="#0D1117"
                  fgColor="#00BCD4"
                  level="H"
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: '#CBD5E1',
                    marginBottom: 4,
                  }}
                >
                  Scan to open on your phone
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#00BCD4',
                    letterSpacing: '0.1em',
                  }}
                >
                  app.legacy-loop.com
                </div>
              </div>
            </div>

            {/* RIGHT — Phone mockup with live V8 preview (floating bob) */}
            <motion.div
              animate={reduced ? {} : { y: [0, -6, 0] }}
              transition={
                reduced
                  ? {}
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
              style={{
                position: 'relative',
                width: 220,
                aspectRatio: '9 / 16',
                margin: '0 auto',
                borderRadius: 28,
                overflow: 'hidden',
                border: '8px solid #0D1117',
                outline: '1px solid rgba(0,188,212,0.3)',
                boxShadow:
                  '0 0 40px rgba(0,188,212,0.12), 0 24px 56px rgba(0,0,0,0.5)',
                background:
                  'linear-gradient(180deg, #0D1117 0%, #1A1F2E 100%)',
                padding: '32px 18px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* iOS-style notch */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 72,
                  height: 6,
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: 3,
                  zIndex: 3,
                }}
              />

              {/* App header — wordmark + live dot */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: 12,
                    color: '#00BCD4',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Legacy-Loop
                </span>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                    animation: reduced
                      ? 'none'
                      : 'pulse 1.4s ease-in-out infinite',
                  }}
                />
              </div>

              {/* V8 mini pills — same vocab as the live app */}
              {[
                { label: 'LIST', value: '$380', color: '#00BCD4' },
                { label: 'ACCEPT', value: '$280', color: '#22C55E' },
                { label: 'FLOOR', value: '$220', color: '#F59E0B' },
              ].map((p) => (
                <div
                  key={p.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${p.color}40`,
                    borderRadius: 8,
                    borderLeft: `3px solid ${p.color}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      color: p.color,
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#F1F5F9',
                    }}
                  >
                    {p.value}
                  </span>
                </div>
              ))}

              {/* Item context line */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: '#8B949E',
                  textAlign: 'center',
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                Nintendo 64 · Good
                <br />
                Garage sale w/ online backup
              </div>
            </motion.div>
          </div>
        )}

        {/* Senior-friendly help text */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto 36px',
            lineHeight: 1.65,
          }}
        >
          Not sure how to install? It&apos;s simple — tap the button for your
          phone type and follow the steps. Need help? Email{' '}
          <a
            href="mailto:support@legacy-loop.com"
            style={{ color: '#00BCD4', textDecoration: 'none' }}
          >
            support@legacy-loop.com
          </a>
        </p>

        {/* PWA feature chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? 8 : 12,
            marginBottom: 32,
          }}
        >
          {[
            'PWA Installable',
            'Works Offline',
            'No App Store Wait',
            'Free to Install',
          ].map((feature) => (
            <span
              key={feature}
              style={{
                fontFamily: 'var(--font-data)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: '#00BCD4',
                background: 'rgba(0,188,212,0.08)',
                border: '1px solid rgba(0,188,212,0.25)',
                padding: '8px 14px',
                borderRadius: 9999,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Trust line */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: '#8B949E',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Built in Maine.{' '}
          <span style={{ color: '#F1F5F9', fontWeight: 500 }}>
            Free to install. Always.
          </span>
        </p>
      </div>
    </section>
  )
}

// ---------- PRE-SALES WAITLIST + FOUNDING MEMBERS ----------
function WaitlistSection({
  activeSection,
  offeringIntent,
  setOfferingIntent,
}: {
  activeSection: string
  offeringIntent: OfferingIntent | null
  setOfferingIntent: (i: OfferingIntent | null) => void
}) {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  // Offering-true choice: '' | founding | an OFFERINGS SKU id. Drives the full
  // field bundle at submit (NOT sent raw as tierInterest).
  const [quickChoice, setQuickChoice] = useState('')
  const [reason, setReason] = useState('')
  const [zip, setZip] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [already, setAlready] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  // CMD-WAITLIST-WALKTHROUGH — guided "Find My Plan" flow swaps in place of
  // the flat form (senior-friendly · no modal, no scroll-trap). Flat form
  // stays the fast lane below the divider.
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  // Part 4 — real live founding count from the Google Sheet (via app proxy). Null until it loads;
  // on any failure it stays null and the live line simply hides (never a fabricated number).
  const [live, setLive] = useState<{ claimed: number; cohortSize: number; spotsLeft: number } | null>(null)
  useEffect(() => {
    let alive = true
    fetch('https://app.legacy-loop.com/api/waitlist/count')
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && d.ok === true && typeof d.claimed === 'number') {
          setLive({
            claimed: d.claimed,
            // FIX 5 (CEO G3): canon fallback = 100 when the Sheet omits the field; the real
            // cohort size, when present, still renders verbatim (the "first cohort" nuance).
            cohortSize: typeof d.cohortSize === 'number' ? d.cohortSize : 100,
            spotsLeft: typeof d.spotsLeft === 'number' ? d.spotsLeft : Math.max(0, 100 - d.claimed),
          })
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // When a section CTA carries an offering, pre-select the matching dropdown
  // value if one exists (WG Essentials/Legacy have no dropdown option — the chip
  // + captured intent carry them instead).
  const SELECTABLE = ['diy', 'power', 'estateManager', 'estateCare', 'wgProfessional', 'neighborhood', 'free']
  useEffect(() => {
    if (offeringIntent && SELECTABLE.includes(offeringIntent.offering)) {
      setQuickChoice(offeringIntent.offering)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offeringIntent])

  // Resolve the offering-true field bundle: captured CTA intent > dropdown
  // choice > section inference. Every value obeys the §1 vocabulary law.
  const buildPayload = (): Record<string, string> => {
    const payload: Record<string, string> = { firstName, lastName, email, zip, section: activeSection }
    let bundle: Partial<Record<'tierInterest' | 'reason' | 'sellerType' | 'servicePreference' | 'offering', string>> = {}
    let source = 'landing-quick'
    let note: string | undefined

    if (offeringIntent && OFFERINGS[offeringIntent.offering]) {
      const o = OFFERINGS[offeringIntent.offering]
      bundle = { tierInterest: o.tierInterest, reason: o.reason, sellerType: o.sellerType, servicePreference: o.servicePreference, offering: o.id }
      source = offeringIntent.source
      note = offeringIntent.note
    } else if (quickChoice && OFFERINGS[quickChoice]) {
      const o = OFFERINGS[quickChoice]
      bundle = { tierInterest: o.tierInterest, reason: o.reason, sellerType: o.sellerType, servicePreference: o.servicePreference, offering: o.id }
    } else if (quickChoice === 'founding') {
      bundle = { tierInterest: 'founding', reason: reason || 'exploring' }
    } else if (activeSection === 'estate') {
      // Blank dropdown while browsing the estate section — never lose the intent.
      bundle = { tierInterest: 'estate', reason: 'estate', sellerType: 'estate', servicePreference: 'diy', offering: 'estateManager' }
    } else {
      bundle = { tierInterest: 'undecided', reason: reason || '' }
    }

    payload.source = source
    for (const [k, v] of Object.entries(bundle)) if (v) payload[k] = v
    if (note) payload.note = note
    return payload
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || isSubmitting) return
    setIsSubmitting(true)
    setError('')
    try {
      // Posts cross-subdomain to the app floor (CORS allow-listed on the API side).
      const res = await fetch('https://app.legacy-loop.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      const data = await res.json().catch(() => ({} as { ok?: boolean; already?: boolean; error?: string }))
      // Only show success on a real {ok:true} — honest, not a faked confirmation.
      if (res.ok && data.ok) {
        setAlready(Boolean(data.already))
        setSubmitted(true)
        // Redirect to the real /thank-you route so the Google Ads conversion fires.
        // A returning duplicate (?already=1) shows the graceful copy and does NOT convert.
        window.location.assign(data.already ? '/thank-you?already=1' : '/thank-you')
        return
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('We could not reach the server. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    padding: '14px 20px',
    borderRadius: 12,
    border: '1px solid rgba(0,188,212,0.25)',
    background: 'rgba(255,255,255,0.04)',
    color: '#F1F5F9',
    outline: 'none',
    minHeight: 48,
    transition: 'border-color 0.3s ease, background 0.3s ease',
  }

  return (
    <section
      id="waitlist"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,188,212,0.07) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>

        {/* Eyebrow — animated pulse dot */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(0,188,212,0.08)',
            border: '1px solid rgba(0,188,212,0.2)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00BCD4',
              boxShadow: '0 0 8px rgba(0,188,212,0.6)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#00BCD4',
            }}
          >
            Early Access
          </span>
        </div>

        {/* Headline */}
        <SectionHeading>
          You&apos;re Early.{' '}
          <GradientText>That&apos;s Rare.</GradientText>
        </SectionHeading>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Lock in pre-launch pricing forever. Get priority access before public launch. Be part of Legacy-Loop from day one.
        </p>

        {/* Founding spots counter — BIG number, AnimatedStat count-up on viewport.
            CMD-ESTATE-EXPERIENCE-V2 V20 (FIX 5 · CEO G3): canon = 100 founding spots. The
            real "first cohort" size lives in the live Sheet indicator below (ONE story). */}
        <div style={{ marginBottom: 12 }}>
          <AnimatedStat
            target={100}
            duration={2200}
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 800,
              fontSize: 'clamp(48px, 8vw, 64px)',
              background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              display: 'inline-block',
            }}
          />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-data)',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '0.05em',
            color: '#F1F5F9',
            marginBottom: 6,
          }}
        >
          founding member spots
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 13,
            color: '#94A3B8',
            marginBottom: 36,
          }}
        >
          Early access — pre-launch pricing locked for life
        </p>

        {/* Founding cohort indicator — real count from the Sheet (no fabricated fill). Hidden until loaded. */}
        {live ? (
          <div style={{ marginBottom: 40 }}>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.05em',
                color: '#00BCD4',
                margin: 0,
              }}
            >
              {live.claimed} of {live.cohortSize} founding spots claimed
              <span style={{ color: '#94A3B8', fontWeight: 400 }}> &middot; {live.spotsLeft} still open</span>
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: 40 }} />
        )}

        {submitted ? (
          /* ===== B8 — SUCCESS STATE ===== */
          <div
            style={{
              padding: '40px 32px',
              borderRadius: 20,
              background: 'rgba(0,188,212,0.04)',
              border: '1px solid rgba(0,188,212,0.2)',
            }}
          >
            {/* Animated checkmark */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(0,188,212,0.12)',
                border: '2px solid #00BCD4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                animation: 'fadeScaleIn 0.5s ease-out',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00BCD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 22,
                color: '#F1F5F9',
                marginBottom: 12,
              }}
            >
              {already ? "You're already on the list." : "You're in. Welcome to Legacy-Loop."}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: '#CBD5E1',
                lineHeight: 1.65,
                marginBottom: 20,
              }}
            >
              {already ? "Good news — you're already on the founding list. Your original confirmation is in your inbox (check Promotions the first time). We'll email you the moment your cohort opens." : "Your founding member rate is locked. Your welcome email is on its way from hello@legacy-loop.com — check your inbox (it may land in Promotions the first time)."}
            </p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just locked in founding member pricing at @Legacy-LoopApp — AI-powered resale for the next generation. Join early: https://legacy-loop.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 14,
                color: '#00BCD4',
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
              }}
            >
              Tell a friend →
            </a>
          </div>
        ) : showWalkthrough ? (
          /* ===== GUIDED WALKTHROUGH (in-place swap) ===== */
          <WaitlistWalkthrough
            live={live}
            isMobile={isMobile}
            onExit={() => setShowWalkthrough(false)}
          />
        ) : (
          /* ===== CHOICE: guided walkthrough (star) + flat form (fast lane) ===== */
          <>
            {/* CMD-WAITLIST-INTAKE-ELEVATE — captured offering chip. A visitor who
                clicked a section CTA (e.g. Estate Legacy $7,000) arrives with it held. */}
            {offeringIntent && OFFERINGS[offeringIntent.offering] && (() => {
              const o = OFFERINGS[offeringIntent.offering]
              const gold = o.register === 'estate'
              const accent = gold ? '#D4A017' : '#00BCD4'
              const chipBg = gold ? 'rgba(212,160,23,0.10)' : 'rgba(0,188,212,0.10)'
              const chipBorder = gold ? 'rgba(212,160,23,0.35)' : 'rgba(0,188,212,0.35)'
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                    maxWidth: 480,
                    margin: '0 auto 24px',
                    padding: '12px 18px',
                    borderRadius: 14,
                    background: chipBg,
                    border: `1px solid ${chipBorder}`,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#CBD5E1' }}>Reserving:</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15, color: '#F1F5F9' }}>{o.name}</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 15, color: accent }}>
                    {o.price}{o.priceSuffix ?? ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOfferingIntent(null)}
                    aria-label="Clear selected offering"
                    style={{
                      marginLeft: 4,
                      minHeight: 32,
                      minWidth: 32,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: '#94A3B8',
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                    }}
                  >
                    Change
                  </button>
                </div>
              )
            })()}

            {/* Find My Plan — the primary path */}
            <div style={{ marginBottom: 28 }}>
              <MagneticButton
                onClick={() => setShowWalkthrough(true)}
                style={{
                  width: '100%',
                  maxWidth: 480,
                  margin: '0 auto',
                  fontSize: 17,
                  padding: '18px 32px',
                  minHeight: 56,
                }}
              >
                Find My Plan — 2 minutes &rarr;
              </MagneticButton>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: '#94A3B8',
                  margin: '12px 0 0',
                  lineHeight: 1.5,
                }}
              >
                No account needed &middot; takes about 2 minutes &middot; find your service, tier, and price
              </p>
            </div>

            {/* Divider — "or join quickly" */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                maxWidth: 480,
                margin: '0 auto 24px',
              }}
            >
              <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: '#6B7280',
                }}
              >
                or join quickly
              </span>
              <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 480,
                margin: '0 auto',
              }}
            >
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 12,
              }}
            >
              <input
                type="text"
                placeholder="First name"
                aria-label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.5)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.25)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              />
              <input
                type="text"
                placeholder="Last name (optional)"
                aria-label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.5)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.25)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              />
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,188,212,0.5)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,188,212,0.25)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
            />

            {/* Which best describes you — offering-true. Each value drives the
                full field bundle at submit (see buildPayload). Optional. */}
            <select
              value={quickChoice}
              onChange={(e) => setQuickChoice(e.target.value)}
              aria-label="Which best describes you?"
              style={{
                ...inputStyle,
                fontSize: 16,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                color: quickChoice === '' ? '#94A3B8' : '#F1F5F9',
              }}
            >
              <option value="" style={{ color: '#0D1117' }}>Which best describes you? (optional)</option>
              <optgroup label="Selling my own things" style={{ color: '#0D1117' }}>
                <option value="diy" style={{ color: '#0D1117' }}>Just me, a few things</option>
                <option value="power" style={{ color: '#0D1117' }}>Me — a lot to sell</option>
              </optgroup>
              <optgroup label="Estate &amp; downsizing" style={{ color: '#0D1117' }}>
                <option value="estateManager" style={{ color: '#0D1117' }}>I&apos;ll manage the estate myself</option>
                <option value="estateCare" style={{ color: '#0D1117' }}>Estate — guided, with support</option>
                <option value="wgProfessional" style={{ color: '#0D1117' }}>Estate — do it all for me</option>
              </optgroup>
              <optgroup label="Group sale" style={{ color: '#0D1117' }}>
                <option value="neighborhood" style={{ color: '#0D1117' }}>A neighborhood / group sale</option>
              </optgroup>
              <option value="founding" style={{ color: '#0D1117' }}>Founding member — first 100</option>
              <option value="free" style={{ color: '#0D1117' }}>Just exploring</option>
            </select>

            {/* Part 3 — "What brings you?" (non-PII intent signal, helps us welcome you) + optional ZIP */}
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 12,
              }}
            >
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                aria-label="What brings you here?"
                style={{
                  ...inputStyle,
                  fontSize: 16,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  minWidth: 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  color: reason === '' ? '#94A3B8' : '#F1F5F9',
                }}
              >
                <option value="" style={{ color: '#0D1117' }}>What brings you here? (optional)</option>
                <option value="estate" style={{ color: '#0D1117' }}>Estate or downsizing</option>
                <option value="declutter" style={{ color: '#0D1117' }}>Decluttering or a garage sale</option>
                <option value="exploring" style={{ color: '#0D1117' }}>Just exploring</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="ZIP (optional)"
                aria-label="ZIP code (optional)"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                maxLength={10}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.5)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,188,212,0.25)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              />
            </div>

            {/* B7 — Premium CTA button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 16,
                padding: '16px 32px',
                borderRadius: 12,
                border: 'none',
                background: isSubmitting
                  ? 'linear-gradient(135deg, #00899b, #007566)'
                  : 'linear-gradient(135deg, #00bcd4, #009688)',
                color: '#fff',
                cursor: isSubmitting ? 'wait' : 'pointer',
                minHeight: 52,
                boxShadow: '0 0 40px rgba(0,188,212,0.3), 0 4px 20px rgba(0,188,212,0.15)',
                transition: 'transform 0.2s ease, filter 0.2s ease',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.filter = 'brightness(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              {isSubmitting ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Securing your spot...
                </>
              ) : (
                'Secure My Founding Rate →'
              )}
            </button>

            {error && (
              <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#fca5a5', margin: '4px 0 0', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280', margin: '4px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
              We&apos;ll email you from hello@legacy-loop.com — check your inbox (the first email may land in Promotions).
            </p>
            </form>
          </>
        )}

        {/* B5 — Trust signals row */}
        {!submitted && !showWalkthrough && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isMobile ? 16 : 32,
              marginTop: 28,
              marginBottom: 28,
            }}
          >
            {[
              { icon: '🔒', text: 'No credit card required' },
              { icon: '🛡️', text: 'Your data is never sold' },
              { icon: '🏷️', text: 'Pre-launch pricing locked forever' },
            ].map((signal) => (
              <div
                key={signal.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{signal.icon}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 12,
                    color: '#6B7280',
                  }}
                >
                  {signal.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* B6 — Benefits row */}
        {!submitted && !showWalkthrough && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '8px 24px',
              maxWidth: 420,
              margin: '0 auto',
              textAlign: 'left',
            }}
          >
            {[
              'Priority access before public launch',
              'Pre-launch pricing locked in forever',
              'Direct line to the founding team',
              'Shape the product with your feedback',
            ].map((benefit) => (
              <div
                key={benefit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                    fontSize: 12,
                    color: '#00BCD4',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 13,
                    color: '#94A3B8',
                    lineHeight: 1.5,
                  }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ---------- FINAL CTA ----------
function FinalCTASection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,188,212,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner crosshair markers — final studio-grade frame */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.2 + i * 0.08,
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            ...pos,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <path d="M6 0v12M0 6h12" stroke="#00BCD4" strokeWidth="1" />
        </motion.svg>
      ))}

      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Ghost oversized "JOIN" word — imperative, short, behind CTA */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: width < 768 ? -20 : -40,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-data)',
            fontSize: width < 768 ? '30vw' : 'clamp(200px, 26vw, 420px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(0,188,212,0.05)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          JOIN
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Founding pricing HUD pill */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 9999,
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.4)',
                fontFamily: 'var(--font-data)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: '#D4AF37',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#D4AF37',
                  boxShadow: '0 0 8px rgba(212,175,55,0.7)',
                  animation: 'pulse 1.4s ease-in-out infinite',
                }}
              />
              Founding pricing · Limited
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              color: '#F1F5F9',
              textAlign: 'center',
              margin: '0 0 24px',
            }}
          >
            Your Items Have Value.{' '}
            <GlitchWord text="We Help You Find It." />
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 17,
              color: '#CBD5E1',
              lineHeight: 1.65,
              marginBottom: 40,
            }}
          >
            Start for free. No credit card required.
          </p>
        </div>

        <MagneticButton href="#waitlist">
          Join Early Access
        </MagneticButton>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 14,
            color: '#94A3B8',
            marginTop: 20,
          }}
        >
          <AnimatedStat target={100} duration={2200} style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: '#00BCD4' }} /> founding member spots — early access, open now
        </p>
      </div>
    </section>
  )
}

// ---------- FOOTER — AWWWARDS PREMIUM ----------
function Footer() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: 14,
    color: '#6B7280',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    display: 'block',
    padding: '6px 0',
  }

  const colHeading: React.CSSProperties = {
    fontFamily: 'var(--font-data)',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#94A3B8',
    marginBottom: 16,
  }

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Teal accent line at top */}
      <div
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.3) 50%, transparent 100%)',
        }}
      />

      {/* Main footer content */}
      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(13,17,23,0.95) 0%, rgba(10,12,16,1) 100%)',
          padding: width < 380 ? '48px 16px 32px' : isMobile ? '60px 24px 40px' : '80px 48px 48px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Top row — Logo + tagline large */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              gap: 32,
              marginBottom: 64,
            }}
          >
            <div>
              <img
                src="/logos/LegacyLoop-Logo-Master-Outlines-11.png"
                alt="Legacy-Loop"
                style={{ maxWidth: 200, objectFit: 'contain', display: 'block' }}
              />
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '4px',
                  color: '#4B5563',
                  marginTop: 0,
                  textTransform: 'uppercase' as const,
                }}
              >
                CONNECTING GENERATIONS
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: isMobile ? 20 : 24,
                  color: '#F1F5F9',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Every item tells a story.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: isMobile ? 20 : 24,
                  margin: '4px 0 0',
                  lineHeight: 1.3,
                  background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                We help you tell it.
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? 32 : 48,
              paddingBottom: 48,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Column 1 — Navigate */}
            <div>
              <div style={colHeading}>Navigate</div>
              {[
                { label: 'How It Works', action: () => scrollTo('how-it-works') },
                { label: 'AI Agents', action: () => scrollTo('bots') },
                { label: 'Pricing', action: () => scrollTo('pricing') },
                { label: 'Our Story', action: () => scrollTo('showcase') },
              ].map((link) => (
                <span
                  key={link.label}
                  onClick={link.action}
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = '#6B7280')
                  }
                >
                  {link.label}
                </span>
              ))}
            </div>

            {/* Column 2 — Product */}
            <div>
              <div style={colHeading}>Product</div>
              <a href="#waitlist" style={linkStyle}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >Get Started</a>
              <a href="https://app.legacy-loop.com/auth/login" style={linkStyle}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >Login</a>
            </div>

            {/* Column 3 — Legal */}
            <div>
              <div style={colHeading}>Legal</div>
              <a href="/privacy" style={linkStyle}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >Privacy Policy</a>
              <a href="/terms" style={linkStyle}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >Terms of Service</a>
            </div>

            {/* Column 4 — Contact */}
            <div>
              <div style={colHeading}>Contact</div>
              <a href="mailto:support@legacy-loop.com" style={{...linkStyle, wordBreak: 'break-all' as const}}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#00BCD4')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >support@legacy-loop.com</a>
              <a href="mailto:ryan@legacy-loop.com" style={{...linkStyle, wordBreak: 'break-all' as const}}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#00BCD4')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6B7280')}
              >ryan@legacy-loop.com</a>
              <span style={{ ...linkStyle, cursor: 'default', color: '#4B5563', fontSize: 13, marginTop: 8 }}>
                Maine, USA
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              paddingTop: 24,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: '#4B5563',
              }}
            >
              &copy; 2026 Legacy-Loop Tech LLC. All rights reserved.
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: '#4B5563',
              }}
            >
              {/* Canonical NAP — local-SEO · byte-identical to GBP + app footer */}
              Legacy-Loop Tech LLC &middot; Waterville, ME (service area) &middot; <a href="tel:+12076149204" style={{ color: '#4B5563', textDecoration: 'none' }}>207-614-9204</a> &middot; <a href="https://legacy-loop.com" style={{ color: '#4B5563', textDecoration: 'none' }}>https://legacy-loop.com</a>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: '#4B5563',
              }}
            >
              Built with heart in Maine. 🌲
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* CharReveal now uses CSS transitions, no @keyframes needed */

/* ==============================================
   HELP CENTER — floating button + modal
   Senior-first: large tap target, clear label, simple actions.
   Links out to the full help experience at app.legacy-loop.com/help
   so we don't duplicate infrastructure — the app already has an AI
   chat widget, articles, and a contact form.
   ============================================== */
function HelpCenter() {
  const width = useWindowWidth()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const isMobile = width < 1024

  // Listen for "open from nav" events dispatched by the StickyNav's Help link
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('legacyloop:open-help', handler)
    return () => window.removeEventListener('legacyloop:open-help', handler)
  }, [])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    // Lock background scroll while modal is open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const actions = [
    {
      icon: '💬',
      title: 'Chat with our AI',
      desc: 'Get instant answers, any time of day',
      href: 'https://app.legacy-loop.com/help?chat=1',
      accent: '#00BCD4',
    },
    {
      icon: '📖',
      title: 'Browse Help Center',
      desc: 'Guides, tutorials, and FAQs',
      href: 'https://app.legacy-loop.com/help',
      accent: '#22D3EE',
    },
    {
      icon: '✉️',
      title: 'Email our team',
      desc: 'We reply within 4 hours',
      href: 'mailto:support@legacy-loop.com',
      accent: '#D4AF37',
    },
  ]

  return (
    <>
      {/* Floating Help Button — bottom-left.
          MOBILE: 44×44 perfect circle ball. Icon only. No label.
            Tesla / Apple / Intercom standard. The "?" glyph + brand teal
            + fixed position carry the affordance. aria-label preserved
            for screen readers. Modal opens with full text on tap.
          DESKTOP: 56px pill with hover-reveal "Need help?" label.
            Unchanged from original. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Open help center"
        style={{
          position: 'fixed',
          left: isMobile ? 16 : 28,
          bottom: isMobile ? 20 : 28,
          zIndex: 950,
          appearance: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          width: isMobile ? 44 : undefined,
          height: isMobile ? 44 : 56,
          borderRadius: 9999,
          background:
            'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
          boxShadow: hovered
            ? '0 0 40px rgba(0,188,212,0.6), 0 8px 24px rgba(0,188,212,0.3)'
            : '0 2px 12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,188,212,0.2)',
          transition:
            'box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1), transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          overflow: 'hidden',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Icon slot — perfect circle on mobile (44×44), full pill height
            on desktop (56×56). */}
        <span
          aria-hidden
          style={{
            width: isMobile ? 44 : 56,
            height: isMobile ? 44 : 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#0D1117',
          }}
        >
          <svg
            width={isMobile ? 22 : 24}
            height={isMobile ? 22 : 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        {/* Label — desktop only (mobile is icon-only ball). Hover-reveal
            on desktop preserves the original interaction. */}
        {!isMobile && (
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 15,
              color: '#0D1117',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              maxWidth: hovered ? 140 : 0,
              opacity: hovered ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-width 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease',
              paddingRight: hovered ? 20 : 0,
            }}
          >
            Need help?
          </span>
        )}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="helpcenter-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 20 : 40,
            background: 'rgba(13,17,23,0.78)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: reduced
              ? 'none'
              : 'fadeScaleIn 0.3s cubic-bezier(0.23, 1, 0.32, 1) both',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              background: 'rgba(22,27,34,0.98)',
              border: '1px solid rgba(0,188,212,0.25)',
              borderRadius: 24,
              padding: isMobile ? 24 : 36,
              boxShadow:
                '0 0 60px rgba(0,188,212,0.15), 0 24px 64px rgba(0,0,0,0.6)',
              position: 'relative',
              animation: reduced
                ? 'none'
                : 'fadeScaleIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) both',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help center"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9999,
                color: '#CBD5E1',
                cursor: 'pointer',
                fontSize: 18,
                transition: 'all 0.3s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.1)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  '#F1F5F9'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.05)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  '#CBD5E1'
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Eyebrow */}
            <div
              style={{
                fontFamily: 'var(--font-data)',
                fontWeight: 700,
                fontSize: 11,
                color: '#00BCD4',
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                marginBottom: 12,
              }}
            >
              Legacy-Loop Help Center
            </div>

            {/* Title */}
            <h2
              id="helpcenter-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: isMobile ? 26 : 32,
                lineHeight: 1.15,
                color: '#F1F5F9',
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              How can we help?
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 15,
                color: '#94A3B8',
                lineHeight: 1.6,
                margin: '0 0 28px',
              }}
            >
              We&apos;re here for you. No question is too small, and every
              answer comes from a real human or our trained AI — whichever
              is faster.
            </p>

            {/* Action cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {actions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  target={action.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={action.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 18,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    textDecoration: 'none',
                    color: 'inherit',
                    minHeight: 72,
                    transition:
                      'background 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = `${action.accent}12`
                    el.style.borderColor = `${action.accent}55`
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'rgba(255,255,255,0.03)'
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${action.accent}14`,
                      border: `1px solid ${action.accent}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: 16,
                        color: '#F1F5F9',
                        marginBottom: 2,
                      }}
                    >
                      {action.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: '#94A3B8',
                        lineHeight: 1.4,
                      }}
                    >
                      {action.desc}
                    </div>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={action.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Senior-friendly footer note */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                margin: '24px 0 0',
                lineHeight: 1.55,
              }}
            >
              Prefer the phone? Leave a message at our help line and we&apos;ll
              call you back within one business day.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/* ==============================================
   PAGE COMPONENT — DEFAULT EXPORT
   ============================================== */
export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Section-aware intake: track which section is active so a blank-dropdown
  // submit can infer intent, and every POST carries `section` telemetry.
  const [activeSection, setActiveSection] = useState('hero')
  // Offering carried from a section CTA into the waitlist form.
  const [offeringIntent, setOfferingIntent] = useState<OfferingIntent | null>(null)

  useEffect(() => {
    const ids = ['hero', 'garage-sale', 'megabot', 'how-it-works', 'shipping', 'bots', 'pricing', 'estate', 'mission', 'download', 'waitlist']
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting section as active.
        let best: { id: string; ratio: number } | null = null
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) {
            best = { id: e.target.id, ratio: e.intersectionRatio }
          }
        }
        if (best) setActiveSection(best.id)
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // On touch devices: show IMMEDIATELY — framer-motion animations are unreliable
  // on iPad Safari/Chrome. Desktop: 3s delay for entrance animation.
  useEffect(() => {
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) {
      setIsLoaded(true)
      return
    }
    const timeout = setTimeout(() => setIsLoaded(true), 3000)
    return () => clearTimeout(timeout)
  }, [])

  // Lenis Smooth Scroll — desktop only.
  // Lenis breaks IntersectionObserver and scroll behavior on iPad/touch devices,
  // causing content to stay invisible. Use native scroll on touch devices.
  useEffect(() => {
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch) return // Native scroll works perfectly on touch devices

    // Inject Lenis CSS so scroll isn't blocked
    const style = document.createElement('style')
    style.textContent = `
      html.lenis, html.lenis body { height: auto; }
      .lenis.lenis-smooth { scroll-behavior: auto !important; }
      .lenis.lenis-smooth iframe { pointer-events: none; }
    `
    document.head.appendChild(style)

    let lenis: any
    let rafId: number
    ;(async () => {
      try {
        const Lenis = (await import('lenis')).default
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          autoRaf: false,
        })
        const raf = (time: number) => {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      } catch {
        // If Lenis fails, ensure native scroll works
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }
    })()
    return () => {
      if (lenis) lenis.destroy()
      if (rafId) cancelAnimationFrame(rafId)
      style.remove()
    }
  }, [])

  return (
    <>
      <Preloader isLoaded={isLoaded} />
      <CustomCursor />
      <GradientBackground />
      <NoiseOverlay />
      <StickyNav isLoaded={isLoaded} />
      <SectionNavigator isLoaded={isLoaded} />
      <HelpCenter />
      <main style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
        <HeroSection isLoaded={isLoaded} />
        <GarageSaleSection isLoaded={isLoaded} />
        <MarketplaceTicker />
        <MarketOpportunitySection />
        <MegaBotSection />
        <HowItWorksSection />
        <ShippingCenterSection />
        <ProductPreviewSection />
        <AIAgentsSection />
        <PricingSection setOfferingIntent={setOfferingIntent} />
        <EstateSection />
        <SocialProofSection />
        <TechSection />
        <AppDownloadSection />
        <VideoShowcaseSection />
        <WaitlistSection
          activeSection={activeSection}
          offeringIntent={offeringIntent}
          setOfferingIntent={setOfferingIntent}
        />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  )
}
