import { SocialReelModel, type SocialReelPlatform } from "../models/social-reel.model.js";

export const socialReelRepository = {
  findActive() {
    return SocialReelModel.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  },

  findAll() {
    return SocialReelModel.find().sort({ sortOrder: 1, createdAt: -1 });
  },

  findById(id: string) {
    return SocialReelModel.findById(id);
  },

  create(data: {
    title?: string;
    platform: SocialReelPlatform;
    sourceUrl: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return SocialReelModel.create(data);
  },

  updateById(
    id: string,
    data: Partial<{
      title: string;
      platform: SocialReelPlatform;
      sourceUrl: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    return SocialReelModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  },

  deleteById(id: string) {
    return SocialReelModel.findByIdAndDelete(id);
  },
};
