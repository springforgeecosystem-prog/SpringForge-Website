"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface PluginInfo {
  name: string;
  version: string;
  uploadDate: string;
  hasFile: boolean;
}

function formatDate(iso: string) {
  if (!iso || iso === "N/A") return "N/A";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [info, setInfo] = useState<PluginInfo | null>(null);
  const [infoError, setInfoError] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function loadInfo() {
    try {
      const res = await fetch("/api/plugin/info");
      const data: PluginInfo = await res.json();
      setInfo(data);
      setInfoError(false);
    } catch {
      setInfoError(true);
    }
  }

  useEffect(() => {
    loadInfo();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    if (!username || !password) {
      setAlert({ type: "error", message: "Please enter admin credentials." });
      return;
    }
    if (!file) {
      setAlert({ type: "error", message: "Please select a .zip file." });
      return;
    }
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setAlert({ type: "error", message: "Only .zip files are accepted." });
      return;
    }
    if (!version.trim()) {
      setAlert({ type: "error", message: "Please enter a version number." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("version", version.trim());

    setUploading(true);
    try {
      const res = await fetch(`/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAlert({ type: "success", message: data.message });
        setFile(null);
        setVersion("");
        const input = document.getElementById(
          "plugin-file",
        ) as HTMLInputElement;
        if (input) input.value = "";
        setTimeout(loadInfo, 500);
      } else if (res.status === 401) {
        setAlert({
          type: "error",
          message: "Invalid credentials. Check username and password.",
        });
      } else {
        setAlert({
          type: "error",
          message: data.message ?? `Upload failed (HTTP ${res.status}).`,
        });
      }
    } catch {
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-base text-content-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-dark-border bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SpringForge"
              width={32}
              height={32}
              style={{ mixBlendMode: "screen" }}
            />
            <span className="text-lg font-bold">
              Spring<span className="text-accent">Forge</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-dark-border px-4 py-2 text-sm text-content-secondary transition hover:border-accent/40 hover:text-accent"
          >
            ← Back to Site
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-content-secondary">
            Upload a new version of the SpringForge plugin.
          </p>
        </div>

        {/* Current plugin info */}
        <div className="mb-6 rounded-2xl border border-dark-border bg-dark-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-content-muted">
            Current Plugin
          </h2>

          {infoError ? (
            <p className="text-sm text-content-secondary">
              Could not load plugin info.
            </p>
          ) : info === null ? (
            <p className="text-sm text-content-muted">Loading…</p>
          ) : (
            <div className="space-y-2.5">
              {[
                { label: "Name", value: info.name },
                { label: "Version", value: info.version },
                { label: "Upload Date", value: formatDate(info.uploadDate) },
                {
                  label: "Status",
                  value: info.hasFile ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />{" "}
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />{" "}
                      No file uploaded
                    </span>
                  ),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-dark-border py-2 last:border-0 text-sm"
                >
                  <span className="text-content-secondary">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload form */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-content-muted">
            Upload New Version
          </h2>

          {/* Alert */}
          {alert && (
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              <span>{alert.type === "success" ? "✓" : "⚠"}</span>
              <span>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Credentials row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-content-secondary">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="off"
                  required
                  className="w-full rounded-lg border border-dark-border bg-dark-base px-3 py-2.5 text-sm text-content-primary placeholder-content-muted outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-content-secondary">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-dark-border bg-dark-base px-3 py-2.5 text-sm text-content-primary placeholder-content-muted outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Version */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-content-secondary">
                Plugin Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.2.0"
                required
                className="w-full rounded-lg border border-dark-border bg-dark-base px-3 py-2.5 text-sm text-content-primary placeholder-content-muted outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              />
            </div>

            {/* File */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-content-secondary">
                Plugin ZIP File
              </label>
              <input
                id="plugin-file"
                type="file"
                accept=".zip"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-dark-border bg-dark-base px-3 py-2.5 text-sm text-content-secondary outline-none transition file:mr-3 file:rounded file:border-0 file:bg-dark-hover file:px-3 file:py-1 file:text-xs file:font-medium file:text-content-secondary hover:border-accent/30 focus:border-accent/50"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-black transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "↻ Uploading…" : "↑ Upload Plugin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
