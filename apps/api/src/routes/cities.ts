import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { validate, getValidatedBody, getValidatedParams } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireSuperAdmin } from "../middleware/authorize.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { cityService } from "../services/city.service.js";
import {
  cityIdParamSchema,
  createCitySchema,
  updateCitySchema,
} from "../validators/city.validator.js";
import type { z } from "zod";

export const cityRouter = Router();

cityRouter.use(requireDatabase);

cityRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cities = await cityService.listActive();
    return sendSuccess(res, cities);
  }),
);

export const adminCityRouter = Router();

adminCityRouter.use(requireDatabase);
adminCityRouter.use(authenticate);
adminCityRouter.use(requireSuperAdmin);

adminCityRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cities = await cityService.listAll();
    return sendSuccess(res, cities);
  }),
);

adminCityRouter.post(
  "/",
  validate(createCitySchema),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<z.infer<typeof createCitySchema>>(req);
    const city = await cityService.create(body);
    return sendSuccess(res, city, { message: "City created" });
  }),
);

adminCityRouter.patch(
  "/:id",
  validate(cityIdParamSchema, "params"),
  validate(updateCitySchema),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: string }>(req);
    const body = getValidatedBody<z.infer<typeof updateCitySchema>>(req);
    const city = await cityService.update(id, body);
    return sendSuccess(res, city, { message: "City updated" });
  }),
);
