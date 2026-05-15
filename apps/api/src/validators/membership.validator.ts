import { z } from "zod";
import { MEMBERSHIP_PLANS } from "../lib/constants.js";

export const planSlugParamSchema = z.object({
  slug: z.enum([MEMBERSHIP_PLANS.FREE, MEMBERSHIP_PLANS.STANDARD]),
});

export const updatePlanSchema = z.object({
  planName: z.string().trim().min(2).max(80).optional(),
  price: z.number().min(0).optional(),
  features: z.array(z.string().trim().min(1).max(80)).optional(),
  durationDays: z.number().int().min(1).max(36500).optional(),
  isActive: z.boolean().optional(),
});

export const assignBusinessPlanSchema = z.object({
  planSlug: z.enum([MEMBERSHIP_PLANS.FREE, MEMBERSHIP_PLANS.STANDARD]),
});

export const upgradePlanSchema = z.object({
  planSlug: z.enum([MEMBERSHIP_PLANS.STANDARD]),
});

export const updatePaymentSettingsSchema = z.object({
  provider: z.enum(["razorpay", "none"]).optional(),
  enabled: z.boolean().optional(),
  testMode: z.boolean().optional(),
  keyId: z.string().trim().max(200).optional(),
  keySecret: z.string().trim().max(500).optional(),
  webhookSecret: z.string().trim().max(500).optional(),
});

export const moderateReviewSchema = z.object({
  isApproved: z.boolean(),
});

export const businessIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export const updateBusinessListingSchema = z.object({
  isActive: z.boolean(),
});

export const updateBusinessFeaturedSchema = z.object({
  isFeatured: z.boolean(),
});

export const reviewIdParamSchema = z.object({
  id: z.string().trim().min(1),
});
