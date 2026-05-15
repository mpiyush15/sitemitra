import { z } from "zod";

export const recordSearchSchema = z
  .object({
    category: z.string().trim().max(120).optional(),
    city: z.string().trim().max(120).optional(),
    q: z.string().trim().max(200).optional(),
  })
  .refine((data) => Boolean(data.category || data.city || data.q), {
    message: "At least one search field is required",
  });

export const popularSearchQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(8).default(3),
  perSearch: z.coerce.number().int().min(0).max(8).default(4),
});

export type RecordSearchInput = z.infer<typeof recordSearchSchema>;
export type PopularSearchQuery = z.infer<typeof popularSearchQuerySchema>;
