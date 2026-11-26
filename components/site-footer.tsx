/** Footer of the landing page and the plugin registry: the logo, links into each section, and the licence. */

import Link from "next/link";
import { GithubLogo } from "@/components/icons/brand-logos";

/** Footer columns: a heading and its links. A `mono` column shows its labels as commands. */
const COLUMNS: { title: string; mono?: boolean; links: { label: string; href: string }[] }[] = [
  {
    title: "Documentation",
    links: [
      { label: "Installation", href: "/docs/installing" },
      { label: "Architecture", href: "/docs/introduction" },
      { label: "App configuration", href: "/docs/app-configuration" },
      { label: "JavaScript APIs", href: "/docs/javascript-apis" },
      { label: "Bridge security", href: "/docs/native-bridge-security" },
    ],
  },
  {
    title: "CLI",
    mono: true,
    links: [
      { label: "wefter init", href: "/cli/init" },
      { label: "wefter sync", href: "/cli/sync" },
      { label: "wefter run", href: "/cli/run" },
      { label: "wefter build", href: "/cli/build" },
      { label: "wefter doctor", href: "/cli/doctor" },
    ],
  },
  {
    title: "Plugins",
    links: [
      { label: "Plugin registry", href: "/plugins" },
      { label: "Plugin guide", href: "/plugin" },
      { label: "Plugin anatomy", href: "/plugin/plugin-anatomy" },
      { label: "@WefterMethod", href: "/plugin/wefter-method" },
      { label: "Submit a plugin", href: "/plugins#submit" },
    ],
  },
];

/** The site footer. */
export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border bg-fd-card/60">
      <div className="mx-auto w-full max-w-6xl px-6 pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <img src="/Logo/Dark/Logo.svg" alt="Wefter" className="h-6 w-auto dark:hidden" />
            <img src="/Logo/Light/Logo.svg" alt="Wefter" className="hidden h-6 w-auto dark:block" />
            <p className="max-w-sm text-sm leading-relaxed text-fd-muted-foreground">
              Ship a Vue, React, Svelte or plain JavaScript app as a native Android and iOS app, with plugins written in
              Kotlin and Swift.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-fd-foreground">{column.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-fd-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`transition-colors hover:text-fd-foreground ${column.mono ? "font-mono text-[13px]" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Wefter. Open source under the MIT License.</span>
          <a
            href="https://github.com/Wefters/wefter"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-fd-foreground"
          >
            <GithubLogo className="size-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
