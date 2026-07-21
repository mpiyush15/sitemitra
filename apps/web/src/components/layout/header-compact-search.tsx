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
import { useCities } from "@/hooks/use-cities";
import { useSmartListingsSearch } from "@/hooks/use-smart-listings-search";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { cn } from "@/lib/cn";

type HeaderCompactSearchProps = {
  className?: string;
  defaultQuery?: string;
  defaultCategory?: string;
  defaultCity?: string;
  cities?: string[];
};

export function HeaderCompactSearch({
  className,
  defaultQuery = "",
  defaultCategory = "",
  defaultCity = "",
}: HeaderCompactSearchProps) {
  const navigate = useRouteNavigate();
  const navigateToSmartSearch = useSmartListingsSearch();
  const { categories } = useCategories();
  const { cityNames } = useCities();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const [city, setCity] = useState(defaultCity);
  const { label, visible } = useCyclingSearchSuggestion(!query.trim());

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!query.trim() && !category && !city) {
      navigate(getSearchSuggestionHref(label));
      return;
    }

    navigateToSmartSearch({
      rawQuery: query,
      category,
      city,
      categories,
      cities: cityNames,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap", className)}
    >
      <div className="relative min-w-[8rem] flex-1 sm:min-w-[10rem]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder=""
          className="relative z-10 h-9 w-full rounded-full border-border bg-background text-sm"
          aria-label="Search"
        />
        <CyclingSearchPlaceholder
          label={label}
          visible={!query.trim() && visible}
          className="left-3"
        />
      </div>
      <Select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        aria-label="Category"
        className="h-9 w-full rounded-full border-border bg-background px-3 text-sm sm:w-[8.5rem] sm:shrink-0"
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
        className="h-9 w-full rounded-full border-border bg-background px-3 text-sm sm:w-[6.5rem] sm:shrink-0"
      >
        <option value="">All cities</option>
        {cityNames.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <HiOutlineMagnifyingGlass className="h-4 w-4" />
      </button>
    </form>
  );
}
