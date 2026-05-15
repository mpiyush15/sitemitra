export const ROLES = {
  USER: "user",
  BUSINESS: "business",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const MEMBERSHIP_PLANS = {
  FREE: "free",
  STANDARD: "standard",
} as const;

export type MembershipPlan =
  (typeof MEMBERSHIP_PLANS)[keyof typeof MEMBERSHIP_PLANS];

export const INQUIRY_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  CLOSED: "closed",
} as const;

export type InquiryStatus =
  (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

export const PAYMENT_STATUS = {
  CREATED: "created",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const AUTH_COOKIE_NAME = "access_token";
