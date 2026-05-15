"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { persistSearchInquiry } from "@/lib/inquiry-message";
import { recordSearch } from "@/lib/public";

export function SearchLogger() {
  const searchParams = useSearchParams();
  const lastKey = useRef("");

  useEffect(() => {
    const category = searchParams.get("category") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const q = searchParams.get("q") ?? undefined;
    const featured = searchParams.get("featured");

    if (featured === "1" || (!category && !city && !q)) return;

    const key = `${category ?? ""}|${city ?? ""}|${q ?? ""}`;
    if (key === lastKey.current) return;
    lastKey.current = key;

    persistSearchInquiry({ category, city, q });
    void recordSearch({ category, city, q });
  }, [searchParams]);

  return null;
}
