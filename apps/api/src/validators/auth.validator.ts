import { z } from "zod";
import { ROLES } from "../lib/constants.js";
import { isValidIndianMobile, normalizeIndianMobile } from "../lib/phone.js";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .transform((value) => normalizeIndianMobile(value))
  .refine((value) => isValidIndianMobile(value), {
    message: "Enter a valid 10-digit Indian mobile number",
  });

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128),
    phone: phoneSchema,
    role: z.enum([ROLES.BUSINESS, ROLES.USER]).default(ROLES.USER),
    businessName: z.string().trim().min(2).max(160).optional(),
    category: z.string().trim().min(2).max(120).optional(),
    city: z.string().trim().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === ROLES.USER) {
      const city = data.city?.trim() ?? "";
      if (city.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["city"],
        });
      }
    }

    if (data.role === ROLES.BUSINESS && data.businessName?.trim()) {
      if (!data.category?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Category is required when adding a business name",
          path: ["category"],
        });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required when adding a business name",
          path: ["city"],
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
