import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const variants = {
  default: "border-border bg-muted text-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  warning: "border-accent/40 bg-accent/10 text-foreground",
} as const;

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
  title?: string;
};

export function Alert({ className, variant = "default", title, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    >
      {title && <p className="mb-1 font-medium">{title}</p>}
      {children}
    </div>
  );
}
