import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-muted text-foreground",
  accent: "bg-accent/15 text-accent border border-accent/30",
  success: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
  outline: "border border-border text-muted-foreground",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
