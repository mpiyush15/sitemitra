export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type HealthResponse = {
  service: string;
  status: string;
  environment: string;
  database: "connected" | "disconnected" | "not_configured";
  razorpayConfigured: boolean;
  timestamp: string;
};

export type SafeUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  membershipPlan: string;
  membershipExpiresAt: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  user: SafeUser;
  businessProfile: SafeBusinessProfile | null;
  token: string;
};

export type ProfileResponse = {
  user: SafeUser;
  businessProfile: SafeBusinessProfile | null;
};

export type ProfileCompletion = {
  isComplete: boolean;
  missing: string[];
  percent: number;
};

export type CategoryItem = {
  id: string;
  categoryName: string;
  slug: string;
  icon: string;
  isActive?: boolean;
  sortOrder?: number;
  businessCount?: number;
};

export type CityItem = {
  id: string;
  cityName: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export type SocialReelPlatform = "instagram" | "youtube" | "facebook";

export type SocialReelItem = {
  id: string;
  title: string;
  platform: SocialReelPlatform;
  sourceUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

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

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedBusinesses = {
  items: BusinessCard[];
  pagination: PaginationMeta;
};

export type PopularSearchBlock = {
  label: string;
  href: string;
  searchCount: number;
  category?: string;
  city?: string;
  q?: string;
  businesses: BusinessCard[];
};

export type PublicReview = {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
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
};
