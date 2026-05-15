import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedQuery } from "../lib/validate.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { searchService } from "../services/search.service.js";
import type { z } from "zod";
import {
  popularSearchQuerySchema,
  recordSearchSchema,
} from "../validators/search.validator.js";

export const searchRouter = Router();

searchRouter.use(requireDatabase);

searchRouter.post(
  "/record",
  validate(recordSearchSchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof recordSearchSchema>>(req);
    const result = await searchService.recordSearch(body);
    return sendSuccess(res, result, { status: 201 });
  }),
);

searchRouter.get(
  "/popular",
  validate(popularSearchQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const query = getValidatedQuery<z.infer<typeof popularSearchQuerySchema>>(req);
    const blocks = await searchService.getPopularWithResults(query);
    return sendSuccess(res, blocks);
  }),
);
