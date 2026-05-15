"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { scrollToHash, scrollToPageTop } from "@/lib/scroll-on-navigate";

function ScrollToTopOnNavigateInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const routeKey = `${pathname}?${search}`;
  const prevRouteKey = useRef(routeKey);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.length > 1) {
      requestAnimationFrame(() => {
        if (!scrollToHash(hash, "smooth")) {
          scrollToPageTop("auto");
        }
      });
      prevRouteKey.current = routeKey;
      return;
    }

    if (prevRouteKey.current !== routeKey) {
      requestAnimationFrame(() => {
        scrollToPageTop("auto");
      });
      prevRouteKey.current = routeKey;
    }
  }, [routeKey, pathname, search]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash.length > 1) {
        scrollToHash(hash, "smooth");
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}

export function ScrollToTopOnNavigate() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopOnNavigateInner />
    </Suspense>
  );
}
