import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { getValidatedBody, getValidatedParams, validate } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRoles } from "../middleware/authorize.js";
import { ROLES } from "../lib/constants.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { customerService } from "../services/customer.service.js";
import { createCustomerReviewSchema } from "../validators/review.validator.js";
import { slugParamSchema } from "../validators/business.validator.js";

export const customerRouter = Router();

customerRouter.use(requireDatabase);
customerRouter.use(authenticate);
customerRouter.use(requireRoles(ROLES.USER));

customerRouter.get(
  "/businesses/:slug/engagement",
  validate(slugParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const result = await customerService.getBusinessEngagement(slug, req.auth!.sub);
    return sendSuccess(res, result);
  }),
);

customerRouter.post(
  "/businesses/:slug/saved",
  validate(slugParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const result = await customerService.toggleSaved(slug, req.auth!.sub);
    return sendSuccess(res, result);
  }),
);

customerRouter.post(
  "/businesses/:slug/reviews",
  validate(slugParamSchema, "params"),
  validate(createCustomerReviewSchema),
  asyncHandler(async (req, res) => {
    const { slug } = getValidatedParams<{ slug: string }>(req);
    const body = getValidatedBody<import("../validators/review.validator.js").CreateCustomerReviewInput>(
      req,
    );
    const review = await customerService.createReview(
      slug,
      req.auth!.sub,
      req.user!.fullName,
      req.auth!.role,
      body,
    );
    return sendSuccess(res, review, { message: "Review published", status: 201 });
  }),
);
