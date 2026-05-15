import { z } from "zod";

const platformSchema = z.enum(["instagram", "youtube", "facebook"]);

export const createSocialReelSchema = z.object({
  title: z.string().trim().max(120).optional(),
  platform: platformSchema,
  sourceUrl: z.string().trim().url().max(500),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateSocialReelSchema = z.object({
  title: z.string().trim().max(120).optional(),
  platform: platformSchema.optional(),
  sourceUrl: z.string().trim().url().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const socialReelIdParamSchema = z.object({
  id: z.string().trim().min(1),
});
