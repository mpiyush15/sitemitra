import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { profileImageUpload } from "../lib/image-upload.js";
import { sendError, sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedParams } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireBusiness } from "../middleware/authorize.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { dashboardMediaService } from "../services/dashboard-media.service.js";
import { dashboardService } from "../services/dashboard.service.js";
import type { z } from "zod";
import {
  publishBusinessProfileSchema,
  updateBusinessProfileSchema,
} from "../validators/business-profile.validator.js";
import {
  inquiryIdParamSchema,
  updateInquiryStatusSchema,
} from "../validators/inquiry.validator.js";
import { upgradePlanSchema } from "../validators/membership.validator.js";
import { inquiryService } from "../services/inquiry.service.js";
import { analyticsService } from "../services/analytics.service.js";
import { membershipService } from "../services/membership.service.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireDatabase);
dashboardRouter.use(authenticate);
dashboardRouter.use(requireBusiness);

dashboardRouter.get(
  "/business-profile",
  asyncHandler(async (req, res) => {
    const result = await dashboardService.getBusinessProfile(req.auth!.sub);
    return sendSuccess(res, result);
  }),
);

dashboardRouter.patch(
  "/business-profile",
  validate(updateBusinessProfileSchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof updateBusinessProfileSchema>>(req);
    const result = await dashboardService.updateBusinessProfile(req.auth!.sub, body);
    return sendSuccess(res, result, { message: "Profile saved" });
  }),
);

dashboardRouter.post(
  "/business-profile/logo",
  profileImageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendError(res, 400, "IMAGE_REQUIRED", "Image file is required (field name: image)");
    }
    const result = await dashboardMediaService.uploadLogo(req.auth!.sub, req.file);
    return sendSuccess(res, result, { message: "Logo updated" });
  }),
);

dashboardRouter.post(
  "/business-profile/thumbnail",
  profileImageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendError(res, 400, "IMAGE_REQUIRED", "Image file is required (field name: image)");
    }
    const result = await dashboardMediaService.uploadThumbnail(req.auth!.sub, req.file);
    return sendSuccess(res, result, { message: "Listing thumbnail updated" });
  }),
);

dashboardRouter.post(
  "/business-profile/profile-banner",
  profileImageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendError(res, 400, "IMAGE_REQUIRED", "Image file is required (field name: image)");
    }
    const result = await dashboardMediaService.uploadProfileBanner(req.auth!.sub, req.file);
    return sendSuccess(res, result, { message: "Profile banner updated" });
  }),
);

dashboardRouter.post(
  "/business-profile/gallery",
  profileImageUpload.array("images", 10),
  asyncHandler(async (req, res) => {
    const files = req.files;
    if (!Array.isArray(files) || files.length === 0) {
      return sendError(
        res,
        400,
        "IMAGE_REQUIRED",
        "At least one image file is required (field name: images)",
      );
    }
    const result = await dashboardMediaService.uploadGalleryImages(req.auth!.sub, files);
    return sendSuccess(res, result, { message: "Gallery images uploaded" });
  }),
);

dashboardRouter.post(
  "/business-profile/publish",
  validate(publishBusinessProfileSchema),
  asyncHandler(async (req, res) => {
    const { publish } = getValidatedBody<z.infer<typeof publishBusinessProfileSchema>>(req);
    const result = await dashboardService.setPublished(req.auth!.sub, publish);
    return sendSuccess(res, result, {
      message: publish ? "Listing published" : "Listing unpublished",
    });
  }),
);

dashboardRouter.get(
  "/inquiries",
  asyncHandler(async (req, res) => {
    const inquiries = await inquiryService.listForBusinessUser(req.auth!.sub);
    return sendSuccess(res, inquiries);
  }),
);

dashboardRouter.patch(
  "/inquiries/:id",
  validate(inquiryIdParamSchema, "params"),
  validate(updateInquiryStatusSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const body = getValidatedBody<z.infer<typeof updateInquiryStatusSchema>>(req);
    const result = await inquiryService.updateStatusForBusinessUser(req.auth!.sub, id, body);
    return sendSuccess(res, result, { message: "Inquiry updated" });
  }),
);

dashboardRouter.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const analytics = await analyticsService.getBusinessAnalytics(req.auth!.sub);
    return sendSuccess(res, analytics);
  }),
);

dashboardRouter.post(
  "/upgrade",
  validate(upgradePlanSchema),
  asyncHandler(async (req, res) => {
    const { planSlug } = getValidatedBody<z.infer<typeof upgradePlanSchema>>(req);
    const result = await membershipService.upgradeBusinessUser(req.auth!.sub, planSlug);
    return sendSuccess(res, result, { message: "Plan upgraded successfully" });
  }),
);
