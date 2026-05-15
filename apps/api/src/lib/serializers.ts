import type { UserDocument } from "../models/user.model.js";
import type { BusinessProfileDocument } from "../models/business-profile.model.js";

export type SafeUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  membershipPlan: string;
  membershipExpiresAt: Date | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeBusinessProfile = {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  category: string;
  subCategory: string;
  city: string;
  state: string;
  description: string;
  services: string[];
  experience: string;
  logo: string;
  thumbnail: string;
  profileBanner: string;
  gallery: string[];
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  website: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  membershipType: string;
  verificationBadge: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  /** Platform moderation: false = hidden from public listings */
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
};

export function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? "",
    city: user.city ?? "",
    role: user.role,
    membershipPlan: user.membershipPlan,
    membershipExpiresAt: user.membershipExpiresAt ?? null,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toSafeBusinessProfile(
  profile: BusinessProfileDocument,
): SafeBusinessProfile {
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    businessName: profile.businessName,
    slug: profile.slug,
    category: profile.category,
    subCategory: profile.subCategory ?? "",
    city: profile.city,
    state: profile.state ?? "",
    description: profile.description ?? "",
    services: profile.services ?? [],
    experience: profile.experience ?? "",
    logo: profile.logo ?? "",
    thumbnail: profile.thumbnail ?? "",
    profileBanner: profile.profileBanner ?? "",
    gallery: profile.gallery ?? [],
    whatsappNumber: profile.whatsappNumber ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    email: profile.email ?? "",
    website: profile.website ?? "",
    socialLinks: {
      facebook: profile.socialLinks?.facebook ?? "",
      instagram: profile.socialLinks?.instagram ?? "",
      linkedin: profile.socialLinks?.linkedin ?? "",
      youtube: profile.socialLinks?.youtube ?? "",
    },
    membershipType: profile.membershipType,
    verificationBadge: profile.verificationBadge,
    isFeatured: profile.isFeatured,
    isPublished: profile.isPublished ?? false,
    isActive: profile.isActive !== false,
    rating: profile.rating,
    totalReviews: profile.totalReviews,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}
