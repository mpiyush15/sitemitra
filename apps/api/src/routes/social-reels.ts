import { Router } from "express";
import type { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedParams } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireSuperAdmin } from "../middleware/authorize.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { socialReelService } from "../services/social-reel.service.js";
import {
  createSocialReelSchema,
  socialReelIdParamSchema,
  updateSocialReelSchema,
} from "../validators/social-reel.validator.js";

export const socialReelRouter = Router();

socialReelRouter.use(requireDatabase);

socialReelRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const reels = await socialReelService.listActive();
    return sendSuccess(res, reels);
  }),
);

export const adminSocialReelRouter = Router();

adminSocialReelRouter.use(requireDatabase);
adminSocialReelRouter.use(authenticate);
adminSocialReelRouter.use(requireSuperAdmin);

adminSocialReelRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const reels = await socialReelService.listAll();
    return sendSuccess(res, reels);
  }),
);

adminSocialReelRouter.post(
  "/",
  validate(createSocialReelSchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof createSocialReelSchema>>(req);
    const reel = await socialReelService.create(body);
    return sendSuccess(res, reel, { message: "Reel added" });
  }),
);

adminSocialReelRouter.patch(
  "/:id",
  validate(socialReelIdParamSchema, "params"),
  validate(updateSocialReelSchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const body = getValidatedBody<z.infer<typeof updateSocialReelSchema>>(req);
    const reel = await socialReelService.update(id, body);
    return sendSuccess(res, reel, { message: "Reel updated" });
  }),
);

adminSocialReelRouter.delete(
  "/:id",
  validate(socialReelIdParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const result = await socialReelService.remove(id);
    return sendSuccess(res, result, { message: "Reel removed" });
  }),
);
