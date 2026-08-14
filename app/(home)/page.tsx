"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  Cpu,
  Globe,
  Layers,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
  ChevronRight,
  FileCode2,
  Boxes,
  ExternalLink,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Write Web UI",
    description:
      "Build your interface with Vue, React, Svelte, or Vanilla JS. Web assets render directly inside native OS WebViews (WebView & WKWebView).",
    tag: "Web Layer",
  },
  {
    number: "02",
    title: "Declare Native Plugins",
    description:
      "Add explicit native capability plugins via `wefter add @wefterjs/camera`. Gradle dependencies, permissions, and manifests are verified automatically.",
    tag: "Plugin Registry",
  },
  {
    number: "03",
    title: "Weave Shell & Dispatcher",
    description:
      "Running `wefter sync` generates static Kotlin & Swift dispatchers inside `.wefter/native/` with zero runtime reflection.",
    tag: "Static Generator",
  },
  {
    number: "04",
    title: "Launch Live Session",
    description:
      "Deploy signed binaries or start hot-reload sessions directly on physical devices, Android Emulators, or iOS Simulators.",
    tag: "Hot Reload",
  },
];

const features = [
  {
    icon: Zap,
    title: "Zero Reflection Overhead",
    description:
      "Native calls route through static generated Kotlin & Swift dispatchers. No JS engine overhead (V8/Hermes) and no local HTTP server lag.",
    highlight: "Static Dispatch",
    span: "lg:col-span-2",
  },
  {
    icon: Globe,
    title: "Framework Agnostic Core",
    description:
      "Runtime functions (`invokeNative`, `registerHook`) operate independently of your UI stack. Works out of the box with Vue, React, Svelte, or Vanilla JS.",
    highlight: "100% Flexible",
    span: "lg:col-span-1",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Parity",
    description:
      "Invoke uniform JavaScript signatures on Android and iOS. Platform-specific execution is encapsulated safely inside native dispatchers.",
    highlight: "Single Contract",
    span: "lg:col-span-1",
  },
  {
    icon: Cpu,
    title: "Minimal Binary Footprint",
    description:
      "No embedded WebServers or third-party engines. Compiles down to clean, lightweight, production-ready native shells.",
    highlight: "Lightweight",
    span: "lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Explicit Security Audit",
    description:
      "Plugins are never auto-discovered. `wefter add` verifies SHA-256 lockfile checksums and signature audits before compilation.",
    highlight: "Verified Code",
    span: "lg:col-span-1",
  },
];

