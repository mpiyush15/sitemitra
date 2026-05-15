import { SavedBusinessModel } from "../models/saved-business.model.js";

export const savedBusinessRepository = {
  findByUserAndBusiness(userId: string, businessId: string) {
    return SavedBusinessModel.findOne({ userId, businessId });
  },

  save(userId: string, businessId: string) {
    return SavedBusinessModel.findOneAndUpdate(
      { userId, businessId },
      { userId, businessId },
      { upsert: true, new: true },
    );
  },

  remove(userId: string, businessId: string) {
    return SavedBusinessModel.findOneAndDelete({ userId, businessId });
  },

  listByUser(userId: string, limit = 50) {
    return SavedBusinessModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("businessId");
  },
};
