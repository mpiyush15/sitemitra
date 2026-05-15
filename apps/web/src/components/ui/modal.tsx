"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Applied to the fixed full-screen root (e.g. z-index above sticky headers). */
  rootClassName?: string;
  variant?: "default" | "glass";
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  rootClassName,
  variant = "default",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", rootClassName)}>
      <button
        type="button"
        className={cn("absolute inset-0", variant === "glass" ? "glass-overlay" : "bg-black/50")}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl p-6",
          variant === "glass"
            ? "glass-modal"
            : "border border-border bg-card shadow-lg",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={variant === "glass" ? "hover:bg-white/50" : undefined}
          >
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
