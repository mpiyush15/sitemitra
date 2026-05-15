"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { CyclingSearchPlaceholder } from "@/components/layout/cycling-search-placeholder";
import { HeaderMobileSearch } from "@/components/layout/header-mobile-search";
import { Modal } from "@/components/ui/modal";
import { useCyclingSearchSuggestion } from "@/hooks/use-cycling-search-suggestion";
import { cn } from "@/lib/cn";

type HomeMobileHeaderSearchProps = {
  className?: string;
  defaultQuery?: string;
  defaultCategory?: string;
  defaultCity?: string;
  /** Tighter pill + icon for same-row header next to logo. */
  compact?: boolean;
};

/**
 * Home-only mobile header search: one-line trigger after the hero scrolls away;
 * full filters + query live in a modal (desktop / listings mobile unchanged).
 */
export function HomeMobileHeaderSearch({
  className,
  defaultQuery = "",
  defaultCategory = "",
  defaultCity = "",
  compact = false,
}: HomeMobileHeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { label, visible } = useCyclingSearchSuggestion(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal =
    mounted && open ? (
      <Modal
        open
        onClose={() => setOpen(false)}
        title="Search"
        rootClassName="z-[100]"
        className="max-h-[min(90dvh,36rem)] max-w-md overflow-y-auto bg-background p-5 sm:p-6"
      >
        <HeaderMobileSearch
          defaultQuery={defaultQuery}
          defaultCategory={defaultCategory}
          defaultCity={defaultCity}
          showFilters
          onAfterSubmit={() => setOpen(false)}
        />
      </Modal>
    ) : null;

  return (
    <div className={cn("min-w-0", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full min-w-0 items-center gap-1.5 bg-transparent p-0 text-left"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open search"
      >
        <div className="relative min-w-0 flex-1">
          <div
            className={cn(
              "relative flex h-9 w-full min-w-0 items-center rounded-full border border-border bg-background px-3 text-xs shadow-sm",
              !compact && "h-10 text-sm",
            )}
          >
            <CyclingSearchPlaceholder
              label={label}
              visible={visible}
              className="left-3 top-1/2 max-w-[calc(100%-0.25rem)] -translate-y-1/2 text-xs"
            />
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground",
            compact ? "h-9 w-9" : "h-10 w-10",
          )}
          aria-hidden
        >
          <HiOutlineMagnifyingGlass className="h-4 w-4" />
        </span>
      </button>

      {modal ? createPortal(modal, document.body) : null}
    </div>
  );
}
