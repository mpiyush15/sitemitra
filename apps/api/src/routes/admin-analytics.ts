import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireSuperAdmin } from "../middleware/authorize.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { analyticsService } from "../services/analytics.service.js";

export const adminAnalyticsRouter = Router();

adminAnalyticsRouter.use(requireDatabase);
adminAnalyticsRouter.use(authenticate);
adminAnalyticsRouter.use(requireSuperAdmin);

adminAnalyticsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const analytics = await analyticsService.getPlatformAnalytics();
    return sendSuccess(res, analytics);
  }),
);
