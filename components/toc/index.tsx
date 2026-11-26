/** Table of contents state shared by the TOC styles: the page's headings and which are in view. */

"use client";
import * as Primitive from "fumadocs-core/toc";
import { type ComponentProps, createContext, use, useRef } from "react";
import { cn } from "../../lib/cn";
import { mergeRefs } from "../../lib/merge-refs";

const TOCContext = createContext<Primitive.TOCItemType[]>([]);

/** The headings of the current page. */
export function useTOCItems(): Primitive.TOCItemType[] {
  return use(TOCContext);
}

export type TOCProviderProps = Primitive.AnchorProviderProps;

export const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;

/** Provides the page's headings and tracks the active one. */
export function TOCProvider({ toc, children, ...props }: TOCProviderProps) {
  return (
    <TOCContext value={toc}>
      <Primitive.AnchorProvider toc={toc} {...props}>
        {children}
      </Primitive.AnchorProvider>
    </TOCContext>
  );
}

/** Scroll container for a long table of contents, which follows the active heading and fades at its edges. */
export function TOCScrollArea({ ref, className, ...props }: ComponentProps<"div">) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mergeRefs(viewRef, ref)}
      className={cn(
        "relative min-h-0 text-sm overflow-x-clip overflow-y-auto overscroll-contain [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3",
        className,
      )}
      {...props}
    >
      <Primitive.ScrollProvider containerRef={viewRef}>{props.children}</Primitive.ScrollProvider>
    </div>
  );
}
