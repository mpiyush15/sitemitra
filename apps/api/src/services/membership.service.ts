import { MEMBERSHIP_PLANS, type MembershipPlan } from "../lib/constants.js";
import {
  DEFAULT_FREE_FEATURES,
  DEFAULT_STANDARD_FEATURES,
  resolveEffectivePlan,
} from "../lib/plan-features.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import { membershipRepository } from "../repositories/membership.repository.js";
import { paymentSettingsRepository } from "../repositories/payment-settings.repository.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { PaymentModel } from "../models/payment.model.js";

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export const membershipService = {
  async ensureDefaultPlans() {
    await membershipRepository.upsertBySlug(MEMBERSHIP_PLANS.FREE, {
      planName: "Free",
      price: 0,
      features: [...DEFAULT_FREE_FEATURES],
      durationDays: 36500,
      isActive: true,
    });
    await membershipRepository.upsertBySlug(MEMBERSHIP_PLANS.STANDARD, {
      planName: "Standard",
      price: 0,
      features: [...DEFAULT_STANDARD_FEATURES],
      durationDays: 365,
      isActive: true,
    });
    await paymentSettingsRepository.get();
  },

  async listPublicPlans() {
    await this.ensureDefaultPlans();
    const plans = await membershipRepository.findActive();
    return plans.map((plan) => ({
      id: plan._id.toString(),
      planName: plan.planName,
      slug: plan.slug,
      price: plan.price,
      features: plan.features,
      durationDays: plan.durationDays,
    }));
  },

  async listAdminPlans() {
    await this.ensureDefaultPlans();
    const plans = await membershipRepository.findAll();
    return plans.map((plan) => ({
      id: plan._id.toString(),
      planName: plan.planName,
      slug: plan.slug,
      price: plan.price,
      features: plan.features,
      durationDays: plan.durationDays,
      isActive: plan.isActive,
    }));
  },

  async updatePlan(
    slug: MembershipPlan,
    input: Partial<{
      planName: string;
      price: number;
      features: string[];
      durationDays: number;
      isActive: boolean;
    }>,
  ) {
    const updated = await membershipRepository.updateBySlug(slug, input);
    if (!updated) throw new NotFoundError("Plan not found");
    return {
      id: updated._id.toString(),
      planName: updated.planName,
      slug: updated.slug,
      price: updated.price,
      features: updated.features,
      durationDays: updated.durationDays,
      isActive: updated.isActive,
    };
  },

  async getPaymentSettingsPublic() {
    const settings = await paymentSettingsRepository.get();
    return {
      provider: settings.provider,
      enabled: settings.enabled,
      testMode: settings.testMode,
      hasKeys: Boolean(settings.keyId),
    };
  },

  async getPaymentSettingsAdmin() {
    const settings = await paymentSettingsRepository.getWithSecrets();
    return {
      provider: settings.provider,
      enabled: settings.enabled,
      testMode: settings.testMode,
      keyId: settings.keyId,
      hasKeySecret: Boolean(settings.keySecret),
      hasWebhookSecret: Boolean(settings.webhookSecret),
    };
  },

  async updatePaymentSettings(input: {
    provider?: "razorpay" | "none";
    enabled?: boolean;
    testMode?: boolean;
    keyId?: string;
    keySecret?: string;
    webhookSecret?: string;
  }) {
    const update: Record<string, unknown> = {};
    if (input.provider !== undefined) update.provider = input.provider;
    if (input.enabled !== undefined) update.enabled = input.enabled;
    if (input.testMode !== undefined) update.testMode = input.testMode;
    if (input.keyId !== undefined) update.keyId = input.keyId;
    if (input.keySecret !== undefined && input.keySecret.trim()) {
      update.keySecret = input.keySecret.trim();
    }
    if (input.webhookSecret !== undefined && input.webhookSecret.trim()) {
      update.webhookSecret = input.webhookSecret.trim();
    }
    await paymentSettingsRepository.update(update);
    return this.getPaymentSettingsAdmin();
  },

  async assignPlan(userId: string, planSlug: MembershipPlan) {
    const plan = await membershipRepository.findBySlugAdmin(planSlug);
    if (!plan || !plan.isActive) throw new NotFoundError("Plan not found");

    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const expiresAt =
      planSlug === MEMBERSHIP_PLANS.STANDARD ? addDays(plan.durationDays) : null;

    await userRepository.updateMembership(userId, planSlug, expiresAt);
    await businessProfileRepository.updateMembershipByUserId(userId, planSlug);

    return {
      membershipPlan: planSlug,
      membershipExpiresAt: expiresAt,
      planName: plan.planName,
    };
  },

  async assignPlanToBusiness(businessId: string, planSlug: MembershipPlan) {
    const profile = await businessProfileRepository.findById(businessId);
    if (!profile) throw new NotFoundError("Business not found");
    return this.assignPlan(profile.userId.toString(), planSlug);
  },

  async upgradeBusinessUser(userId: string, planSlug: MembershipPlan) {
    if (planSlug === MEMBERSHIP_PLANS.FREE) {
      return this.assignPlan(userId, MEMBERSHIP_PLANS.FREE);
    }

    await this.ensureDefaultPlans();
    const plan = await membershipRepository.findBySlugAdmin(planSlug);
    if (!plan || !plan.isActive) throw new NotFoundError("Plan not found");

    const settings = await paymentSettingsRepository.get();
    const requiresPayment = plan.price > 0 && settings.enabled && settings.provider === "razorpay";

    if (requiresPayment) {
      throw new ForbiddenError(
        "Online payment is required for this plan. Razorpay checkout will be enabled in the next release.",
      );
    }

    return this.assignPlan(userId, planSlug);
  },

  async listPayments(limit = 100) {
    const payments = await PaymentModel.find().sort({ createdAt: -1 }).limit(limit);
    return payments.map((payment) => ({
      id: payment._id.toString(),
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      paymentStatus: payment.paymentStatus,
      membershipPlan: payment.membershipPlan,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    }));
  },

  getEffectivePlan(plan: string, expiresAt?: Date | null) {
    return resolveEffectivePlan(plan, expiresAt);
  },
};
