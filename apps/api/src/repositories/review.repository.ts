import { ReviewModel } from "../models/review.model.js";

export const reviewRepository = {
  findApprovedByBusinessId(businessId: string, limit = 20) {
    return ReviewModel.find({ businessId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  findPending(limit = 100) {
    return ReviewModel.find({ isApproved: false }).sort({ createdAt: -1 }).limit(limit);
  },

  updateApproval(id: string, isApproved: boolean) {
    return ReviewModel.findByIdAndUpdate(id, { isApproved }, { new: true });
  },
};
