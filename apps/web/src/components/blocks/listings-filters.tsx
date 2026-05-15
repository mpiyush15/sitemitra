"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { CategoryItem } from "@/types/api";

type ListingsFiltersProps = {
  categories?: CategoryItem[];
  cities?: string[];
  category?: string;
  city?: string;
  onCategoryChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  className?: string;
};

export function ListingsFilters({
  categories = [],
  cities = [],
  category = "",
  city = "",
  onCategoryChange,
  onCityChange,
  className,
}: ListingsFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4", className)}>
      <div className="min-w-[180px] flex-1 space-y-2">
        <Label htmlFor="filter-category">Category</Label>
        <Select
          id="filter-category"
          value={category}
          onChange={(e) => onCategoryChange?.(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.categoryName}
            </option>
          ))}
        </Select>
      </div>
      <div className="min-w-[180px] flex-1 space-y-2">
        <Label htmlFor="filter-city">City</Label>
        <Select
          id="filter-city"
          value={city}
          onChange={(e) => onCityChange?.(e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
