import { NotFoundError } from "../lib/errors.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { inquiryRepository } from "../repositories/inquiry.repository.js";
import { profileViewRepository } from "../repositories/profile-view.repository.js";

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
    const [profileVisitors, uniqueVisitors, enquiriesTotal] = await Promise.all([
      profileViewRepository.countVisitorsAll(),
      profileViewRepository.countDistinctVisitorsAll(),
      inquiryRepository.countAll(),
    ]);

    return {
      profileVisitors,
      uniqueVisitors,
      enquiriesTotal,
    };
  },
};
