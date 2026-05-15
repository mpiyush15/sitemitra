import type { BusinessProfileDocument } from "../models/business-profile.model.js";
import type { ReviewDocument } from "../models/review.model.js";
import type { CatalogueDocument } from "../models/catalogue.model.js";
import { MEMBERSHIP_PLANS } from "./constants.js";
import {
  DEFAULT_FREE_FEATURES,
  DEFAULT_STANDARD_FEATURES,
} from "./plan-features.js";
import { toSafeBusinessProfile, type SafeBusinessProfile } from "./serializers.js";

export type BusinessCard = {
  id: string;
  businessName: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  logo: string;
  thumbnail: string;
  gallery: string[];
  experience: string;
  phoneNumber: string;
  whatsappNumber: string;
  membershipType: string;
  verificationBadge: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  description: string;
};

export type PublicReview = {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
};

export type PublicCatalogue = {
  id: string;
  title: string;
  fileUrl: string;
  thumbnail: string;
};

export type BusinessDetail = SafeBusinessProfile & {
  reviews: PublicReview[];
  catalogues: PublicCatalogue[];
  isPremium: boolean;
  planFeatures: string[];
};

export function toBusinessCard(profile: BusinessProfileDocument): BusinessCard {
  const isPremium = profile.membershipType === MEMBERSHIP_PLANS.STANDARD;

  return {
    id: profile._id.toString(),
    businessName: profile.businessName,
    slug: profile.slug,
    category: profile.category,
    city: profile.city,
    state: profile.state ?? "",
    logo: isPremium ? profile.logo ?? "" : "",
    thumbnail: isPremium ? profile.thumbnail ?? "" : "",
    gallery: isPremium ? profile.gallery ?? [] : [],
    experience: isPremium ? profile.experience ?? "" : "",
    phoneNumber: profile.phoneNumber ?? "",
    whatsappNumber: profile.whatsappNumber ?? "",
    membershipType: profile.membershipType,
    verificationBadge: isPremium ? profile.verificationBadge : false,
    isFeatured: profile.isFeatured,
    rating: profile.totalReviews > 0 ? profile.rating : 0,
    totalReviews: profile.totalReviews ?? 0,
    description: profile.description ?? "",
  };
}

export function toPublicReview(review: ReviewDocument): PublicReview {
  return {
    id: review._id.toString(),
    customerName: review.customerName,
    rating: review.rating,
    reviewText: review.reviewText ?? "",
    createdAt: review.createdAt,
  };
}

export function toPublicCatalogue(catalogue: CatalogueDocument): PublicCatalogue {
  return {
    id: catalogue._id.toString(),
    title: catalogue.title,
    fileUrl: catalogue.fileUrl,
    thumbnail: catalogue.thumbnail ?? "",
  };
}

export function toBusinessDetail(
  profile: BusinessProfileDocument,
  extras: {
    reviews: ReviewDocument[];
    catalogues: CatalogueDocument[];
  },
): BusinessDetail {
  const base = toSafeBusinessProfile(profile);
  const isPremium = profile.membershipType === MEMBERSHIP_PLANS.STANDARD;

  return {
    ...base,
    logo: isPremium ? base.logo : "",
    thumbnail: isPremium ? base.thumbnail : "",
    profileBanner: isPremium ? base.profileBanner : "",
    gallery: isPremium ? base.gallery : [],
    services: isPremium ? base.services : [],
    experience: isPremium ? base.experience : "",
    reviews: extras.reviews.map(toPublicReview),
    catalogues: isPremium ? extras.catalogues.map(toPublicCatalogue) : [],
    isPremium,
    planFeatures: isPremium ? [...DEFAULT_STANDARD_FEATURES] : [...DEFAULT_FREE_FEATURES],
  };
}
