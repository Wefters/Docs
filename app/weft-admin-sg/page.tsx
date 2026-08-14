"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  ExternalLink,
  Package,
  Sparkles,
  ArrowLeft,
  Code2,
  Eye,
  FileText,
  AlertTriangle,
  User,
  GitBranch,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
} from "lucide-react";
import type { PluginItem, SubmissionItem } from "@/lib/db";
import { MDXRenderer } from "@/components/mdx-renderer";
import { TurnstileWidget } from "@/components/turnstile";

export default function WefterAdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"plugins" | "submissions">("plugins");

  // Plugins State
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "official" | "community">("all");

  // Submissions State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [reviewSubmission, setReviewSubmission] = useState<SubmissionItem | null>(null);
  const [rejectingSubmission, setRejectingSubmission] = useState<SubmissionItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [subActionLoading, setSubActionLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<PluginItem | null>(null);
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  // Form State
  const [formData, setFormData] = useState<Partial<PluginItem>>({
    name: "",
    packageName: "",
    slug: "",
    type: "official",
    platforms: ["android", "ios"],
    version: "0.0.1",
    author: "Wefter Core Team",
    repositoryUrl: "https://github.com/Wefters/wefter",
    npmUrl: "",
    license: "MIT",
    descriptionMdx: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Dialog State
  const [deletingPlugin, setDeletingPlugin] = useState<PluginItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check auth session on load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchPlugins();
          fetchSubmissions();
        }
      }
    } catch (err) {
      setAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, turnstileToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        fetchPlugins();
        fetchSubmissions();
      } else {
        setAuthError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setAuthError("Authentication error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setAuthenticated(false);
      setUsername("");
      setPassword("");
      setTurnstileToken("");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plugins?limit=100");
      if (res.ok) {
        const data = await res.json();
        setPlugins(data.plugins || []);
      }
    } catch (err) {
      console.error("Failed to fetch plugins:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingPlugin(null);
    setFormData({
      name: "",
      packageName: "",
      slug: "",
      type: "official",
      platforms: ["android", "ios"],
      version: "0.0.1",
      author: "Wefter Core Team",
      repositoryUrl: "https://github.com/Wefters/wefter",
      npmUrl: "",
      license: "MIT",
      descriptionMdx: `## Overview\n\nDetailed description of plugin capabilities.\n\n### Installation\n\n\`\`\`bash\nwefter add @wefterjs/plugin-name\n\`\`\`\n\n### JavaScript API\n\n\`\`\`typescript\nimport { Plugin } from '@wefterjs/plugin-name';\n\nconst result = await Plugin.execute();\n\`\`\``,
    });
    setFormError("");
    setEditorTab("write");
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (plugin: PluginItem) => {
    setEditingPlugin(plugin);
    setFormData({ ...plugin });
    setFormError("");
    setEditorTab("write");
    setModalOpen(true);
  };

  // Save Plugin (Create or Update)
  const handleSavePlugin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.packageName) {
      setFormError("Plugin Title and Package Name are required.");
      return;
    }

    setSaving(true);
    try {
      const method = editingPlugin ? "PUT" : "POST";
      const res = await fetch("/api/plugins", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPlugins();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to save plugin");
      }
    } catch (err) {
      setFormError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Plugin
  const handleDeletePlugin = async () => {
    if (!deletingPlugin) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/plugins?id=${deletingPlugin.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingPlugin(null);
        fetchPlugins();
      }
    } catch (err) {
      console.error("Failed to delete plugin:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Submission Approval Handler
  const handleApproveSubmission = async (sub: SubmissionItem) => {
    setSubActionLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id, action: "approve" }),
      });
      if (res.ok) {
        setReviewSubmission(null);
        fetchPlugins();
        fetchSubmissions();
      }
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setSubActionLoading(false);
    }
  };

  // Submission Rejection Handler
  const handleRejectSubmission = async () => {
    if (!rejectingSubmission) return;
    setSubActionLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectingSubmission.id,
          action: "reject",
          rejectionReason,
        }),
      });
      if (res.ok) {
        setRejectingSubmission(null);
        setRejectionReason("");
        fetchSubmissions();
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setSubActionLoading(false);
    }
  };

  // Submission Delete Handler
  const handleDeleteSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error("Delete submission error:", err);
    }
  };

  // Filtered Plugins List
  const filteredPlugins = plugins.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.packageName.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "all" || p.type === filterType;

    return matchesSearch && matchesType;
  });

  const pendingSubmissionsCount = submissions.filter((s) => s.status === "pending").length;

  // Loading State
  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-fd-background text-fd-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-fd-primary border-t-transparent" />
      </div>
    );
  }

  // Auth Gate Screen
  if (!authenticated) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-fd-background text-fd-foreground px-6 py-12 selection:bg-fd-primary/20">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-5xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.15,transparent_65%)] blur-3xl" />

        <div className="w-full max-w-md space-y-8 rounded-2xl border border-fd-border bg-fd-card p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center gap-2">
              <img
                src="/Logo/Dark/Logo.svg"
                alt="Wefter Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/Logo/Light/Logo.svg"
                alt="Wefter Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Registry Admin</h1>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Enter admin authentication credentials to access the Wefter Plugin Registry portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                required
                className="w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-xs text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-xs text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-hidden"
              />
            </div>

            {/* Cloudflare Turnstile Widget Container */}
            {turnstileSiteKey && (
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
              />
            )}

            {authError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-fd-primary py-3 text-xs font-semibold text-fd-primary-foreground shadow-md transition-all hover:bg-fd-primary/90 disabled:opacity-50 mt-2"
            >
              {authLoading ? "Authenticating..." : "Unlock Admin Portal"}
            </button>
          </form>

          <div className="border-t border-fd-border/60 pt-4 text-center">
            <Link
              href="/plugins"
              className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Plugins Directory</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated Admin Portal UI
  return (
    <main className="relative flex min-h-screen flex-col bg-fd-background text-fd-foreground selection:bg-fd-primary/20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.12,transparent_65%)] blur-3xl" />

      {/* Admin Control Bar */}
      <div className="border-b border-fd-border bg-fd-card/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/Logo/Dark/Logo.svg"
                alt="Wefter Logo"
                className="h-7 w-auto dark:hidden"
              />
              <img
                src="/Logo/Light/Logo.svg"
                alt="Wefter Logo"
                className="h-7 w-auto hidden dark:block"
              />
            </div>
            <div className="h-5 w-px bg-fd-border/70" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">Registry Admin</h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                  Authorized
                </span>
              </div>
              <p className="text-[11px] text-fd-muted-foreground font-mono">
                Management portal for plugins.json & submissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/plugins"
              className="inline-flex items-center gap-1.5 rounded-xl border border-fd-border/70 bg-fd-background px-3.5 py-2 text-xs font-semibold text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Directory</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 flex-1 space-y-8">
        {/* Dashboard Hero Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-fd-border bg-fd-card p-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-fd-primary mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Plugin Registry Management</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Plugin Ecosystem Admin</h2>
            <p className="text-xs text-fd-muted-foreground mt-1">
              Create, edit, approve, and publish official and community plugin definitions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-xs font-semibold text-fd-primary-foreground shadow-md transition-all hover:bg-fd-primary/90 hover:scale-[1.01] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Plugin</span>
            </button>
          </div>
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-fd-muted-foreground">Total Published</div>
            <div className="mt-2 text-2xl font-extrabold text-fd-foreground">{plugins.length}</div>
          </div>

          <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-500">Official Plugins</div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-500">
              {plugins.filter((p) => p.type === "official").length}
            </div>
          </div>

          <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-purple-500">Community Plugins</div>
            <div className="mt-2 text-2xl font-extrabold text-purple-500">
              {plugins.filter((p) => p.type === "community").length}
            </div>
          </div>

          <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center justify-between">
              <span>Submissions Queue</span>
              {pendingSubmissionsCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <div className="mt-2 text-2xl font-extrabold text-amber-500">
              {pendingSubmissionsCount} <span className="text-xs font-normal text-fd-muted-foreground">pending</span>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-fd-border pb-3">
          <button
            onClick={() => setActiveTab("plugins")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "plugins"
                ? "bg-fd-primary text-fd-primary-foreground shadow-xs"
                : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Published Registry ({plugins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "submissions"
                ? "bg-fd-primary text-fd-primary-foreground shadow-xs"
                : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Community Submissions</span>
            {pendingSubmissionsCount > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PUBLISHED REGISTRY */}
        {activeTab === "plugins" && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fd-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search plugins by title or package name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-fd-border bg-fd-card py-2.5 pl-10 pr-4 text-xs text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-fd-border/70 bg-fd-card p-1 text-xs">
                {(["all", "official", "community"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`rounded-lg px-3 py-1 capitalize transition-colors ${
                      filterType === t
                        ? "bg-fd-primary text-fd-primary-foreground font-semibold"
                        : "text-fd-muted-foreground hover:text-fd-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Plugins Table */}
            <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-xs text-fd-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-fd-primary border-t-transparent mx-auto mb-2" />
                  <span>Loading registry database...</span>
                </div>
              ) : filteredPlugins.length === 0 ? (
                <div className="p-12 text-center text-xs text-fd-muted-foreground">
                  No plugins match current filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-fd-border bg-fd-muted/50 font-mono text-[11px] uppercase tracking-wider text-fd-muted-foreground">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold">Plugin Details</th>
                        <th className="px-6 py-3.5 font-semibold">Type</th>
                        <th className="px-6 py-3.5 font-semibold">Version</th>
                        <th className="px-6 py-3.5 font-semibold">Author</th>
                        <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fd-border/60">
                      {filteredPlugins.map((plugin) => (
                        <tr key={plugin.id} className="transition-colors hover:bg-fd-accent/30">
                          <td className="px-6 py-4">
                            <Link
                              href={`/plugins/${plugin.slug}`}
                              target="_blank"
                              className="group inline-block"
                            >
                              <div className="font-bold text-fd-foreground group-hover:text-fd-primary transition-colors flex items-center gap-1.5">
                                <span>{plugin.name}</span>
                                <ExternalLink className="h-3 w-3 text-fd-muted-foreground group-hover:text-fd-primary" />
                              </div>
                              <code className="text-[11px] font-mono text-fd-muted-foreground block mt-0.5">
                                {plugin.packageName}
                              </code>
                            </Link>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase ${
                                plugin.type === "official"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              }`}
                            >
                              {plugin.type === "official" && <ShieldCheck className="h-3 w-3" />}
                              <span>{plugin.type}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 font-mono text-fd-muted-foreground">v{plugin.version}</td>
                          <td className="px-6 py-4 text-fd-foreground">{plugin.author}</td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(plugin)}
                                className="inline-flex items-center gap-1 rounded-lg border border-fd-border/70 bg-fd-background px-2.5 py-1.5 font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
                              >
                                <Edit className="h-3.5 w-3.5 text-fd-primary" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => setDeletingPlugin(plugin)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-500/15"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY SUBMISSIONS */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
              {submissionsLoading ? (
                <div className="p-12 text-center text-xs text-fd-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-fd-primary border-t-transparent mx-auto mb-2" />
                  <span>Loading community submissions queue...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-16 text-center text-xs text-fd-muted-foreground space-y-3">
                  <Inbox className="h-8 w-8 text-fd-muted-foreground mx-auto" />
                  <div className="font-bold text-sm text-fd-foreground">Submissions Queue Empty</div>
                  <p>No community plugin proposals have been submitted yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-fd-border bg-fd-muted/50 font-mono text-[11px] uppercase tracking-wider text-fd-muted-foreground">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold">Plugin & Package</th>
                        <th className="px-6 py-3.5 font-semibold">Submitted By</th>
                        <th className="px-6 py-3.5 font-semibold">Repository</th>
                        <th className="px-6 py-3.5 font-semibold">Status</th>
                        <th className="px-6 py-3.5 font-semibold text-right">Review Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fd-border/60">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="transition-colors hover:bg-fd-accent/30">
                          <td className="px-6 py-4">
                            <div className="font-bold text-fd-foreground">{sub.name}</div>
                            <code className="text-[11px] font-mono text-fd-primary block mt-0.5">
                              {sub.packageName}
                            </code>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-semibold text-fd-foreground">{sub.author}</div>
                            <div className="text-[11px] text-fd-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              <span>{sub.authorEmail}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <a
                              href={sub.repositoryUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-fd-primary hover:underline"
                            >
                              <span>Repo</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase ${
                                sub.status === "approved"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                  : sub.status === "rejected"
                                  ? "border-red-500/30 bg-red-500/10 text-red-500"
                                  : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {sub.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                              {sub.status === "rejected" && <XCircle className="h-3 w-3" />}
                              {sub.status === "pending" && <Clock className="h-3 w-3" />}
                              <span>{sub.status}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setReviewSubmission(sub)}
                                className="inline-flex items-center gap-1 rounded-lg border border-fd-border bg-fd-background px-2.5 py-1.5 font-semibold text-fd-foreground hover:bg-fd-accent"
                              >
                                <Eye className="h-3.5 w-3.5 text-fd-primary" />
                                <span>Review</span>
                              </button>

                              {sub.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApproveSubmission(sub)}
                                    disabled={subActionLoading}
                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 shadow-xs"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Approve & Publish</span>
                                  </button>

                                  <button
                                    onClick={() => setRejectingSubmission(sub)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 font-semibold text-red-500 hover:bg-red-500/20"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="p-1.5 text-fd-muted-foreground hover:text-red-500 transition-colors"
                                title="Delete submission entry"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PLUGIN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-fd-border bg-fd-card p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-fd-border/70 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
                  {editingPlugin ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <h3 className="text-base font-bold text-fd-foreground">
                  {editingPlugin ? "Edit Registry Plugin" : "Add New Registry Plugin"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlugin} className="space-y-4">
              {/* Grid 1: Name, Package Name, Slug */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    Plugin Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Native Camera"
                    required
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={formData.packageName || ""}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    placeholder="e.g. @wefterjs/camera"
                    required
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="camera (auto-generated)"
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Grid 2: Type & Version */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    Plugin Type
                  </label>
                  <select
                    value={formData.type || "official"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as "official" | "community" })
                    }
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  >
                    <option value="official">Official</option>
                    <option value="community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version || "0.0.1"}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="0.0.1"
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground font-mono focus:border-fd-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Grid 3: Author, License */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Wefter Core Team"
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    License
                  </label>
                  <input
                    type="text"
                    value={formData.license || "MIT"}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    placeholder="MIT"
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground font-mono uppercase focus:border-fd-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Grid 4: npm URL & Repository URL */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    npm Package Link *
                  </label>
                  <input
                    type="url"
                    value={formData.npmUrl || ""}
                    onChange={(e) => setFormData({ ...formData, npmUrl: e.target.value })}
                    placeholder="https://www.npmjs.com/package/..."
                    required
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1.5">
                    GitHub Repository <span className="text-fd-muted-foreground font-normal text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.repositoryUrl || ""}
                    onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/Wefters/wefter"
                    className="w-full rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* MDX Content Editor with Write/Preview Tabs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    MDX Documentation Content
                  </label>
                  <div className="flex gap-1 rounded-lg border border-fd-border bg-fd-background p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setEditorTab("write")}
                      className={`flex items-center gap-1 rounded px-2 py-0.5 ${
                        editorTab === "write" ? "bg-fd-primary text-fd-primary-foreground font-semibold" : "text-fd-muted-foreground"
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      <span>Write</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab("preview")}
                      className={`flex items-center gap-1 rounded px-2 py-0.5 ${
                        editorTab === "preview" ? "bg-fd-primary text-fd-primary-foreground font-semibold" : "text-fd-muted-foreground"
                      }`}
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview MDX</span>
                    </button>
                  </div>
                </div>

                {editorTab === "write" ? (
                  <textarea
                    rows={10}
                    value={formData.descriptionMdx || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionMdx: e.target.value })}
                    placeholder="Write MDX documentation..."
                    className="w-full rounded-xl border border-fd-border bg-fd-background p-3 text-xs font-mono text-fd-foreground focus:border-fd-primary focus:outline-hidden"
                  />
                ) : (
                  <div className="min-h-[220px] rounded-xl border border-fd-border bg-fd-background p-4 text-xs overflow-y-auto max-h-80">
                    <MDXRenderer content={formData.descriptionMdx || ""} />
                  </div>
                )}
              </div>

              {formError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-fd-border/70 bg-fd-background px-4 py-2 text-xs font-semibold text-fd-muted-foreground transition-colors hover:bg-fd-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-fd-primary px-5 py-2 text-xs font-semibold text-fd-primary-foreground shadow-xs transition-all hover:bg-fd-primary/90 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{saving ? "Saving..." : editingPlugin ? "Update Plugin" : "Publish Plugin"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSION MODAL */}
      {reviewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-fd-border bg-fd-card p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-fd-border/70 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fd-foreground">Review Plugin Submission</h3>
                  <p className="text-xs text-fd-muted-foreground">{reviewSubmission.packageName}</p>
                </div>
              </div>
              <button
                onClick={() => setReviewSubmission(null)}
                className="rounded-lg p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2 bg-fd-background p-4 rounded-xl border border-fd-border/70">
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Title & License</span>
                  <span className="font-bold text-fd-foreground text-sm">{reviewSubmission.name}</span>
                  <span className="text-[11px] font-mono text-fd-muted-foreground block">License: {reviewSubmission.license || "MIT"}</span>
                </div>
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Author</span>
                  <span className="font-semibold text-fd-foreground">{reviewSubmission.author} ({reviewSubmission.authorEmail})</span>
                </div>
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">npm Package</span>
                  {reviewSubmission.npmUrl ? (
                    <a href={reviewSubmission.npmUrl} target="_blank" rel="noreferrer" className="text-red-500 hover:underline flex items-center gap-1 font-mono">
                      <span>{reviewSubmission.npmUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-fd-muted-foreground">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Repository</span>
                  {reviewSubmission.repositoryUrl ? (
                    <a href={reviewSubmission.repositoryUrl} target="_blank" rel="noreferrer" className="text-fd-primary hover:underline flex items-center gap-1 font-mono">
                      <span>{reviewSubmission.repositoryUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-fd-muted-foreground">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block">Version & Platforms</span>
                  <span className="font-mono text-fd-foreground uppercase">v{reviewSubmission.version} · {reviewSubmission.platforms.join(", ")}</span>
                </div>
              </div>

              <div>
                <span className="text-fd-muted-foreground font-mono uppercase text-[10px] block mb-2">Submitted MDX Documentation</span>
                <div className="max-h-72 overflow-y-auto rounded-xl border border-fd-border bg-fd-background p-4">
                  <MDXRenderer content={reviewSubmission.descriptionMdx} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-fd-border">
                <button
                  onClick={() => setReviewSubmission(null)}
                  className="rounded-xl border border-fd-border px-4 py-2 text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent"
                >
                  Close Preview
                </button>
                {reviewSubmission.status === "pending" && (
                  <>
                    <button
                      onClick={() => setRejectingSubmission(reviewSubmission)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveSubmission(reviewSubmission)}
                      disabled={subActionLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      <span>{subActionLoading ? "Publishing..." : "Approve & Publish to Registry"}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT SUBMISSION MODAL */}
      {rejectingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-fd-border bg-fd-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold text-base">Reject Submission</h3>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              You are rejecting the submission for <strong className="text-fd-foreground">{rejectingSubmission.name}</strong> ({rejectingSubmission.packageName}).
            </p>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-fd-muted-foreground mb-1">
                Rejection Feedback / Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Repository is missing native source code or does not build."
                className="w-full rounded-xl border border-fd-border bg-fd-background p-3 text-xs text-fd-foreground focus:border-fd-primary focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingSubmission(null)}
                className="rounded-xl border border-fd-border px-4 py-2 text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmission}
                disabled={subActionLoading}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {subActionLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingPlugin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-fd-border bg-fd-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold text-base">Delete Plugin Definition</h3>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-fd-foreground">{deletingPlugin.name}</strong> (<code className="font-mono text-xs">{deletingPlugin.packageName}</code>)? This action will remove it from the public directory.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingPlugin(null)}
                className="rounded-xl border border-fd-border px-4 py-2 text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlugin}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
