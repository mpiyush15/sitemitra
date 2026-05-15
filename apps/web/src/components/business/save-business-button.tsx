"use client";

import { useState } from "react";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/lib/api";
import { getProfile } from "@/lib/auth";
import { toggleSavedBusiness } from "@/lib/customer";
import { ROLES } from "@/lib/constants";
import { getStoredToken } from "@/lib/session";
import { cn } from "@/lib/cn";

type SaveBusinessButtonProps = {
  slug: string;
  initialSaved?: boolean;
  variant?: "icon" | "button";
  className?: string;
};

export function SaveBusinessButton({
  slug,
  initialSaved = false,
  variant = "button",
  className,
}: SaveBusinessButtonProps) {
  const { openAuth } = useAuthModal();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!getStoredToken()) {
      openAuth("login");
      return;
    }

    setLoading(true);
    try {
      const profile = await getProfile();
      if (profile.user.role !== ROLES.USER) {
        openAuth("register");
        return;
      }
      const result = await toggleSavedBusiness(slug);
      setSaved(result.saved);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        openAuth("login");
      }
    } finally {
      setLoading(false);
    }
  }

  const label = saved ? "Saved" : "Save";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted",
          className,
        )}
        aria-label={label}
        aria-pressed={saved}
      >
        {loading ? (
          <Spinner className="h-4 w-4" />
        ) : saved ? (
          <HiBookmark className="h-5 w-5 text-accent" />
        ) : (
          <HiOutlineBookmark className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className={cn("gap-1.5", className)}
      aria-pressed={saved}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : saved ? (
        <HiBookmark className="h-4 w-4 text-accent" />
      ) : (
        <HiOutlineBookmark className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
