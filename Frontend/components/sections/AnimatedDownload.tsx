"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useInView,
  animate,
  useReducedMotion,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { slideInLeft } from "@/lib/variants";

interface PluginInfo {
  name: string;
  version: string;
  uploadDate: string;
  description: string;
  hasFile: boolean;
}

function formatDate(iso: string) {
  if (!iso || iso === "N/A") return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const INSTALL_STEPS = [
  <>
    Download the{" "}
    <code className="rounded bg-dark-hover px-1.5 py-0.5 text-accent">
      .zip
    </code>{" "}
    file above
  </>,
  <>
    Open IntelliJ IDEA →{" "}
    <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">
      Settings
    </code>{" "}
    →{" "}
    <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">
      Plugins
    </code>
  </>,
  <>
    Click ⚙ gear icon →{" "}
    <code className="rounded bg-dark-hover px-1.5 py-0.5 text-content-primary">
      Install Plugin from Disk…
    </code>
  </>,
  <>
    Select the downloaded{" "}
    <code className="rounded bg-dark-hover px-1.5 py-0.5 text-accent">
      .zip
    </code>{" "}
    and restart IntelliJ IDEA
  </>,
];

export default function AnimatedDownload({ plugin }: { plugin: PluginInfo }) {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("sf_token"));
    check();
    window.addEventListener("sf_auth_change", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("sf_auth_change", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  const handleDownload = useCallback(async () => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      window.location.href = "/login?redirect=/#download";
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch("/api/plugin/download", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        // Token expired — redirect to login
        localStorage.removeItem("sf_token");
        localStorage.removeItem("sf_user");
        window.dispatchEvent(new Event("sf_auth_change"));
        window.location.href = "/login?redirect=/#download";
        return;
      }
      if (!res.ok) throw new Error("Download failed");

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (reduceMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.18);
    btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.18);
  }

  function handleMouseLeave() {
    animate(btnX, 0, { type: "spring", stiffness: 350, damping: 22 });
    animate(btnY, 0, { type: "spring", stiffness: 350, damping: 22 });
  }

  return (
    <motion.section
      id="download"
      ref={sectionRef}
      className="border-y border-dark-border bg-dark-card px-6 py-24"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-3 text-4xl font-bold tracking-tight">
          Download SpringForge
        </h2>
        <p className="mb-8 text-content-secondary">
          {isLoggedIn ? (
            <>Ready to download — click below to get the plugin</>
          ) : (
            <>Sign in or create an account to download the plugin</>
          )}
        </p>

        {/* Version badge with pulsing dot */}
        <div className="mb-8 inline-flex items-center">
          <Badge
            variant="outline"
            className="gap-2 rounded-full border-accent/25 bg-accent/10 px-5 py-2 text-sm font-medium text-accent hover:bg-accent/10"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
                animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {plugin.hasFile ? `Version ${plugin.version}` : "No release yet"}
            {plugin.hasFile && plugin.uploadDate !== "N/A" && (
              <span className="text-content-muted">
                · {formatDate(plugin.uploadDate)}
              </span>
            )}
          </Badge>
        </div>

        {/* Download CTA — magnetic hover */}
        <div className="mb-10">
          {plugin.hasFile ? (
            <div
              ref={btnRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="inline-block"
            >
              <motion.button
                onClick={handleDownload}
                disabled={downloading}
                style={{ x: btnX, y: btnY }}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-black transition hover:bg-accent-dark hover:shadow-[0_0_40px_rgba(0,255,170,0.25)] disabled:opacity-50"
                whileHover={reduceMotion ? {} : { scale: 1.02 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
              >
                {downloading
                  ? "↓ Downloading…"
                  : isLoggedIn
                    ? "↓ Download Plugin (.zip)"
                    : "→ Sign In to Download"}
              </motion.button>
            </div>
          ) : (
            <Button
              disabled
              variant="outline"
              className="cursor-not-allowed rounded-xl border-dark-border bg-dark-border px-8 py-6 text-lg font-semibold text-content-muted opacity-60"
            >
              ↓ No Release Available
            </Button>
          )}
        </div>

        {/* Install steps — staggered slide in */}
        <div className="rounded-2xl border border-dark-border bg-black p-6 text-left">
          <p className="mb-3 text-sm font-semibold text-content-primary">
            How to install
          </p>
          <motion.ol
            className="space-y-2"
            initial={reduceMotion ? false : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.3 },
              },
            }}
          >
            {INSTALL_STEPS.map((step, i) => (
              <motion.li
                key={i}
                className="text-sm text-content-secondary"
                custom={i}
                variants={slideInLeft}
              >
                <span className="mr-2 font-mono text-accent">{i + 1}.</span>
                {step}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </motion.section>
  );
}
