"use client";

import { useState } from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCog6Tooth,
  HiOutlineInformationCircle,
  HiOutlineUser,
} from "react-icons/hi2";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

type PlatformUserMenuProps = {
  fullName: string;
  email: string;
  roleLabel?: string;
  onLogout?: () => void | Promise<void>;
  loggingOut?: boolean;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getFirstName(name: string) {
  return name.trim().split(" ")[0] ?? name;
}

export function PlatformUserMenu({
  fullName,
  email,
  roleLabel,
  onLogout,
  loggingOut = false,
  className,
}: PlatformUserMenuProps) {
  const [open, setOpen] = useState(false);
  const firstName = getFirstName(fullName);
  const initials = getInitials(fullName);

  async function handleLogout() {
    if (loggingOut || !onLogout) return;
    setOpen(false);
    await onLogout();
  }

  return (
    <DropdownMenu
      className={className}
      align="end"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/60 sm:gap-3 sm:pr-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-white">
            {initials}
          </span>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">{firstName}</span>
          {open ? (
            <HiOutlineChevronUp className="hidden h-4 w-4 text-muted-foreground sm:block" />
          ) : (
            <HiOutlineChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          )}
        </span>
      }
    >
      <div className="w-64 p-2">
        <div className="border-b border-border px-3 py-3">
          <p className="text-sm font-semibold text-foreground">{fullName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{email}</p>
          {roleLabel && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-accent">{roleLabel}</p>
          )}
        </div>

        <div className="py-1">
          <DropdownMenuItem className="gap-3 rounded-lg px-3">
            <HiOutlineUser className="h-5 w-5 shrink-0 text-muted-foreground" />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 rounded-lg px-3">
            <HiOutlineCog6Tooth className="h-5 w-5 shrink-0 text-muted-foreground" />
            Account settings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 rounded-lg px-3">
            <HiOutlineInformationCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            Support
          </DropdownMenuItem>
        </div>

        <div className="border-t border-border pt-1">
          {onLogout && (
            <DropdownMenuItem
              className="gap-3 rounded-lg px-3"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <Spinner size="sm" />
              ) : (
                <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              {loggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          )}
        </div>
      </div>
    </DropdownMenu>
  );
}
