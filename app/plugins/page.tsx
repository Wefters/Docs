/**
 * Plugin registry: official and community plugins, searchable and filtered by who maintains them, and a
 * dialog for authors to submit their own plugin for review.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Plus, Search, SearchX, X } from "lucide-react";
import type { PluginItem } from "@/lib/db";
import { PageBand } from "@/components/page-band";
import { PluginCard } from "@/components/plugins/plugin-card";
import { SubmitPluginDialog } from "@/components/plugins/submit-plugin-dialog";
import { SiteFooter } from "@/components/site-footer";

/** Who maintains the plugins being shown. */
type Filter = "all" | "official" | "community";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "official", label: "Official" },
  { id: "community", label: "Community" },
];

/** Plugins on one page of the list: three rows of three. */
const PAGE_SIZE = 9;

/** The registry page. Opening it at `#submit` opens the submission dialog. */
export default function PluginsDirectoryPage() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    const openFromHash = () => window.location.hash === "#submit" && setSubmitOpen(true);
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          type: filter,
          search: search.trim(),
        });
        const res = await fetch(`/api/plugins?${params}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setPlugins(data.plugins ?? []);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total ?? 0);
        }
      } catch (err) {
        if (!controller.signal.aborted) console.error("Failed to load plugins:", err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, filter, page]);

  /** Closes the submission dialog and drops `#submit` from the address. */
  function closeSubmit() {
    setSubmitOpen(false);
    if (window.location.hash === "#submit") history.replaceState(null, "", window.location.pathname);
  }

  /** Shows the first page for a new search or filter. */
  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <PageBand className="py-16 text-center sm:py-20">
          <p className="inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-fd-primary">
            <span className="h-px w-6 bg-fd-primary/60" />
            Plugin registry
            <span className="h-px w-6 bg-fd-primary/60" />
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-fd-foreground sm:text-5xl">
            Native plugins for Wefter apps
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty text-fd-muted-foreground">
            Add the camera, secure storage, haptics and more to your app with one <code>wefter add</code>. Official
            plugins are maintained by the Wefter team; community plugins are reviewed before they are listed.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-semibold text-fd-primary-foreground shadow-sm transition-all hover:-translate-y-px hover:bg-fd-primary/90 active:translate-y-0 active:scale-[0.98]"
            >
              <Plus className="size-4" />
              Submit a plugin
            </button>
            <Link
              href="/plugin"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-semibold text-fd-foreground transition-all hover:-translate-y-px hover:bg-fd-accent active:translate-y-0 active:scale-[0.98]"
            >
              <BookOpen className="size-4 text-fd-muted-foreground" />
              Read the plugin guide
            </Link>
          </div>
        </PageBand>

        <section aria-labelledby="plugins-list" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
          <h2 id="plugins-list" className="sr-only">
            Plugins
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <label htmlFor="plugin-search" className="sr-only">
                Search plugins
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fd-muted-foreground" />
              <input
                id="plugin-search"
                type="search"
                placeholder="Search by name or package"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                className="w-full rounded-lg border border-fd-border bg-fd-card py-2 pr-9 pl-9 text-sm text-fd-foreground placeholder:text-fd-muted-foreground transition-colors focus:border-fd-primary focus:outline-hidden focus:ring-2 focus:ring-fd-primary/20 [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <p className="hidden text-sm text-fd-muted-foreground md:block" aria-live="polite">
                {loading ? "Loading…" : `${total} ${total === 1 ? "plugin" : "plugins"}`}
              </p>
              <div
                role="group"
                aria-label="Maintained by"
                className="flex rounded-lg border border-fd-border bg-fd-card p-1"
              >
                {FILTERS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={filter === id}
                    onClick={() => {
                      setFilter(id);
                      setPage(1);
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      filter === id
                        ? "bg-fd-accent text-fd-accent-foreground"
                        : "text-fd-muted-foreground hover:text-fd-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {loading && plugins.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-60 animate-pulse rounded-xl border border-fd-border bg-fd-card" />
                ))}
              </div>
            ) : plugins.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-fd-border px-6 py-16 text-center">
                <SearchX className="size-8 text-fd-muted-foreground" />
                <h3 className="mt-4 text-base font-semibold text-fd-foreground">No plugins found</h3>
                <p className="mt-1 max-w-sm text-sm text-fd-muted-foreground">
                  {search
                    ? `Nothing matches “${search}”. Try the package name, such as @wefterjs/scanner.`
                    : "There are no plugins in this group yet."}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={() => changeSearch("")}
                    className="mt-5 rounded-lg border border-fd-border px-3.5 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}
              >
                {plugins.map((plugin) => (
                  <PluginCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-1.5 text-sm">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
                className="rounded-lg border border-fd-border p-2 text-fd-foreground transition-colors hover:bg-fd-accent disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  className={`size-9 rounded-lg font-medium transition-colors ${
                    page === n
                      ? "bg-fd-primary text-fd-primary-foreground"
                      : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
                className="rounded-lg border border-fd-border p-2 text-fd-foreground transition-colors hover:bg-fd-accent disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </section>
      </div>

      <SiteFooter />
      <SubmitPluginDialog open={submitOpen} onClose={closeSubmit} />
    </>
  );
}
