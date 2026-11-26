/**
 * Content sources of the three documentation sections, built from the MDX files in `content/`.
 *
 * Every page may set, in its frontmatter:
 * - `icon`: a Lucide icon name (such as `Rocket`), shown in the sidebar and next to the page title.
 * - `sidebarTitle`: a shorter name for the sidebar when the title is long.
 */

import { createElement } from "react";
import { icons } from "lucide-react";
import { defineDocs } from "fumadocs-mdx/macro";
import { loader, type LoaderPlugin } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";

/** Frontmatter of a page: Fumadocs' own fields plus `sidebarTitle`. */
export type PageFrontmatter = NonNullable<(typeof pageSchema)["~standard"]["types"]>["output"] & {
  sidebarTitle?: string;
};

/** The parts of a Standard Schema (https://standardschema.dev) that Fumadocs uses. */
interface FrontmatterSchema<Output> {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => ValidationResult<Output>;
    readonly types?: { readonly input: unknown; readonly output: Output };
  };
}

/** The result of validating frontmatter: the value, or what is wrong with it. */
type ValidationResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
      }>;
    };

/** Fumadocs' page schema, keeping `sidebarTitle`, which it would otherwise drop. */
const pageWithSidebarTitle: FrontmatterSchema<PageFrontmatter> = {
  "~standard": {
    version: 1,
    vendor: "wefter-docs",
    validate(value: unknown): ValidationResult<PageFrontmatter> {
      const result = pageSchema["~standard"].validate(value);
      if (result instanceof Promise) throw new Error("The page schema must validate synchronously.");
      if (result.issues) return { issues: result.issues };
      const sidebarTitle = (value as { sidebarTitle?: unknown }).sidebarTitle;
      if (sidebarTitle !== undefined && typeof sidebarTitle !== "string") {
        return { issues: [{ message: "sidebarTitle must be a string", path: ["sidebarTitle"] }] };
      }
      return { value: { ...result.value, sidebarTitle } };
    },
  },
};

const docs = defineDocs({ dir: "content/docs", docs: { schema: pageWithSidebarTitle } });
const pluginDocs = defineDocs({ dir: "content/plugin", docs: { schema: pageWithSidebarTitle } });
const cliDocs = defineDocs({ dir: "content/cli", docs: { schema: pageWithSidebarTitle } });

/** The Lucide icon component named `name`, if there is one. */
export function lucideIcon(name: string | undefined) {
  return name && name in icons ? icons[name as keyof typeof icons] : undefined;
}

/** Turns an `icon` name from frontmatter or `meta.json` into the icon element. */
function resolveIcon(name: string | undefined) {
  const Icon = lucideIcon(name);
  return Icon ? createElement(Icon, { className: "size-4 shrink-0" }) : undefined;
}

/** Shows a page's `sidebarTitle` in the sidebar in place of its title. */
const sidebarTitles: LoaderPlugin = {
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      const sidebarTitle = file?.format === "page" ? (file.data as PageFrontmatter).sidebarTitle : undefined;
      return sidebarTitle ? { ...node, name: sidebarTitle } : node;
    },
  },
};

/** Guides and concepts, served under `/docs`. */
export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon: resolveIcon,
  plugins: [sidebarTitles],
});

/** Plugin authoring docs, served under `/plugin`. */
export const pluginSource = loader({
  baseUrl: "/plugin",
  source: pluginDocs.toFumadocsSource(),
  icon: resolveIcon,
  plugins: [sidebarTitles],
});

/** CLI reference, served under `/cli`. */
export const cliSource = loader({
  baseUrl: "/cli",
  source: cliDocs.toFumadocsSource(),
  icon: resolveIcon,
  plugins: [sidebarTitles],
});
