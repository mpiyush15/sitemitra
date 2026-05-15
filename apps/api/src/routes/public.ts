import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedQuery, getValidatedParams } from "../lib/validate.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { businessService, categoryService } from "../services/public.service.js";
import { inquiryService } from "../services/inquiry.service.js";
import { analyticsService } from "../services/analytics.service.js";
import {
  businessListQuerySchema,
  featuredQuerySchema,
  relatedQuerySchema,
  slugParamSchema,
} from "../validators/business.validator.js";
import { createInquirySchema } from "../validators/inquiry.validator.js";
import { recordProfileViewSchema } from "../validators/analytics.validator.js";

export const categoryRouter = Router();

categoryRouter.use(requireDatabase);

categoryRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await categoryService.listActive();
    return sendSuccess(res, categories);
  }),
);

export const businessRouter = Router();

businessRouter.use(requireDatabase);

businessRouter.get(
  "/",
  validate(businessListQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const result = await businessService.list(getValidatedQuery(req));
    return sendSuccess(res, result);
  }),
);

businessRouter.get(
  "/featured",
  validate(featuredQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const { limit } = getValidatedQuery<{ limit?: number }>(req);
    const items = await businessService.featured(limit ?? 8);
    return sendSuccess(res, items);
  }),
);

businessRouter.get(
  "/:slug/related",
  validate(slugParamSchema, "params"),
  validate(relatedQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const { limit } = getValidatedQuery<{ limit?: number }>(req);
    const items = await businessService.getRelated(slug, limit ?? 4);
    return sendSuccess(res, items);
  }),
);

businessRouter.post(
  "/:slug/views",
  validate(slugParamSchema, "params"),
  validate(recordProfileViewSchema),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const body = getValidatedBody<import("../validators/analytics.validator.js").RecordProfileViewInput>(req);
    const result = await analyticsService.recordProfileView(slug, body.sessionId);
    return sendSuccess(res, result);
  }),
);

businessRouter.post(
  "/:slug/inquiries",
  validate(slugParamSchema, "params"),
  validate(createInquirySchema),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const body = getValidatedBody<import("../validators/inquiry.validator.js").CreateInquiryInput>(req);
    const result = await inquiryService.createForSlug(slug, body);
    return sendSuccess(res, result, { message: result.message, status: 201 });
  }),
);

businessRouter.get(
  "/:slug",
  validate(slugParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const business = await businessService.getBySlug(slug);
    return sendSuccess(res, business);
  }),
);
