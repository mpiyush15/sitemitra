"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { NavLink } from "@/components/layout/sidebar";

type MobileNavProps = {
  links: NavLink[];
  className?: string;
};

export function MobileNav({ links, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("md:hidden", className)}>
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border"
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-16 z-40 border-b border-border bg-background p-4 shadow-lg">
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links available.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}
    </div>
  );
}
