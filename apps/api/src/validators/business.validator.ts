import { z } from "zod";

export const businessListQuerySchema = z.object({
  category: z.string().trim().optional(),
  city: z.string().trim().optional(),
  q: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export const featuredQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(24).optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(12).optional(),
});

export type BusinessListQuery = z.infer<typeof businessListQuerySchema>;
