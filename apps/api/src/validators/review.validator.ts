import { z } from "zod";

export const createCustomerReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().max(2000).optional().default(""),
});

export type CreateCustomerReviewInput = z.infer<typeof createCustomerReviewSchema>;
