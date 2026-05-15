import { slugToLabel } from "@/lib/seo";

export type ListingsSearchFilters = {
  category?: string;
  city?: string;
  q?: string;
  page?: number;
  featured?: boolean;
};

export function buildListingsSearchUrl(filters: ListingsSearchFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  if (filters.q) params.set("q", filters.q);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.featured) params.set("featured", "1");
  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

export function buildBusinessProfileUrl(
  slug: string,
  filters?: Pick<ListingsSearchFilters, "q" | "category" | "city">,
): string {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.city) params.set("city", filters.city);
  const query = params.toString();
  return query ? `/business/${slug}?${query}` : `/business/${slug}`;
}

export function resolveCategoryLabel(
  categorySlug: string | undefined,
  categories: { slug: string; categoryName: string }[],
): string | undefined {
  if (!categorySlug) return undefined;
  return categories.find((item) => item.slug === categorySlug)?.categoryName ?? slugToLabel(categorySlug);
}

export function getListingsHeading(
  filters: ListingsSearchFilters,
  categoryLabel?: string,
): { title: string; subtitle: string } {
  if (filters.featured) {
    return {
      title: "Featured listings",
      subtitle: "Hand-picked by Site Mitra — Standard professionals only",
    };
  }

  const query = filters.q?.trim();
  const category = categoryLabel ?? (filters.category ? slugToLabel(filters.category) : "");
  const city = filters.city ?? "";

  if (query && category && city) {
    return {
      title: `${category} in ${city}`,
      subtitle: `Showing results matching “${query}”`,
    };
  }

  if (query && city) {
    return {
      title: `Results in ${city}`,
      subtitle: `Showing businesses matching “${query}”`,
    };
  }

  if (query && category) {
    return {
      title: category,
      subtitle: `Showing businesses matching “${query}”`,
    };
  }

  if (query) {
    return {
      title: `Search results`,
      subtitle: `Showing businesses matching “${query}”`,
    };
  }

  if (category && city) {
    return {
      title: `${category} in ${city}`,
      subtitle: "Browse trusted professionals in your city",
    };
  }

  if (category) {
    return {
      title: category,
      subtitle: "Browse professionals in this category",
    };
  }

  if (city) {
    return {
      title: `Professionals in ${city}`,
      subtitle: "Browse construction businesses in your city",
    };
  }

  return {
    title: "All listings",
    subtitle: "Search by keyword, category, or city to narrow results",
  };
}

export function hasActiveFilters(filters: ListingsSearchFilters): boolean {
  return Boolean(filters.category || filters.city || filters.q);
}
