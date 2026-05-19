import { UserModel } from "../models/user.model.js";
import type { Role } from "../lib/constants.js";

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByPhone(phone: string) {
    if (!phone) return null;
    return UserModel.findOne({ phone });
  },

  findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  findAll(limit = 200) {
    return UserModel.find().sort({ createdAt: -1 }).limit(limit);
  },

  updateMembership(userId: string, membershipPlan: string, membershipExpiresAt: Date | null) {
    return UserModel.findByIdAndUpdate(
      userId,
      { membershipPlan, membershipExpiresAt },
      { new: true },
    );
  },

  create(data: {
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    passwordHash: string;
    role?: Role;
  }) {
    return UserModel.create(data);
  },
};
