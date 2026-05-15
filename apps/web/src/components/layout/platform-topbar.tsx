"use client";

import { HiOutlineBars3 } from "react-icons/hi2";
import { PlatformNotifications } from "@/components/layout/platform-notifications";
import { PlatformUserMenu } from "@/components/layout/platform-user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PlatformTopbarProps = {
  title: string;
  fullName?: string;
  userEmail?: string;
  roleLabel?: string;
  onLogout?: () => void | Promise<void>;
  loggingOut?: boolean;
  onMenuClick?: () => void;
  className?: string;
};

export function PlatformTopbar({
  title,
  fullName,
  userEmail,
  roleLabel,
  onLogout,
  loggingOut,
  onMenuClick,
  className,
}: PlatformTopbarProps) {
  return (
    <header
      className={cn(
        "glass-panel sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 px-4 sm:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/80 bg-white/50 text-primary md:hidden"
          aria-label="Open menu"
        >
          <HiOutlineBars3 className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {fullName && userEmail ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <PlatformNotifications />
          <PlatformUserMenu
            fullName={fullName}
            email={userEmail}
            roleLabel={roleLabel}
            onLogout={onLogout}
            loggingOut={loggingOut}
          />
        </div>
      ) : (
        onLogout && (
          <Button variant="outline" size="sm" onClick={onLogout}>
            Sign out
          </Button>
        )
      )}
    </header>
  );
}
