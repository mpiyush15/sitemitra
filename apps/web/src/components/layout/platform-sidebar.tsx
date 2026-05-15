"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ShellNavSection } from "@/lib/shell-nav";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

type PlatformSidebarProps = {
  sections: ShellNavSection[];
  homeHref: string;
  homeSubtitle: string;
  className?: string;
  onNavigate?: () => void;
};

export function PlatformSidebar({
  sections,
  homeHref,
  homeSubtitle,
  className,
  onNavigate,
}: PlatformSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-slate-50/95 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-slate-200/80 px-5 py-5">
        <Link href={homeHref} onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            SM
          </span>
          <span>
            <span className="block text-sm font-bold text-primary">{SITE_NAME}</span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {homeSubtitle}
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isRoot = item.href === homeHref;
                const active =
                  pathname === item.href ||
                  (!isRoot && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "glass-sidebar-active font-semibold"
                          : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
