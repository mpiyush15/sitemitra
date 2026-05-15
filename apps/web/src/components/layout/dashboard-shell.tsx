"use client";

import type { ReactNode } from "react";
import { Sidebar, type NavLink } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/cn";

const DASHBOARD_LINKS: NavLink[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Inquiries", href: "/dashboard/inquiries" },
  { label: "Upgrade", href: "/dashboard/upgrade" },
];

type DashboardShellProps = {
  children: ReactNode;
  title?: string;
  userName?: string;
  links?: NavLink[];
  onLogout?: () => void;
  className?: string;
};

export function DashboardShell({
  children,
  title,
  userName,
  links = DASHBOARD_LINKS,
  onLogout,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col md:flex-row", className)}>
      <Sidebar links={links} className="hidden md:block" />
      <div className="flex flex-1 flex-col">
        <Topbar title={title} userName={userName} onLogout={onLogout} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