const frameworks = [
  { name: "Vue.js", color: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5" },
  { name: "React", color: "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5" },
  { name: "Svelte", color: "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/5" },
  { name: "Angular", color: "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5" },
  { name: "Vanilla JS", color: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5" },
];

const stats = [
  { value: "Zero Reflection", label: "Static Kotlin & Swift Dispatchers" },
  { value: "Direct IPC", label: "Native OS WebView Bridge" },
  { value: "Universal UI", label: "Vue, React, Svelte & Vanilla JS" },
  { value: "No Node Server", label: "Pure Compiled Native Shell" },
];

const codeExamples = {
  js: {
    filename: "app.ts",
    language: "TypeScript",
    code: `import { invokeNative } from "@wefterjs/core";

// 1. Asynchronous Web JavaScript Invocation
const result = await invokeNative<{ active: boolean }>(
  "camera",
  "toggleTorch",
  { enable: true }
);

console.log("Hardware torch status:", result.active);`,
  },
  kotlin: {
    filename: "CameraPlugin.kt",
    language: "Kotlin (Android)",
    code: `// 2. Native Kotlin Plugin Dispatcher
class CameraPlugin : WefterPlugin() {
    @WefterMethod
    fun toggleTorch(payload: Map<String, Any>, callback: BridgeCallback) {
        val enable = payload["enable"] as? Boolean ?: false
        hardware.setTorch(enable)
        resolve(callback, mapOf("active" to enable))
    }
}`,
  },
  swift: {
    filename: "CameraPlugin.swift",
    language: "Swift (iOS)",
    code: `// 3. Native Swift Plugin Dispatcher
@objc(CameraPlugin)
public class CameraPlugin: WefterPlugin {
    @WefterMethod
    public func toggleTorch(_ payload: [String: Any], _ callback: BridgeCallback) {
        let enable = payload["enable"] as? Bool ?? false
        hardware.setTorch(enable)
        resolve(callback, ["active": enable])
    }
}`,
  },
};

const installOptions = {
  npx: {
    label: "npx",
    cmd: "npx wefter init && npm install && npx wefter sync",
    lines: ["npx wefter init", "npm install", "npx wefter sync"],
  },
  global: {
    label: "Global CLI",
    cmd: "npm install -g @wefterjs/cli && wefter init && npm install && wefter sync",
    lines: ["npm install -g @wefterjs/cli", "wefter init", "npm install && wefter sync"],
  },
  pnpm: {
    label: "pnpm",
    cmd: "pnpm dlx wefter init && pnpm install && pnpm wefter sync",
    lines: ["pnpm dlx wefter init", "pnpm install", "pnpm wefter sync"],
  },
  yarn: {
    label: "yarn",
    cmd: "yarn dlx wefter init && yarn install && yarn wefter sync",
    lines: ["yarn dlx wefter init", "yarn install", "yarn wefter sync"],
  },
};

export default function HomePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"js" | "kotlin" | "swift">("js");
  const [pmTab, setPmTab] = useState<keyof typeof installOptions>("npx");

  const currentCmd = installOptions[pmTab].cmd;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-fd-background text-fd-foreground selection:bg-fd-primary/20">
      {/* Dynamic Background Glow Layer */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.12,transparent_65%)] blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-14 md:pt-20 md:pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-3.5 py-1 text-xs font-medium text-fd-muted-foreground backdrop-blur-md transition-colors hover:border-fd-primary/40">
            <Sparkles className="h-3.5 w-3.5 text-fd-primary" />
            <span>Wefter Architecture v0.0.3</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Headline (Max 2 lines) */}
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl leading-[1.1]">
            Build Native Mobile Apps with the{" "}
            <span className="bg-gradient-to-r from-fd-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Web Code You Already Know
            </span>
          </h1>

          {/* Subtext (Max 20 words) */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-fd-muted-foreground leading-relaxed">
            Compile Vue, React, Svelte, and Vanilla JS into lightweight native shells with zero-reflection Kotlin & Swift dispatchers.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/installing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground shadow-md shadow-fd-primary/15 transition-all hover:bg-fd-primary/90 hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs/introduction"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-5 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all hover:bg-fd-accent hover:border-fd-border/80"
            >
              <Code2 className="h-4 w-4 text-fd-muted-foreground" />
              <span>Read Architecture</span>
            </Link>
          </div>

          {/* Terminal Command Bar */}
          <div className="mt-10 w-full max-w-xl overflow-hidden rounded-xl border border-fd-border bg-fd-card/90 shadow-xl text-left backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-fd-border/70 bg-fd-muted/30 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-fd-muted-foreground" />
                  <span className="font-mono text-xs text-fd-muted-foreground font-medium">Quick Setup</span>
                </div>
                <div className="flex gap-1 border-l border-fd-border/60 pl-3">
                  {(Object.keys(installOptions) as Array<keyof typeof installOptions>).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPmTab(pm)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                        pmTab === pm
                          ? "bg-fd-primary text-fd-primary-foreground"
                          : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/60"
                      }`}
                    >
                      {installOptions[pm].label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-fd-border/60 bg-fd-background/80 px-2.5 py-1 text-xs font-medium text-fd-muted-foreground transition-all hover:text-fd-foreground hover:bg-fd-accent"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 font-mono text-xs sm:text-sm text-fd-foreground space-y-1.5">
              {installOptions[pmTab].lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-fd-primary font-bold select-none">$</span>
                  <span className="truncate">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Framework Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-fd-muted-foreground mr-1">
              Supports:
            </span>
            {frameworks.map((fw) => (
              <span
                key={fw.name}
                className={`rounded-full border px-3 py-0.5 text-xs font-medium ${fw.color}`}
              >
                {fw.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Architectural Metrics */}
      <section className="border-y border-fd-border/60 bg-fd-card/40 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-lg sm:text-xl font-bold tracking-tight text-fd-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-fd-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Interactive Playground */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-fd-foreground">
            Unified JS Call, Direct Native Dispatch
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-fd-muted-foreground">
            Invoke native capabilities asynchronously from JavaScript and receive strongly-typed Promises directly from Kotlin and Swift.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-2xl">
          {/* Tab Bar Header */}
          <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/20 px-4 pt-2">
            <div className="flex gap-1 overflow-x-auto">
              {(["js", "kotlin", "swift"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "border-fd-primary text-fd-primary bg-fd-card rounded-t-lg"
                      : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
                  }`}
                >
                  <FileCode2 className="h-4 w-4" />
                  <span>{codeExamples[tab].language}</span>
                </button>
              ))}
            </div>
            <div className="hidden sm:block text-xs font-mono text-fd-muted-foreground px-3 py-1">
              {codeExamples[activeTab].filename}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto bg-fd-card text-fd-foreground">
            <pre>
              <code>{codeExamples[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 4-Step Process Pipeline */}
      <section className="border-t border-fd-border bg-fd-card/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-fd-foreground">
              How Wefter Operates
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-fd-muted-foreground">
              A 4-step workflow connecting web user interfaces to disposable native runtime shells.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-xl border border-fd-border bg-fd-card p-5 shadow-xs transition-all hover:border-fd-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fd-primary/10 text-xs font-bold text-fd-primary group-hover:bg-fd-primary group-hover:text-fd-primary-foreground transition-colors">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fd-muted-foreground bg-fd-muted/60 px-2 py-0.5 rounded">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-fd-foreground">{step.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-fd-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-fd-foreground">
            Architected for High-Performance Mobile Runtime
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-fd-muted-foreground">
            Designed for deterministic native builds, zero reflection overhead, and security audits.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const IconComp = feat.icon;
            return (
              <div
                key={feat.title}
                className={`group rounded-2xl border border-fd-border bg-fd-card p-6 shadow-xs transition-all hover:border-fd-primary/40 hover:shadow-md ${feat.span}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary group-hover:bg-fd-primary group-hover:text-fd-primary-foreground transition-colors">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-fd-muted-foreground border border-fd-border/60 bg-fd-muted/40 px-2.5 py-0.5 rounded-full">
                    {feat.highlight}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-fd-foreground">{feat.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-fd-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Navigation & Documentation Cards */}
      <section className="border-t border-fd-border bg-fd-card/30 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-fd-foreground">
              Explore Documentation
            </h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              Jump directly into runtime guides, plugin development, and CLI tools.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href="/docs"
              className="group rounded-xl border border-fd-border bg-fd-card p-6 transition-all hover:border-fd-primary/50 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-fd-foreground group-hover:text-fd-primary">Docs Guide</span>
                <ChevronRight className="h-4 w-4 text-fd-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-fd-primary" />
              </div>
              <p className="mt-3 text-xs sm:text-sm text-fd-muted-foreground leading-relaxed">
                Architecture overview, setup prerequisites, configuration schema, and FAQs.
              </p>
            </Link>

            <Link
              href="/plugin"
              className="group rounded-xl border border-fd-border bg-fd-card p-6 transition-all hover:border-fd-primary/50 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-fd-foreground group-hover:text-fd-primary">Plugin Authoring</span>
                <ChevronRight className="h-4 w-4 text-fd-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-fd-primary" />
              </div>
              <p className="mt-3 text-xs sm:text-sm text-fd-muted-foreground leading-relaxed">
                Build native Kotlin & Swift plugins with `@WefterMethod` and lifecycle hooks.
              </p>
            </Link>

            <Link
              href="/cli"
              className="group rounded-xl border border-fd-border bg-fd-card p-6 transition-all hover:border-fd-primary/50 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-fd-foreground group-hover:text-fd-primary">CLI Reference</span>
                <ChevronRight className="h-4 w-4 text-fd-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-fd-primary" />
              </div>
              <p className="mt-3 text-xs sm:text-sm text-fd-muted-foreground leading-relaxed">
                Complete CLI command reference for `init`, `sync`, `build`, `run`, and `doctor`.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border bg-fd-card/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-fd-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-fd-primary" />
            <span className="font-medium text-fd-foreground">Wefter Native Runtime</span>
            <span>— Open Source Architecture</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/docs" className="hover:text-fd-foreground transition-colors">
              Docs
            </Link>
            <Link href="/plugin" className="hover:text-fd-foreground transition-colors">
              Plugin
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
      </footer>
    </main>
  );
}
