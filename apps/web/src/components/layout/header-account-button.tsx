"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/auth-routing";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { getStoredToken } from "@/lib/session";
import { cn } from "@/lib/cn";

type HeaderAccountButtonProps = {
  className?: string;
};

export function HeaderAccountButton({ className }: HeaderAccountButtonProps) {
  const pathname = usePathname();
  const navigate = useRouteNavigate();
  const { openAuth } = useAuthModal();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!getStoredToken()) {
      setRole(null);
      return;
    }

    getProfile()
      .then((data) => setRole(data.user.role))
      .catch(() => setRole(null));
  }, [pathname]);

  function onClick() {
    if (role) {
      navigate(getPostAuthPath(role));
      return;
    }

    openAuth("login");
  }

  if (role) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Open account"
        onClick={onClick}
        className={cn("h-9 shrink-0 px-3 sm:h-10", className)}
      >
        <HiOutlineUserCircle className="h-5 w-5 sm:mr-1.5" />
        <span className="hidden sm:inline">Account</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 border-2 px-4 font-semibold sm:h-10 sm:px-5",
        className,
      )}
    >
      Log in
    </Button>
  );
}
