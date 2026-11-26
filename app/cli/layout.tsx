import { cliSource } from "@/lib/source";
import { DocsLayout } from "@/layouts/docs";
import { baseOptions, rootTabs } from "@/lib/layout.shared";

/** Layout of the `/cli` section: sidebar from its page tree and the section tabs. */
export default function Layout({ children }: LayoutProps<"/cli">) {
  return (
    <DocsLayout tree={cliSource.getPageTree()} tabs={rootTabs} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
