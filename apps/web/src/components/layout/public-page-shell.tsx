import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { ReactNode } from "react";

type PublicPageShellProps = {
  children: ReactNode;
};

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
