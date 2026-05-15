"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1", className)}>{children}</div>;
}
