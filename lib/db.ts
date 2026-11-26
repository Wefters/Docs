/** Storage for the plugin registry and plugin submissions, kept as JSON files in `data/`. */

import fs from "fs";
import path from "path";

/** A plugin listed in the registry. `descriptionMdx` is shown on its detail page. */
export interface PluginItem {
  id: string;
  name: string;
  packageName: string;
  slug: string;
  type: "official" | "community";
  platforms: string[];
  version: string;
  author: string;
  repositoryUrl?: string;
  npmUrl?: string;
  license?: string;
  descriptionMdx: string;
  createdAt: string;
  updatedAt: string;
}

/** A plugin submitted by a community author, waiting for review or already reviewed. */
export interface SubmissionItem {
  id: string;
  name: string;
  packageName: string;
  slug: string;
  author: string;
  authorEmail: string;
  repositoryUrl?: string;
  npmUrl?: string;
  license?: string;
  platforms: string[];
  version: string;
  descriptionMdx: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

/** Files the registry and submissions are stored in. */
const DATA_FILE = path.join(process.cwd(), "data", "plugins.json");
const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "submissions.json");

/** Every registered plugin; empty when the file is missing or invalid. */
function readLocalPlugins(): PluginItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading plugins.json:", error);
    return [];
  }
}

/** Saves the registry. */
function writeLocalPlugins(plugins: PluginItem[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(plugins, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing plugins.json:", error);
  }
}

/** Every submission; empty when the file is missing or invalid. */
function readLocalSubmissions(): SubmissionItem[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
    const content = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading submissions.json:", error);
    return [];
  }
}

/** Saves the submissions. */
function writeLocalSubmissions(submissions: SubmissionItem[]) {
  try {
    const dir = path.dirname(SUBMISSIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing submissions.json:", error);
  }
}

/**
 * One page of plugins, filtered by type (`official`, `community` or `all`) and a search over name, package
 * and description.
 */
export async function getPlugins(
  options: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  } = {},
) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(50, options.limit || 9));
  const search = (options.search || "").toLowerCase().trim();
  const type = options.type || "all";

  let items = readLocalPlugins();

  if (type && type !== "all") {
    items = items.filter((p) => p.type === type);
  }

  if (search) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.packageName.toLowerCase().includes(search) ||
        p.descriptionMdx.toLowerCase().includes(search),
    );
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedPlugins = items.slice(startIndex, startIndex + limit);

  return {
    plugins: paginatedPlugins,
    total,
    totalPages,
    page,
    limit,
  };
}

/** The plugin with this slug or id, or `null`. */
export async function getPluginBySlug(slug: string): Promise<PluginItem | null> {
  const items = readLocalPlugins();
  return items.find((p) => p.slug === slug || p.id === slug) || null;
}

/** Updates the plugin with the same id or slug, or adds a new one (deriving the slug from the name). */
export async function upsertPlugin(input: Partial<PluginItem>): Promise<PluginItem> {
  const items = readLocalPlugins();
  const now = new Date().toISOString();
  const existingIndex = items.findIndex(
    (p) => (input.id && p.id === input.id) || (input.slug && p.slug === input.slug),
  );

  let updatedPlugin: PluginItem;

  if (existingIndex >= 0) {
    updatedPlugin = {
      ...items[existingIndex],
      ...input,
      updatedAt: now,
    } as PluginItem;
    items[existingIndex] = updatedPlugin;
  } else {
    const slug =
      input.slug || (input.name ? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `plugin-${Date.now()}`);
    updatedPlugin = {
      id: input.id || slug,
      name: input.name || "Untitled Plugin",
      packageName: input.packageName || "@wefter-community/plugin",
      slug,
      type: input.type || "community",
      platforms: input.platforms && input.platforms.length ? input.platforms : ["android", "ios"],
      version: input.version || "0.0.1",
      author: input.author || "Community Developer",
      repositoryUrl: input.repositoryUrl || undefined,
      npmUrl: input.npmUrl || undefined,
      license: input.license || "MIT",
      descriptionMdx: input.descriptionMdx || "## Overview\n\nCustom plugin description.",
      createdAt: now,
      updatedAt: now,
    };
    items.unshift(updatedPlugin);
  }

  writeLocalPlugins(items);
  return updatedPlugin;
}

/** Removes a plugin by id or slug. Returns `false` when it does not exist. */
export async function deletePlugin(id: string): Promise<boolean> {
  const items = readLocalPlugins();
  const filtered = items.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === items.length) return false;
  writeLocalPlugins(filtered);
  return true;
}

/** Every submission. */
export async function getSubmissions(): Promise<SubmissionItem[]> {
  return readLocalSubmissions();
}

/** Stores a new submission as `pending`. */
export async function createSubmission(input: Partial<SubmissionItem>): Promise<SubmissionItem> {
  const items = readLocalSubmissions();
  const now = new Date().toISOString();
  const slug = input.slug || (input.name ? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `sub-${Date.now()}`);

  const newSubmission: SubmissionItem = {
    id: `sub-${Date.now()}`,
    name: input.name || "Untitled Plugin",
    packageName: input.packageName || "@community/plugin",
    slug,
    author: input.author || "Community Developer",
    authorEmail: input.authorEmail || "",
    repositoryUrl: input.repositoryUrl || undefined,
    npmUrl: input.npmUrl || undefined,
    license: input.license || "MIT",
    platforms: input.platforms && input.platforms.length ? input.platforms : ["android", "ios"],
    version: input.version || "0.0.1",
    descriptionMdx: input.descriptionMdx || "## Overview\n\nPlugin submission description.",
    status: "pending",
    submittedAt: now,
  };

  items.unshift(newSubmission);
  writeLocalSubmissions(items);
  return newSubmission;
}

/**
 * Marks a submission approved and publishes it to the registry as a community plugin.
 *
 * @returns The published plugin, or `null` when the submission does not exist.
 */
export async function approveSubmission(id: string): Promise<PluginItem | null> {
  const submissions = readLocalSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index < 0) return null;

  const sub = submissions[index];
  const now = new Date().toISOString();

  submissions[index] = {
    ...sub,
    status: "approved",
    reviewedAt: now,
  };
  writeLocalSubmissions(submissions);

  const publishedPlugin = await upsertPlugin({
    name: sub.name,
    packageName: sub.packageName,
    slug: sub.slug,
    type: "community",
    platforms: sub.platforms,
    version: sub.version,
    author: sub.author,
    repositoryUrl: sub.repositoryUrl,
    npmUrl: sub.npmUrl,
    license: sub.license || "MIT",
    descriptionMdx: sub.descriptionMdx,
  });

  return publishedPlugin;
}

/** Marks a submission rejected, with an optional reason. */
export async function rejectSubmission(id: string, reason?: string): Promise<boolean> {
  const submissions = readLocalSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index < 0) return false;

  submissions[index] = {
    ...submissions[index],
    status: "rejected",
    rejectionReason: reason || "Does not meet ecosystem quality standards",
    reviewedAt: new Date().toISOString(),
  };
  writeLocalSubmissions(submissions);
  return true;
}

/** Removes a submission. Returns `false` when it does not exist. */
export async function deleteSubmission(id: string): Promise<boolean> {
  const submissions = readLocalSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  if (filtered.length === submissions.length) return false;
  writeLocalSubmissions(filtered);
  return true;
}
