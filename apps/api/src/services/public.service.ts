import { NotFoundError } from "../lib/errors.js";
import { getPagination, parsePaginationQuery } from "../lib/pagination.js";
import { parseSmartSearch } from "../lib/smart-search.js";
import {
  toBusinessCard,
  toBusinessDetail,
} from "../lib/public-serializers.js";
import {
  businessProfileRepository,
  catalogueRepository,
  categoryRepository,
  cityRepository,
  reviewRepository,
} from "../repositories/index.js";
import type { BusinessListQuery } from "../validators/business.validator.js";

export const categoryService = {
  async listActive() {
    const categories = await categoryRepository.findActive();
    return categories.map((category) => ({
      id: category._id.toString(),
      categoryName: category.categoryName,
      slug: category.slug,
      icon: category.icon ?? "",
    }));
  },
};

export const businessService = {
  async list(query: BusinessListQuery) {
    const { page, limit, skip } = parsePaginationQuery(query);

    const [categories, cities] = await Promise.all([
      categoryRepository.findActive(),
      cityRepository.findActive(),
    ]);

    const parsed = parseSmartSearch(
      query.q ?? "",
      categories.map((item) => ({
        slug: item.slug,
        categoryName: item.categoryName,
      })),
      cities.map((item) => item.cityName),
      { category: query.category, city: query.city },
    );

    let category = parsed.category ?? query.category;
    if (category) {
      const bySlug = await categoryRepository.findBySlug(category);
      if (bySlug) category = bySlug.categoryName;
    }

    let profession = query.profession;
    if (profession) {
      const bySlug = await categoryRepository.findBySlug(profession);
      if (bySlug) profession = bySlug.categoryName;
    }

    const { items, total } = await businessProfileRepository.list({
      category,
      profession,
      categoryType: query.categoryType,
      city: parsed.city ?? query.city,
      experience: query.experience,
      q: parsed.q,
      skip,
      limit,
    });

    return {
      items: items.map(toBusinessCard),
      pagination: getPagination(page, limit, total),
    };
  },

  async featured(limit = 8) {
    const items = await businessProfileRepository.findFeatured(limit);
    return items.map(toBusinessCard);
  },

  async getBySlug(slug: string) {
    const profile = await businessProfileRepository.findBySlug(slug);
    if (!profile) {
      throw new NotFoundError("Business not found");
    }

    const [reviews, catalogues] = await Promise.all([
      reviewRepository.findApprovedByBusinessId(profile._id.toString(), 50),
      catalogueRepository.findByBusinessId(profile._id.toString()),
    ]);

    return toBusinessDetail(profile, { reviews, catalogues });
  },

  async getRelated(slug: string, limit = 4) {
    const profile = await businessProfileRepository.findBySlug(slug);
    if (!profile) {
      throw new NotFoundError("Business not found");
    }

    const items = await businessProfileRepository.findRelated(
      profile.slug,
      profile.category,
      profile.city,
      limit,
    );

    return items.map(toBusinessCard);
  },
};
