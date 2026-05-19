import { MEMBERSHIP_PLANS } from "../lib/constants.js";
import { BusinessProfileModel, type BusinessProfileDocument } from "../models/business-profile.model.js";

const PROFESSIONAL_CATEGORY_PATTERN =
  /engineer|architect|contractor|interior|plumber|electrical|painter|surveyor|fabricator|designer/i;
const VENDOR_CATEGORY_PATTERN =
  /vendor|dealer|supplier|material|cement|steel|hardware|tile|marble|machinery|building/i;

export type BusinessListFilter = {
  category?: string;
  profession?: string;
  categoryType?: "professional" | "vendor";
  city?: string;
  experience?: string;
  q?: string;
  skip: number;
  limit: number;
};

function buildExperienceFilter(experience: string) {
  const minYears = Number.parseInt(experience, 10);
  if (Number.isNaN(minYears)) {
    return { experience: { $regex: escapeRegex(experience), $options: "i" } };
  }
  return {
    experience: {
      $regex: new RegExp(`${minYears}\\s*\\+?|${minYears}\\s*[-–]?\\s*\\d+|${minYears}\\s*y`, "i"),
    },
  };
}

function buildListFilter({
  category,
  profession,
  categoryType,
  city,
  experience,
  q,
}: Omit<BusinessListFilter, "skip" | "limit">) {
  const filter: Record<string, unknown> = {};

  if (profession) {
    filter.category = { $regex: new RegExp(escapeRegex(profession), "i") };
  } else if (category) {
    filter.category = { $regex: new RegExp(escapeRegex(category), "i") };
  } else if (categoryType === "professional") {
    filter.category = { $regex: PROFESSIONAL_CATEGORY_PATTERN };
  } else if (categoryType === "vendor") {
    filter.category = { $regex: VENDOR_CATEGORY_PATTERN };
  }

  if (city) {
    filter.city = { $regex: new RegExp(`^${escapeRegex(city)}$`, "i") };
  }

  if (experience) {
    Object.assign(filter, buildExperienceFilter(experience));
  }

  if (q) {
    const terms = q
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length >= 2);

    if (terms.length === 0) {
      const pattern = escapeRegex(q);
      filter.$or = [
        { businessName: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
        { category: { $regex: pattern, $options: "i" } },
        { city: { $regex: pattern, $options: "i" } },
        { services: { $elemMatch: { $regex: pattern, $options: "i" } } },
      ];
    } else {
      filter.$and = terms.map((term) => {
        const pattern = escapeRegex(term);
        return {
          $or: [
            { businessName: { $regex: pattern, $options: "i" } },
            { description: { $regex: pattern, $options: "i" } },
            { category: { $regex: pattern, $options: "i" } },
            { city: { $regex: pattern, $options: "i" } },
            { services: { $elemMatch: { $regex: pattern, $options: "i" } } },
          ],
        };
      });
    }
  }

  return filter;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Public discovery: published and not deactivated by platform admin */
export const publicListingMatch = {
  isPublished: true,
  isActive: { $ne: false },
} as const;

const listSort = {
  isFeatured: -1 as const,
  membershipType: -1 as const,
  rating: -1 as const,
  createdAt: -1 as const,
};

export const businessProfileRepository = {
  findByUserId(userId: string) {
    return BusinessProfileModel.findOne({ userId });
  },

  findBySlug(slug: string, options?: { includeUnpublished?: boolean }) {
    const filter: Record<string, unknown> = { slug: slug.toLowerCase() };
    if (!options?.includeUnpublished) {
      Object.assign(filter, publicListingMatch);
    }
    return BusinessProfileModel.findOne(filter);
  },

  slugExists(slug: string) {
    return BusinessProfileModel.exists({ slug: slug.toLowerCase() });
  },

  create(data: {
    userId: string;
    businessName: string;
    slug: string;
    category: string;
    city: string;
    subCategory?: string;
    state?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    email?: string;
    isPublished?: boolean;
  }) {
    return BusinessProfileModel.create(data);
  },

  updateByUserId(
    userId: string,
    data: Partial<{
      businessName: string;
      slug: string;
      category: string;
      subCategory: string;
      city: string;
      state: string;
      description: string;
      services: string[];
      experience: string;
      logo: string;
      thumbnail: string;
      profileBanner: string;
      gallery: string[];
      whatsappNumber: string;
      phoneNumber: string;
      email: string;
      website: string;
      socialLinks: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
      };
      isPublished: boolean;
    }>,
  ) {
    return BusinessProfileModel.findOneAndUpdate({ userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async list(filterInput: BusinessListFilter) {
    const filter = { ...buildListFilter(filterInput), ...publicListingMatch };
    const [items, total] = await Promise.all([
      BusinessProfileModel.find(filter)
        .sort(listSort)
        .skip(filterInput.skip)
        .limit(filterInput.limit),
      BusinessProfileModel.countDocuments(filter),
    ]);
    return { items, total };
  },

  /** Homepage featured block + /listings?featured=1 — super-admin pick, Standard only. */
  findFeatured(limit: number) {
    return BusinessProfileModel.find({
      ...publicListingMatch,
      isFeatured: true,
      membershipType: MEMBERSHIP_PLANS.STANDARD,
    })
      .sort(listSort)
      .limit(limit);
  },

  async findRelated(excludeSlug: string, category: string, city: string, limit: number) {
    const exclude = excludeSlug.toLowerCase();
    const results: BusinessProfileDocument[] = [];
    const seen = new Set<string>();

    const collect = async (extra: Record<string, unknown>) => {
      if (results.length >= limit) return;

      const docs = await BusinessProfileModel.find({
        ...publicListingMatch,
        slug: { $ne: exclude },
        ...extra,
      })
        .sort(listSort)
        .limit(limit);

      for (const doc of docs) {
        const id = doc._id.toString();
        if (seen.has(id)) continue;
        seen.add(id);
        results.push(doc);
        if (results.length >= limit) break;
      }
    };

    const categoryFilter = category
      ? { category: { $regex: new RegExp(`^${escapeRegex(category)}$`, "i") } }
      : {};
    const cityFilter = city
      ? { city: { $regex: new RegExp(`^${escapeRegex(city)}$`, "i") } }
      : {};

    await collect({ ...categoryFilter, ...cityFilter });
    await collect(categoryFilter);
    await collect(cityFilter);

    return results.slice(0, limit);
  },

  findAllAdmin(limit = 500) {
    return BusinessProfileModel.find().sort({ createdAt: -1 }).limit(limit);
  },

  findById(id: string) {
    return BusinessProfileModel.findById(id);
  },

  updateMembershipByUserId(userId: string, membershipType: string) {
    return BusinessProfileModel.findOneAndUpdate(
      { userId },
      { membershipType },
      { new: true },
    );
  },

  updateListingActiveById(id: string, isActive: boolean) {
    return BusinessProfileModel.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true, runValidators: true },
    );
  },

  updateFeaturedById(id: string, isFeatured: boolean) {
    return BusinessProfileModel.findByIdAndUpdate(
      id,
      { $set: { isFeatured } },
      { new: true, runValidators: true },
    );
  },
};
