"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

type TopbarProps = {
  title?: string;
  userName?: string;
  onLogout?: () => void;
  className?: string;
};

export function Topbar({ title, userName, onLogout, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-border bg-background px-6",
        className,
      )}
    >
      <h1 className="text-lg font-semibold">{title ?? "Dashboard"}</h1>
      {userName && (
        <DropdownMenu
          trigger={
            <span className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium">
              {userName}
            </span>
          }
        >
          {onLogout && (
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          )}
          {!onLogout && (
            <DropdownMenuItem>Account</DropdownMenuItem>
          )}
        </DropdownMenu>
      )}
      {!userName && onLogout && (
        <Button variant="outline" size="sm" onClick={onLogout}>
          Log out
        </Button>
      )}
    </header>
  );
}
