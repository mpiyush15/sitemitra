"use client";

import Link from "next/link";
import { HiAdjustmentsHorizontal, HiChevronDown, HiMapPin } from "react-icons/hi2";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { buildListingsSearchUrl, type ListingsSearchFilters } from "@/lib/listings-search";
import { cn } from "@/lib/cn";

type ListingsQuickFiltersProps = {
  filters: ListingsSearchFilters;
  cities: string[];
  className?: string;
};

const pillBase =
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors";

const selectOverlayClass = "absolute inset-0 h-full w-full cursor-pointer opacity-0";

function pillClass(active: boolean) {
  return cn(
    pillBase,
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/50",
  );
}

export function ListingsQuickFilters({ filters, cities, className }: ListingsQuickFiltersProps) {
  const navigate = useRouteNavigate();
  const allActive = !filters.featured && !filters.city;
  const featuredActive = Boolean(filters.featured);
  const cityActive = Boolean(filters.city);

  const baseFilters: ListingsSearchFilters = {
    category: filters.category,
    q: filters.q,
    page: 1,
  };

  const featuredHref = buildListingsSearchUrl(
    featuredActive ? baseFilters : { ...baseFilters, featured: true },
  );

  function onCityChange(city: string) {
    const next: ListingsSearchFilters = { ...baseFilters };
    if (city) next.city = city;
    navigate(buildListingsSearchUrl(next));
  }

  return (
    <div className={cn("min-w-0", className)}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:sr-only">
        Quick filters
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span
          className={cn(
            pillBase,
            "pointer-events-none w-9 justify-center border-border bg-muted/40 px-0",
          )}
          aria-hidden
        >
          <HiAdjustmentsHorizontal className="h-4 w-4 text-muted-foreground" />
        </span>

        <Link
          href={buildListingsSearchUrl(baseFilters)}
          className={pillClass(allActive)}
          aria-pressed={allActive}
        >
          All
        </Link>

        <Link href={featuredHref} className={pillClass(featuredActive)} aria-pressed={featuredActive}>
          Featured
        </Link>

        <label className={cn(pillClass(cityActive), "relative min-w-[6.5rem]")}>
          <HiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="max-w-[5rem] truncate">{filters.city || "All"}</span>
          <HiChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <select
            className={selectOverlayClass}
            value={filters.city ?? ""}
            onChange={(event) => onCityChange(event.target.value)}
            aria-label="Filter by city"
          >
            <option value="">All</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
