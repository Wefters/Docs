import type { ReactNode } from "react";

/** Bare layout for the admin page, without the site navigation. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
