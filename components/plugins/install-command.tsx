/** The `wefter add` command for a plugin, with a button that copies it. */

"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The command box. */
export function InstallCommand({ packageName }: { packageName: string }) {
  const [copied, setCopied] = useState(false);
  const command = `wefter add ${packageName}`;

  /** Copies the command and shows a tick for two seconds. */
  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background py-1.5 pr-1.5 pl-3">
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-fd-foreground">
        <span className="text-fd-muted-foreground select-none">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Command copied" : "Copy command"}
        className="shrink-0 rounded-md p-2 text-fd-muted-foreground transition-all hover:bg-fd-accent hover:text-fd-foreground active:scale-95"
      >
        {copied ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
