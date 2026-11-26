/** Content sources of the three documentation sections, built from the MDX files in `content/`. */

import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";

const docs = defineDocs({ dir: "content/docs" });
const pluginDocs = defineDocs({ dir: "content/plugin" });
const cliDocs = defineDocs({ dir: "content/cli" });

/** Guides and concepts, served under `/docs`. */
export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

/** Plugin authoring docs, served under `/plugin`. */
export const pluginSource = loader({
  baseUrl: "/plugin",
  source: pluginDocs.toFumadocsSource(),
});

/** CLI reference, served under `/cli`. */
export const cliSource = loader({
  baseUrl: "/cli",
  source: cliDocs.toFumadocsSource(),
});
