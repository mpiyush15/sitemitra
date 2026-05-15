"use client";

import { useState } from "react";
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { cn } from "@/lib/cn";
import type { CategoryItem } from "@/types/api";

type ListingsSearchFormProps = {
  categories: CategoryItem[];
  cities: string[];
  defaults: {
    q?: string;
    category?: string;
    city?: string;
  };
  className?: string;
};

const pillClass =
  "relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/50";

const selectOverlayClass = "absolute inset-0 h-full w-full cursor-pointer opacity-0";

export function ListingsSearchForm({ categories, cities, defaults, className }: ListingsSearchFormProps) {
  const navigate = useRouteNavigate();
  const [values, setValues] = useState({
    category: defaults.category ?? "",
    city: defaults.city ?? "",
  });

  function apply(category: string, city: string) {
    const params = new URLSearchParams();
    if (defaults.q?.trim()) params.set("q", defaults.q.trim());
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    navigate(params.toString() ? `/listings?${params}` : "/listings");
  }

  function update(patch: Partial<typeof values>) {
    const next = { ...values, ...patch };
    setValues(next);
    apply(next.category, next.city);
  }

  const categoryLabel =
    categories.find((item) => item.slug === values.category)?.categoryName ?? "Category";
  const cityLabel = values.city || "City";
  const hasFilters = Boolean(values.category || values.city || defaults.q?.trim());

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn(pillClass, "pointer-events-none w-9 justify-center px-0")} aria-hidden>
        <HiAdjustmentsHorizontal className="h-4 w-4 text-muted-foreground" />
      </span>

      <label className={pillClass}>
        <span className={cn("max-w-[8rem] truncate", values.category && "text-primary")}>
          {values.category ? categoryLabel : "Category"}
        </span>
        <HiChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <select
          className={selectOverlayClass}
          value={values.category}
          onChange={(e) => update({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </label>

      <label className={pillClass}>
        <span className={cn("max-w-[7rem] truncate", values.city && "text-primary")}>
          {cityLabel}
        </span>
        <HiChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <select
          className={selectOverlayClass}
          value={values.city}
          onChange={(e) => update({ city: e.target.value })}
          aria-label="Filter by city"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setValues({ category: "", city: "" });
            navigate("/listings");
          }}
          className={cn(pillClass, "text-muted-foreground hover:text-foreground")}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
