'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

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
      }}
    >
      <img
        src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png"
        alt="LegacyLoop"
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
    const mq = window.matchMedia('(pointer: fine)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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
      style={style}
      onError={(e) => {
        ;(e.target as HTMLVideoElement).style.display = 'none'
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
        padding: 'clamp(18px, 3vw, 28px)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: visible
          ? hovered
            ? 'translateY(-4px)'
            : 'translateY(0) scale(1)'
          : 'translateY(28px) scale(0.97)',
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${delay}ms` : '0ms',
        boxShadow: hovered
          ? '0 0 30px rgba(0,188,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          : 'none',
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
  style: extraStyle,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  style?: React.CSSProperties
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
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
// Source: Premium SaaS sites — cycling word animation
function KineticHeadline({
  words,
  style: extraStyle,
}: {
  words: string[]
  style?: React.CSSProperties
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'top', height: '1.5em', lineHeight: 1.5, ...extraStyle }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
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
    { label: 'Join Waitlist', target: 'waitlist' },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(0,188,212,0.08)'
            : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
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
            alt="LegacyLoop"
            style={{
              height: isTablet ? 36 : 48,
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Center — Nav Links (desktop + tablet) */}
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isTablet ? 12 : 32,
              }}
            >
              {navLinks.map((link) => (
                <span
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: isTablet ? 12 : 14,
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

          {/* Right — Login + CTA */}
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
              href="https://app.legacy-loop.com/auth/signup"
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
            {isMobile && (
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

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'rgba(13,17,23,0.97)',
            backdropFilter: 'blur(24px)',
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
    { id: 'megabot', label: 'MegaBot', icon: '◆' },
    { id: 'how-it-works', label: 'How It Works', icon: '◆' },
    { id: 'shipping', label: 'Shipping', icon: '◆' },
    { id: 'bots', label: 'AI Bots', icon: '◆' },
    { id: 'pricing', label: 'Pricing', icon: '◆' },
    { id: 'estate', label: 'Estates', icon: '◆' },
    { id: 'waitlist', label: 'Join', icon: '◆' },
  ]

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
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
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

  // ── DESKTOP: side dots ──
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 0,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Scroll progress line */}
      <div
        style={{
          position: 'absolute',
          right: 7,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 1,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: progressHeight,
            background: 'linear-gradient(180deg, #00BCD4, #009688)',
            borderRadius: 1,
          }}
        />
      </div>

      {sections.map((section, i) => {
        const isActive = activeSection === section.id
        return (
          <div
            key={section.id}
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '8px 0',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Label — reveals on hover */}
            <div
              style={{
                overflow: 'hidden',
                maxWidth: isHovered ? 140 : 0,
                opacity: isHovered ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-data)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: isActive ? '#00BCD4' : '#6B7280',
                  transition: 'color 0.3s ease',
                  paddingRight: 6,
                }}
              >
                {section.label}
              </span>
            </div>

            {/* Dot */}
            <div
              style={{
                width: isActive ? 16 : 8,
                height: isActive ? 16 : 8,
                borderRadius: '50%',
                background: isActive
                  ? 'linear-gradient(135deg, #00BCD4, #009688)'
                  : 'rgba(255,255,255,0.15)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isActive
                  ? '0 0 12px rgba(0,188,212,0.4), 0 0 4px rgba(0,188,212,0.2)'
                  : 'none',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                flexShrink: 0,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ---------- HERO SECTION ----------
function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  const width = useWindowWidth()
  const reduced = useReducedMotion()

  return (
    <section
      id="hero"
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
      {/* Video Background */}
      <AutoPlayVideo
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.12,
          zIndex: 0,
        }}
        sources={[
          { src: '/hero-loop.webm', type: 'video/webm' },
          { src: '/hero-loop.mp4', type: 'video/mp4' },
        ]}
      />

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
          alt="LegacyLoop — Connecting Generations"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{
            maxWidth: width < 480 ? 220 : 300,
            objectFit: 'contain',
            marginBottom: 24,
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
          <MagneticButton href="https://app.legacy-loop.com/auth/signup">
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

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          animation: 'scrollBounce 2s ease-in-out infinite',
          opacity: 0.5,
          zIndex: 5,
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
      </div>
    </section>
  )
}

// ---------- MARKETPLACE TICKER ----------
function MarketplaceTicker() {
  const width = useWindowWidth()
  const platforms = [
    'eBay',
    'Mercari',
    'Poshmark',
    'OfferUp',
    'Etsy',
    'Facebook Marketplace',
    'Craigslist',
    'Instagram',
    'Amazon',
    'TikTok Shop',
    'Reverb',
    'Pinterest',
    'Depop',
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

// ---------- MARKET OPPORTUNITY ----------
function MarketOpportunitySection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const cols = width < 768 ? '1fr' : 'repeat(3, 1fr)'

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionEyebrow text="THE OPPORTUNITY" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
            marginTop: 48,
          }}
        >
          {[
            {
              target: 10000,
              suffix: '+',
              label: 'Americans turn 65 every day',
            },
            {
              prefix: '$',
              target: 48,
              suffix: 'B',
              label: 'Estate and resale market',
            },
            {
              target: 76,
              suffix: '%',
              label: 'Of sellers say pricing is their biggest frustration',
            },
          ].map((stat, i) => (
            <GlowCard key={i} delay={i * 80}>
              <div style={{ textAlign: 'center' }}>
                <AnimatedStat
                  target={stat.target}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix}
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                    fontSize: 'clamp(36px, 5vw, 48px)',
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#CBD5E1',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </GlowCard>
          ))}
        </div>

        <ScrollRevealText
          text="Managing an estate should not require becoming an eBay expert. LegacyLoop was built for this moment."
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

// ---------- MEGABOT SECTION ----------
function MegaBotSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const cols = width < 768 ? '1fr' : 'repeat(2, 1fr)'
  const [fillActive, setFillActive] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
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
      detail: 'Sees 48+ attributes from a single photo',
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
      id="megabot"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Subtle purple ambient glow for MegaBot section */}
      <div
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
        }}
      />
      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionEyebrow text="THE CROWN JEWEL" color="#8B5CF6" />
        <SectionHeading>
          Four AI Engines. <GradientText>One Fair Price.</GradientText>
        </SectionHeading>
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
          simultaneously. When 4 AIs agree on your item&apos;s value, you can trust
          the number.
        </p>

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
            87% Average AI Agreement
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
                width: fillActive ? '87%' : '0%',
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
            Cost per 4-AI analysis: less than a cup of coffee. Margin: 85%+
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
  const steps = [
    {
      num: 1,
      emoji: '📷',
      title: 'Upload a Photo',
      desc: 'Snap a pic. Our AI handles the rest.',
    },
    {
      num: 2,
      emoji: '🧠',
      title: 'AI Analysis & Pricing',
      desc: '10 AI bots analyze your item. MegaBot confirms the price.',
    },
    {
      num: 3,
      emoji: '📣',
      title: 'List & Match Buyers',
      desc: 'One click. 13 platforms. AI finds your buyers.',
    },
    {
      num: 4,
      emoji: '📦',
      title: 'Ship & Get Paid',
      desc: 'AI Shipping Center picks the best carrier. Print a label. Get paid.',
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
        <SectionEyebrow text="THE PROCESS" />
        <SectionHeading>From Photo to Sold in Four Steps</SectionHeading>

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

  const carriers = [
    { name: 'USPS', emoji: '📬' },
    { name: 'UPS', emoji: '📦' },
    { name: 'FedEx', emoji: '🚚' },
    { name: 'DHL', emoji: '✈️' },
    { name: 'Arta', emoji: '🎨' },
  ]

  const features = [
    { emoji: '🤖', title: 'AI Rate Optimization', desc: 'Instantly compares carriers and selects the cheapest, fastest option for every shipment.' },
    { emoji: '📐', title: 'Parcel + LTL Freight', desc: 'From a vintage watch to a full dining set — small parcels and large freight handled seamlessly.' },
    { emoji: '🏠', title: 'Local Pickup', desc: 'Coordinate local buyer pickup with built-in scheduling. No shipping needed.' },
    { emoji: '🎩', title: 'White-Glove Delivery', desc: 'Arta fine art and specialty logistics for high-value antiques and collectibles.' },
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
          AI Shipping Center.{' '}
          <GradientText>Every Carrier. One Click.</GradientText>
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
          A full Transportation Management System built right into the platform.
          Compare rates, print labels, and track shipments — without leaving LegacyLoop.
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
      alt: 'LegacyLoop Dashboard — item management and AI analysis overview',
      transform: noTransform
        ? 'none'
        : 'perspective(1200px) rotateY(8deg) rotateX(2deg) scale(0.92)',
      zIndex: 1,
    },
    {
      src: '/images/screenshots/app-screenshot-03.png',
      alt: 'LegacyLoop AI Bot Results — detailed item valuation and pricing',
      transform: noTransform ? 'none' : 'scale(1.02)',
      zIndex: 2,
    },
    {
      src: '/images/screenshots/app-screenshot-05.png',
      alt: 'LegacyLoop Listing Manager — multi-platform listing creation',
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
        <SectionHeading>See It In Action</SectionHeading>
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
          Real screenshots from the live LegacyLoop platform. Every feature you
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
      desc: '48+ attributes from one photo',
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
      desc: 'Listings for 13 platforms',
      tier: 'DIY+',
      tierColor: '#22C55E',
      tierBg: 'rgba(34,197,94,0.15)',
    },
    {
      emoji: '🎯',
      name: 'BuyerBot',
      desc: '6-12 buyer profiles before you list',
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
      desc: 'Never undersell a family heirloom',
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
      desc: 'Instant alerts for items worth $500+',
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
        <SectionEyebrow text="YOUR AI TEAM" />
        <SectionHeading>
          Ten Specialized AI Bots.{' '}
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
          MegaBot powers them all — our 4-engine consensus system that ensures
          every valuation is fair.
        </p>

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

// ---------- PRICING ----------
function PricingSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const [isAnnual, setIsAnnual] = useState(false)
  const cols =
    width >= 1200
      ? 'repeat(4, 1fr)'
      : width >= 640
        ? 'repeat(2, 1fr)'
        : '1fr'

  const tiers = [
    {
      name: 'FREE',
      slug: 'free',
      monthlyPrice: 0,
      annualPrice: 0,
      oldMonthly: null as string | null,
      commission: '12%',
      features: ['Basic AI identification', 'Public store page', 'Email support'],
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'DIY SELLER',
      slug: 'diy',
      monthlyPrice: 10,
      annualPrice: 100,
      oldMonthly: '$20',
      commission: '8%',
      features: ['Enhanced AI pricing', '5 core bots included', '20 credits/month included', 'BuyerBot matching', 'Priority email support'],
      cta: 'Start Selling',
      highlight: false,
    },
    {
      name: 'POWER SELLER',
      slug: 'power',
      monthlyPrice: 25,
      annualPrice: 250,
      oldMonthly: '$49',
      commission: '5%',
      features: ['MegaBot (credit-based)', 'All specialty bots', '50 credits/month included', 'Advanced analytics', 'Phone support'],
      cta: 'Go Pro',
      highlight: true,
    },
    {
      name: 'ESTATE MANAGER',
      slug: 'estate',
      monthlyPrice: 75,
      annualPrice: 750,
      oldMonthly: '$99',
      commission: '4%',
      features: ['All bots including CarBot', '100 credits/month included', 'White-label store', 'Dedicated account manager', 'API access'],
      cta: 'Manage Estates',
      highlight: false,
    },
  ]

  return (
    <section
      id="pricing"
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionEyebrow text="SIMPLE HONEST PRICING" />
        <SectionHeading>Simple, Honest Pricing</SectionHeading>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          1.75% buyer + 1.75% seller = 3.5% total on sales. Subscriptions = 0% processing. Always transparent.
        </p>

        {/* Monthly / Annual Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: isAnnual ? 400 : 600,
              fontSize: 15,
              color: isAnnual ? '#6B7280' : '#F1F5F9',
              transition: 'all 0.3s ease',
            }}
          >
            Monthly
          </span>
          <div
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: 56,
              height: 30,
              borderRadius: 15,
              background: isAnnual
                ? 'linear-gradient(135deg, #00BCD4, #009688)'
                : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s ease',
              border: isAnnual
                ? '1px solid rgba(0,188,212,0.5)'
                : '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: isAnnual ? 28 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#FFFFFF',
                transition: 'left 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: isAnnual ? 600 : 400,
              fontSize: 15,
              color: isAnnual ? '#F1F5F9' : '#6B7280',
              transition: 'all 0.3s ease',
            }}
          >
            Annual
          </span>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 11,
              background: 'rgba(0,188,212,0.15)',
              color: '#00BCD4',
              padding: '4px 10px',
              borderRadius: 20,
              letterSpacing: '0.05em',
              opacity: isAnnual ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            SAVE 20%
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
            alignItems: 'start',
          }}
        >
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${tier.highlight ? 'rgba(0,188,212,0.4)' : 'rgba(0,188,212,0.15)'}`,
                borderRadius: 16,
                backdropFilter: 'blur(12px)',
                padding: '32px 24px 28px',
                transform: tier.highlight && width >= 1200 ? 'scale(1.03)' : 'none',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {tier.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    background: '#00BCD4',
                    color: '#0D1117',
                    padding: '4px 12px',
                    borderRadius: '0 0 8px 8px',
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  color: '#F1F5F9',
                }}
              >
                {tier.name}
              </div>

              <div>
                {tier.monthlyPrice > 0 && (
                  <s
                    style={{
                      color: '#6B7280',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      marginRight: 8,
                    }}
                  >
                    {isAnnual ? `$${tier.monthlyPrice}` : tier.oldMonthly}
                  </s>
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 700,
                    fontSize: 36,
                    background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ${isAnnual ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: '#94A3B8',
                  }}
                >
                  /mo
                </span>
                {isAnnual && tier.annualPrice > 0 && (
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: '#6B7280',
                      marginTop: 4,
                    }}
                  >
                    ${tier.annualPrice}/yr billed annually
                  </div>
                )}
              </div>

              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  fontSize: 13,
                  background: 'rgba(0,188,212,0.1)',
                  color: '#00BCD4',
                  padding: '4px 10px',
                  borderRadius: 6,
                  alignSelf: 'flex-start',
                }}
              >
                {tier.commission} commission
              </span>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  flex: 1,
                }}
              >
                {tier.features.map((feature) => (
                  <span
                    key={feature}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: '#CBD5E1',
                    }}
                  >
                    <span style={{ color: '#00BCD4', marginRight: 6 }}>✓</span>
                    {feature}
                  </span>
                ))}
              </div>

              <a
                href={`https://app.legacy-loop.com/auth/signup?tier=${tier.slug}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 44,
                  borderRadius: 12,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ...(tier.name === 'FREE'
                    ? {
                        background: 'transparent',
                        border: '1px solid rgba(0,188,212,0.4)',
                        color: '#00BCD4',
                      }
                    : {
                        background: 'linear-gradient(135deg, #00bcd4, #009688)',
                        border: '1px solid transparent',
                        color: '#fff',
                        boxShadow:
                          '0 0 20px rgba(0,188,212,0.2), 0 2px 8px rgba(0,188,212,0.15)',
                      }),
                }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table — horizontally scrollable on mobile */}
        <div
          style={{
            marginTop: 64,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,188,212,0.15)',
            borderRadius: 16,
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: width < 640 ? 580 : 'auto' }}>
              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr',
                  padding: width < 480 ? '12px 14px' : '16px 20px',
                  borderBottom: '1px solid rgba(0,188,212,0.15)',
                  background: 'rgba(0,188,212,0.05)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 11, color: '#00BCD4', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Feature</span>
                {['Free', 'DIY Seller', 'Power Seller', 'Estate Manager'].map((h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: width < 480 ? 10 : 11, color: '#00BCD4', textTransform: 'uppercase' as const, letterSpacing: '0.1em', textAlign: 'center' }}>{h}</span>
                ))}
              </div>
              {/* Table Rows */}
              {[
                { feature: 'AI Item Analysis', free: 'Limited', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'PriceBot', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'PhotoBot', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'DescriptionBot', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'BuyerBot', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'ShippingBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'ReconBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'AntiqueBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'CollectiblesBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'NegotiationBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'CrossListBot', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'CarBot', free: '—', diy: '—', power: '—', estate: '✓' },
                { feature: 'MegaBot (All-in-One)', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'Monthly Credits', free: '—', diy: '20/mo', power: '50/mo', estate: '100/mo' },
                { feature: 'Active Items', free: '3', diy: '25', power: '100', estate: 'Unlimited' },
                { feature: 'Photos Per Item', free: '2', diy: '5', power: '8', estate: '15' },
                { feature: 'Commission', free: '12%', diy: '8%', power: '5%', estate: '4%' },
                { feature: 'Public Store Page', free: '✓', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'Custom Store Branding', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'White-Label Store', free: '—', diy: '—', power: '—', estate: '✓' },
                { feature: 'Advanced Analytics', free: '—', diy: '—', power: '✓', estate: '✓' },
                { feature: 'Garage Sale Network', free: 'Browse', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'Neighborhood Sale Events', free: '—', diy: '✓', power: '✓', estate: '✓' },
                { feature: 'Estate Sale Events', free: '—', diy: '—', power: '—', estate: '✓' },
                { feature: 'API Access', free: '—', diy: '—', power: '—', estate: '✓' },
                { feature: 'Dedicated Account Manager', free: '—', diy: '—', power: '—', estate: '✓' },
              ].map((row, i) => (
                <div
                  key={row.feature}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr',
                    padding: width < 480 ? '10px 14px' : '12px 20px',
                    borderBottom: i < 25 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,188,212,0.04)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: width < 480 ? 12 : 14, color: '#CBD5E1', fontWeight: 500, whiteSpace: 'nowrap' }}>{row.feature}</span>
                  {[row.free, row.diy, row.power, row.estate].map((val, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: width < 480 ? 12 : 14,
                        textAlign: 'center',
                        color: val === '✓' ? '#00BCD4' : val === '—' ? '#4B5563' : '#CBD5E1',
                        fontWeight: val === '✓' ? 600 : 400,
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Scroll hint on mobile */}
          {width < 640 && (
            <div style={{ padding: '8px 20px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#6B7280' }}>← Swipe to see all tiers →</span>
            </div>
          )}
        </div>

        {/* Credit Packs */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 40,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#94A3B8',
          }}
        >
          <span style={{ fontWeight: 500 }}>AI Credit Packs:</span> $25 / 30
          credits &bull; $50 / 65 credits &bull; $100 / 140 credits &bull; $200
          / 300 credits
        </div>
        <p
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#94A3B8',
          }}
        >
          First AI analysis is always free. 10 free credits when you sign up. Credits &amp; add-ons: 3.5% processing.
        </p>
      </div>
    </section>
  )
}

// ---------- BUILT FOR ESTATES ----------
function EstateSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const [activeTab, setActiveTab] = useState<'whiteglove' | 'estatecare' | 'neighborhood'>('whiteglove')

  const features = [
    { emoji: '🏺', text: 'Antique detection that prevents underselling heirlooms' },
    { emoji: '🌐', text: 'Post your entire estate to 13 platforms in one click' },
    { emoji: '💬', text: 'AI Messaging Agent handles buyer conversations for you' },
    { emoji: '🚚', text: 'AI Shipping Center — USPS, UPS, FedEx, DHL, Arta white-glove. Parcel, LTL freight, and local pickup' },
  ]

  const whiteGloveTiers = [
    {
      name: 'Estate Essentials',
      price: '$1,750',
      oldPrice: '$2,500',
      commission: '25% commission',
      features: ['Item photography', 'AI listing creation', 'Buyer outreach', 'Shipping coordination', 'Donation management'],
    },
    {
      name: 'Estate Professional',
      price: '$3,500',
      oldPrice: '$5,000',
      commission: '30% commission',
      features: ['Everything in Essentials', 'Buyer negotiation', 'Premium listing placement', 'Dedicated estate manager', 'Full reporting'],
      recommended: true,
    },
    {
      name: 'Estate Legacy',
      price: '$7,000',
      oldPrice: '$10,000',
      commission: '35% commission',
      features: ['Everything in Professional', 'White-glove concierge', 'Family coordination tools', 'Archive and documentation', 'Priority support'],
    },
  ]

  const neighborhoodFeatures = [
    { col: 'left', items: ['On-site planning with all families', 'AI pricing for all items', 'Custom event flyer (digital + print-ready)', 'Email campaign to local buyers', 'Individual family sales reports'] },
    { col: 'right', items: ['Professional photography (all items)', 'Unified public sale page', 'Social media graphics', 'Day-of coordination materials', 'Donation coordination (shared pickup)'] },
  ]

  const tabStyle = (isActive: boolean) => ({
    fontFamily: 'var(--font-heading)',
    fontWeight: 600 as const,
    fontSize: 14,
    padding: '10px 24px',
    borderRadius: 24,
    border: 'none',
    cursor: 'pointer' as const,
    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    background: isActive ? 'linear-gradient(135deg, #D4A017, #B8860B)' : 'transparent',
    color: isActive ? '#0D1117' : '#94A3B8',
    letterSpacing: '0.02em',
  })

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
      id="estate"
    >
      {/* Warm background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/estate/generations-hands.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          zIndex: 0,
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

      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionEyebrow text="FOR FAMILIES & COMMUNITIES" color="#D4A017" />
        <SectionHeading>Selling Should Not Add to the Grief.</SectionHeading>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            maxWidth: 640,
            margin: '0 auto 48px',
            textAlign: 'center',
            lineHeight: 1.75,
          }}
        >
          When a loved one passes, families face an overwhelming task — hundreds
          of items, emotional weight, and no idea what anything is worth.
          LegacyLoop was built for this moment.
        </p>

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

          {!isMobile && !isTablet && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/estate/senior-tablet.png"
                alt="Senior woman using LegacyLoop on a tablet to manage estate items"
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
          )}
        </div>

        {/* Services Tab Toggle */}
        <div style={{ marginTop: 80, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              gap: 4,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,160,23,0.15)',
              borderRadius: 28,
              padding: 4,
              marginBottom: 48,
            }}
          >
            <button
              onClick={() => setActiveTab('whiteglove')}
              style={tabStyle(activeTab === 'whiteglove')}
            >
              White Glove
            </button>
            <button
              onClick={() => setActiveTab('estatecare')}
              style={tabStyle(activeTab === 'estatecare')}
            >
              Estate Care
            </button>
            <button
              onClick={() => setActiveTab('neighborhood')}
              style={tabStyle(activeTab === 'neighborhood')}
            >
              Neighborhood Bundle
            </button>
          </div>
        </div>

        {/* Pre-Launch Banner */}
        <div
          style={{
            background: 'rgba(212,160,23,0.06)',
            border: '1px solid rgba(212,160,23,0.2)',
            borderRadius: 12,
            padding: '14px 24px',
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 15,
              color: '#D4A017',
              margin: 0,
            }}
          >
            Pre-Launch Pricing Active — Founding clients receive discounted rates locked in at launch price.
          </p>
        </div>

        {/* White Glove Tab */}
        {activeTab === 'whiteglove' && (
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 22,
                color: '#D4A017',
                textAlign: 'center',
                marginBottom: 32,
              }}
            >
              White-Glove Estate Services
            </h3>
            <div
              style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: 'column',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 20,
              }}
            >
              {whiteGloveTiers.map((tier) => (
                <GlowCard
                  key={tier.name}
                  defaultBorderColor={tier.recommended ? 'rgba(212,160,23,0.4)' : 'rgba(212,160,23,0.2)'}
                  hoverBorderColor="rgba(212,160,23,0.5)"
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    transform: tier.recommended && width >= 1024 ? 'scale(1.03)' : 'none',
                  }}
                >
                  {tier.recommended && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-data)',
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.05em',
                        background: '#D4A017',
                        color: '#0D1117',
                        padding: '4px 12px',
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      RECOMMENDED
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: 17,
                      color: '#F1F5F9',
                      marginBottom: 12,
                      marginTop: tier.recommended ? 8 : 0,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontWeight: 700,
                        fontSize: 32,
                        background: 'linear-gradient(135deg, #D4A017, #FFFFFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {tier.price}
                    </span>
                    {tier.oldPrice && (
                      <s
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          color: '#6B7280',
                        }}
                      >
                        {tier.oldPrice}
                      </s>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: '#94A3B8',
                      marginTop: 4,
                      marginBottom: 16,
                    }}
                  >
                    {tier.commission}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                    {tier.features.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: '#CBD5E1',
                        }}
                      >
                        <span style={{ color: '#D4A017', marginRight: 6 }}>&#10003;</span>
                        {f}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* Estate Care Tab */}
        {activeTab === 'estatecare' && (
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 22,
                color: '#D4A017',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Estate Care — Self-Service Tools
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: '#94A3B8',
                textAlign: 'center',
                maxWidth: 540,
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}
            >
              For families who want to manage the process themselves with AI-powered tools and guidance at every step.
            </p>
            <div
              style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: 'column',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 20,
              }}
            >
              {[
                {
                  name: 'Estate Starter',
                  slug: 'estate-starter',
                  price: '$75',
                  period: '/mo',
                  features: ['Up to 50 active items', 'AI identification & pricing', 'Multi-platform crosslisting', 'Basic shipping tools', 'Community support'],
                },
                {
                  name: 'Estate Plus',
                  slug: 'estate-plus',
                  price: '$150',
                  period: '/mo',
                  features: ['Up to 200 active items', 'Priority AI processing', 'Advanced analytics dashboard', 'BuyerBot & NegotiationBot', 'Phone & email support'],
                  recommended: true,
                },
                {
                  name: 'Estate Unlimited',
                  slug: 'estate-unlimited',
                  price: '$299',
                  period: '/mo',
                  features: ['Unlimited active items', 'All bots including CarBot', 'White-label store', 'API access & integrations', 'Dedicated support line'],
                },
              ].map((tier) => (
                <GlowCard
                  key={tier.name}
                  defaultBorderColor={(tier as { recommended?: boolean }).recommended ? 'rgba(212,160,23,0.4)' : 'rgba(212,160,23,0.2)'}
                  hoverBorderColor="rgba(212,160,23,0.5)"
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    transform: (tier as { recommended?: boolean }).recommended && width >= 1024 ? 'scale(1.03)' : 'none',
                  }}
                >
                  {(tier as { recommended?: boolean }).recommended && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-data)',
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.05em',
                        background: '#D4A017',
                        color: '#0D1117',
                        padding: '4px 12px',
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      BEST VALUE
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: 17,
                      color: '#F1F5F9',
                      marginBottom: 12,
                      marginTop: (tier as { recommended?: boolean }).recommended ? 8 : 0,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontWeight: 700,
                        fontSize: 32,
                        background: 'linear-gradient(135deg, #D4A017, #FFFFFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {tier.price}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8' }}>
                      {tier.period}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', marginTop: 16 }}>
                    {tier.features.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: '#CBD5E1',
                        }}
                      >
                        <span style={{ color: '#D4A017', marginRight: 6 }}>&#10003;</span>
                        {f}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`https://app.legacy-loop.com/auth/signup?tier=${tier.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 44,
                      borderRadius: 12,
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      marginTop: 20,
                      background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                      color: '#0D1117',
                      border: '1px solid transparent',
                      boxShadow: '0 0 20px rgba(212,160,23,0.15), 0 2px 8px rgba(212,160,23,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started
                  </a>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* Neighborhood Bundle Tab */}
        {activeTab === 'neighborhood' && (
          <div>
            <div
              style={{
                display: (isMobile || isTablet) ? 'flex' : 'grid',
                flexDirection: 'column',
                gridTemplateColumns: (isMobile || isTablet) ? '1fr' : '1fr 380px',
                gap: 32,
                alignItems: 'start',
              }}
            >
              <GlowCard
                defaultBorderColor="rgba(212,160,23,0.2)"
                hoverBorderColor="rgba(212,160,23,0.4)"
                style={{ padding: '32px 28px' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.15em',
                    color: '#D4A017',
                    marginBottom: 8,
                  }}
                >
                  COMMUNITY SALE PROGRAM
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 24,
                    color: '#F1F5F9',
                    marginBottom: 16,
                  }}
                >
                  Neighborhood Bundle
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontWeight: 700,
                      fontSize: 40,
                      background: 'linear-gradient(135deg, #D4A017, #FFFFFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    $239
                  </span>
                  <s style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#6B7280' }}>$399</s>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: '#CBD5E1',
                    marginBottom: 2,
                  }}
                >
                  20% commission on sales
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#94A3B8',
                    marginBottom: 24,
                  }}
                >
                  2&ndash;8 families per bundle
                </p>

                {/* Two-column feature list */}
                <div
                  style={{
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: 'column',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 6 : 16,
                  }}
                >
                  {neighborhoodFeatures.map((col) => (
                    <div key={col.col} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {col.items.map((item) => (
                        <span
                          key={item}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            color: '#CBD5E1',
                          }}
                        >
                          <span style={{ color: '#D4A017', marginRight: 6 }}>&#10003;</span>
                          {item}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Additional families callout */}
                <div
                  style={{
                    marginTop: 24,
                    background: 'rgba(212,160,23,0.06)',
                    border: '1px solid rgba(212,160,23,0.15)',
                    borderRadius: 10,
                    padding: '12px 16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: '#CBD5E1',
                    }}
                  >
                    Additional families:{' '}
                    <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: '#D4A017' }}>
                      $89/family
                    </span>
                    {' '}
                    <s style={{ fontSize: 13, color: '#6B7280' }}>$149</s>
                  </span>
                </div>

                {/* CTA */}
                <a
                  href="https://app.legacy-loop.com/auth/signup?tier=neighborhood-bundle"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                    borderRadius: 12,
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    marginTop: 24,
                    background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                    color: '#0D1117',
                    border: '1px solid transparent',
                    boxShadow: '0 0 20px rgba(212,160,23,0.15), 0 2px 8px rgba(212,160,23,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Start a Neighborhood Bundle
                </a>
              </GlowCard>

              {/* Garage sale image */}
              {!isMobile && !isTablet && (
                <div style={{ position: 'sticky', top: 100 }}>
                  <img
                    src="/images/garage/garage-sale.png"
                    alt="Organized neighborhood garage sale with electronics, vintage finds, and clothing"
                    loading="lazy"
                    style={{
                      width: '100%',
                      borderRadius: 16,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(212,160,23,0.08)',
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <img
                    src="/images/garage/family-garage.png"
                    alt="Family using LegacyLoop to manage their garage sale"
                    loading="lazy"
                    style={{
                      width: '100%',
                      borderRadius: 16,
                      marginTop: 16,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(212,160,23,0.08)',
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
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
          target={47}
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
          Beta signups and counting
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
            Pre-Launch Pricing: 47 of 100 early access spots remaining
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
                width: barActive ? '47%' : '0%',
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
  const cols = width < 640 ? '1fr' : 'repeat(2, 1fr)'

  const items = [
    {
      emoji: '⚡',
      title: 'Next.js',
      desc: 'React framework trusted by Netflix, TikTok, Notion',
    },
    {
      emoji: '🔷',
      title: 'TypeScript',
      desc: '85+ routes. Zero type errors. Type-safe end to end.',
    },
    {
      emoji: '🤖',
      title: 'Real AI APIs',
      desc: 'Every analysis is live AI. No fake data. No demos.',
    },
    {
      emoji: '📦',
      title: 'AI Shipping Center',
      desc: 'Full TMS — USPS, UPS, FedEx, DHL, Arta. Parcel, LTL freight, local pickup.',
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
        <SectionEyebrow text="THE INFRASTRUCTURE" />
        <SectionHeading>Enterprise-Grade. Built to Scale.</SectionHeading>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 20,
            marginTop: 48,
          }}
        >
          {items.map((item, i) => (
            <GlowCard key={item.title} delay={i * 80}>
              <span style={{ fontSize: 24 }}>{item.emoji}</span>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 18,
                  color: '#F1F5F9',
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
                  color: '#CBD5E1',
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
          text="10 AI bots. 4 consensus engines. One AI Shipping Center. Every tool you need — in one platform."
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

  return (
    <>
      {/* PART 1 — Cinematic video hero with headline overlay */}
      <section
        id="showcase"
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
        {/* Full-bleed video background */}
        <AutoPlayVideo
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
            zIndex: 0,
          }}
          sources={[
            { src: '/Legacy_Loop_Hero_Video_Connecting_Generations.mp4', type: 'video/mp4' },
          ]}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(13,17,23,0.6) 0%, rgba(13,17,23,0.3) 35%, rgba(13,17,23,0.3) 65%, rgba(13,17,23,0.7) 100%)',
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
            Built with Purpose. <GradientText>Powered by AI.</GradientText>
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
            LegacyLoop connects generations through technology built with heart.
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

          {/* Mission Statement — the heart of LegacyLoop */}
          <div
            style={{
              maxWidth: 800,
              margin: '0 auto',
              textAlign: 'center',
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
              LegacyLoop was built to honor something bigger than profit.
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
                { icon: '🎖️', title: 'Veterans First', desc: '25% off subscriptions, 20% off white-glove, 25% reduced commissions. A portion of our success funds veteran housing.' },
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
  const isMobile = width < 768

  const [detectedPlatform, setDetectedPlatform] = useState<string>('WebApp')

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
  }, [])

  const installCards = [
    {
      platform: 'iOS',
      icon: '🍎',
      title: 'iPhone & iPad',
      steps: ['Open legacy-loop.com in Safari', 'Tap the Share button', 'Select "Add to Home Screen"'],
    },
    {
      platform: 'Android',
      icon: '🤖',
      title: 'Android',
      steps: ['Open legacy-loop.com in Chrome', 'Tap the menu (⋮)', 'Select "Install App" or "Add to Home Screen"'],
    },
    {
      platform: 'Desktop',
      icon: '💻',
      title: 'Mac & PC',
      steps: ['Open legacy-loop.com in Chrome', 'Click the install icon in the address bar', 'Click "Install"'],
    },
  ]

  const isHighlighted = (platform: string) => platform === detectedPlatform

  return (
    <section
      style={{
        ...sp,
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SectionEyebrow text="GET THE APP" />
        <SectionHeading>
          Install LegacyLoop.{' '}
          <GradientText>No App Store Needed.</GradientText>
        </SectionHeading>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 17,
            color: '#CBD5E1',
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          LegacyLoop is a Progressive Web App — install it directly from your browser for a native app experience. No download required.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 20,
            marginBottom: 20,
          }}
        >
          {installCards.map((card, i) => (
            <GlowCard
              key={card.platform}
              delay={i * 100}
              style={isHighlighted(card.platform) ? {
                border: '1px solid rgba(0,188,212,0.4)',
                background: 'rgba(0,188,212,0.06)',
              } : undefined}
            >
              {isHighlighted(card.platform) && (
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: '#00BCD4',
                    background: 'rgba(0,188,212,0.15)',
                    padding: '3px 10px',
                    borderRadius: 10,
                    marginBottom: 8,
                    display: 'inline-block',
                  }}
                >
                  Detected: Your Platform
                </span>
              )}
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 18,
                  color: '#F1F5F9',
                  marginBottom: 16,
                }}
              >
                {card.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                        fontSize: 12,
                        color: '#0D1117',
                        background: '#00BCD4',
                        borderRadius: '50%',
                        width: 22,
                        height: 22,
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
                        fontSize: 14,
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
          ))}
        </div>

        {/* GAP A — Web App card (full width) */}
        <GlowCard
          delay={300}
          style={isHighlighted('WebApp') ? {
            border: '1px solid rgba(0,188,212,0.4)',
            background: 'rgba(0,188,212,0.06)',
            marginBottom: 48,
          } : { marginBottom: 48 }}
        >
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 24 }}>
            <div style={{ flex: 1 }}>
              {isHighlighted('WebApp') && (
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: '#00BCD4',
                    background: 'rgba(0,188,212,0.15)',
                    padding: '3px 10px',
                    borderRadius: 10,
                    marginBottom: 8,
                    display: 'inline-block',
                  }}
                >
                  Detected: Your Platform
                </span>
              )}
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌐</div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 18,
                  color: '#F1F5F9',
                  marginBottom: 8,
                }}
              >
                Web App — Open in Your Browser
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: '#CBD5E1',
                  lineHeight: 1.55,
                  marginBottom: 16,
                }}
              >
                No install required. Works on any device.
              </p>
              <a
                href="https://app.legacy-loop.com"
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '12px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #00bcd4, #009688)',
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(0,188,212,0.3)',
                }}
              >
                Open Web App →
              </a>
            </div>
          </div>
        </GlowCard>

        {/* GAP B — QR Code */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,188,212,0.15)',
            }}
          >
            <QRCodeSVG
              value="https://app.legacy-loop.com"
              size={200}
              bgColor="#0D1117"
              fgColor="#00BCD4"
              level="H"
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: '#CBD5E1',
            }}
          >
            Scan to open on your phone
          </span>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              fontSize: 13,
              color: '#00BCD4',
              letterSpacing: '0.05em',
            }}
          >
            app.legacy-loop.com
          </span>
        </div>

        {/* Senior-friendly help text */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: 480,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          Not sure how to install? It&apos;s simple — tap the button for your phone type and follow the steps. Need help? Email us at{' '}
          <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>
            support@legacy-loop.com
          </a>
        </p>

        {/* PWA features callout */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? 12 : 24,
          }}
        >
          {['Offline Access', 'Push Notifications', 'Home Screen Icon', 'Instant Updates'].map((feature) => (
            <span
              key={feature}
              style={{
                fontFamily: 'var(--font-data)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#00BCD4',
                background: 'rgba(0,188,212,0.08)',
                border: '1px solid rgba(0,188,212,0.2)',
                padding: '8px 16px',
                borderRadius: 20,
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- PRE-SALES WAITLIST + FOUNDING MEMBERS ----------
function WaitlistSection() {
  const width = useWindowWidth()
  const sp = useSectionPadding(width)
  const isMobile = width < 768
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || isSubmitting) return
    setIsSubmitting(true)
    try {
      await fetch('https://n8n.legacy-loop.com/webhook/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, timestamp: new Date().toISOString() }),
      }).catch(() => {})
    } catch {
      // Graceful degradation — still show success
    }
    // Brief delay for perceived quality
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false)
    setSubmitted(true)
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
          Lock in pre-launch pricing forever. Get priority access before public launch. Be part of LegacyLoop from day one.
        </p>

        {/* Founding spots counter — BIG number */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-data)',
              fontWeight: 800,
              fontSize: 'clamp(48px, 8vw, 64px)',
              background: 'linear-gradient(135deg, #00BCD4, #FFFFFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
            }}
          >
            153
          </span>
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
          of 200 founding spots remaining
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
          Spots are filling fast
        </p>

        {/* Progress bar — 47 of 200 = 23.5% filled */}
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.06)',
            margin: '0 auto 40px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '23.5%',
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00BCD4, #009688)',
            }}
          />
        </div>

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
              You&apos;re in. Welcome to LegacyLoop.
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
              Your founding member rate is locked. Check your inbox — we&apos;ll be in touch soon.
            </p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just locked in founding member pricing at @LegacyLoopApp — AI-powered resale for the next generation. Join early: https://legacy-loop.com')}`}
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
        ) : (
          /* ===== FORM ===== */
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
                type="email"
                placeholder="your@email.com"
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
          </form>
        )}

        {/* B5 — Trust signals row */}
        {!submitted && (
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
        {!submitted && (
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

      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <SectionHeading
          style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
          }}
        >
          Your Items Have Value.{' '}
          <GradientText>We Help You Prove It.</GradientText>
        </SectionHeading>
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

        <MagneticButton href="https://app.legacy-loop.com/auth/signup">
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
          153 founding spots remaining — join before they&apos;re gone
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
                alt="LegacyLoop"
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
              <a href="https://app.legacy-loop.com/auth/signup" style={linkStyle}
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
              &copy; 2026 LegacyLoop Tech LLC. All rights reserved.
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
   PAGE COMPONENT — DEFAULT EXPORT
   ============================================== */
export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Hard 3-second timeout — page MUST be visible within 3s on any device
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 3000)
    return () => clearTimeout(timeout)
  }, [])

  // Lenis Smooth Scroll — inject CSS + init with error fallback
  useEffect(() => {
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
      <main style={{ position: 'relative', zIndex: 5, background: 'transparent' }}>
        <HeroSection isLoaded={isLoaded} />
        <MarketplaceTicker />
        <MarketOpportunitySection />
        <MegaBotSection />
        <HowItWorksSection />
        <ShippingCenterSection />
        <ProductPreviewSection />
        <AIAgentsSection />
        <PricingSection />
        <EstateSection />
        <SocialProofSection />
        <TechSection />
        <AppDownloadSection />
        <VideoShowcaseSection />
        <WaitlistSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  )
}
