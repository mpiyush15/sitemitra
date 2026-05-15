"use client";

import { BrandRouteSpinner } from "@/components/ui/brand-route-spinner";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

type AuthTransitionOverlayProps = {
  exiting?: boolean;
};

export function AuthTransitionOverlay({ exiting = false }: AuthTransitionOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/95 backdrop-blur-md transition-opacity duration-500",
        exiting ? "opacity-0" : "opacity-100",
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <BrandRouteSpinner />
      <p className="mt-8 text-sm font-semibold tracking-wide text-primary">{SITE_NAME}</p>
      <p className="mt-1 text-xs text-muted-foreground">Opening your dashboard...</p>
    </div>
  );
}
