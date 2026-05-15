"use client";

import { useEffect } from "react";

export const HOME_PAGE_SEARCH_VISIBILITY_EVENT = "site-mitra:home-search-visibility";

const HOME_SEARCH_TARGETS = ["hero-page-search", "home-platform-search"];

export function HomePageSearchBridge() {
  useEffect(() => {
    const elements = HOME_SEARCH_TARGETS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const notify = () => {
      window.dispatchEvent(
        new CustomEvent(HOME_PAGE_SEARCH_VISIBILITY_EVENT, {
          detail: { inView: visible.size > 0 },
        }),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });
        notify();
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    notify();

    return () => observer.disconnect();
  }, []);

  return null;
}
