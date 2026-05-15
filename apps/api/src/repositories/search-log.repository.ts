import { SearchLogModel } from "../models/search-log.model.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";

export type SearchFilter = {
  category?: string;
  city?: string;
  q?: string;
};

export type PopularSearchRow = SearchFilter & {
  label: string;
  count: number;
};

export const searchLogRepository = {
  async recordSearch(filter: SearchFilter, label: string) {
    const category = filter.category?.trim() ?? "";
    const city = filter.city?.trim() ?? "";
    const q = filter.q?.trim() ?? "";

    if (!category && !city && !q) return null;

    return SearchLogModel.findOneAndUpdate(
      { category, city, q },
      {
        $set: { label, lastSearchedAt: new Date() },
        $inc: { count: 1 },
        $setOnInsert: { category, city, q },
      },
      { upsert: true, new: true },
    );
  },

  async findPopular(limit: number): Promise<PopularSearchRow[]> {
    const rows = await SearchLogModel.find()
      .sort({ count: -1, lastSearchedAt: -1 })
      .limit(limit)
      .lean();

    return rows.map((row) => ({
      category: row.category || undefined,
      city: row.city || undefined,
      q: row.q || undefined,
      label: row.label,
      count: row.count,
    }));
  },

  async fallbackFromListings(limit: number): Promise<PopularSearchRow[]> {
    const grouped = await BusinessProfileModel.aggregate<{
      _id: { category: string; city: string };
      count: number;
    }>([
      { $match: { isPublished: true, isActive: { $ne: false } } },
      { $group: { _id: { category: "$category", city: "$city" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return grouped.map((row) => ({
      category: row._id.category,
      city: row._id.city,
      label: `${row._id.category} in ${row._id.city}`,
      count: row.count,
    }));
  },
};
