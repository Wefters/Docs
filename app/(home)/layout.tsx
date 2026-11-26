import { HomeLayout } from "@/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

/** Layout of the landing page. */
export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
