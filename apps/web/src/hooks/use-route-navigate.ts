"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { hrefHasHash, scrollForHref } from "@/lib/scroll-on-navigate";

export function useRouteNavigate() {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      router.push(href, { scroll: false });
      if (!hrefHasHash(href)) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } else {
        scrollForHref(href);
      }
    },
    [router],
  );
}
