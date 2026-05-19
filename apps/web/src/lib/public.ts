import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type {
  BusinessCard,
  BusinessDetail,
  CategoryItem,
  CityItem,
  PaginatedBusinesses,
  PopularSearchBlock,
  SocialReelItem,
} from "@/types/api";

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    return await apiFetch<CategoryItem[]>(API_ROUTES.categories, {
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
}

export async function fetchCities(): Promise<CityItem[]> {
  try {
    return await apiFetch<CityItem[]>(API_ROUTES.cities, {
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
}

export async function fetchSocialReels(): Promise<SocialReelItem[]> {
  try {
    return await apiFetch<SocialReelItem[]>(API_ROUTES.socialReels, {
      next: { revalidate: 120 },
    });
  } catch {
    return [];
  }
}

export async function fetchFeaturedBusinesses(limit = 8): Promise<BusinessCard[]> {
  try {
    return await apiFetch<BusinessCard[]>(
      `${API_ROUTES.businesses}/featured?limit=${limit}`,
      { next: { revalidate: 120 } },
    );
  } catch {
    return [];
  }
}

export async function fetchBusinesses(params: {
  category?: string;
  profession?: string;
  categoryType?: "professional" | "vendor";
  city?: string;
  experience?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedBusinesses> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.profession) search.set("profession", params.profession);
  if (params.categoryType) search.set("categoryType", params.categoryType);
  if (params.city) search.set("city", params.city);
  if (params.experience) search.set("experience", params.experience);
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  const path = query ? `${API_ROUTES.businesses}?${query}` : API_ROUTES.businesses;

  try {
    return await apiFetch<PaginatedBusinesses>(path, { cache: "no-store" });
  } catch {
    return {
      items: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
    };
  }
}

export async function fetchPopularSearchBlocks(limit = 3, perSearch = 4) {
  try {
    return await apiFetch<PopularSearchBlock[]>(
      `${API_ROUTES.search.popular}?limit=${limit}&perSearch=${perSearch}`,
      { next: { revalidate: 120 } },
    );
  } catch {
    return [];
  }
}

export async function fetchTrendingSearches(limit = 8) {
  try {
    return await apiFetch<PopularSearchBlock[]>(
      `${API_ROUTES.search.popular}?limit=${limit}&perSearch=0`,
      { next: { revalidate: 120 } },
    );
  } catch {
    return [];
  }
}

export async function recordSearch(params: {
  category?: string;
  city?: string;
  q?: string;
}) {
  try {
    await apiFetch<{ recorded: boolean }>(API_ROUTES.search.record, {
      method: "POST",
      body: params,
    });
  } catch {
    // Non-blocking analytics
  }
}

export async function fetchRelatedBusinesses(slug: string, limit = 4) {
  try {
    return await apiFetch<BusinessCard[]>(
      `${API_ROUTES.businesses}/${slug}/related?limit=${limit}`,
      { next: { revalidate: 120 } },
    );
  } catch {
    return [];
  }
}

export async function fetchBusinessBySlug(
  slug: string,
): Promise<BusinessDetail | null> {
  try {
    return await apiFetch<BusinessDetail>(`${API_ROUTES.businesses}/${slug}`, {
      next: { revalidate: 120 },
    });
  } catch {
    return null;
  }
}

export function whatsappUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${text}`;
}

export function telUrl(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
