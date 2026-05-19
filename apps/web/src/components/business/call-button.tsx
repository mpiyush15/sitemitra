"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContactLoginGate } from "@/hooks/use-contact-login-gate";
import { telUrl } from "@/lib/public";
import { cn } from "@/lib/cn";

type CallButtonProps = {
  phone: string;
  className?: string;
  /** When true (default), guests are prompted to log in instead of calling. */
  requireLogin?: boolean;
};

export function CallButton({ phone, className, requireLogin = true }: CallButtonProps) {
  const { ensureLoggedIn } = useContactLoginGate();

  if (requireLogin) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
        onClick={() => {
          if (!ensureLoggedIn()) return;
          window.location.href = telUrl(phone);
        }}
      >
        Call now
      </Button>
    );
  }

  return (
    <Link href={telUrl(phone)} className={className}>
      <Button variant="outline" size="sm">
        Call now
      </Button>
    </Link>
  );
}
