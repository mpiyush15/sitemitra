"use client";

import { cn } from "@/lib/cn";

type CyclingSearchPlaceholderProps = {
  label: string;
  visible: boolean;
  className?: string;
};

export function CyclingSearchPlaceholder({
  label,
  visible,
  className,
}: CyclingSearchPlaceholderProps) {
  if (!visible) return null;

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-4 top-1/2 z-[11] max-w-[calc(100%-1rem)] -translate-y-1/2 truncate text-sm text-muted-foreground transition-opacity duration-300 ease-in-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {label}
    </span>
  );
}
