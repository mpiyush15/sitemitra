"use client";

import Link from "next/link";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useRouteNavigate } from "@/hooks/use-route-navigate";
import { buildListingsSearchUrl, type ListingsSearchFilters } from "@/lib/listings-search";
import { cn } from "@/lib/cn";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Experience" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
  { value: "15", label: "15+ years" },
] as const;

const CATEGORY_TYPE_OPTIONS = [
  { value: "", label: "Category" },
  { value: "professional", label: "Professionals" },
  { value: "vendor", label: "Vendors & suppliers" },
] as const;

type ListingsFilterBarProps = {
  filters: ListingsSearchFilters;
  cities: string[];
  categories: { slug: string; categoryName: string }[];
  className?: string;
};

const pillBase =
  "inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors sm:h-9 sm:px-3 sm:text-sm";

const selectClass =
  "h-8 min-w-0 max-w-[9.5rem] shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-background bg-[length:12px] bg-[right_0.5rem_center] bg-no-repeat py-0 pl-2.5 pr-7 text-xs font-medium text-foreground hover:border-primary/30 sm:h-9 sm:max-w-[11rem] sm:pl-3 sm:pr-8 sm:text-sm";

function pillClass(active: boolean) {
  return cn(
    pillBase,
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/50",
  );
}

export function ListingsFilterBar({
  filters,
  cities,
  categories,
  className,
}: ListingsFilterBarProps) {
  const navigate = useRouteNavigate();

  const allActive =
    !filters.featured &&
    !filters.city &&
    !filters.profession &&
    !filters.categoryType &&
    !filters.experience;

  const featuredActive = Boolean(filters.featured);

  function apply(patch: Partial<ListingsSearchFilters>) {
    navigate(
      buildListingsSearchUrl({
        category: filters.category,
        profession: filters.profession,
        categoryType: filters.categoryType,
        city: filters.city,
        experience: filters.experience,
        featured: undefined,
        q: filters.q,
        page: 1,
        ...patch,
      }),
    );
  }

  const baseFilters: ListingsSearchFilters = {
    q: filters.q,
    page: 1,
  };

  return (
    <div className={cn("min-w-0 border-t border-border/80 pt-3", className)}>
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span
          className={cn(pillBase, "pointer-events-none w-8 justify-center border-border bg-muted/40 px-0")}
          aria-hidden
        >
          <HiAdjustmentsHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </span>

        <Link
          href={buildListingsSearchUrl(baseFilters)}
          className={pillClass(allActive)}
          aria-pressed={allActive}
        >
          All
        </Link>

        <Link
          href={buildListingsSearchUrl(
            featuredActive ? baseFilters : { ...baseFilters, featured: true },
          )}
          className={pillClass(featuredActive)}
          aria-pressed={featuredActive}
        >
          Featured
        </Link>

        <select
          className={cn(selectClass, filters.profession && "border-primary/40 bg-primary/5 text-primary")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
          value={filters.profession ?? ""}
          onChange={(e) => apply({ profession: e.target.value || undefined })}
          aria-label="Filter by profession"
        >
          <option value="">Profession</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <select
          className={cn(selectClass, filters.city && "border-primary/40 bg-primary/5 text-primary")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
          value={filters.city ?? ""}
          onChange={(e) => apply({ city: e.target.value || undefined })}
          aria-label="Filter by location"
        >
          <option value="">Location</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className={cn(selectClass, filters.experience && "border-primary/40 bg-primary/5 text-primary")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
          value={filters.experience ?? ""}
          onChange={(e) => apply({ experience: e.target.value || undefined })}
          aria-label="Filter by experience"
        >
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value || "any"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className={cn(
            selectClass,
            filters.categoryType && "border-primary/40 bg-primary/5 text-primary",
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
          value={filters.categoryType ?? ""}
          onChange={(e) =>
            apply({
              categoryType:
                e.target.value === "professional" || e.target.value === "vendor"
                  ? e.target.value
                  : undefined,
            })
          }
          aria-label="Filter by category type"
        >
          {CATEGORY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value || "any"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
