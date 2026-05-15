"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { HomeMobileHeaderSearch } from "@/components/layout/home-mobile-header-search";
import { HeaderAccountButton } from "@/components/layout/header-account-button";
import { HeaderCompactSearch } from "@/components/layout/header-compact-search";
import { HeaderMobileSearch } from "@/components/layout/header-mobile-search";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { HOME_PAGE_SEARCH_VISIBILITY_EVENT } from "@/components/blocks/home-page-search-bridge";
import { LISTINGS_PAGE_SEARCH_VISIBILITY_EVENT } from "@/components/blocks/listings-page-search-bar";
import { SITE_NAME, SITE_PLATFORM_LINE, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/cn";

const fadeEase = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const searchReveal = cn(
  "transition-[opacity,transform,max-height] will-change-[opacity,transform,max-height]",
  fadeEase,
);

const headerRowReveal = cn("transition-[padding]", fadeEase);

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const isListings = pathname.startsWith("/listings");
  const usesScrollSearch = isHome || isListings;
  const listingsKey = isListings
    ? `${searchParams.get("q") ?? ""}|${searchParams.get("category") ?? ""}|${searchParams.get("city") ?? ""}`
    : "home";
  const listingsDefaults = isListings
    ? {
        q: searchParams.get("q") ?? "",
        category: searchParams.get("category") ?? "",
        city: searchParams.get("city") ?? "",
      }
    : { q: "", category: "", city: "" };
  const [showSearch, setShowSearch] = useState(!usesScrollSearch);
  const { openAuth } = useAuthModal();
  const searchVisible = showSearch || !usesScrollSearch;

  useEffect(() => {
    if (!usesScrollSearch) {
      setShowSearch(true);
      return;
    }

    const eventName = isHome
      ? HOME_PAGE_SEARCH_VISIBILITY_EVENT
      : LISTINGS_PAGE_SEARCH_VISIBILITY_EVENT;

    const onVisibility = (event: Event) => {
      const detail = (event as CustomEvent<{ inView: boolean }>).detail;
      setShowSearch(!detail.inView);
    };

    setShowSearch(false);
    window.addEventListener(eventName, onVisibility);
    return () => window.removeEventListener(eventName, onVisibility);
  }, [usesScrollSearch, isHome]);

  return (
    <header className="glass-panel sticky top-0 z-50 w-full">
      <div
        className={cn(
          "relative flex w-full max-w-none items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 lg:gap-4 lg:px-8",
          headerRowReveal,
          searchVisible && usesScrollSearch ? "py-2.5" : "py-3.5",
        )}
      >
        <Link
          href="/"
          className="relative z-10 flex min-w-0 shrink-0 items-center gap-2 sm:min-h-[2.75rem] sm:gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:h-11 sm:w-11">
            SM
          </span>
          <span className="min-w-0 max-lg:max-w-[5.5rem] sm:max-lg:max-w-none">
            <span className="block truncate text-sm font-bold tracking-wide text-primary sm:text-lg">
              {SITE_NAME.toUpperCase()}
            </span>
            {isHome ? (
              <>
                <span
                  className={cn(
                    "hidden overflow-hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block",
                    searchReveal,
                    searchVisible ? "translate-y-0 opacity-0" : "translate-y-0 opacity-100",
                  )}
                >
                  {SITE_TAGLINE}
                </span>
                <span
                  className={cn(
                    "hidden overflow-hidden text-[9px] uppercase tracking-widest text-muted-foreground/80 xl:block",
                    searchReveal,
                    searchVisible ? "translate-y-0 opacity-0" : "translate-y-0 opacity-100",
                  )}
                >
                  {SITE_PLATFORM_LINE}
                </span>
              </>
            ) : null}
          </span>
        </Link>

        {usesScrollSearch && isHome && searchVisible ? (
          <div className="relative z-10 min-w-0 flex-1 pl-2 lg:hidden">
            <HomeMobileHeaderSearch
              compact
              key={`mobile-home-inline-${listingsKey}`}
              className="w-full min-w-0 pb-0"
              defaultQuery={listingsDefaults.q}
              defaultCategory={listingsDefaults.category}
              defaultCity={listingsDefaults.city}
            />
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-3 top-1/2 z-[5] hidden -translate-y-1/2 justify-center lg:flex lg:inset-x-8">
          <div
            className={cn(
              "w-full max-w-3xl px-1",
              searchReveal,
              searchVisible
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-2 scale-[0.98] opacity-0",
            )}
          >
            <HeaderCompactSearch
              key={listingsKey}
              className="w-full"
              defaultQuery={listingsDefaults.q}
              defaultCategory={listingsDefaults.category}
              defaultCity={listingsDefaults.city}
            />
          </div>
        </div>

        <div className="relative z-10 hidden shrink-0 items-center gap-2 lg:flex">
          <HeaderAccountButton />
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="h-9 shrink-0 px-3 text-xs font-semibold shadow-sm sm:h-10 sm:px-4 sm:text-sm"
            onClick={() => openAuth("register-business")}
          >
            <span className="sm:hidden">List</span>
            <span className="hidden sm:inline">List business</span>
          </Button>
        </div>
      </div>

      {usesScrollSearch && !isHome ? (
        <div
          className={cn(
            "overflow-hidden px-3 lg:hidden sm:px-4",
            searchReveal,
            searchVisible
              ? "max-h-40 translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-1 opacity-0",
          )}
        >
          <HeaderMobileSearch
            key={`mobile-${listingsKey}`}
            className="pb-2.5"
            defaultQuery={listingsDefaults.q}
            defaultCategory={listingsDefaults.category}
            defaultCity={listingsDefaults.city}
            showFilters
          />
        </div>
      ) : !usesScrollSearch ? (
        <div className="px-3 pb-2.5 lg:hidden sm:px-4">
          <HeaderMobileSearch
            key={`mobile-${listingsKey}`}
            defaultQuery={listingsDefaults.q}
            defaultCategory={listingsDefaults.category}
            defaultCity={listingsDefaults.city}
            showFilters
          />
        </div>
      ) : null}
    </header>
  );
}
