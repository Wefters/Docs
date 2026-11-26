/** Detail page of one plugin in the registry: what it does, how to install it, and who maintains it. */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getPluginBySlug } from "@/lib/db";
import { platformName, pluginBody, pluginIcon, pluginSummary } from "@/lib/plugins";
import { PageBand } from "@/components/page-band";
import { PluginTypeBadge } from "@/components/plugins/plugin-card";
import { InstallCommand } from "@/components/plugins/install-command";
import { MDXRenderer } from "@/components/mdx-renderer";
import { GithubLogo, NpmLogo } from "@/components/icons/brand-logos";
import { SiteFooter } from "@/components/site-footer";

/** The registry changes when plugins are approved, so every request reads it. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plugin = await getPluginBySlug((await params).slug);
  if (!plugin) return { title: "Plugin not found" };
  return { title: plugin.name, description: pluginSummary(plugin.descriptionMdx) || plugin.packageName };
}

/** Shared look of the outlined link buttons. */
const LINK_BUTTON =
  "inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3.5 py-2 text-sm font-medium text-fd-foreground transition-all hover:-translate-y-px hover:bg-fd-accent active:translate-y-0 active:scale-[0.98]";

/** The plugin page; a slug no plugin has shows `not-found.tsx` with status 404. */
export default async function PluginDetailPage({ params }: Props) {
  const { slug } = await params;
  const plugin = await getPluginBySlug(slug);

  if (!plugin) notFound();

  const Icon = pluginIcon(plugin.slug);
  const summary = pluginSummary(plugin.descriptionMdx);
  const updated = new Date(plugin.updatedAt).toLocaleDateString("en", { dateStyle: "medium" });
  const details: [string, React.ReactNode][] = [
    ["Maintained by", plugin.author],
    ["Version", <span className="font-mono">{plugin.version}</span>],
    ["License", plugin.license || "MIT"],
    ["Platforms", plugin.platforms.map(platformName).join(", ")],
    ["Updated", updated],
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <PageBand className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
            <Link href="/plugins" className="transition-colors hover:text-fd-foreground">
              Plugins
            </Link>
            <ChevronRight className="size-3.5" />
            <span aria-current="page" className="truncate font-mono text-fd-foreground">
              {plugin.packageName}
            </span>
          </nav>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-fd-border bg-fd-card text-fd-primary">
                <Icon className="size-7" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <PluginTypeBadge type={plugin.type} />
                  <span className="font-mono text-xs text-fd-muted-foreground">v{plugin.version}</span>
                </div>
                <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-fd-foreground sm:text-4xl">
                  {plugin.name}
                </h1>
                {summary && (
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-pretty text-fd-muted-foreground">
                    {summary}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              {plugin.npmUrl && (
                <a href={plugin.npmUrl} target="_blank" rel="noreferrer" className={LINK_BUTTON}>
                  <NpmLogo />
                  npm
                </a>
              )}
              {plugin.repositoryUrl && (
                <a href={plugin.repositoryUrl} target="_blank" rel="noreferrer" className={LINK_BUTTON}>
                  <GithubLogo />
                  Source
                </a>
              )}
            </div>
          </div>
        </PageBand>

        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-6 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <MDXRenderer content={pluginBody(plugin.descriptionMdx)} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <section aria-labelledby="install-heading">
              <h2 id="install-heading" className="mb-2.5 text-sm font-semibold text-fd-foreground">
                Install
              </h2>
              <InstallCommand packageName={plugin.packageName} />
              <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                Then run <code className="font-mono">wefter sync</code> to add it to the native projects.
              </p>
            </section>

            <section aria-labelledby="details-heading" className="rounded-xl border border-fd-border bg-fd-card p-5">
              <h2 id="details-heading" className="text-sm font-semibold text-fd-foreground">
                Details
              </h2>
              <dl className="mt-3 divide-y divide-fd-border text-sm">
                {details.map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-fd-muted-foreground">{term}</dt>
                    <dd className="text-right font-medium text-fd-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
