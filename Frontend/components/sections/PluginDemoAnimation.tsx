'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Lottie from 'lottie-react'
import spinnerData from '@/public/lottie/spinner.json'

export default function PluginDemoAnimation({ version = 'N/A' }: { version?: string }) {
  const [stage, setStage] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const TOTAL = 6
  const INTERVAL = 2200

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setStage((s) => (s + 1) % TOTAL), INTERVAL)
    return () => clearInterval(t)
  }, [paused])

  const stageLabels = [
    { id: 'menu',    symbol: '⚡', label: 'Open Menu'         },
    { id: 'codegen', symbol: '🔧', label: 'Generate Code'    },
    { id: 'runtime', symbol: '🐞', label: 'Runtime Debugger' },
    { id: 'quality', symbol: '📊', label: 'Quality Scan'     },
    { id: 'cicd',    symbol: '🚀', label: 'CI/CD Pipeline'   },
    { id: 'done',    symbol: '✅', label: 'All Done'          },
  ]

  const menuModules = [
    { icon: '🔧', label: 'Code Generator',   desc: 'input.yml → AI → Spring files', dot: 'bg-blue-400',   text: 'text-blue-300',   btn: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'   },
    { icon: '🐞', label: 'Runtime Debugger', desc: 'Breakpoints, call stack, vars',  dot: 'bg-red-400',    text: 'text-red-300',    btn: 'border-red-500/40 text-red-400 hover:bg-red-500/10'       },
    { icon: '📊', label: 'Quality Analyzer', desc: 'SonarQube-style static scan',    dot: 'bg-purple-400', text: 'text-purple-300', btn: 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10' },
    { icon: '🚀', label: 'CI/CD Generator',  desc: 'GitHub Actions deploy.yml',      dot: 'bg-yellow-400', text: 'text-yellow-300', btn: 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10' },
  ]

  const codeFiles = [
    { name: 'UserController.java', color: 'text-blue-400',   dot: 'bg-blue-400'   },
    { name: 'UserService.java',    color: 'text-green-400',  dot: 'bg-green-400'  },
    { name: 'UserRepository.java', color: 'text-yellow-400', dot: 'bg-yellow-400' },
    { name: 'User.java (Entity)',  color: 'text-purple-400', dot: 'bg-purple-400' },
    { name: 'UserDTO.java',        color: 'text-pink-400',   dot: 'bg-pink-400'   },
  ]

  const codeLines = [
    { text: '@RestController',           color: 'text-green-400'            },
    { text: '@RequestMapping("/users")',  color: 'text-blue-400'             },
    { text: 'class UserController {',    color: 'text-purple-300'           },
    { text: '  @Autowired',              color: 'text-yellow-400'           },
    { text: '  UserService service;',    color: 'text-content-secondary/60' },
  ]

  const cicdSteps = [
    { type: 'done',    label: 'Set up job',       time: '2s',  sub: false },
    { type: 'done',    label: 'Checkout code',    time: '1s',  sub: false },
    { type: 'done',    label: 'Set up Java 17',   time: '3s',  sub: false },
    { type: 'running', label: 'Run Maven build',  time: null,  sub: false },
    { type: 'log',     label: '> mvn package -DskipTests…', time: null, sub: true },
    { type: 'pending', label: 'Deploy to Railway', time: null, sub: false },
  ]

  const qualityMetrics = [
    { label: 'Coverage',    value: 87, stroke: '#22c55e' },
    { label: 'Maintain.',   value: 92, stroke: '#3b82f6' },
    { label: 'Reliability', value: 95, stroke: '#a855f7' },
    { label: 'Security',    value: 89, stroke: '#eab308' },
  ]

  const runtimeFrames = [
    { method: 'UserService.createUser()',    file: 'UserService.java:42',    active: true  },
    { method: 'UserController.post()',       file: 'UserController.java:28', active: false },
    { method: 'DispatcherServlet.handle()',  file: 'DispatcherServlet:874',  active: false },
  ]

  const runtimeVars = [
    { name: 'user',        value: 'User { id=null, name="Alice" }',  color: 'text-blue-400'   },
    { name: 'requestBody', value: '{ "name": "Alice", "email": … }', color: 'text-green-400'  },
    { name: 'this',        value: 'UserService @ 0x4f2a',             color: 'text-purple-400' },
  ]

  return (
    <section
      aria-label="SpringForge plugin demo animation"
      className="overflow-hidden rounded-xl border border-dark-border bg-[#0d0d0d]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* IDE title bar */}
      <div className="flex items-center justify-between border-b border-dark-border bg-[#1a1a1a] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SpringForge" width={14} height={14} className="rounded" unoptimized />
          <span className="text-[11px] font-medium text-content-secondary">SpringForge Plugin — IntelliJ IDEA</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Stage content */}
      <div className="relative h-[260px] overflow-hidden">
        <AnimatePresence mode="wait">

          {/* Stage 0 — Plugin Panel */}
          {stage === 0 && (
            <motion.div
              key="menu"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Tool window header */}
              <div className="flex items-center justify-between border-b border-dark-border bg-[#1c1c1c] px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={12} height={12} className="rounded" unoptimized />
                  <span className="font-mono text-[10px] font-semibold text-content-secondary/80">SpringForge</span>
                  <span className="rounded bg-accent/15 px-1.5 py-px font-mono text-[7px] font-semibold text-accent">v{version}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="font-mono text-[8px] text-green-400/70">Connected</span>
                  </motion.div>
                  {/* settings icon */}
                  <svg width={11} height={11} viewBox="0 0 16 16" fill="none" className="text-content-secondary/30">
                    <circle cx={8} cy={8} r={2.5} stroke="currentColor" strokeWidth={1.5}/>
                    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Module list */}
              <div className="flex-1 overflow-hidden px-2 py-1.5">
                {menuModules.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                    className="group flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-white/[0.04]"
                  >
                    {/* Colored status dot */}
                    <motion.span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${m.dot}`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    />
                    {/* Emoji icon */}
                    <span className="w-5 shrink-0 text-center text-[13px] leading-none">{m.icon}</span>
                    {/* Label + desc */}
                    <div className="min-w-0 flex-1">
                      <p className={`font-mono text-[10px] font-medium leading-tight ${m.text}`}>{m.label}</p>
                      <p className="truncate font-mono text-[8px] text-content-secondary/35">{m.desc}</p>
                    </div>
                    {/* Run button */}
                    <motion.button
                      whileHover={reduceMotion ? {} : { scale: 1.08 }}
                      className={`flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 font-mono text-[8px] transition-colors ${m.btn}`}
                    >
                      <svg width={7} height={8} viewBox="0 0 7 8" fill="currentColor">
                        <path d="M0 0l7 4-7 4V0z"/>
                      </svg>
                      Run
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Status bar */}
              <div className="flex items-center gap-1.5 border-t border-dark-border bg-[#1c1c1c] px-3 py-1">
                <svg width={8} height={8} viewBox="0 0 16 16" fill="none">
                  <circle cx={8} cy={8} r={6.5} stroke="#22c55e" strokeWidth={1.5}/>
                  <path d="M5 8l2.5 2.5L11 5" stroke="#22c55e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-mono text-[8px] text-content-secondary/35">Spring Boot project detected · Java 17 · Maven</span>
              </div>
            </motion.div>
          )}

          {/* Stage 1 — Code generation */}
          {stage === 1 && (
            <motion.div
              key="codegen"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 flex gap-3 px-4 py-3"
            >
              {/* File tree */}
              <div className="w-[130px] shrink-0">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-content-secondary/30">Files created</p>
                <div className="space-y-1.5">
                  {codeFiles.map((f, i) => (
                    <motion.div
                      key={f.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.14 }}
                      className="flex items-center gap-1.5"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.14 + 0.1, type: 'spring', stiffness: 320 }}
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${f.dot}`}
                      />
                      <span className={`truncate font-mono text-[10px] ${f.color}`}>{f.name}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 0.75, duration: 0.65, repeat: Infinity }}
                  className="mt-2 inline-block font-mono text-[12px] text-accent"
                >_</motion.span>
              </div>
              {/* Code preview */}
              <div className="flex-1 overflow-hidden rounded-lg border border-dark-border bg-black/50 px-2.5 py-2">
                {codeLines.map((line, i) => (
                  <motion.div
                    key={line.text}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.17 + 0.08 }}
                    className={`font-mono text-[10px] leading-[1.75] ${line.color}`}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stage 2 — Runtime Debugger */}
          {stage === 2 && (
            <motion.div
              key="runtime"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 px-4 py-3"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-red-500"
                />
                <span className="font-mono text-[10px] text-red-400">Breakpoint — UserService.java:42</span>
              </div>
              <div className="flex gap-3">
                {/* Call stack */}
                <div className="w-[152px] shrink-0">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-content-secondary/30">Call Stack</p>
                  <div className="relative">
                    <div className="absolute left-[6px] top-4 h-[calc(100%-16px)] w-px bg-dark-border" />
                    {runtimeFrames.map((f, i) => (
                      <motion.div
                        key={f.method}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="relative flex items-start gap-2 py-1"
                      >
                        <div className={`relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ${f.active ? 'border-accent bg-accent/20' : 'border-dark-border bg-[#0d0d0d]'}`}>
                          {f.active && (
                            <motion.div
                              className="absolute inset-[-4px] rounded-full border border-accent/40"
                              animate={{ opacity: [0.8, 0, 0.8], scale: [1, 2, 1] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate font-mono text-[9px] ${f.active ? 'text-accent' : 'text-content-secondary/40'}`}>{f.method}</p>
                          <p className="font-mono text-[8px] text-content-secondary/25">{f.file}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Variables */}
                <div className="flex-1 min-w-0">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-content-secondary/30">Variables</p>
                  <div className="space-y-1.5">
                    {runtimeVars.map((v, i) => (
                      <motion.div
                        key={v.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 + 0.3 }}
                        className="rounded-md border border-dark-border bg-black/30 px-2 py-1"
                      >
                        <p className="font-mono text-[8px] text-content-secondary/40">{v.name}</p>
                        <p className={`truncate font-mono text-[9px] ${v.color}`}>{v.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 3 — Quality */}
          {stage === 3 && (
            <motion.div
              key="quality"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 px-4 py-3"
            >
              <p className="mb-2.5 text-[10px] text-content-secondary/50">◈ Static analysis complete — SonarQube</p>
              <div className="flex gap-4">
                {/* Overall score ring */}
                <div className="flex w-[88px] shrink-0 flex-col items-center">
                  {(() => {
                    const r = 28, circ = 2 * Math.PI * r
                    return (
                      <svg width={72} height={72} viewBox="0 0 72 72" fill="none">
                        <circle cx={36} cy={36} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
                        <motion.circle
                          cx={36} cy={36} r={r}
                          stroke="#22c55e" strokeWidth={5} strokeLinecap="round"
                          strokeDasharray={circ}
                          initial={{ strokeDashoffset: circ }}
                          animate={{ strokeDashoffset: circ * 0.09 }}
                          transition={{ delay: 0.1, duration: 0.85, ease: 'easeOut' }}
                          transform="rotate(-90 36 36)"
                        />
                        <text x={36} y={31} textAnchor="middle" dominantBaseline="middle"
                          fontSize={20} fontWeight="bold" fill="#22c55e">A</text>
                        <text x={36} y={49} textAnchor="middle" dominantBaseline="middle"
                          fontSize={8} fill="rgba(255,255,255,0.3)">91 / 100</text>
                      </svg>
                    )
                  })()}
                  <span className="mt-1 text-center text-[8px] text-content-secondary/35">Overall</span>
                </div>
                {/* Metric bars */}
                <div className="flex-1 space-y-2.5 pt-0.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-content-secondary/30">Breakdown</p>
                  {qualityMetrics.map((m, i) => (
                    <motion.div key={m.label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.13 + 0.15 }}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-[9px] text-content-secondary/60">{m.label}</span>
                        <motion.span
                          className="font-mono text-[9px]"
                          style={{ color: m.stroke }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.13 + 0.65 }}
                        >{m.value}%</motion.span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: m.stroke }}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value}%` }}
                          transition={{ delay: i * 0.13 + 0.2, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 4 — CI/CD */}
          {stage === 4 && (
            <motion.div
              key="cicd"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 px-4 py-3"
            >
              {/* Workflow header */}
              <div className="mb-2.5 flex items-center gap-2 rounded-md border border-yellow-400/20 bg-yellow-400/5 px-2.5 py-1.5">
                <Lottie animationData={spinnerData} loop style={{ width: 12, height: 12, flexShrink: 0 }} />
                <span className="font-mono text-[9px] text-yellow-400">deploy.yml — triggered by push to main</span>
              </div>
              {/* Step list */}
              <div className="space-y-0.5">
                {cicdSteps.map((step, i) => {
                  let rowClass = ''
                  if (step.type === 'running') rowClass = 'border-l-2 border-yellow-400/60 bg-yellow-400/5'
                  else if (step.sub) rowClass = 'pl-7'

                  let labelClass = 'text-content-secondary/25'
                  if (step.type === 'done')    labelClass = 'text-content-secondary/65'
                  if (step.type === 'running') labelClass = 'text-yellow-400'
                  if (step.type === 'log')     labelClass = 'text-green-400/55'

                  return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.13 }}
                    className={`flex items-center gap-2 rounded px-2 py-[3px] font-mono text-[9px] ${rowClass}`}
                  >
                    {step.type === 'done' && (
                      <motion.svg width={12} height={12} viewBox="0 0 12 12" fill="none" className="shrink-0" initial={false}>
                        <motion.circle cx={6} cy={6} r={4.5} stroke="#22c55e" strokeWidth={1}
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: i * 0.13 + 0.2, duration: 0.28 }} />
                        <motion.path d="M3.5 6l1.8 1.8 3-3.3" stroke="#22c55e" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: i * 0.13 + 0.4, duration: 0.22 }} />
                      </motion.svg>
                    )}
                    {step.type === 'running' && (
                      <Lottie animationData={spinnerData} loop style={{ width: 12, height: 12, flexShrink: 0 }} />
                    )}
                    {step.type === 'pending' && (
                      <svg width={12} height={12} viewBox="0 0 12 12" fill="none" className="shrink-0">
                        <circle cx={6} cy={6} r={4.5} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                      </svg>
                    )}
                    {step.type === 'log' && (
                      <span className="w-3 shrink-0 text-content-secondary/20">›</span>
                    )}
                    <span className={labelClass}>{step.label}</span>
                    {step.time && (
                      <motion.span
                        className="ml-auto font-mono text-[8px] text-content-secondary/25"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.13 + 0.5 }}
                      >{step.time}</motion.span>
                    )}
                  </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Stage 5 — Done */}
          {stage === 5 && (
            <motion.div
              key="done"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 py-4"
            >
              <motion.svg width={64} height={64} viewBox="0 0 64 64" fill="none" initial={false}>
                <motion.circle
                  cx={32} cy={32} r={22}
                  stroke="#2ecc71" strokeWidth={2.5} strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
                <motion.path
                  d="M20 33 L28 41 L44 23"
                  stroke="#2ecc71" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
                />
              </motion.svg>
              <div className="text-center">
                <p className="text-sm font-semibold text-content-primary">SpringForge Complete</p>
                <p className="mt-0.5 text-[11px] text-content-secondary/60">All modules ran successfully</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 text-[10px] font-mono"
              >
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-green-400">Code ✓</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-400">CI/CD ✓</span>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-400">Quality ✓</span>
                <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-yellow-400">Runtime ✓</span>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Progress dots + stage label */}
      <div className="flex items-center justify-between border-t border-dark-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          {stageLabels.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === stage ? 'h-2 w-6 bg-accent' : 'h-2 w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Jump to stage: ${s.label}`}
            />
          ))}
        </div>
        <span className="text-[10px] text-content-secondary/50">
          {stageLabels[stage].symbol}&nbsp;{stageLabels[stage].label}
        </span>
      </div>
    </section>
  )
}
