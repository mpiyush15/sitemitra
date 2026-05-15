"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HiHome,
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
  HiSquares2X2,
  HiUserCircle,
} from "react-icons/hi2";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { getProfile } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/auth-routing";
import { getStoredToken } from "@/lib/session";
import { cn } from "@/lib/cn";

/** Matches `Button` outline + primary tokens for tiles */
const outlineTile = cn(
  "rounded-lg border border-border bg-transparent font-semibold text-foreground shadow-sm transition-colors",
  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
);

const primaryTile = cn(
  "rounded-lg border border-transparent bg-accent font-semibold text-accent-foreground shadow-sm transition-colors",
  "hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
);

const ghostTile = cn(
  "rounded-lg border border-transparent font-medium transition-colors",
  "hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
);

const tileInner =
  "flex h-10 w-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-tight";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { open, mode, openAuth } = useAuthModal();
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

  const homeActive = pathname === "/";
  const listingsActive = pathname.startsWith("/listings");
  const accountLinkActive =
    !!role && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"));
  const loginModalActive = !role && open && mode === "login";
  const listModalActive = open && mode === "register-business";

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid w-full grid-cols-4 gap-2 px-3 py-2">
        <Link
          href="/"
          className={cn(
            tileInner,
            ghostTile,
            homeActive ? "border-primary/40 bg-primary/5 text-primary" : "text-muted-foreground",
          )}
        >
          {homeActive ? (
            <HiHome className="h-5 w-5 shrink-0" aria-hidden />
          ) : (
            <HiOutlineHome className="h-5 w-5 shrink-0" aria-hidden />
          )}
          <span>Home</span>
        </Link>

        <Link
          href="/listings"
          className={cn(
            tileInner,
            ghostTile,
            listingsActive ? "border-primary/40 bg-primary/5 text-primary" : "text-muted-foreground",
          )}
        >
          {listingsActive ? (
            <HiSquares2X2 className="h-5 w-5 shrink-0" aria-hidden />
          ) : (
            <HiOutlineSquares2X2 className="h-5 w-5 shrink-0" aria-hidden />
          )}
          <span>Browse</span>
        </Link>

        {role ? (
          <Link
            href={getPostAuthPath(role)}
            className={cn(
              tileInner,
              outlineTile,
              accountLinkActive && "border-primary/50 bg-primary/5 text-primary",
              !accountLinkActive && "text-muted-foreground",
            )}
          >
            <HiUserCircle className="h-4 w-4 shrink-0" aria-hidden />
            <span>Account</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuth("login")}
            className={cn(
              tileInner,
              outlineTile,
              loginModalActive && "border-primary/50 bg-primary/5 text-primary",
              !loginModalActive && "text-muted-foreground",
            )}
          >
            <HiOutlineUserCircle className="h-4 w-4 shrink-0" aria-hidden />
            <span>Log in</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => openAuth("register-business")}
          className={cn(
            tileInner,
            primaryTile,
            listModalActive && "ring-2 ring-primary/30",
          )}
        >
          <HiOutlinePlusCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span>List</span>
        </button>
      </div>
    </nav>
  );
}
