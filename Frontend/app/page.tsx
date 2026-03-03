import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PluginInfo {
  name: string
  version: string
  uploadDate: string
  description: string
  hasFile: boolean
}

async function getPluginInfo(): Promise<PluginInfo> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/plugin/info`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('fetch failed')
    return res.json()
  } catch {
    return {
      name: 'SpringForge',
      version: 'N/A',
      uploadDate: 'N/A',
      description: '',
      hasFile: false,
    }
  }
}

function formatDate(iso: string) {
  if (!iso || iso === 'N/A') return 'N/A'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const features = [
  {
    icon: '🏗️',
    title: 'Architecture-Aware Code Generation',
    desc: 'Intelligent project scaffolding and code generation powered by Machine Learning and LLMs. Automatically analyzes existing project structures (Layered, MVC, Clean) and uses Dynamic Prompt Construction to inject live project constraints for structurally valid code.',
  },
  {
    icon: '🔍',
    title: 'RAG-Based Runtime Error Analysis',
    desc: 'AI-powered debugging assistance without leaving the IDE. Uses Cosine Similarity Search on a vector database to retrieve semantically relevant documentation and fixes, achieving >75% precision and >90% fix accuracy.',
  },
  {
    icon: '🎯',
    title: 'AI-Driven Code Quality Assurance',
    desc: 'Structural health and anti-pattern detection using a Dual-Engine AI Architecture. Employs an Anti-Pattern Classifier and Quality Score Regression model (0–100) to detect business logic placement issues and tight coupling.',
  },
  {
    icon: '🚀',
    title: 'Intelligent CI/CD & Infrastructure Assistant',
    desc: 'Secure DevOps artifact generation powered by Claude, MCP, and multi-layer validation. Automatically generates Dockerfiles, Docker Compose, and GitHub Actions with line-by-line AI explanations for DevSecOps education.',
  },
]

const stats = [
  { value: '4', label: 'AI Components' },
  { value: '>90%', label: 'Fix Accuracy' },
  { value: '≥50%', label: 'Time Saved' },
  { value: '100%', label: 'IDE Native' },
]

export default async function Home() {
  const plugin = await getPluginInfo()

  return (
    <main className="min-h-screen bg-dark-base">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-dark-border bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SpringForge"
              width={36}
              height={36}
              className="shrink-0"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="text-lg font-bold tracking-tight">
              Spring<span className="text-accent">Forge</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="#features"
              className="rounded-lg border border-dark-border px-4 py-2 text-sm font-medium text-content-secondary transition hover:border-accent hover:text-accent"
            >
              Features
            </Link>
            <Link
              href="#download"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-dark"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-28 text-center">
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="h-[500px] w-[700px] rounded-full bg-accent opacity-5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            IntelliJ IDEA Plugin · Intelligent Development Ecosystem
          </span>

          <h1 className="mb-5 text-6xl font-extrabold leading-none tracking-tight md:text-7xl">
            Spring<span className="text-accent">Forge</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-content-secondary">
            An Intelligent Spring Boot Development Ecosystem — powered by Machine Learning, RAG-based debugging, and architecture-aware code generation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#download"
              className="flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-black transition hover:bg-accent-dark hover:shadow-[0_0_30px_rgba(0,255,170,0.25)]"
            >
              ↓ Download Plugin
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-dark-border px-7 py-3.5 text-base font-semibold text-content-primary transition hover:border-accent/40 hover:text-accent"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y border-dark-border bg-dark-card">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10 px-6 py-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-accent">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-content-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-4xl font-bold tracking-tight">
              Four AI-Powered Components for Modern Spring Boot Development
            </h2>
            <p className="text-content-secondary">
              Comprehensive intelligent development assistance — from code generation to deployment
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-dark-border bg-dark-card p-7 transition duration-300 hover:border-accent/30 hover:bg-dark-hover"
              >
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-content-primary">{f.title}</h3>
                <p className="text-sm leading-relaxed text-content-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download ── */}
      <section id="download" className="border-y border-dark-border bg-dark-card px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-4xl font-bold tracking-tight">Download SpringForge</h2>
          <p className="mb-8 text-content-secondary">
            Install via{' '}
            <span className="text-content-primary">
              Settings → Plugins → Install from Disk
            </span>{' '}
            in IntelliJ IDEA
          </p>

          {/* version badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-5 py-2 text-sm font-medium text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {plugin.hasFile ? `Version ${plugin.version}` : 'No release yet'}
            {plugin.hasFile && plugin.uploadDate !== 'N/A' && (
              <span className="text-content-muted">· {formatDate(plugin.uploadDate)}</span>
            )}
          </div>

          <div className="mb-10">
            {plugin.hasFile ? (
              <a
                href="/api/plugin/download"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-black transition hover:bg-accent-dark hover:shadow-[0_0_40px_rgba(0,255,170,0.2)]"
              >
                ↓ Download Plugin (.zip)
              </a>
            ) : (
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-dark-border px-8 py-4 text-lg font-semibold text-content-muted opacity-60"
              >
                ↓ No Release Available
              </button>
            )}
          </div>

          {/* install steps */}
          <div className="rounded-2xl border border-dark-border bg-black p-6 text-left">
            <p className="mb-3 text-sm font-semibold text-content-primary">How to install</p>
            <ol className="space-y-2 text-sm text-content-secondary">
              <li><span className="mr-2 font-mono text-accent">1.</span>Download the <code className="rounded bg-dark-hover px-1.5 py-0.5 text-accent">.zip</code> file above</li>
              <li><span className="mr-2 font-mono text-accent">2.</span>Open IntelliJ IDEA → <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">Settings</code> → <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">Plugins</code></li>
              <li><span className="mr-2 font-mono text-accent">3.</span>Click ⚙ gear icon → <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">Install Plugin from Disk…</code></li>
              <li><span className="mr-2 font-mono text-accent">4.</span>Select the downloaded <code className="rounded bg-dark-hover px-1.5 py-0.5 text-accent">.zip</code> and restart IntelliJ IDEA</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dark-border px-6 py-8 text-center text-sm text-content-muted">
        <p>
          © 2025 SpringForge · Research Project 25-26J-451 · SLIIT ·{' '}
          Powered by{' '}
          <a
            href="https://www.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Claude AI
          </a>
        </p>
      </footer>

    </main>
  )
}
