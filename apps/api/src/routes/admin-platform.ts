import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendError, sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedParams } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/authorize.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { adminService } from "../services/admin.service.js";
import { membershipService } from "../services/membership.service.js";
import {
  compressImageToWebp,
  deleteObjectByPublicUrl,
  isAllowedBannerMime,
  uploadHeroBannerWebp,
} from "../services/storage.service.js";
import {
  assignBusinessPlanSchema,
  businessIdParamSchema,
  moderateReviewSchema,
  planSlugParamSchema,
  reviewIdParamSchema,
  updateBusinessListingSchema,
  updateBusinessFeaturedSchema,
  updatePaymentSettingsSchema,
  updatePlanSchema,
} from "../validators/membership.validator.js";
import { updateSiteTopbarSchema } from "../validators/site-topbar.validator.js";
import { siteTopbarService } from "../services/site-topbar.service.js";
import {
  bannerCreateFormSchema,
  bannerIdParamSchema,
  bannerUpdateJsonSchema,
} from "../validators/banner.validator.js";
import type { z } from "zod";
import { MEMBERSHIP_PLANS } from "../lib/constants.js";

const bannerImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes },
  fileFilter: (_req, file, cb) => {
    if (isAllowedBannerMime(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          400,
          "INVALID_IMAGE_TYPE",
          "Only JPEG, PNG, or WebP images are allowed",
        ),
      );
    }
  },
});

export const plansRouter = Router();
plansRouter.use(requireDatabase);
plansRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const plans = await membershipService.listPublicPlans();
    return sendSuccess(res, plans);
  }),
);

plansRouter.get(
  "/payment-status",
  asyncHandler(async (_req, res) => {
    const status = await membershipService.getPaymentSettingsPublic();
    return sendSuccess(res, status);
  }),
);

export const adminPlatformRouter = Router();
adminPlatformRouter.use(requireDatabase);
adminPlatformRouter.use(authenticate);
adminPlatformRouter.use(requireAdmin);

adminPlatformRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listUsers());
  }),
);

adminPlatformRouter.get(
  "/businesses",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listBusinesses());
  }),
);

adminPlatformRouter.patch(
  "/businesses/:id/membership",
  validate(businessIdParamSchema, "params"),
  validate(assignBusinessPlanSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const { planSlug } = getValidatedBody<z.infer<typeof assignBusinessPlanSchema>>(req);
    const result = await membershipService.assignPlanToBusiness(id, planSlug);
    return sendSuccess(res, result, { message: "Plan assigned" });
  }),
);

adminPlatformRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listCategories());
  }),
);

adminPlatformRouter.get(
  "/reviews",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listReviews());
  }),
);

adminPlatformRouter.patch(
  "/reviews/:id",
  validate(reviewIdParamSchema, "params"),
  validate(moderateReviewSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const { isApproved } = getValidatedBody<z.infer<typeof moderateReviewSchema>>(req);
    const result = await adminService.moderateReview(id, isApproved);
    return sendSuccess(res, result, {
      message: isApproved ? "Review is visible on the profile" : "Review hidden from public profile",
    });
  }),
);

adminPlatformRouter.delete(
  "/reviews/:id",
  validate(reviewIdParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const result = await adminService.deleteReview(id);
    return sendSuccess(res, result, { message: "Review deleted permanently" });
  }),
);

adminPlatformRouter.get(
  "/banners",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listBanners());
  }),
);

export const adminMembershipRouter = Router();
adminMembershipRouter.use(requireDatabase);
adminMembershipRouter.use(authenticate);
adminMembershipRouter.use(requireSuperAdmin);

adminMembershipRouter.get(
  "/plans",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await membershipService.listAdminPlans());
  }),
);

adminMembershipRouter.patch(
  "/plans/:slug",
  validate(planSlugParamSchema, "params"),
  validate(updatePlanSchema),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: typeof MEMBERSHIP_PLANS.FREE | typeof MEMBERSHIP_PLANS.STANDARD }>(req);
    const body = getValidatedBody<z.infer<typeof updatePlanSchema>>(req);
    const plan = await membershipService.updatePlan(slug, body);
    return sendSuccess(res, plan, { message: "Plan updated" });
  }),
);

