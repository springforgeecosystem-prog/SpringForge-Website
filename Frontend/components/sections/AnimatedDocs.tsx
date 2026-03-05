'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Step {
  num: number
  text: string
}

interface TableRow {
  col1: string
  col2: string
  col3?: string
}

interface CodeBlock {
  lang: string
  code: string
}

interface Section {
  id: string
  title: string
  icon: string
  color: string
  intro: string
  image?: string
  imageAlt?: string
  steps?: Step[]
  table?: { headers: string[]; rows: TableRow[] }
  codeBlock?: CodeBlock
  subSections?: {
    title: string
    steps?: Step[]
    table?: { headers: string[]; rows: TableRow[] }
  }[]
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const sections: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    color: 'from-accent/20 to-transparent',
    intro:
      'Install SpringForge in three steps — no configuration, no accounts, no setup required. Just download, install, and go.',
    subSections: [
      {
        title: 'Step 1 — Download the Plugin',
        steps: [
          { num: 1, text: 'Go to the Download section on this page' },
          { num: 2, text: 'Click Download Plugin to get the latest SpringForge-Tools.zip' },
        ],
      },
      {
        title: 'Step 2 — Install in IntelliJ IDEA',
        steps: [
          { num: 1, text: 'Open IntelliJ IDEA' },
          { num: 2, text: 'Go to Settings (Ctrl+Alt+S) → Plugins' },
          { num: 3, text: 'Click the ⚙️ gear icon → Install Plugin from Disk...' },
          { num: 4, text: 'Select the downloaded .zip file' },
          { num: 5, text: 'Click OK, then Restart IDE' },
        ],
      },
      {
        title: 'Step 3 — Open the Plugin',
        steps: [
          { num: 1, text: 'After restart, look for the SpringForge panel on the right sidebar' },
          { num: 2, text: "If it's not visible: View → Tool Windows → SpringForge" },
          { num: 3, text: "That's it — the plugin is ready to use immediately" },
        ],
      },
    ],
  },
  {
    id: 'code-gen',
    title: 'Code Generation',
    icon: '⚡',
    color: 'from-blue-500/20 to-transparent',
    image: '/Code Gen.png',
    imageAlt: 'SpringForge Code Generation panel in IntelliJ IDEA',
    intro:
      'Generate complete Spring Boot project scaffolding and Java source files using AI. Works for brand-new projects and for adding code to existing ones.',
    table: {
      headers: ['Action', 'What it does'],
      rows: [
        { col1: 'Create New Spring Boot Project', col2: 'Wizard to generate a full project with your chosen architecture and dependencies' },
        { col1: 'Detect Architecture', col2: 'ML-powered identification of the architecture pattern of your open project' },
        { col1: 'Generate Prompt', col2: 'Reads your input.yml and builds a detailed AI prompt you can use elsewhere' },
        { col1: 'Generate Code from input.yml', col2: 'Parses input.yml, calls the AI, and writes generated Java files into your project' },
      ],
    },
    subSections: [
      {
        title: 'Create a New Project',
        steps: [
          { num: 1, text: 'Open the SpringForge sidebar → Code Gen tab' },
          { num: 2, text: 'Click Create New Spring Boot Project' },
          { num: 3, text: 'Choose an architecture pattern: Layered, Hexagonal, Clean, Event-Driven, or Microservices' },
          { num: 4, text: 'Select dependencies: Web, JPA, Security, Lombok, Actuator, Validation, and more' },
          { num: 5, text: 'Enter project metadata: Group ID, Artifact ID, Package name' },
          { num: 6, text: 'Click Generate — the full project scaffold is created' },
        ],
      },
      {
        title: 'Generate Code from input.yml',
        steps: [
          { num: 1, text: 'Create an input.yml file in the root of your open IntelliJ project (see example below)' },
          { num: 2, text: 'Open the Code Gen tab → click Generate Code (input.yml → AI → Files)' },
          { num: 3, text: 'The plugin parses your input.yml, calls the AI, and writes the Java files into your project automatically' },
        ],
      },
      {
        title: 'Detect Existing Architecture',
        steps: [
          { num: 1, text: 'Open any Spring Boot project in IntelliJ' },
          { num: 2, text: 'Code Gen tab → click Existing Project (Detect Architecture)' },
          { num: 3, text: 'The plugin analyses your codebase and shows the detected pattern with a confidence percentage' },
        ],
      },
    ],
    codeBlock: {
      lang: 'yaml',
      code: `project:
  name: my-app
  language: java
  framework: spring-boot

entities:
  - name: User
    fields:
      - name: id
        type: Long
      - name: username
        type: String
      - name: email
        type: String

features:
  - REST_API
  - JPA
  - VALIDATION`,
    },
  },
  {
    id: 'cicd',
    title: 'CI/CD Assistant',
    icon: '🔧',
    color: 'from-purple-500/20 to-transparent',
    image: '/Cicd gen.png',
    imageAlt: 'SpringForge CI/CD Pipeline Generator panel in IntelliJ IDEA',
    intro:
      'Generate production-ready DevOps files for your Spring Boot project — powered by AI. No manual writing of Dockerfiles or pipelines needed.',
    table: {
      headers: ['Generated File', 'Description'],
      rows: [
        { col1: 'Dockerfile', col2: 'Multi-stage optimised container build tailored to your project' },
        { col1: '.github/workflows/build.yml', col2: 'Complete GitHub Actions CI/CD pipeline with test, build, and deploy stages' },
        { col1: 'docker-compose.yml', col2: 'Multi-service local development stack with detected databases and services' },
        { col1: 'k8s/deployment.yml', col2: 'Kubernetes Deployment and Service manifests' },
      ],
    },
    subSections: [
      {
        title: 'How to Use',
        steps: [
          { num: 1, text: 'Open the SpringForge sidebar → CI/CD tab' },
          { num: 2, text: 'Select your source: Local Project (current open project) or GitHub Repository (enter a URL and pick a branch)' },
          { num: 3, text: 'Tick the files you want to generate: Dockerfile, GitHub Actions, Docker Compose, Kubernetes Manifests' },
          { num: 4, text: 'Click Generate CI/CD Files' },
          { num: 5, text: 'Watch the output console — files are written to your project root when complete' },
        ],
      },
      {
        title: 'What the AI detects automatically',
        steps: [
          { num: 1, text: 'Build tool (Maven or Gradle) — uses the correct wrapper commands' },
          { num: 2, text: 'Java version — sets the correct base image and compiler target' },
          { num: 3, text: 'Database dependencies (MySQL, PostgreSQL, MongoDB) — adds services to Docker Compose' },
          { num: 4, text: 'Architecture type (Microservice, Reactive WebFlux, Event-Driven) — adjusts Dockerfile and health check config' },
        ],
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality Assurance',
    icon: '🛡️',
    color: 'from-green-500/20 to-transparent',
    image: '/quality.png',
    imageAlt: 'SpringForge Quality Assurance panel in IntelliJ IDEA',
    intro:
      'Analyse your Spring Boot project for architecture violations and anti-patterns using ML. Get AI-generated fix suggestions for every issue found.',
    table: {
      headers: ['Report Section', 'Description'],
      rows: [
        { col1: 'Detected Architecture', col2: 'The architecture pattern your project matches' },
        { col1: 'Architecture Violations', col2: 'Rules broken relative to the detected pattern' },
        { col1: 'Severity', col2: 'Each violation rated CRITICAL, HIGH, or MEDIUM' },
        { col1: 'Affected Files', col2: 'Exact file paths where violations are found' },
        { col1: 'Recommendations', col2: 'Human-readable guidance on how to fix each issue' },
        { col1: 'AI Fix Suggestions', col2: 'Concrete, code-level fix proposals generated by AI' },
        { col1: 'Explainability Report', col2: 'Exportable PDF report of all findings' },
      ],
    },
    subSections: [
      {
        title: 'How to Use',
        steps: [
          { num: 1, text: 'Open any Spring Boot project in IntelliJ' },
          { num: 2, text: 'Open the SpringForge sidebar → Quality tab' },
          { num: 3, text: 'Click Analyze Code Quality' },
          { num: 4, text: 'Wait for the background analysis to complete (progress shown in the panel)' },
          { num: 5, text: 'Browse violations by severity in the results panel' },
          { num: 6, text: 'Click Get AI Fix Suggestions to receive code-level fixes for each violation' },
          { num: 7, text: 'Click Export Report to save a PDF summary of all findings' },
        ],
      },
    ],
  },
  {
    id: 'runtime',
    title: 'Runtime Debugger',
    icon: '🔍',
    color: 'from-orange-500/20 to-transparent',
    image: '/runtime.png',
    imageAlt: 'SpringForge Runtime Error Analysis panel in IntelliJ IDEA',
    intro:
      'Analyses runtime errors appearing in your IntelliJ console and provides AI-powered root cause analysis and fix suggestions without leaving the IDE.',
    subSections: [
      {
        title: 'Passive Mode (Automatic)',
        steps: [
          { num: 1, text: 'Run or debug your Spring Boot application in IntelliJ normally' },
          { num: 2, text: 'The plugin listens automatically — when a stack trace appears, SpringForge captures it in the background' },
          { num: 3, text: 'Analysis results appear in the Runtime panel automatically' },
        ],
      },
      {
        title: 'Active Mode (Manual)',
        steps: [
          { num: 1, text: 'When an exception appears in the Run or Debug console, select (highlight) the stack trace text' },
          { num: 2, text: 'Right-click → Analyze with SpringForge' },
          { num: 3, text: 'The plugin returns: identified root cause, affected class and method, and a suggested fix' },
        ],
      },
      {
        title: 'From the Sidebar',
        steps: [
          { num: 1, text: 'Open the SpringForge sidebar → Runtime tab' },
          { num: 2, text: 'Paste your error or stack trace into the text area' },
          { num: 3, text: 'Click Analyze Error — the AI returns a root cause and suggested fix instantly' },
        ],
      },
    ],
  },
  {
    id: 'audit',
    title: 'Audit Log',
    icon: '📋',
    color: 'from-pink-500/20 to-transparent',
    image: '/audit.png',
    imageAlt: 'SpringForge Audit Log panel in IntelliJ IDEA',
    intro:
      'Tracks every action the plugin performs — generations, validations, and explainability calls — with timing, status, and source details.',
    subSections: [
      {
        title: 'What is tracked',
        steps: [
          { num: 1, text: 'GENER — every CI/CD file generation with source (LOCAL / GitHub), artifacts, duration, and OK / Error status' },
          { num: 2, text: 'VALID — every validation run against generated or existing files' },
          { num: 3, text: 'EXPLA — every explainability / AI analysis call with duration and status' },
        ],
      },
      {
        title: 'Summary statistics',
        steps: [
          { num: 1, text: 'Generations — total count, success rate, average duration' },
          { num: 2, text: 'Validations — total count, success rate, average duration' },
          { num: 3, text: 'Explainability — total count, success rate, average duration' },
        ],
      },
      {
        title: 'How to Use',
        steps: [
          { num: 1, text: 'Open the SpringForge sidebar → Audit tab' },
          { num: 2, text: 'The log auto-refreshes after each plugin action — no manual refresh needed' },
          { num: 3, text: 'Click Refresh to manually reload the last 100 events' },
          { num: 4, text: 'Click Export PDF to save the full audit log as a PDF report' },
          { num: 5, text: 'Click Clear Log to wipe the audit history' },
        ],
      },
    ],
  },
]

/* ─── Helpers ────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {steps.map((s) => (
        <li key={s.num} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
            {s.num}
          </span>
          <span className="text-sm leading-relaxed text-content-secondary">{s.text}</span>
        </li>
      ))}
    </ol>
  )
}

function DocTable({ headers, rows }: { headers: string[]; rows: TableRow[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-dark-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-border bg-dark-card">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-dark-border/50 transition hover:bg-dark-card/60 last:border-0"
            >
              <td className="px-4 py-3 font-medium text-content-primary">{r.col1}</td>
              <td className="px-4 py-3 text-content-secondary">{r.col2}</td>
              {r.col3 && <td className="px-4 py-3 text-content-secondary">{r.col3}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeExample({ block }: { block: { lang: string; code: string } }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(block.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-dark-border bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-dark-border px-4 py-2">
        <span className="text-xs font-medium text-content-secondary">{block.lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-content-secondary transition hover:text-accent"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-green-300">
        <code>{block.code}</code>
      </pre>
    </div>
  )
}

function SectionPanel({ section, isOpen, onToggle, index, reduceMotion, onImageClick }: {
  section: Section
  isOpen: boolean
  onToggle: () => void
  index: number
  reduceMotion: boolean | null
  onImageClick: (src: string, alt: string) => void
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="overflow-hidden rounded-2xl border border-dark-border bg-dark-card"
    >
      {/* Header */}
      <button
        onClick={(e) => { onToggle(); (e.currentTarget as HTMLButtonElement).blur() }}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-base text-xl">
            {section.icon}
          </span>
          <div>
            <h3 className="font-semibold text-content-primary">{section.title}</h3>
            <p className="mt-0.5 text-xs text-content-secondary line-clamp-1 max-w-xs sm:max-w-sm">
              {section.intro}
            </p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-4 shrink-0 text-content-secondary"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="border-t border-dark-border">
              {/* Screenshot preview */}
              {section.image && (
                <div className="border-b border-dark-border bg-dark-base/40 px-6 py-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent/70">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    Plugin Preview
                  </p>
                  <button
                    onClick={() => onImageClick(section.image as string, section.imageAlt ?? section.title)}
                    className="group relative mx-auto block w-full max-w-xs overflow-hidden rounded-lg border border-dark-border shadow-lg shadow-black/40 transition hover:border-accent/50"
                    aria-label="Click to enlarge preview"
                  >
                    <div className="flex items-center gap-1 border-b border-dark-border bg-[#1a1a1a] px-2.5 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500/70" />
                      <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                      <span className="h-2 w-2 rounded-full bg-green-500/70" />
                      <span className="ml-1.5 text-[9px] text-content-secondary/40">SpringForge Tools</span>
                    </div>
                    <div className="relative">
                      <Image
                        src={section.image as string}
                        alt={section.imageAlt ?? section.title}
                        width={380}
                        height={300}
                        className="w-full object-cover object-top"
                        unoptimized
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                        <span className="scale-75 rounded-full bg-white/10 p-2 opacity-0 backdrop-blur-sm transition group-hover:scale-100 group-hover:opacity-100">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              <div className="space-y-6 px-6 pb-6 pt-6">
                {/* Intro */}
                <p className="text-sm leading-relaxed text-content-secondary">{section.intro}</p>

                {/* Top-level table */}
                {section.table && (
                  <DocTable headers={section.table.headers} rows={section.table.rows} />
                )}

                {/* Sub-sections */}
                {section.subSections?.map((sub) => (
                  <div key={sub.title}>
                    <h4 className="text-sm font-semibold text-content-primary">{sub.title}</h4>
                    {sub.steps && <StepList steps={sub.steps} />}
                    {sub.table && <DocTable headers={sub.table.headers} rows={sub.table.rows} />}
                  </div>
                ))}

                {/* Code block */}
                {section.codeBlock && (
                  <div>
                    <h4 className="text-sm font-semibold text-content-primary">Example input.yml</h4>
                    <CodeExample block={section.codeBlock} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function AnimatedDocs() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openId, setOpenId] = useState<string | null>('getting-started')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  function openLightbox(src: string, alt: string) {
    setLightbox({ src, alt })
  }

  function closeLightbox() {
    setLightbox(null)
  }

  return (
    <section id="documentation" ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <motion.div
          className="mb-14 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Documentation
          </span>
          <h2 className="mb-3 text-4xl font-bold tracking-tight">
            How to Use SpringForge
          </h2>
          <p className="text-content-secondary">
            Everything you need to know — from installing the plugin to using all four modules
          </p>
        </motion.div>

        {/* Quick-access pill tabs */}
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-2"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                openId === s.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-dark-border text-content-secondary hover:border-accent/50 hover:text-content-primary'
              }`}
            >
              <span>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </motion.div>

        {/* Accordion panels */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <SectionPanel
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              onToggle={() => toggle(section.id)}
              index={i}
              reduceMotion={reduceMotion}
              onImageClick={openLightbox}
            />
          ))}
        </div>

        {/* ── Lightbox ─────────────────────────────────── */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-16"
              onClick={closeLightbox}
            >
              {/* backdrop */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

              {/* panel */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10 w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* title bar */}
                <div className="flex items-center justify-between border-b border-dark-border bg-[#1a1a1a] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-[10px] text-content-secondary/50">SpringForge Tools — IntelliJ IDEA</span>
                  </div>
                  <button
                    onClick={closeLightbox}
                    className="rounded-md p-1 text-content-secondary/50 transition hover:text-content-primary"
                    aria-label="Close preview"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto bg-[#111] p-4">
                  <Image
                    src={lightbox.src}
                    alt={lightbox.alt}
                    width={900}
                    height={700}
                    className="w-full rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick reference tip */}
        <motion.p
          className="mt-8 text-center text-xs text-content-secondary/50"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          All features are also accessible from the top menu bar: <span className="text-accent">Tools → SpringForge</span>
        </motion.p>

      </div>
    </section>
  )
}
