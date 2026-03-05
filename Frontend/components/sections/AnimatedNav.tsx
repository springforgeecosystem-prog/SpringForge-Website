'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from 'framer-motion'
import type { AnimationPlaybackControls } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

function SpinningLogo({ reduceMotion }: { reduceMotion: boolean | null }) {
  const rotate     = useMotionValue(0)
  const isHovering = useRef(false)
  const animRef    = useRef<AnimationPlaybackControls | null>(null)

  function runLoop() {
    if (!isHovering.current) return
    // Normalize accumulated rotation before each loop to stay near 0–360
    const cur = rotate.get() % 360
    rotate.set(cur)
    animRef.current = animate(rotate, cur + 360, {
      duration: 1.0,
      ease: 'linear',
      onComplete: runLoop,
    })
  }

  function onHoverStart() {
    if (reduceMotion) return
    isHovering.current = true
    runLoop()
  }

  function onHoverEnd() {
    if (reduceMotion) return
    isHovering.current = false
    animRef.current?.stop()

    // Smoothly complete the current rotation instead of snapping back
    const cur   = rotate.get()
    const remaining = 360 - (cur % 360)
    animRef.current = animate(rotate, cur + remaining, {
      // Duration proportional to how much is left — feels natural
      duration: (remaining / 360) * 0.55,
      ease: 'easeOut',
      onComplete: () => rotate.set(0),
    })
  }

  return (
    <motion.div
      className="shrink-0 select-none"
      style={{ rotate }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <Image src="/springforge.svg" alt="SpringForge" width={36} height={36} />
    </motion.div>
  )
}

export default function AnimatedNav() {
  const reduceMotion = useReducedMotion()
  const { scrollY }  = useScroll()

  const blurValue = useTransform(scrollY, [0, 80], [0, 12])
  const bgOpacity = useTransform(scrollY, [0, 80], [0.7, 0.97])
  const blurStyle = useTransform(blurValue, (v) => `blur(${v}px)`)
  const bgStyle   = useTransform(bgOpacity, (v) => `rgba(0,0,0,${v})`)

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-dark-border"
      initial={reduceMotion ? false : { y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      style={{ backdropFilter: blurStyle, backgroundColor: bgStyle }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <SpinningLogo reduceMotion={reduceMotion} />
          <span className="text-lg font-bold tracking-tight">
            Spring<span className="text-accent">Forge</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/#features"
            className="rounded-lg border border-dark-border px-4 py-2 text-sm font-medium text-content-secondary transition hover:border-accent hover:text-accent"
          >
            Features
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-dark-border px-4 py-2 text-sm font-medium text-content-secondary transition hover:border-accent hover:text-accent"
          >
            Documentation
          </Link>
          <Link
            href="/#download"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-dark"
          >
            Download
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
