"use client";

import type { SmartSearchCategory } from "@/lib/smart-search";
import { buildListingsSearchParams } from "@/lib/smart-search";
import { persistSearchInquiry } from "@/lib/inquiry-message";
import { useRouteNavigate } from "@/hooks/use-route-navigate";

type NavigateToSmartSearchOptions = {
  rawQuery?: string;
  category?: string;
  city?: string;
  categories: SmartSearchCategory[];
  cities: string[];
  fallbackHref?: string;
};

export function useSmartListingsSearch() {
  const navigate = useRouteNavigate();

  return function navigateToSmartSearch({
    rawQuery = "",
    category = "",
    city = "",
    categories,
    cities,
    fallbackHref = "/listings",
  }: NavigateToSmartSearchOptions) {
    const { params, parsed } = buildListingsSearchParams(rawQuery, categories, cities, {
      category,
      city,
    });

    const hasFilters = Boolean(parsed.q || parsed.category || parsed.city);
    if (!hasFilters) {
      navigate(fallbackHref);
      return;
    }

    persistSearchInquiry(parsed);
    navigate(`/listings?${params.toString()}`);
  };
}
