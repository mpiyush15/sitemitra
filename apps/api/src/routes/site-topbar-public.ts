import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { siteTopbarService } from "../services/site-topbar.service.js";

export const siteTopbarPublicRouter = Router();
siteTopbarPublicRouter.use(requireDatabase);

siteTopbarPublicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return sendSuccess(res, await siteTopbarService.getPublic());
  }),
);
