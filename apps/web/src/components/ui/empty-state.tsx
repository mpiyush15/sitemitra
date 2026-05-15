import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  className,
  title = "Nothing here yet",
  description = "Data will appear once connected or added.",
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-10 text-center",
        className,
      )}
      {...props}
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
      {children}
    </div>
  );
}
