/** The page heading: the page's icon from its frontmatter, then its title. */

import { DocsTitle } from "@/layouts/docs/page";
import { lucideIcon } from "@/lib/source";

/** The `<h1>` of a docs page. Pages without an `icon` show the title alone. */
export function PageTitle({ title, icon }: { title: string; icon?: string }) {
  const Icon = lucideIcon(icon);
  return (
    <DocsTitle className="flex items-center gap-3">
      {Icon && (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-fd-primary/15 bg-fd-primary/10 text-fd-primary">
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      <span>{title}</span>
    </DocsTitle>
  );
}
