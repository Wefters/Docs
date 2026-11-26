/** Shown with status 404 when no plugin in the registry has the slug in the address. */

import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export default function PluginNotFound() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <PackageX className="size-10 text-fd-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-fd-foreground">Plugin not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
          No plugin in the registry has this address. It may have been renamed or removed.
        </p>
        <Link
          href="/plugins"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-all hover:bg-fd-primary/90 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          Back to the registry
        </Link>
      </div>
      <SiteFooter />
    </>
  );
}
