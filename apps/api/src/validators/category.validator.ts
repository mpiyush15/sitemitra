import { z } from "zod";

export const createCategorySchema = z.object({
  categoryName: z.string().min(2, "Category name must be at least 2 characters").max(60),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCategorySchema = z.object({
  categoryName: z.string().min(2).max(60).optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const categoryIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
});
