import { fetchCategories } from "@/lib/public";
import { CLIENT_CATEGORIES } from "@/lib/constants";
import type { CategoryItem } from "@/types/api";

export type ResolvedCategory = CategoryItem & { iconKey: string };

function fallbackCategories(): ResolvedCategory[] {
  return CLIENT_CATEGORIES.map((c) => ({
    id: c.id,
    categoryName: c.categoryName,
    slug: c.slug,
    icon: c.iconKey,
    iconKey: c.iconKey,
  }));
}

/** API categories when available; otherwise same static list used before seeding. */
export async function resolveCategories(): Promise<ResolvedCategory[]> {
  const apiCategories = await fetchCategories();
  if (apiCategories.length === 0) return fallbackCategories();

  return apiCategories.map((c) => ({
    ...c,
    iconKey: c.icon || CLIENT_CATEGORIES.find((x) => x.slug === c.slug)?.iconKey || "building",
  }));
}

/** Client-side fetch without Next cache options. */
export async function resolveCategoriesClient(): Promise<ResolvedCategory[]> {
  try {
    const { apiFetch } = await import("@/lib/api");
    const { API_ROUTES } = await import("@/lib/constants");
    const apiCategories = await apiFetch<CategoryItem[]>(API_ROUTES.categories);
    if (apiCategories.length === 0) return fallbackCategories();
    return apiCategories.map((c) => ({
      ...c,
      iconKey: c.icon || CLIENT_CATEGORIES.find((x) => x.slug === c.slug)?.iconKey || "building",
    }));
  } catch {
    return fallbackCategories();
  }
}
