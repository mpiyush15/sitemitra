import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { adminService } from "../services/admin.service.js";

export const bannersPublicRouter = Router();
bannersPublicRouter.use(requireDatabase);

bannersPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const banners = await adminService.listPublicHeroBanners();
    return sendSuccess(res, banners);
  }),
);
