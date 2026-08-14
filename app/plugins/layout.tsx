import { HomeLayout } from "@/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

export default function PluginsLayout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
