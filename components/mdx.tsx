import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import type { MDXComponents } from "mdx/types";

/**
 * Components available in MDX pages: Fumadocs' defaults plus `Steps` and `Step`, with `components`
 * overriding them.
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    ...components,
  } satisfies MDXComponents;
}

/** Alias used by the MDX loader. */
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
