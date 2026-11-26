"use client";
import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { useSearchContext } from "@fumadocs/base-ui/contexts/search";
import { useTranslations } from "@fuma-translate/react";
import { cn } from "../../../lib/cn";
import { type ButtonProps, buttonVariants } from "../../../components/ui/button";
import { Dialog } from "@base-ui/react/dialog";

/** Props of {@link SearchTrigger}; `hideIfDisabled` hides it when search is off. */
export interface SearchTriggerProps extends Omit<ComponentProps<"button">, "color">, ButtonProps {
  hideIfDisabled?: boolean;
}

/** Icon button that opens the search dialog. */
export function SearchTrigger({ hideIfDisabled, size = "icon-sm", color = "ghost", ...props }: SearchTriggerProps) {
  const { enabled, dialogHandle } = useSearchContext();
  const t = useTranslations({ note: "search trigger" });
  if (hideIfDisabled && !enabled) return null;

  return (
    <Dialog.Trigger
      handle={dialogHandle}
      type="button"
      className={cn(
        buttonVariants({
          size,
          color,
        }),
        props.className,
      )}
      data-search=""
      aria-label={t("Open Search", { note: "aria-label" })}
    >
      <Search />
    </Dialog.Trigger>
  );
}

/** Props of {@link FullSearchTrigger}. */
export interface FullSearchTriggerProps extends ComponentProps<"button"> {
  hideIfDisabled?: boolean;
}

/** Search field look-alike, with its keyboard shortcut, that opens the search dialog. */
export function FullSearchTrigger({ hideIfDisabled, ...props }: FullSearchTriggerProps) {
  const { enabled, hotKey, dialogHandle } = useSearchContext();
  const t = useTranslations({ note: "search trigger" });
  if (hideIfDisabled && !enabled) return null;

  return (
    <Dialog.Trigger
      handle={dialogHandle}
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
        props.className,
      )}
    >
      <Search className="size-4" />
      {t("Search")}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd key={i} className="rounded-md border bg-fd-background px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </Dialog.Trigger>
  );
}
