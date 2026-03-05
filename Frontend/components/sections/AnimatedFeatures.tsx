'use client'

import { useRef } from 'react'
import PluginDemoAnimation from './PluginDemoAnimation'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { features } from '@/lib/data'

interface FeatureCardProps {
  icon: string
  title: string
  desc: string
  index: number
  reduceMotion: boolean | null
}

function FeatureCard({ icon, title, desc, index, reduceMotion }: FeatureCardProps) {
  const hoverProgress = useMotionValue(0)
  const iconY         = useMotionValue(0)
  const iconScale     = useMotionValue(1)

  const borderColor    = useTransform(hoverProgress, [0, 1], ['rgba(26,26,26,1)', 'rgba(0,255,170,0.3)'])
  const shimmerOpacity = useTransform(hoverProgress, [0, 1], [0, 1])

  function onHoverStart() {
    if (reduceMotion) return
    animate(hoverProgress, 1, { duration: 0.25 })
    // Cartoon bounce: jump up → squish on landing → small rebound → settle
    animate(iconY,     [0, -14, 0, -5, 0], { duration: 0.5, ease: 'easeInOut' })
    animate(iconScale, [1, 1.2, 0.85, 1.08, 1.0], { duration: 0.5 })
  }

  function onHoverEnd() {
    animate(hoverProgress, 0, { duration: 0.25 })
    // Grace-reset in case the bounce is still mid-flight
    animate(iconY,     0, { type: 'spring', stiffness: 400, damping: 20 })
    animate(iconScale, 1, { type: 'spring', stiffness: 400, damping: 20 })
  }

  return (
    <motion.div
      className="relative rounded-2xl border bg-dark-card p-7"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1.0] },
        },
      }}
      style={{ borderColor }}
      whileHover={reduceMotion ? {} : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Top shimmer line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        style={{ opacity: shimmerOpacity }}
      />

      <motion.div
        className="mb-4 text-3xl"
        style={{ y: iconY, scale: iconScale, display: 'inline-block' }}
      >
        {icon}
      </motion.div>
      <h3 className="mb-2 font-semibold text-content-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-content-secondary">{desc}</p>
    </motion.div>
  )
}

export default function AnimatedFeatures({ version = 'N/A' }: { version?: string }) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <motion.div
          className="mb-14 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="mb-3 text-4xl font-bold tracking-tight">
            Four AI-Powered Components for Modern Spring Boot Development
          </h2>
          <p className="text-content-secondary">
            Comprehensive intelligent development assistance — from code generation to deployment
          </p>
        </motion.div>

        {/* Live demo — above the cards */}
        <motion.div
          className="mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="mb-4 text-center text-sm text-content-secondary">
            See every module in action — hover to pause
          </p>
          <PluginDemoAnimation version={version} />
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial={reduceMotion ? false : 'hidden'}
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: {} }}
        >
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              desc={f.desc}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
