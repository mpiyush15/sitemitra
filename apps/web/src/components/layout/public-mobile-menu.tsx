"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type MobileMenuLink = {
  label: string;
  href: string;
};

type PublicMobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: readonly MobileMenuLink[];
  onLogin: () => void;
  onRegister: () => void;
};

export function PublicMobileMenu({
  open,
  onClose,
  links,
  onLogin,
  onRegister,
}: PublicMobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "glass-overlay absolute inset-0 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        id="public-mobile-menu"
        aria-label="Mobile navigation"
        className={cn(
          "absolute right-0 top-0 flex h-dvh w-[min(100vw,20rem)] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <p className="text-sm font-semibold text-primary">Menu</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {links.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted active:bg-muted"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-border p-4">
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
          >
            Login
          </button>
          <Button
            type="button"
            onClick={onRegister}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            List Your Business
          </Button>
        </div>
      </nav>
    </div>
  );
}
