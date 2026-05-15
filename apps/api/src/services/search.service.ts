import { toBusinessCard } from "../lib/public-serializers.js";
import {
  businessProfileRepository,
  categoryRepository,
  searchLogRepository,
} from "../repositories/index.js";
import type { PopularSearchRow } from "../repositories/search-log.repository.js";
import type {
  PopularSearchQuery,
  RecordSearchInput,
} from "../validators/search.validator.js";

async function resolveCategoryName(category?: string) {
  if (!category) return "";
  const bySlug = await categoryRepository.findBySlug(category);
  if (bySlug) return bySlug.categoryName;
  return category;
}

function buildSearchLabel(input: RecordSearchInput, categoryName: string) {
  const q = input.q?.trim();
  const city = input.city?.trim();
  const category = categoryName || input.category?.trim();

  if (q && city) return `${q} in ${city}`;
  if (q && category) return `${q} · ${category}`;
  if (q) return q;
  if (category && city) return `${category} in ${city}`;
  if (category) return category;
  if (city) return `Professionals in ${city}`;
  return "Listings";
}

function buildSearchHref(filter: PopularSearchRow) {
  const params = new URLSearchParams();
  if (filter.category) params.set("category", filter.category);
  if (filter.city) params.set("city", filter.city);
  if (filter.q) params.set("q", filter.q);
  const qs = params.toString();
  return qs ? `/listings?${qs}` : "/listings";
}

async function normalizePopularRows(rows: PopularSearchRow[]) {
  const normalized: PopularSearchRow[] = [];

  for (const row of rows) {
    let category = row.category;
    if (category?.includes("-")) {
      const match = await categoryRepository.findBySlug(category);
      if (match) category = match.categoryName;
    }

    normalized.push({
      ...row,
      category,
      label: row.label || buildSearchLabel(row, category ?? ""),
    });
  }

  return normalized;
}

export const searchService = {
  async recordSearch(input: RecordSearchInput) {
    const categoryName = await resolveCategoryName(input.category);
    const label = buildSearchLabel(input, categoryName);

    await searchLogRepository.recordSearch(
      {
        category: categoryName || input.category,
        city: input.city,
        q: input.q,
      },
      label,
    );

    return { recorded: true };
  },

  async getPopularWithResults({ limit, perSearch }: PopularSearchQuery) {
    let popular = await searchLogRepository.findPopular(limit);

    if (popular.length === 0) {
      popular = await searchLogRepository.fallbackFromListings(limit);
    }

    const rows = await normalizePopularRows(popular);

    const blocks = await Promise.all(
      rows.map(async (row) => {
        const base = {
          label: row.label,
          href: buildSearchHref(row),
          searchCount: row.count,
          category: row.category,
          city: row.city,
          q: row.q,
        };

        if (perSearch <= 0) {
          return { ...base, businesses: [] };
        }

        const { items } = await businessProfileRepository.list({
          category: row.category,
          city: row.city,
          q: row.q,
          skip: 0,
          limit: perSearch,
        });

        return {
          ...base,
          businesses: items.map(toBusinessCard),
        };
      }),
    );

    return perSearch <= 0 ? blocks : blocks.filter((block) => block.businesses.length > 0);
  },
};
