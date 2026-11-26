import { docsSource } from "@/lib/source";
import { DocsLayout } from "@/layouts/docs";
import { baseOptions, rootTabs } from "@/lib/layout.shared";

/** Layout of the `/docs` section: sidebar from its page tree and the section tabs. */
export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={docsSource.getPageTree()} tabs={rootTabs} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
