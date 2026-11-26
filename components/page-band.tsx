/** The band at the top of the registry pages: a faded woven background behind the page's title. */

import type { ReactNode } from "react";
import { WovenBackground } from "@/components/home/woven-background";
import { cn } from "@/lib/cn";

/** The band; `className` styles the inner container that holds `children`. */
export function PageBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-fd-border">
      <WovenBackground className="h-full sm:h-full md:h-full lg:h-full" />
      <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>{children}</div>
    </section>
  );
}
