import { MembershipModel } from "../models/membership.model.js";
import type { MembershipPlan } from "../lib/constants.js";

export const membershipRepository = {
  findAll() {
    return MembershipModel.find().sort({ price: 1 });
  },

  findActive() {
    return MembershipModel.find({ isActive: true }).sort({ price: 1 });
  },

  findBySlug(slug: MembershipPlan) {
    return MembershipModel.findOne({ slug, isActive: true });
  },

  findBySlugAdmin(slug: MembershipPlan) {
    return MembershipModel.findOne({ slug });
  },

  upsertBySlug(
    slug: MembershipPlan,
    data: {
      planName: string;
      price: number;
      features: string[];
      durationDays: number;
      isActive?: boolean;
    },
  ) {
    return MembershipModel.findOneAndUpdate({ slug }, data, { upsert: true, new: true });
  },

  updateBySlug(slug: MembershipPlan, data: Partial<{
    planName: string;
    price: number;
    features: string[];
    durationDays: number;
    isActive: boolean;
  }>) {
    return MembershipModel.findOneAndUpdate({ slug }, data, { new: true });
  },
};
