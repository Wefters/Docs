/** Dialog where community authors propose a plugin for the registry. Proposals are reviewed before listing. */

"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, Check, Eye, FileText, X } from "lucide-react";
import { MDXRenderer } from "@/components/mdx-renderer";
import { platformName } from "@/lib/plugins";

/** The values of a new proposal. */
const EMPTY_FORM = {
  name: "",
  packageName: "",
  repositoryUrl: "",
  npmUrl: "",
  license: "MIT",
  author: "",
  authorEmail: "",
  platforms: ["android", "ios"],
  version: "0.0.1",
  descriptionMdx: "## Overview\n\nWhat the plugin does, its methods, and any native setup it needs.",
};

/** Shared look of the text inputs. */
const INPUT =
  "w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground/70 transition-colors focus:border-fd-primary focus:outline-hidden focus:ring-2 focus:ring-fd-primary/20";

/** A labelled form field. */
function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fd-foreground">
        {label}
        {hint && <span className="ml-1 font-normal text-fd-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/** The dialog; it renders nothing while `open` is false. */
export function SubmitPluginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    firstField.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Closes the dialog and clears the form. */
  function close() {
    setForm(EMPTY_FORM);
    setTab("write");
    setSubmitted(false);
    setError("");
    onClose();
  }

  /** Sends the proposal for review. */
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.platforms.length === 0) {
      setError("Choose at least one platform.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) setSubmitted(true);
      else setError(data.error || "The proposal could not be sent. Try again.");
    } catch {
      setError("The proposal could not be sent. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /** Updates one text field. */
  const set = (key: keyof typeof EMPTY_FORM) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs sm:items-center"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="my-8 w-full max-w-2xl rounded-2xl border border-fd-border bg-fd-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-fd-border px-6 py-5">
          <div>
            <h2 id={`${id}-title`} className="text-lg font-semibold text-fd-foreground">
              Submit a plugin
            </h2>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              The Wefter team reviews each proposal before it is listed.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-fd-foreground">Proposal sent</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fd-muted-foreground">
              The Wefter team will review it. Once approved, it appears in the registry.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-all hover:bg-fd-primary/90 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={`${id}-name`} label="Plugin name">
                <input
                  ref={firstField}
                  id={`${id}-name`}
                  required
                  placeholder="Bluetooth Low Energy"
                  value={form.name}
                  onChange={set("name")}
                  className={INPUT}
                />
              </Field>
              <Field id={`${id}-package`} label="Package name">
                <input
                  id={`${id}-package`}
                  required
                  placeholder="@wefter-community/ble"
                  value={form.packageName}
                  onChange={set("packageName")}
                  className={`${INPUT} font-mono`}
                />
              </Field>
              <Field id={`${id}-npm`} label="npm page">
                <input
                  id={`${id}-npm`}
                  type="url"
                  required
                  placeholder="https://www.npmjs.com/package/…"
                  value={form.npmUrl}
                  onChange={set("npmUrl")}
                  className={INPUT}
                />
              </Field>
              <Field id={`${id}-repo`} label="Repository" hint="(optional)">
                <input
                  id={`${id}-repo`}
                  type="url"
                  placeholder="https://github.com/…"
                  value={form.repositoryUrl}
                  onChange={set("repositoryUrl")}
                  className={INPUT}
                />
              </Field>
              <Field id={`${id}-author`} label="Author">
                <input
                  id={`${id}-author`}
                  required
                  placeholder="Jane Doe"
                  value={form.author}
                  onChange={set("author")}
                  className={INPUT}
                />
              </Field>
              <Field id={`${id}-email`} label="Contact email">
                <input
                  id={`${id}-email`}
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={form.authorEmail}
                  onChange={set("authorEmail")}
                  className={INPUT}
                />
              </Field>
              <Field id={`${id}-version`} label="Version">
                <input
                  id={`${id}-version`}
                  placeholder="0.0.1"
                  value={form.version}
                  onChange={set("version")}
                  className={`${INPUT} font-mono`}
                />
              </Field>
              <Field id={`${id}-license`} label="License">
                <input
                  id={`${id}-license`}
                  placeholder="MIT"
                  value={form.license}
                  onChange={set("license")}
                  className={`${INPUT} font-mono`}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-fd-foreground">Platforms</legend>
              <div className="flex gap-5">
                {["android", "ios"].map((platform) => (
                  <label key={platform} className="flex cursor-pointer items-center gap-2 text-sm text-fd-foreground">
                    <input
                      type="checkbox"
                      checked={form.platforms.includes(platform)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          platforms: event.target.checked
                            ? [...current.platforms, platform]
                            : current.platforms.filter((p) => p !== platform),
                        }))
                      }
                      className="size-4 accent-fd-primary"
                    />
                    {platformName(platform)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor={`${id}-description`} className="text-sm font-medium text-fd-foreground">
                  Description <span className="font-normal text-fd-muted-foreground">(Markdown)</span>
                </label>
                <div className="flex rounded-lg border border-fd-border p-0.5 text-xs">
                  {(
                    [
                      ["write", "Write", FileText],
                      ["preview", "Preview", Eye],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={tab === value}
                      onClick={() => setTab(value)}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors ${
                        tab === value
                          ? "bg-fd-accent text-fd-accent-foreground"
                          : "text-fd-muted-foreground hover:text-fd-foreground"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {tab === "write" ? (
                <textarea
                  id={`${id}-description`}
                  rows={7}
                  value={form.descriptionMdx}
                  onChange={set("descriptionMdx")}
                  className={`${INPUT} font-mono text-[13px]`}
                />
              ) : (
                <div className="max-h-64 min-h-40 overflow-y-auto rounded-lg border border-fd-border bg-fd-background p-4 text-sm">
                  <MDXRenderer content={form.descriptionMdx} />
                </div>
              )}
            </div>

            {error && (
              <p role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="size-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-fd-border pt-5">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-all hover:bg-fd-primary/90 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send proposal"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
