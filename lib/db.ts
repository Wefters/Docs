import fs from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "plugins.json");
const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "submissions.json");

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

function writeLocalPlugins(plugins: PluginItem[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(plugins, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing plugins.json:", error);
  }
}

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

function writeLocalSubmissions(submissions: SubmissionItem[]) {
  try {
    const dir = path.dirname(SUBMISSIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing submissions.json:", error);
  }
}

export async function getPlugins(options: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
} = {}) {
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
        p.descriptionMdx.toLowerCase().includes(search)
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

export async function getPluginBySlug(slug: string): Promise<PluginItem | null> {
  const items = readLocalPlugins();
  return items.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function upsertPlugin(input: Partial<PluginItem>): Promise<PluginItem> {
  const items = readLocalPlugins();
  const now = new Date().toISOString();
  const existingIndex = items.findIndex(
    (p) => (input.id && p.id === input.id) || (input.slug && p.slug === input.slug)
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
      input.slug ||
      (input.name ? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `plugin-${Date.now()}`);
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

export async function deletePlugin(id: string): Promise<boolean> {
  const items = readLocalPlugins();
  const filtered = items.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === items.length) return false;
  writeLocalPlugins(filtered);
  return true;
}

// Submissions API Helpers
export async function getSubmissions(): Promise<SubmissionItem[]> {
  return readLocalSubmissions();
}

export async function createSubmission(input: Partial<SubmissionItem>): Promise<SubmissionItem> {
  const items = readLocalSubmissions();
  const now = new Date().toISOString();
  const slug =
    input.slug ||
    (input.name ? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `sub-${Date.now()}`);

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

export async function approveSubmission(id: string): Promise<PluginItem | null> {
  const submissions = readLocalSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index < 0) return null;

  const sub = submissions[index];
  const now = new Date().toISOString();

  // Mark submission as approved
  submissions[index] = {
    ...sub,
    status: "approved",
    reviewedAt: now,
  };
  writeLocalSubmissions(submissions);

  // Publish directly to plugins.json
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

export async function deleteSubmission(id: string): Promise<boolean> {
  const submissions = readLocalSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  if (filtered.length === submissions.length) return false;
  writeLocalSubmissions(filtered);
  return true;
}
