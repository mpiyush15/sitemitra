"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  className,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = (value: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(value);
    onOpenChange?.(value);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-[100] mt-2 min-w-[10rem] rounded-xl border border-border bg-card py-1 shadow-xl",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

type DropdownMenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function DropdownMenuItem({ children, onClick, className, disabled }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center px-4 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
