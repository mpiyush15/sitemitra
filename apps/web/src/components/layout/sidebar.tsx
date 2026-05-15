"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type NavLink = {
  label: string;
  href: string;
};

type SidebarProps = {
  links: NavLink[];
  className?: string;
};

export function Sidebar({ links, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-56 shrink-0 border-r border-border bg-muted/30 p-4", className)}>
      <nav className="flex flex-col gap-1">
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">No navigation links.</p>
        ) : (
          links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
