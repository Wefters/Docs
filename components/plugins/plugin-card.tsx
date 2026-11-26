/** A plugin in the registry list. The whole card opens the plugin; its copy button copies the install command. */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import type { PluginItem } from "@/lib/db";
import { platformName, pluginIcon, pluginSummary } from "@/lib/plugins";

/** Whether a plugin is maintained by the Wefter team or by the community. */
export function PluginTypeBadge({ type }: { type: PluginItem["type"] }) {
  return type === "official" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
      <ShieldCheck className="size-3.5" />
      Official
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-fd-muted px-2 py-0.5 text-xs font-medium text-fd-muted-foreground">
      Community
    </span>
  );
}

/** The card. */
export function PluginCard({ plugin }: { plugin: PluginItem }) {
  const [copied, setCopied] = useState(false);
  const Icon = pluginIcon(plugin.slug);
  const command = `wefter add ${plugin.packageName}`;

  /** Copies the install command and shows a tick for two seconds. */
  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="group relative flex flex-col rounded-xl border border-fd-border bg-fd-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/40 hover:shadow-lg hover:shadow-fd-primary/5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-fd-accent text-fd-accent-foreground">
          <Icon className="size-5" />
        </span>
        <PluginTypeBadge type={plugin.type} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-fd-foreground transition-colors group-hover:text-fd-primary">
        <Link href={`/plugins/${plugin.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          {plugin.name}
        </Link>
      </h3>
      <p className="mt-0.5 truncate font-mono text-xs text-fd-muted-foreground">{plugin.packageName}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fd-muted-foreground">
        {pluginSummary(plugin.descriptionMdx)}
      </p>

      <div className="flex-1" />
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-fd-border pt-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-fd-muted-foreground">
          {plugin.platforms.map((platform) => (
            <span key={platform} className="rounded-md border border-fd-border px-1.5 py-0.5">
              {platformName(platform)}
            </span>
          ))}
          <span className="px-1 font-mono">v{plugin.version}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Install command copied" : `Copy “${command}”`}
          title={command}
          className="relative z-10 rounded-lg p-2 text-fd-muted-foreground transition-all hover:bg-fd-accent hover:text-fd-foreground active:scale-95"
        >
          {copied ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}
        </button>
      </div>
    </article>
  );
}
