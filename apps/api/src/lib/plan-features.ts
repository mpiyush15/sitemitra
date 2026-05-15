import { MEMBERSHIP_PLANS, type MembershipPlan } from "./constants.js";

export const PLAN_FEATURES = {
  BASIC_PROFILE: "basic_profile",
  PHONE: "phone",
  WHATSAPP: "whatsapp",
  ABOUT: "about",
  CITY: "city",
  LOGO_BRANDING: "logo_branding",
  SERVICES: "services",
  EXPERIENCE: "experience",
  GALLERY: "gallery",
  REVIEWS: "reviews",
  CATALOGUES: "catalogues",
  PRIORITY_LISTING: "priority_listing",
  VERIFICATION_ELIGIBLE: "verification_eligible",
} as const;

export type PlanFeature = (typeof PLAN_FEATURES)[keyof typeof PLAN_FEATURES];

export const DEFAULT_FREE_FEATURES: PlanFeature[] = [
  PLAN_FEATURES.BASIC_PROFILE,
  PLAN_FEATURES.PHONE,
  PLAN_FEATURES.WHATSAPP,
  PLAN_FEATURES.ABOUT,
  PLAN_FEATURES.CITY,
];

export const DEFAULT_STANDARD_FEATURES: PlanFeature[] = [
  ...DEFAULT_FREE_FEATURES,
  PLAN_FEATURES.LOGO_BRANDING,
  PLAN_FEATURES.SERVICES,
  PLAN_FEATURES.EXPERIENCE,
  PLAN_FEATURES.GALLERY,
  PLAN_FEATURES.REVIEWS,
  PLAN_FEATURES.CATALOGUES,
  PLAN_FEATURES.PRIORITY_LISTING,
  PLAN_FEATURES.VERIFICATION_ELIGIBLE,
];

export function planHasFeature(features: string[], feature: PlanFeature) {
  return features.includes(feature);
}

export function isStandardPlan(plan: string) {
  return plan === MEMBERSHIP_PLANS.STANDARD;
}

export function resolveEffectivePlan(
  plan: string,
  expiresAt?: Date | null,
): MembershipPlan {
  if (plan === MEMBERSHIP_PLANS.STANDARD && expiresAt && expiresAt.getTime() < Date.now()) {
    return MEMBERSHIP_PLANS.FREE;
  }
  return plan === MEMBERSHIP_PLANS.STANDARD ? MEMBERSHIP_PLANS.STANDARD : MEMBERSHIP_PLANS.FREE;
}