adminMembershipRouter.get(
  "/site-topbar",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await siteTopbarService.getAdmin());
  }),
);

adminMembershipRouter.patch(
  "/site-topbar",
  validate(updateSiteTopbarSchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof updateSiteTopbarSchema>>(req);
    const settings = await siteTopbarService.update(body);
    return sendSuccess(res, settings, { message: "Top bar saved" });
  }),
);

adminMembershipRouter.get(
  "/payment-settings",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await membershipService.getPaymentSettingsAdmin());
  }),
);

adminMembershipRouter.patch(
  "/payment-settings",
  validate(updatePaymentSettingsSchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof updatePaymentSettingsSchema>>(req);
    const settings = await membershipService.updatePaymentSettings(body);
    return sendSuccess(res, settings, { message: "Payment settings saved" });
  }),
);

adminMembershipRouter.get(
  "/payments",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await adminService.listPayments());
  }),
);

adminMembershipRouter.patch(
  "/businesses/:id/listing",
  validate(businessIdParamSchema, "params"),
  validate(updateBusinessListingSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const { isActive } = getValidatedBody<z.infer<typeof updateBusinessListingSchema>>(req);
    const result = await adminService.setBusinessListingActive(id, isActive);
    return sendSuccess(res, result, {
      message: isActive ? "Listing is now visible on the platform" : "Listing hidden from public search",
    });
  }),
);

adminMembershipRouter.patch(
  "/businesses/:id/featured",
  validate(businessIdParamSchema, "params"),
  validate(updateBusinessFeaturedSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const { isFeatured } = getValidatedBody<z.infer<typeof updateBusinessFeaturedSchema>>(req);
    const result = await adminService.setBusinessFeatured(id, isFeatured);
    return sendSuccess(res, result, {
      message: isFeatured ? "Business marked as featured" : "Featured flag removed",
    });
  }),
);

adminMembershipRouter.post(
  "/banners",
  bannerImageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
      return sendError(res, 400, "IMAGE_REQUIRED", "Image file is required (field name: image)");
    }

    const parsed = bannerCreateFormSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid banner fields", {
        issues: parsed.error.flatten(),
      });
    }

    const webp = await compressImageToWebp(req.file.buffer, req.file.mimetype);
    const imageUrl = await uploadHeroBannerWebp(webp);
    const banner = await adminService.createBanner({
      title: parsed.data.title,
      imageUrl,
      redirectUrl: parsed.data.redirectUrl || "",
      sortOrder: parsed.data.sortOrder,
      showOverlay: parsed.data.showOverlay,
    });
    return sendSuccess(res, banner, { message: "Banner created" });
  }),
);

adminMembershipRouter.patch(
  "/banners/:id",
  validate(bannerIdParamSchema, "params"),
  validate(bannerUpdateJsonSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const body = getValidatedBody<z.infer<typeof bannerUpdateJsonSchema>>(req);
    const result = await adminService.updateBanner(id, body);
    const { oldImageUrlForDeletion, ...banner } = result;
    return sendSuccess(res, banner, { message: "Banner updated" });
  }),
);

adminMembershipRouter.post(
  "/banners/:id/image",
  validate(bannerIdParamSchema, "params"),
  bannerImageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
      return sendError(res, 400, "IMAGE_REQUIRED", "Image file is required (field name: image)");
    }
    const { id } = getValidatedParams<{ id: string }>(req);
    const webp = await compressImageToWebp(req.file.buffer, req.file.mimetype);
    const imageUrl = await uploadHeroBannerWebp(webp);
    const result = await adminService.updateBanner(id, { imageUrl });
    if (result.oldImageUrlForDeletion) {
      await deleteObjectByPublicUrl(result.oldImageUrlForDeletion);
    }
    const { oldImageUrlForDeletion, ...banner } = result;
    return sendSuccess(res, banner, { message: "Banner image replaced" });
  }),
);

adminMembershipRouter.delete(
  "/banners/:id",
  validate(bannerIdParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const deleted = await adminService.deleteBanner(id);
    await deleteObjectByPublicUrl(deleted.imageUrl);
    return sendSuccess(res, { id: deleted.id }, { message: "Banner deleted" });
  }),
);
