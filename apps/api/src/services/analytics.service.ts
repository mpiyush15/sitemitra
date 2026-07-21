import { NotFoundError } from "../lib/errors.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { inquiryRepository } from "../repositories/inquiry.repository.js";
import { profileViewRepository } from "../repositories/profile-view.repository.js";
import { UserModel } from "../models/user.model.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";
import { ReviewModel } from "../models/review.model.js";
import { CategoryModel } from "../models/category.model.js";

export const analyticsService = {
  async recordProfileView(slug: string, sessionId: string) {
    const business = await businessProfileRepository.findBySlug(slug);
    if (!business) {
      throw new NotFoundError("Business not found");
    }

    return profileViewRepository.recordView(business._id.toString(), sessionId);
  },

  async getBusinessAnalytics(userId: string) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const businessId = profile._id.toString();
    const [profileVisitors, enquiriesTotal, enquiriesNew] = await Promise.all([
      profileViewRepository.countVisitorsByBusinessId(businessId),
      inquiryRepository.countByBusinessId(businessId),
      inquiryRepository.countNewByBusinessId(businessId),
    ]);

    return {
      profileVisitors,
      enquiriesTotal,
      enquiriesNew,
    };
  },

  async getPlatformAnalytics() {
    const [
      profileVisitors,
      uniqueVisitors,
      enquiriesTotal,
      usersCount,
      businessesCount,
      reviewsCount,
    ] = await Promise.all([
      profileViewRepository.countVisitorsAll(),
      profileViewRepository.countDistinctVisitorsAll(),
      inquiryRepository.countAll(),
      UserModel.countDocuments(),
      BusinessProfileModel.countDocuments(),
      ReviewModel.countDocuments(),
    ]);

    const [topBusinesses, topCategories, recentReviews] = await Promise.all([
      BusinessProfileModel.find({ isPublished: true, isActive: { $ne: false } })
        .sort({ rating: -1, totalReviews: -1 })
        .limit(5)
        .select("businessName slug category city logo rating totalReviews"),
      CategoryModel.aggregate([
        {
          $lookup: {
            from: "businessprofiles",
            localField: "categoryName",
            foreignField: "category",
            as: "businesses",
          },
        },
        {
          $addFields: {
            businessCount: { $size: "$businesses" },
          },
        },
        { $sort: { businessCount: -1 } },
        { $limit: 5 },
        { $project: { _id: 1, categoryName: 1, slug: 1, icon: 1, businessCount: 1 } },
      ]),
      ReviewModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("businessId", "businessName slug"),
    ]);

    return {
      profileVisitors,
      uniqueVisitors,
      enquiriesTotal,
      usersCount,
      businessesCount,
      reviewsCount,
      topBusinesses: topBusinesses.map((b) => ({
        id: b._id.toString(),
        businessName: b.businessName,
        slug: b.slug,
        category: b.category,
        city: b.city,
        logo: b.logo,
        rating: b.rating,
        totalReviews: b.totalReviews,
      })),
      topCategories: topCategories.map((c) => ({
        id: c._id.toString(),
        categoryName: c.categoryName,
        slug: c.slug,
        icon: c.icon,
        businessCount: c.businessCount,
      })),
      recentReviews: recentReviews.map((r) => ({
        id: r._id.toString(),
        businessName: (r.businessId as any)?.businessName || "Unknown",
        businessSlug: (r.businessId as any)?.slug || "",
        customerName: r.customerName,
        rating: r.rating,
        reviewText: r.reviewText,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  },
};
