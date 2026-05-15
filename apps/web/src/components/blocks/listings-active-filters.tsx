import Link from "next/link";
import { buildListingsSearchUrl, resolveCategoryLabel, type ListingsSearchFilters } from "@/lib/listings-search";
import { cn } from "@/lib/cn";

type ListingsActiveFiltersProps = {
  filters: ListingsSearchFilters;
  categories: { slug: string; categoryName: string }[];
  className?: string;
};

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
    >
      <span className="max-w-[8rem] truncate">{label}</span>
      <span aria-hidden className="text-muted-foreground">
        ×
      </span>
    </Link>
  );
}

export function ListingsActiveFilters({
  filters,
  categories,
  className,
}: ListingsActiveFiltersProps) {
  const chips: { key: string; label: string; href: string }[] = [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: `“${filters.q}”`,
      href: buildListingsSearchUrl({ ...filters, q: undefined, page: 1 }),
    });
  }

  if (filters.category) {
    chips.push({
      key: "category",
      label: resolveCategoryLabel(filters.category, categories) ?? filters.category,
      href: buildListingsSearchUrl({ ...filters, category: undefined, page: 1 }),
    });
  }

  if (filters.city) {
    chips.push({
      key: "city",
      label: filters.city,
      href: buildListingsSearchUrl({ ...filters, city: undefined, page: 1 }),
    });
  }

  if (filters.featured) {
    chips.push({
      key: "featured",
      label: "Featured",
      href: buildListingsSearchUrl({ ...filters, featured: undefined, page: 1 }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {chips.map((chip) => (
        <FilterChip key={chip.key} label={chip.label} href={chip.href} />
      ))}
    </div>
  );
}
