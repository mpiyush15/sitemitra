"use client";

import { HiOutlineBell } from "react-icons/hi2";
import { cn } from "@/lib/cn";

type PlatformNotificationsProps = {
  count?: number;
  className?: string;
  onClick?: () => void;
};

export function PlatformNotifications({
  count = 0,
  className,
  onClick,
}: PlatformNotificationsProps) {
  const hasUnread = count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hasUnread ? `${count} notifications` : "Notifications"}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/60 text-primary backdrop-blur-sm transition-colors hover:bg-white/80",
        className,
      )}
    >
      <HiOutlineBell className="h-5 w-5" />
      <span
        className={cn(
          "absolute right-2 top-2 rounded-full bg-accent ring-2 ring-white",
          hasUnread ? "h-2.5 w-2.5" : "h-2 w-2",
        )}
      />
    </button>
  );
}
