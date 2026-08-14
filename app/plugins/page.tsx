"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  Package,
  ShieldCheck,
  Smartphone,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  ArrowRight,
  PackageCheck,
  ChevronRight as ChevronRightIcon,
  Code2,
  Terminal,
  Users,
  X,
  Plus,
  Eye,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { PluginItem } from "@/lib/db";
import { MDXRenderer } from "@/components/mdx-renderer";
import { GithubStarButton } from "@/components/github-star";

export default function PluginsDirectoryPage() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "official" | "community">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Submit Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitTab, setSubmitTab] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitData, setSubmitData] = useState({
    name: "",
    packageName: "",
    repositoryUrl: "",
    npmUrl: "",
    license: "MIT",
    author: "",
    authorEmail: "",
    platforms: ["android", "ios"],
    version: "0.0.1",
    descriptionMdx: `## Overview\n\nProvide a comprehensive description of your plugin capabilities, API methods, and native setup steps.`,
  });

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
        type: selectedType,
        search: search.trim(),
      });
      const res = await fetch(`/api/plugins?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPlugins(data.plugins || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch plugins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Live real-time search with light debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlugins();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedType, page]);

  const handleCopy = (pkgName: string, id: string) => {
    navigator.clipboard.writeText(`wefter add ${pkgName}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitPlugin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.error || "Failed to submit plugin proposal.");
      }
    } catch (err) {
      setSubmitError("Network error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetSubmitForm = () => {
    setSubmitSuccess(false);
    setSubmitError("");
    setSubmitModalOpen(false);
    setSubmitData({
      name: "",
      packageName: "",
      repositoryUrl: "",
      npmUrl: "",
      license: "MIT",
      author: "",
      authorEmail: "",
      platforms: ["android", "ios"],
      version: "0.0.1",
      descriptionMdx: `## Overview\n\nProvide a comprehensive description of your plugin capabilities, API methods, and native setup steps.`,
    });
  };

  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-fd-background text-fd-foreground selection:bg-fd-primary/20">
      {/* Dynamic Background Glow Layer */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.12,transparent_65%)] blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-3.5 py-1 text-xs font-medium text-fd-muted-foreground backdrop-blur-md transition-colors hover:border-fd-primary/40">
            <Sparkles className="h-3.5 w-3.5 text-fd-primary" />
            <span>Wefter Ecosystem Directory</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl leading-[1.1]">
            Native Mobile Capabilities for{" "}
            <span className="bg-gradient-to-r from-fd-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Your Wefter Applications
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-fd-muted-foreground leading-relaxed">
            Discover official core runtime capabilities and community plugins for Android and iOS with zero reflection overhead.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#plugins-grid"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground shadow-md shadow-fd-primary/15 transition-all hover:bg-fd-primary/90 hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Explore Plugins</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-5 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all hover:bg-fd-accent hover:border-fd-primary/40"
            >
              <Plus className="h-4 w-4 text-fd-primary" />
              <span>Submit Your Plugin</span>
            </button>

            <Link
              href="/plugin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-5 py-3 text-sm font-semibold text-fd-muted-foreground backdrop-blur-sm transition-all hover:bg-fd-accent hover:text-fd-foreground"
            >
              <Code2 className="h-4 w-4 text-fd-muted-foreground" />
              <span>Authoring Guide</span>
            </Link>

            <GithubStarButton className="px-5 py-3 text-sm" />
          </div>
        </div>
      </section>

      {/* Architectural Metrics Bar */}
      <section className="border-y border-fd-border/60 bg-fd-card/40 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center md:text-left">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-fd-foreground">
                {totalCount} Packages
              </div>
              <div className="mt-1 text-xs font-medium text-fd-muted-foreground">
                Total Plugins Available
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-emerald-500">
                Official Core
              </div>
              <div className="mt-1 text-xs font-medium text-fd-muted-foreground">
                Verified @wefterjs Packages
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-fd-foreground">
                Zero Reflection
              </div>
              <div className="mt-1 text-xs font-medium text-fd-muted-foreground">
                Static Kotlin & Swift Dispatchers
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-fd-foreground">
                Dual Platform
              </div>
              <div className="mt-1 text-xs font-medium text-fd-muted-foreground">
                Android & iOS Parity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Search & Filter Bar Toolbar */}
      <section id="plugins-grid" className="mx-auto w-full max-w-6xl px-6 pt-12 pb-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-fd-border/80 bg-fd-card/50 p-4 sm:p-5 shadow-xs backdrop-blur-md">
          {/* Top Row: Live Search Input + Segmented Type Control */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fd-muted-foreground" />
              <input
                type="text"
                placeholder="Search by plugin title or package (@wefterjs/haptics)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-fd-border/80 bg-fd-background/80 py-2.5 pl-10 pr-10 text-xs text-fd-foreground placeholder:text-fd-muted-foreground shadow-inner focus:border-fd-primary focus:outline-hidden transition-all"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 rounded-xl border border-fd-border/80 bg-fd-background/80 p-1.5 shadow-inner self-start md:self-auto">
              {[
                { id: "all", label: "All Packages", icon: Layers },
                { id: "official", label: "Official", icon: ShieldCheck },
                { id: "community", label: "Community", icon: Users },
              ].map(({ id, label, icon: Icon }) => {
                const isActive = selectedType === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedType(id as "all" | "official" | "community");
                      setPage(1);
                    }}
                    className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-fd-primary text-fd-primary-foreground shadow-xs scale-[1.02]"
                        : "text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground active:scale-[0.98]"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-fd-primary-foreground" : "text-fd-muted-foreground"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Status Indicator */}
          <div className="flex items-center justify-between border-t border-fd-border/60 pt-3 text-xs text-fd-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {loading
                  ? "Searching registry..."
                  : search
                  ? `Found ${totalCount} ${totalCount === 1 ? "result" : "results"} for "${search}"`
                  : `Showing ${totalCount} verified ${selectedType === "all" ? "runtime" : selectedType} packages`}
              </span>
            </div>

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="text-xs font-medium text-fd-primary hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Plugins Grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-8 flex-1">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl border border-fd-border/50 bg-fd-card/40 animate-pulse p-6"
              />
            ))}
          </div>
        ) : plugins.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-fd-border/80 bg-fd-card/30 p-16 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fd-muted text-fd-muted-foreground border border-fd-border/60">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-base text-fd-foreground">No Plugins Match Search</h3>
            <p className="mt-1 text-xs text-fd-muted-foreground max-w-sm">
              {search
                ? `No registry packages match "${search}". Try refining your search query.`
                : "No plugins available under the selected filter criteria."}
            </p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="mt-5 rounded-xl bg-fd-primary px-4 py-2 text-xs font-semibold text-fd-primary-foreground shadow-xs transition-colors hover:bg-fd-primary/90"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plugins.map((plugin) => (
              <div
                key={plugin.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-fd-border bg-fd-card/80 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-fd-primary/50 hover:shadow-lg"
              >
                <div>
                  {/* Top Row: Type Badge & Versions/Platforms */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                        plugin.type === "official"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {plugin.type === "official" && <ShieldCheck className="h-3 w-3" />}
                      <span>{plugin.type}</span>
                    </span>

                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      {plugin.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="rounded border border-fd-border/50 bg-fd-muted/60 px-1.5 py-0.5 uppercase text-fd-muted-foreground font-semibold"
                        >
                          {plat}
                        </span>
                      ))}
                      <span className="rounded border border-fd-border/80 bg-fd-muted px-2 py-0.5 text-fd-foreground font-semibold">
                        v{plugin.version}
                      </span>
                    </div>
                  </div>

                  {/* Title & Package Name */}
                  <Link href={`/plugins/${plugin.slug}`} className="block mt-4 group-hover:text-fd-primary transition-colors">
                    <h3 className="text-lg font-bold text-fd-foreground tracking-tight flex items-center justify-between">
                      <span>{plugin.name}</span>
                      <ArrowRight className="h-4 w-4 text-fd-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-fd-primary transition-all duration-200" />
                    </h3>
                    <code className="text-xs font-mono text-fd-primary block mt-1">
                      {plugin.packageName}
                    </code>
                  </Link>

                  {/* Description Snippet */}
                  <p className="mt-3 text-xs text-fd-muted-foreground leading-relaxed line-clamp-2">
                    {plugin.descriptionMdx.replace(/^#+\s.*$/gm, "").trim().slice(0, 110)}...
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-6 border-t border-fd-border/60 pt-4 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => handleCopy(plugin.packageName, plugin.id)}
                    title={`wefter add ${plugin.packageName}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-fd-border/80 bg-fd-background px-3 py-1.5 text-[11px] font-mono text-fd-muted-foreground transition-all hover:border-fd-primary/40 hover:text-fd-foreground hover:bg-fd-accent max-w-full overflow-hidden"
                  >
                    {copiedId === plugin.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="text-emerald-500 font-semibold truncate">Copied Command</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">wefter add {plugin.packageName}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/plugins/${plugin.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-fd-primary hover:underline shrink-0"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-fd-border/60 pt-6 sm:flex-row text-xs text-fd-muted-foreground">
            <div>
              Showing page <span className="font-semibold text-fd-foreground">{page}</span> of{" "}
              <span className="font-semibold text-fd-foreground">{totalPages}</span> ({totalCount} plugins total)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-fd-border bg-fd-card px-3.5 py-1.5 font-medium transition-colors hover:bg-fd-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex gap-1 font-mono">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`h-8 w-8 rounded-lg font-medium transition-colors ${
                      page === pNum
                        ? "bg-fd-primary text-fd-primary-foreground font-bold"
                        : "border border-fd-border/60 hover:bg-fd-accent text-fd-foreground"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-fd-border bg-fd-card px-3.5 py-1.5 font-medium transition-colors hover:bg-fd-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Submit Plugin Modal Dialog */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-fd-border bg-fd-card p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-fd-border/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary border border-fd-primary/20">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fd-foreground">Submit Your Plugin</h3>
                  <p className="text-xs text-fd-muted-foreground">Propose a community extension for the Wefter registry</p>
                </div>
              </div>
              <button
                onClick={resetSubmitForm}
                className="rounded-lg p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-fd-foreground">Submission Received!</h4>
                <p className="text-xs text-fd-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you! Your plugin proposal has been queued for review by the Wefter core team. Once approved, it will appear in the official directory.
                </p>
                <button
                  onClick={resetSubmitForm}
                  className="mt-4 rounded-xl bg-fd-primary px-5 py-2.5 text-xs font-semibold text-fd-primary-foreground shadow-xs hover:bg-fd-primary/90"
                >
                  Close & Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPlugin} className="space-y-4">
                {/* Grid 1: Name, Package Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Plugin Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bluetooth Low Energy"
                      value={submitData.name}
                      onChange={(e) => setSubmitData({ ...submitData, name: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. @wefter-community/ble"
                      value={submitData.packageName}
                      onChange={(e) => setSubmitData({ ...submitData, packageName: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Grid 2: npm URL, Repository URL, License */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      npm Package Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.npmjs.com/package/..."
                      value={submitData.npmUrl}
                      onChange={(e) => setSubmitData({ ...submitData, npmUrl: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      GitHub Repository <span className="text-fd-muted-foreground font-normal text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={submitData.repositoryUrl}
                      onChange={(e) => setSubmitData({ ...submitData, repositoryUrl: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      License
                    </label>
                    <input
                      type="text"
                      placeholder="MIT"
                      value={submitData.license}
                      onChange={(e) => setSubmitData({ ...submitData, license: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground font-mono uppercase focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Grid 3: Author Name, Email, Version */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={submitData.author}
                      onChange={(e) => setSubmitData({ ...submitData, author: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={submitData.authorEmail}
                      onChange={(e) => setSubmitData({ ...submitData, authorEmail: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Initial Version
                    </label>
                    <input
                      type="text"
                      value={submitData.version}
                      onChange={(e) => setSubmitData({ ...submitData, version: e.target.value })}
                      placeholder="0.0.1"
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Grid 3: Platforms, Version */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Supported Platforms
                    </label>
                    <div className="flex items-center gap-4 pt-1 text-xs">
                      {["android", "ios"].map((plat) => (
                        <label key={plat} className="flex items-center gap-1.5 cursor-pointer uppercase font-mono">
                          <input
                            type="checkbox"
                            checked={submitData.platforms.includes(plat)}
                            onChange={(e) => {
                              const newPlats = e.target.checked
                                ? [...submitData.platforms, plat]
                                : submitData.platforms.filter((p) => p !== plat);
                              setSubmitData({ ...submitData, platforms: newPlats });
                            }}
                            className="rounded border-fd-border text-fd-primary focus:ring-fd-primary"
                          />
                          <span>{plat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                      Initial Version
                    </label>
                    <input
                      type="text"
                      value={submitData.version}
                      onChange={(e) => setSubmitData({ ...submitData, version: e.target.value })}
                      placeholder="0.0.1"
                      className="w-full rounded-xl border border-fd-border bg-fd-background px-3.5 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Tabbed MDX Documentation Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground">
                      MDX Documentation & Usage
                    </label>
                    <div className="flex gap-1 rounded-lg border border-fd-border bg-fd-card p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSubmitTab("write")}
                        className={`flex items-center gap-1 rounded px-2 py-0.5 ${
                          submitTab === "write" ? "bg-fd-primary text-fd-primary-foreground font-semibold" : "text-fd-muted-foreground"
                        }`}
                      >
                        <FileText className="h-3 w-3" />
                        <span>Write</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmitTab("preview")}
                        className={`flex items-center gap-1 rounded px-2 py-0.5 ${
                          submitTab === "preview" ? "bg-fd-primary text-fd-primary-foreground font-semibold" : "text-fd-muted-foreground"
                        }`}
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  {submitTab === "write" ? (
                    <textarea
                      rows={6}
                      value={submitData.descriptionMdx}
                      onChange={(e) => setSubmitData({ ...submitData, descriptionMdx: e.target.value })}
                      className="w-full rounded-xl border border-fd-border bg-fd-background p-3 text-xs font-mono text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                    />
                  ) : (
                    <div className="min-h-[160px] rounded-xl border border-fd-border bg-fd-background p-4 text-xs overflow-y-auto max-h-60">
                      <MDXRenderer content={submitData.descriptionMdx} />
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetSubmitForm}
                    className="rounded-xl border border-fd-border/70 bg-fd-background px-4 py-2 text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-fd-primary px-5 py-2 text-xs font-semibold text-fd-primary-foreground shadow-xs hover:bg-fd-primary/90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Proposal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Multi-Column Footer */}
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
                  <button
                    onClick={() => setSubmitModalOpen(true)}
                    className="hover:text-fd-foreground transition-colors text-left"
                  >
                    Submit a Plugin
                  </button>
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
                href="https://github.com/Wefters/wefter"
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
