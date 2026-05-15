import { z } from "zod";

export const createCitySchema = z.object({
  cityName: z.string().trim().min(2).max(120),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCitySchema = z.object({
  cityName: z.string().trim().min(2).max(120).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const cityIdParamSchema = z.object({
  id: z.string().trim().min(1),
});
