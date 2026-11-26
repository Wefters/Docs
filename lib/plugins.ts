/** Helpers for showing registry plugins: a plain-text summary, an icon, and platform names. */

import { Fingerprint, KeyRound, MapPin, Puzzle, ScanLine, Vibrate, type LucideIcon } from "lucide-react";

/** The first paragraph of a plugin's Markdown description as plain text, without headings or code. */
export function pluginSummary(markdown: string): string {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const paragraph = withoutCode
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("-") && !block.startsWith("*"));
  if (!paragraph) return "";
  return paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * A plugin's description without its opening heading and opening paragraph, which the detail page already
 * shows as the plugin's name and summary.
 */
export function pluginBody(markdown: string): string {
  const lines = markdown.split("\n");
  let i = 0;
  const skipBlank = () => {
    while (i < lines.length && lines[i].trim() === "") i++;
  };
  skipBlank();
  if (lines[i]?.startsWith("#")) i++;
  skipBlank();
  if (lines[i] !== undefined && !/^(#|```|[-*]\s|\d+\.\s|>|\|)/.test(lines[i])) {
    while (i < lines.length && lines[i].trim() !== "") i++;
  }
  skipBlank();
  return lines.slice(i).join("\n");
}

/** Icons for the kinds of plugin, matched against the plugin's slug. */
const ICONS: [RegExp, LucideIcon][] = [
  [/haptic|vibrat/, Vibrate],
  [/scan|barcode|qr/, ScanLine],
  [/secure|storage|keychain/, KeyRound],
  [/geo|location|gps|map/, MapPin],
  [/biometric|auth|face|touch/, Fingerprint],
];

/** The icon that suits a plugin, or a puzzle piece for any other kind. */
export function pluginIcon(slug: string): LucideIcon {
  return ICONS.find(([pattern]) => pattern.test(slug))?.[1] ?? Puzzle;
}

/** A platform's display name: `android` becomes "Android" and `ios` "iOS". */
export function platformName(platform: string): string {
  if (platform === "ios") return "iOS";
  if (platform === "android") return "Android";
  return platform;
}
