"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  User,
  GitBranch,
  Terminal,
  PackageCheck,
  Sparkles,
  Package,
  Code2,
  ChevronRight,
} from "lucide-react";
import type { PluginItem } from "@/lib/db";
import { MDXRenderer } from "@/components/mdx-renderer";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [plugin, setPlugin] = useState<PluginItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (!slug) return;
    const fetchPlugin = async () => {
      try {
        const res = await fetch(`/api/plugins?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setPlugin(data);
        } else {
          setPlugin(null);
        }
      } catch (err) {
        console.error("Error fetching plugin detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlugin();
  }, [slug]);

  const handleCopy = () => {
    if (!plugin) return;
    navigator.clipboard.writeText(`wefter add ${plugin.packageName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-fd-background text-fd-foreground flex flex-col justify-between">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="h-10 w-48 rounded-xl bg-fd-card/60 animate-pulse mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 rounded-2xl border border-fd-border/50 bg-fd-card/40 animate-pulse" />
              <div className="h-96 rounded-2xl border border-fd-border/50 bg-fd-card/40 animate-pulse" />
            </div>
            <div className="h-80 rounded-2xl border border-fd-border/50 bg-fd-card/40 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!plugin) {
    return (
      <main className="min-h-screen bg-fd-background text-fd-foreground flex flex-col items-center justify-center p-6">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-fd-border bg-fd-card/80 p-8 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-fd-muted text-fd-muted-foreground border border-fd-border/60">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-fd-foreground">Plugin Not Found</h1>
          <p className="mt-2 text-xs text-fd-muted-foreground leading-relaxed">
            The requested plugin &quot;{slug}&quot; could not be located in the registry database.
          </p>
          <button
            onClick={() => {
              router.push("/plugins");
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-2.5 text-xs font-semibold text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Plugins Directory</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-fd-background text-fd-foreground selection:bg-fd-primary/20">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.12,transparent_65%)] blur-3xl" />

      {/* Main Page Layout Container */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-16 flex-1">
        {/* Top Navigation Bar: Back Action & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => {
              router.push("/plugins");
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-fd-border/80 bg-fd-card/60 px-3.5 py-1.5 text-xs font-semibold text-fd-muted-foreground transition-all hover:bg-fd-accent hover:text-fd-foreground shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Plugins Directory</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs text-fd-muted-foreground">
            <Link href="/plugins" className="hover:text-fd-foreground transition-colors flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span>Plugins</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-fd-muted-foreground/60" />
            <span className="font-mono text-fd-foreground font-semibold">{plugin.packageName}</span>
          </nav>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-fd-border/70 pb-8 mb-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider ${
                  plugin.type === "official"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}
              >
                {plugin.type === "official" && <ShieldCheck className="h-3.5 w-3.5" />}
                <span>{plugin.type} Plugin</span>
              </span>

              <span className="rounded-full border border-fd-border bg-fd-card px-3 py-0.5 font-mono text-xs font-semibold text-fd-foreground">
                v{plugin.version}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-fd-foreground">
              {plugin.name}
            </h1>
            <code className="text-sm font-mono text-fd-primary block font-semibold">
              {plugin.packageName}
            </code>
          </div>

          {/* Action Header Links */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {plugin.npmUrl && (
              <a
                href={plugin.npmUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-4 py-2.5 text-xs font-semibold text-fd-foreground shadow-xs backdrop-blur-xs transition-all hover:bg-fd-accent hover:border-fd-border"
              >
                <Package className="h-4 w-4 text-red-500" />
                <span>npm Package</span>
                <ExternalLink className="h-3 w-3 text-fd-muted-foreground" />
              </a>
            )}

            {plugin.repositoryUrl && (
              <a
                href={plugin.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-4 py-2.5 text-xs font-semibold text-fd-foreground shadow-xs backdrop-blur-xs transition-all hover:bg-fd-accent hover:border-fd-border"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Repository</span>
                <ExternalLink className="h-3 w-3 text-fd-muted-foreground" />
              </a>
            )}
          </div>
        </div>

        {/* Two-Column Grid: MDX Content (Left) & Metadata Sticky Sidebar (Right) */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content Area (MDX Document) */}
          <div className="lg:col-span-2 space-y-8">
            <article className="rounded-2xl border border-fd-border/80 bg-fd-card/60 p-6 sm:p-10 shadow-xs backdrop-blur-md">
              <MDXRenderer content={plugin.descriptionMdx} />
            </article>
          </div>

          {/* Sticky Sidebar: Installation & Package Metadata */}
          <div className="space-y-6">
            {/* Quick Terminal Installation Box */}
            <div className="rounded-2xl border border-fd-border bg-fd-card p-6 shadow-xs backdrop-blur-md">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-2">
                <Terminal className="h-4 w-4 text-fd-primary" />
                <span>Installation</span>
              </h3>
              
              <div className="mt-4 rounded-xl border border-fd-border/80 bg-fd-background p-3 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-xs font-semibold text-fd-foreground truncate">
                    wefter add {plugin.packageName}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-fd-primary px-2.5 py-1 text-xs font-semibold text-fd-primary-foreground shadow-xs transition-all hover:bg-fd-primary/90"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Package Details Sidebar Box */}
            <div className="rounded-2xl border border-fd-border bg-fd-card p-6 shadow-xs backdrop-blur-md space-y-5">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground border-b border-fd-border/60 pb-3">
                Package Info
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Author</span>
                  <span className="font-semibold text-fd-foreground mt-0.5 block">{plugin.author}</span>
                </div>

                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Package Name</span>
                  <code className="font-mono text-fd-primary font-semibold mt-0.5 block">{plugin.packageName}</code>
                </div>

                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">License</span>
                  <span className="font-mono font-semibold text-fd-foreground mt-0.5 uppercase block">{plugin.license || "MIT"}</span>
                </div>

                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Supported Platforms</span>
                  <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {plugin.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="rounded border border-fd-border/80 bg-fd-muted/60 px-2 py-0.5 font-semibold text-fd-foreground uppercase"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Version</span>
                  <span className="font-mono font-semibold text-fd-foreground mt-0.5 block">v{plugin.version}</span>
                </div>

                <div className="pt-2 border-t border-fd-border/60 space-y-2">
                  {plugin.npmUrl && (
                    <div>
                      <a
                        href={plugin.npmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-xs text-red-500 hover:underline"
                      >
                        <span>View on npmjs.com</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}

                  {plugin.repositoryUrl && (
                    <div>
                      <a
                        href={plugin.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-xs text-fd-primary hover:underline"
                      >
                        <span>View GitHub Repository</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Column Footer (Matching Home Page) */}
      <footer className="border-t border-fd-border bg-fd-card/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/Logo/Dark/Logo.svg"
                  alt="Wefter Logo"
                  className="h-7 w-auto dark:hidden"
                />
                <img
                  src="/Logo/Light/Logo.svg"
                  alt="Wefter Logo"
                  className="h-7 w-auto hidden dark:block"
                />
              </div>
              <p className="text-xs sm:text-sm text-fd-muted-foreground leading-relaxed max-w-sm">
                Compile Vue, React, Svelte, and Vanilla JS into lightweight native Android & iOS shells with zero-reflection Kotlin & Swift dispatchers.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>v0.0.3 Core Architecture</span>
                </span>
              </div>
            </div>

            {/* Column 1: Core Documentation */}
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-foreground">
                Documentation
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs text-fd-muted-foreground">
                <li>
                  <Link href="/docs/installing" className="hover:text-fd-foreground transition-colors">
                    Installation & Setup
                  </Link>
                </li>
                <li>
                  <Link href="/docs/introduction" className="hover:text-fd-foreground transition-colors">
                    Architecture Overview
                  </Link>
                </li>
                <li>
                  <Link href="/docs/app-configuration" className="hover:text-fd-foreground transition-colors">
                    wefter.config.json
                  </Link>
                </li>
                <li>
                  <Link href="/docs/javascript-apis" className="hover:text-fd-foreground transition-colors">
                    JS Bridge API
                  </Link>
                </li>
                <li>
                  <Link href="/docs/native-bridge-security" className="hover:text-fd-foreground transition-colors">
                    Bridge Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: CLI Commands */}
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-foreground">
                CLI Tooling
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs text-fd-muted-foreground">
                <li>
                  <Link href="/cli/init" className="hover:text-fd-foreground transition-colors font-mono">
                    wefter init
                  </Link>
                </li>
                <li>
                  <Link href="/cli/sync" className="hover:text-fd-foreground transition-colors font-mono">
                    wefter sync
                  </Link>
                </li>
                <li>
                  <Link href="/cli/run" className="hover:text-fd-foreground transition-colors font-mono">
                    wefter run
                  </Link>
                </li>
                <li>
                  <Link href="/cli/build" className="hover:text-fd-foreground transition-colors font-mono">
                    wefter build
                  </Link>
                </li>
                <li>
                  <Link href="/cli/doctor" className="hover:text-fd-foreground transition-colors font-mono">
                    wefter doctor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Plugins & Ecosystem */}
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-foreground">
                Plugins
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs text-fd-muted-foreground">
                <li>
                  <Link href="/plugin" className="hover:text-fd-foreground transition-colors">
                    Plugin Authoring
                  </Link>
                </li>
                <li>
                  <Link href="/plugin/wefter-method" className="hover:text-fd-foreground transition-colors">
                    @WefterMethod API
                  </Link>
                </li>
                <li>
                  <Link href="/plugin/plugin-anatomy" className="hover:text-fd-foreground transition-colors">
                    Plugin Anatomy
                  </Link>
                </li>
                <li>
                  <Link href="/plugins" className="hover:text-fd-foreground transition-colors">
                    Plugins Directory
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-fd-border/60 pt-6 text-xs text-fd-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/Logo/Dark/Icon.svg" alt="Wefter Icon" className="h-4 w-4 dark:hidden" />
              <img src="/Logo/Light/Icon.svg" alt="Wefter Icon" className="h-4 w-4 hidden dark:block" />
              <span>&copy; {new Date().getFullYear()} Wefter Native Runtime. Open Source under MIT License.</span>
            </div>
            <div className="flex items-center gap-5 font-medium">
              <Link href="/docs" className="hover:text-fd-foreground transition-colors">
                Docs
              </Link>
              <Link href="/plugins" className="hover:text-fd-foreground transition-colors">
                Plugins
              </Link>
              <Link href="/cli" className="hover:text-fd-foreground transition-colors">
                CLI
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-fd-foreground transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
