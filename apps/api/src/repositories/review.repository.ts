import { ReviewModel } from "../models/review.model.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";

export const reviewRepository = {
  findApprovedByBusinessId(businessId: string, limit = 50) {
    return ReviewModel.find({ businessId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  findByUserAndBusiness(userId: string, businessId: string) {
    return ReviewModel.findOne({ userId, businessId });
  },

  create(data: {
    businessId: string;
    userId: string;
    customerName: string;
    rating: number;
    reviewText: string;
    isApproved: boolean;
  }) {
    return ReviewModel.create(data);
  },

  findPending(limit = 100) {
    return ReviewModel.find({ isApproved: false }).sort({ createdAt: -1 }).limit(limit);
  },

  updateApproval(id: string, isApproved: boolean) {
    return ReviewModel.findByIdAndUpdate(id, { isApproved }, { new: true });
  },

  async syncBusinessRating(businessId: string) {
    const approved = await ReviewModel.find({ businessId, isApproved: true }).select("rating");
    const totalReviews = approved.length;
    const rating =
      totalReviews === 0
        ? 0
        : Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10;

    await BusinessProfileModel.findByIdAndUpdate(businessId, { rating, totalReviews });
    return { rating, totalReviews };
  },
};
