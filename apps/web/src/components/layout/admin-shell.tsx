"use client";

import type { ReactNode } from "react";
import { PlatformShell } from "@/components/layout/platform-shell";
import { filterPlatformNav } from "@/lib/platform-nav";

type AdminShellProps = {
  children: ReactNode;
  role: string;
  fullName?: string;
  userEmail?: string;
  roleLabel?: string;
  onLogout?: () => void;
};

/** @deprecated Prefer `app/admin/layout.tsx` + `PlatformShell` directly. */
export function AdminShell({
  children,
  role,
  fullName,
  userEmail,
  roleLabel,
  onLogout,
}: AdminShellProps) {
  const sections = filterPlatformNav(role);

  return (
    <PlatformShell
      sections={sections}
      homeHref="/admin"
      homeSubtitle="Platform"
      fullName={fullName}
      userEmail={userEmail}
      roleLabel={roleLabel}
      onLogout={onLogout}
    >
      {children}
    </PlatformShell>
  );
}

export { filterPlatformNav };
