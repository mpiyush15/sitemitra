"use client";

import { FormEvent, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CyclingSearchPlaceholder } from "@/components/layout/cycling-search-placeholder";
import { useCategories } from "@/hooks/use-categories";
import { useCyclingSearchSuggestion } from "@/hooks/use-cycling-search-suggestion";
import { useSmartListingsSearch } from "@/hooks/use-smart-listings-search";
import { LAUNCH_CITIES } from "@/lib/constants";
import { cn } from "@/lib/cn";

type HeroSearchBarProps = {
  className?: string;
};

export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const navigateToSmartSearch = useSmartListingsSearch();
  const { categories } = useCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const { label, visible } = useCyclingSearchSuggestion(!query.trim());

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigateToSmartSearch({
      rawQuery: query,
      category,
      city,
      categories,
      cities: [...LAUNCH_CITIES],
    });
  }

  return (
    <form
      id="hero-page-search"
      onSubmit={onSubmit}
      className={cn(
        "w-full rounded-2xl bg-white p-3 shadow-xl sm:p-4",
        "flex flex-col gap-3 lg:flex-row lg:items-center",
        className,
      )}
    >
      <div className="relative min-w-0 lg:flex-1">
        <Input
          placeholder=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="relative z-10 h-12 border-0 bg-muted/60"
          aria-label="Search"
        />
        <CyclingSearchPlaceholder
          label={label}
          visible={!query.trim() && visible}
          className="left-4"
        />
      </div>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-12 border-0 bg-muted/60 lg:w-44"
        aria-label="Category"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.categoryName}
          </option>
        ))}
      </Select>
      <Select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="h-12 border-0 bg-muted/60 lg:w-36"
        aria-label="City"
      >
        <option value="">All cities</option>
        {LAUNCH_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Button
        type="submit"
        className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90 lg:w-auto lg:min-w-[140px]"
      >
        <HiOutlineMagnifyingGlass className="h-5 w-5" />
        Search
      </Button>
    </form>
  );
}
