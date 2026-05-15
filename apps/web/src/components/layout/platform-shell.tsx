"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";
import { PlatformTopbar } from "@/components/layout/platform-topbar";
import type { ShellNavSection } from "@/lib/shell-nav";
import { getShellPageTitle } from "@/lib/shell-nav";
import { cn } from "@/lib/cn";

type PlatformShellProps = {
  children: ReactNode;
  sections: ShellNavSection[];
  homeHref: string;
  homeSubtitle: string;
  fullName?: string;
  userEmail?: string;
  roleLabel?: string;
  onLogout?: () => void | Promise<void>;
  loggingOut?: boolean;
  className?: string;
};

export function PlatformShell({
  children,
  sections,
  homeHref,
  homeSubtitle,
  fullName,
  userEmail,
  roleLabel,
  onLogout,
  loggingOut,
  className,
}: PlatformShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = getShellPageTitle(pathname, sections, homeHref);

  return (
    <div className={cn("min-h-screen bg-slate-100/80", className)}>
      <PlatformSidebar
        sections={sections}
        homeHref={homeHref}
        homeSubtitle={homeSubtitle}
        className="fixed inset-y-0 left-0 z-30 hidden h-dvh md:flex"
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="glass-overlay absolute inset-0"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <PlatformSidebar
            sections={sections}
            homeHref={homeHref}
            homeSubtitle={homeSubtitle}
            className="relative z-50 h-dvh shadow-xl"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col md:pl-64">
        <PlatformTopbar
          title={title}
          fullName={fullName}
          userEmail={userEmail}
          roleLabel={roleLabel}
          onLogout={onLogout}
          loggingOut={loggingOut}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="relative z-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
