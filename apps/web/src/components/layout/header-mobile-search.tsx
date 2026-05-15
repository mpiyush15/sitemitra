"use client";

import { FormEvent, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { CyclingSearchPlaceholder } from "@/components/layout/cycling-search-placeholder";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import {
  getSearchSuggestionHref,
  useCyclingSearchSuggestion,
} from "@/hooks/use-cycling-search-suggestion";
import { LAUNCH_CITIES } from "@/lib/constants";
import { useSmartListingsSearch } from "@/hooks/use-smart-listings-search";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { cn } from "@/lib/cn";

type HeaderMobileSearchProps = {
  className?: string;
  defaultQuery?: string;
  defaultCategory?: string;
  defaultCity?: string;
  cities?: string[];
  showFilters?: boolean;
  /** Called right before navigation (e.g. close a host modal). */
  onAfterSubmit?: () => void;
};

export function HeaderMobileSearch({
  className,
  defaultQuery = "",
  defaultCategory = "",
  defaultCity = "",
  cities = [...LAUNCH_CITIES],
  showFilters = false,
  onAfterSubmit,
}: HeaderMobileSearchProps) {
  const navigate = useRouteNavigate();
  const navigateToSmartSearch = useSmartListingsSearch();
  const { categories } = useCategories();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const [city, setCity] = useState(defaultCity);
  const { label, visible } = useCyclingSearchSuggestion(!query.trim());

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    onAfterSubmit?.();

    if (!query.trim() && !category && !city) {
      navigate(getSearchSuggestionHref(label));
      return;
    }

    navigateToSmartSearch({
      rawQuery: query,
      category,
      city,
      categories,
      cities,
    });
  }

  return (
    <form onSubmit={onSubmit} className={cn("min-w-0 space-y-2", className)}>
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder=""
            aria-label="Search"
            className="relative z-10 h-10 w-full rounded-full border-border bg-background text-sm"
          />
          <CyclingSearchPlaceholder
            label={label}
            visible={!query.trim() && visible}
            className="left-3 text-xs"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <HiOutlineMagnifyingGlass className="h-4 w-4" />
        </button>
      </div>

      {showFilters ? (
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Category"
            className="h-9 rounded-full border-border bg-background px-3 text-xs"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.categoryName}
              </option>
            ))}
          </Select>
          <Select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="City"
            className="h-9 rounded-full border-border bg-background px-3 text-xs"
          >
            <option value="">All cities</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
    </form>
  );
}
