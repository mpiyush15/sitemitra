import { BannerModel } from "../models/banner.model.js";
import { CategoryModel } from "../models/category.model.js";
import { NotFoundError } from "../lib/errors.js";
import { toSafeUser } from "../lib/serializers.js";
import { toBusinessCard } from "../lib/public-serializers.js";
import {
  businessProfileRepository,
  reviewRepository,
  userRepository,
} from "../repositories/index.js";
import { membershipService } from "./membership.service.js";

export const adminService = {
  async listUsers() {
    const users = await userRepository.findAll();
    return users.map((user) => toSafeUser(user));
  },

  async listBusinesses() {
    const profiles = await businessProfileRepository.findAllAdmin();
    return profiles.map((profile) => ({
      ...toBusinessCard(profile),
      userId: profile.userId.toString(),
      isPublished: profile.isPublished,
      isActive: profile.isActive !== false,
      email: profile.email ?? "",
    }));
  },

  async setBusinessListingActive(businessProfileId: string, isActive: boolean) {
    const updated = await businessProfileRepository.updateListingActiveById(
      businessProfileId,
      isActive,
    );
    if (!updated) {
      throw new NotFoundError("Business not found");
    }
    return {
      id: updated._id.toString(),
      isActive: updated.isActive !== false,
    };
  },

  async setBusinessFeatured(businessProfileId: string, isFeatured: boolean) {
    const updated = await businessProfileRepository.updateFeaturedById(
      businessProfileId,
      isFeatured,
    );
    if (!updated) {
      throw new NotFoundError("Business not found");
    }
    return {
      id: updated._id.toString(),
      isFeatured: Boolean(updated.isFeatured),
    };
  },

  async listCategories() {
    const categories = await CategoryModel.aggregate([
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
      {
        $project: {
          businesses: 0,
        },
      },
      {
        $sort: { sortOrder: 1, categoryName: 1 },
      },
    ]);

    return categories.map((category) => ({
      id: category._id.toString(),
      categoryName: category.categoryName,
      slug: category.slug,
      icon: category.icon ?? "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      businessCount: category.businessCount,
    }));
  },

  async createCategory(input: { categoryName: string; icon?: string; sortOrder?: number }) {
    const slug = input.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const doc = await CategoryModel.create({
      categoryName: input.categoryName.trim(),
      slug,
      icon: input.icon?.trim() ?? "",
      sortOrder: input.sortOrder ?? 0,
      isActive: true,
    });
    return {
      id: doc._id.toString(),
      categoryName: doc.categoryName,
      slug: doc.slug,
      icon: doc.icon,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      businessCount: 0,
    };
  },

  async updateCategory(
    id: string,
    input: { categoryName?: string; icon?: string; isActive?: boolean; sortOrder?: number }
  ) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (input.categoryName !== undefined) {
      category.categoryName = input.categoryName.trim();
      category.slug = category.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (input.icon !== undefined) category.icon = input.icon.trim();
    if (input.isActive !== undefined) category.isActive = input.isActive;
    if (input.sortOrder !== undefined) category.sortOrder = input.sortOrder;

    await category.save();

    return {
      id: category._id.toString(),
      categoryName: category.categoryName,
      slug: category.slug,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    };
  },

  async listReviews() {
    const reviews = await reviewRepository.findAllForAdmin();
    return reviews.map((review) => {
      const business = review.businessId as
        | { _id?: { toString(): string }; businessName?: string; slug?: string }
        | null;
      const businessId =
        business && typeof business === "object" && "_id" in business && business._id
          ? business._id.toString()
          : String(review.businessId);
      return {
        id: review._id.toString(),
        businessId,
        businessName: business?.businessName ?? "Unknown business",
        businessSlug: business?.slug ?? "",
        customerName: review.customerName,
        rating: review.rating,
        reviewText: review.reviewText ?? "",
        isApproved: review.isApproved,
        createdAt: review.createdAt,
      };
    });
  },

  async moderateReview(id: string, isApproved: boolean) {
    const review = await reviewRepository.updateApproval(id, isApproved);
    if (!review) throw new NotFoundError("Review not found");
    await reviewRepository.syncBusinessRating(review.businessId.toString());
    return {
      id: review._id.toString(),
      isApproved: review.isApproved,
    };
  },

  async deleteReview(id: string) {
    const review = await reviewRepository.deleteById(id);
    if (!review) throw new NotFoundError("Review not found");
    await reviewRepository.syncBusinessRating(review.businessId.toString());
    return { id: review._id.toString() };
  },

  async listBanners() {
    const banners = await BannerModel.find().sort({ sortOrder: 1, createdAt: -1 });
    return banners.map((banner) => ({
      id: banner._id.toString(),
      title: banner.title,
      imageUrl: banner.imageUrl,
      redirectUrl: banner.redirectUrl ?? "",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
      showOverlay: banner.showOverlay !== false,
    }));
  },

  /** Active homepage hero banners for public API (sorted). */
  async listPublicHeroBanners() {
    const banners = await BannerModel.find({ isActive: true }).sort({
      sortOrder: 1,
      createdAt: -1,
    });
    return banners.map((banner) => ({
      id: banner._id.toString(),
      title: banner.title,
      imageUrl: banner.imageUrl,
      redirectUrl: banner.redirectUrl ?? "",
      showOverlay: banner.showOverlay !== false,
    }));
  },

  async createBanner(input: {
    title: string;
    imageUrl: string;
    redirectUrl?: string;
    sortOrder?: number;
    showOverlay?: boolean;
  }) {
    const doc = await BannerModel.create({
      title: input.title.trim(),
      imageUrl: input.imageUrl.trim(),
      redirectUrl: (input.redirectUrl ?? "").trim(),
      sortOrder: input.sortOrder ?? 0,
      isActive: true,
      showOverlay: input.showOverlay !== false,
    });
    return {
      id: doc._id.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      redirectUrl: doc.redirectUrl ?? "",
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      showOverlay: doc.showOverlay !== false,
    };
  },

  async updateBanner(
    id: string,
    input: {
      title?: string;
      redirectUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
      showOverlay?: boolean;
      imageUrl?: string;
    },
  ) {
    const banner = await BannerModel.findById(id);
    if (!banner) {
      throw new NotFoundError("Banner not found");
    }

    const oldImageUrlForDeletion =
      input.imageUrl !== undefined && input.imageUrl.trim() !== banner.imageUrl
        ? banner.imageUrl
        : undefined;

    if (input.title !== undefined) banner.title = input.title.trim();
    if (input.redirectUrl !== undefined) banner.redirectUrl = input.redirectUrl.trim();
    if (input.sortOrder !== undefined) banner.sortOrder = input.sortOrder;
    if (input.isActive !== undefined) banner.isActive = input.isActive;
    if (input.showOverlay !== undefined) banner.showOverlay = input.showOverlay;
    if (input.imageUrl !== undefined) banner.imageUrl = input.imageUrl.trim();

    await banner.save();

    return {
      id: banner._id.toString(),
      title: banner.title,
      imageUrl: banner.imageUrl,
      redirectUrl: banner.redirectUrl ?? "",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
      showOverlay: banner.showOverlay !== false,
      oldImageUrlForDeletion,
    };
  },

  async deleteBanner(id: string) {
    const banner = await BannerModel.findByIdAndDelete(id);
    if (!banner) {
      throw new NotFoundError("Banner not found");
    }
    return {
      id: banner._id.toString(),
      imageUrl: banner.imageUrl,
    };
  },

  async listPayments() {
    return membershipService.listPayments();
  },
};
