"use client";

import type { ReactNode } from "react";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type LoginGatedBlockProps = {
  isLoggedIn: boolean;
  children: ReactNode;
  message?: string;
  className?: string;
};

export function LoginGatedBlock({
  isLoggedIn,
  children,
  message = "Log in to view this information.",
  className,
}: LoginGatedBlockProps) {
  const { openAuth } = useAuthModal();

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className={cn("space-y-3 py-1 text-center sm:text-left", className)}>
      <HiOutlineLockClosed className="mx-auto h-6 w-6 text-accent sm:mx-0" aria-hidden />
      <p className="text-xs text-muted-foreground">{message}</p>
      <p className="text-sm font-medium tracking-wide text-foreground">xxx</p>
      <Button type="button" size="sm" variant="outline" onClick={() => openAuth("login")}>
        Log in / Sign up
      </Button>
    </div>
  );
}
