import { pluginSource } from "@/lib/source";
import { DocsLayout } from "@/layouts/docs";
import { baseOptions, rootTabs } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/plugin">) {
  return (
    <DocsLayout tree={pluginSource.getPageTree()} tabs={rootTabs} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
