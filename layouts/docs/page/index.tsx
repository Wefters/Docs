"use client";
import { type ComponentProps, createContext, type FC, type ReactNode, use, useEffect, useState } from "react";
import { cn } from "../../../lib/cn";
import { useTranslations } from "@fuma-translate/react";
import { TOC, TOCPopover, TOCProvider, type TOCProviderProps, type TOCPopoverProps, type TOCProps } from "./slots/toc";
import { Footer, type FooterProps } from "./slots/footer";
import { Breadcrumb, type BreadcrumbProps } from "./slots/breadcrumb";
import { Container } from "./slots/container";
import type { TOCItemType } from "fumadocs-core/toc";
import { buttonVariants } from "../../../components/ui/button";
import { Edit } from "lucide-react";

/**
 * Options of a documentation page: its headings, full-width mode, slots, footer, breadcrumb and table of
 * contents.
 */
export interface DocsPageProps extends ComponentProps<"article"> {
  toc?: TOCItemType[];

  full?: boolean | undefined;
  slots?: Partial<DocsPageSlots>;

  footer?: FooterOptions;
  breadcrumb?: BreadcrumbOptions;
  tableOfContent?: TableOfContentOptions;
  tableOfContentPopover?: TableOfContentPopoverOptions;
}

/** Breadcrumb options and whether to show it. */
interface BreadcrumbOptions extends BreadcrumbProps {
  enabled?: boolean;
  component?: ReactNode;
}

/** Previous and next page links and whether to show them. */
interface FooterOptions extends FooterProps {
  enabled?: boolean;
  component?: ReactNode;
}

/** Table of contents options. */
type TableOfContentOptions = Pick<TOCProviderProps, "single"> &
  TOCProps & {
    enabled?: boolean;
    component?: ReactNode;
  };

/** Table of contents options on small screens, where it is a popover. */
type TableOfContentPopoverOptions = TOCPopoverProps & {
  enabled?: boolean;
  component?: ReactNode;
};

/** Replaceable parts of a documentation page. */
interface DocsPageSlots {
  toc: {
    provider: FC<TOCProviderProps>;
    main: FC<TOCProps>;
    popover: FC<TOCPopoverProps>;
  };
  container: FC<ComponentProps<"article">>;
  footer: FC<FooterProps>;
  breadcrumb: FC<BreadcrumbProps>;
}

/** Page props and slots shared with the page's parts. */
const PageContext = createContext<{
  full: NonNullable<DocsPageProps["full"]>;
  slots: DocsPageSlots;
} | null>(null);

/**
 * The documentation page's props and slots.
 *
 * @throws {Error} When used outside a {@link DocsPage}.
 */
export function useDocsPage() {
  const context = use(PageContext);
  if (!context) throw new Error("Please use page components under <DocsPage /> (`fumadocs-ui/layouts/docs/page`).");
  return context;
}

/** A documentation page: breadcrumb, content, table of contents and previous and next links. */
export function DocsPage({
  full = false,
  tableOfContent: { enabled: tocEnabled = !full, single, ...tocProps } = {},
  tableOfContentPopover: { enabled: tocPopoverEnabled, ...tocPopoverProps } = {},
  breadcrumb: { enabled: breadcrumbEnabled = true, ...breadcrumb } = {},
  footer: { enabled: footerEnabled = true, ...footer } = {},
  toc = [],
  slots: defaultSlots = {},
  children,
  ...containerProps
}: DocsPageProps) {
  tocPopoverEnabled ??= Boolean(toc.length > 0 || tocPopoverProps.header || tocPopoverProps.footer);

  const slots: DocsPageSlots = {
    breadcrumb: defaultSlots.breadcrumb ?? Breadcrumb,
    footer: defaultSlots.footer ?? Footer,
    toc: defaultSlots.toc ?? {
      provider: TOCProvider,
      main: TOC,
      popover: TOCPopover,
    },
    container: defaultSlots.container ?? Container,
  };

  return (
    <PageContext
      value={{
        full,
        slots,
      }}
    >
      <slots.toc.provider single={single} toc={tocEnabled || tocPopoverEnabled ? toc : []}>
        {tocPopoverEnabled && (tocPopoverProps.component ?? <slots.toc.popover {...tocPopoverProps} />)}
        <slots.container {...containerProps}>
          {breadcrumbEnabled && (breadcrumb.component ?? <slots.breadcrumb {...breadcrumb} />)}
          {children}
          {footerEnabled && (footer.component ?? <slots.footer {...footer} />)}
        </slots.container>
        {tocEnabled && (tocProps.component ?? <slots.toc.main {...tocProps} />)}
      </slots.toc.provider>
    </PageContext>
  );
}

/** Link to edit the page on GitHub. */
export function EditOnGitHub(props: ComponentProps<"a">) {
  const t = useTranslations({ note: "edit page" });

  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      {...props}
      className={cn(
        buttonVariants({
          color: "secondary",
          size: "sm",
        }),
        "gap-1.5 not-prose",
        props.className,
      )}
    >
      {props.children ?? (
        <>
          <Edit className="size-3.5" />
          {t("Edit on GitHub")}
        </>
      )}
    </a>
  );
}

/** The page's prose content. */
export function DocsBody({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("prose flex-1", className)}>
      {children}
    </div>
  );
}

/** The page description under its title. */
export function DocsDescription({ children, className, ...props }: ComponentProps<"p">) {
  if (children === undefined) return null;

  return (
    <p {...props} className={cn("mb-8 text-lg text-fd-muted-foreground", className)}>
      {children}
    </p>
  );
}

/** The page title. */
export function DocsTitle({ children, className, ...props }: ComponentProps<"h1">) {
  return (
    <h1 {...props} className={cn("text-[1.75em] font-semibold", className)}>
      {children}
    </h1>
  );
}

/** When the page was last updated. */
export function PageLastUpdate({ date: value, ...props }: Omit<ComponentProps<"p">, "children"> & { date: Date }) {
  const t = useTranslations({ note: "page footer" });
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(value.toLocaleDateString());
  }, [value]);

  return (
    <p {...props} className={cn("text-sm text-fd-muted-foreground", props.className)}>
      {t("Last updated on")} {date}
    </p>
  );
}

export { type BreadcrumbProps, Breadcrumb as PageBreadcrumb } from "./slots/breadcrumb";
export { type FooterProps, Footer as PageFooter } from "./slots/footer";
export { MarkdownCopyButton, ViewOptionsPopover } from "../../../components/ai/page-actions";
