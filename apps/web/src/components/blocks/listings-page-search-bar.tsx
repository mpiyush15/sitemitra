"use client";

import { useEffect } from "react";

export const LISTINGS_PAGE_SEARCH_VISIBILITY_EVENT = "site-mitra:listings-search-visibility";

export function ListingsPageSearchBridge() {
  useEffect(() => {
    const element = document.getElementById("listings-page-search");
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent(LISTINGS_PAGE_SEARCH_VISIBILITY_EVENT, {
            detail: { inView: entry.isIntersecting },
          }),
        );
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return null;
}
