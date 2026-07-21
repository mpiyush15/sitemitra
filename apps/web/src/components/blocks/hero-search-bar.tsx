"use client";

import { FormEvent, useState } from "react";
import {
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CyclingSearchPlaceholder } from "@/components/layout/cycling-search-placeholder";
import { useCategories } from "@/hooks/use-categories";
import { useCyclingSearchSuggestion } from "@/hooks/use-cycling-search-suggestion";
import { useSmartListingsSearch } from "@/hooks/use-smart-listings-search";
import { useCities } from "@/hooks/use-cities";
import { cn } from "@/lib/cn";

type HeroSearchBarProps = {
  className?: string;
};

const fieldRow =
  "flex min-h-[3.25rem] items-center gap-2.5 px-3 sm:min-h-[3.5rem] sm:px-4";
const fieldInput =
  "h-11 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";
const fieldSelect =
  "h-11 min-w-0 flex-1 cursor-pointer border-0 bg-transparent px-0 pr-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";

export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const navigateToSmartSearch = useSmartListingsSearch();
  const { categories } = useCategories();
  const { cityNames } = useCities();
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
      cities: cityNames,
    });
  }

  return (
    <form
      id="hero-page-search"
      onSubmit={onSubmit}
      className={cn(
        "w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 sm:rounded-3xl sm:shadow-xl",
        className,
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div
          className={cn(
            fieldRow,
            "border-b border-border/80 lg:flex-[1.35] lg:border-b-0 lg:border-r",
          )}
        >
          <HiOutlineMagnifyingGlass
            className="h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1">
            <Input
              placeholder=""
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={fieldInput}
              aria-label="Search professionals"
            />
            <CyclingSearchPlaceholder
              label={label}
              visible={!query.trim() && visible}
              className="left-0 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border/80 border-b border-border/80 lg:contents lg:border-0">
          <div
            className={cn(
              fieldRow,
              "border-border/80 lg:w-[11.5rem] lg:shrink-0 lg:border-r lg:border-b-0 xl:w-52",
            )}
          >
            <HiOutlineBuildingOffice2
              className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
              aria-hidden
            />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldSelect}
              aria-label="Category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.categoryName}
                </option>
              ))}
            </Select>
          </div>

          <div
            className={cn(
              fieldRow,
              "lg:w-36 lg:shrink-0 lg:border-r lg:border-b-0 xl:w-40",
            )}
          >
            <HiOutlineMapPin
              className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
              aria-hidden
            />
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={fieldSelect}
              aria-label="City"
            >
              <option value="">All cities</option>
              {cityNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full shrink-0 rounded-none bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 sm:h-[3.25rem] lg:h-auto lg:min-h-[3.5rem] lg:w-[8.5rem] lg:px-4 xl:w-36"
        >
          <HiOutlineMagnifyingGlass className="h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
}
