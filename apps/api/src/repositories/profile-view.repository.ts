import { ProfileViewModel } from "../models/profile-view.model.js";

export const profileViewRepository = {
  async recordView(businessId: string, sessionId: string) {
    try {
      await ProfileViewModel.create({ businessId, sessionId });
      return { recorded: true };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return { recorded: false };
      }
      throw error;
    }
  },

  async countVisitorsByBusinessId(businessId: string) {
    return ProfileViewModel.countDocuments({ businessId });
  },

  async countVisitorsAll() {
    return ProfileViewModel.countDocuments();
  },

  async countDistinctVisitorsAll() {
    const result = await ProfileViewModel.aggregate<{ total: number }>([
      { $group: { _id: "$sessionId" } },
      { $count: "total" },
    ]);
    return result[0]?.total ?? 0;
  },
};
