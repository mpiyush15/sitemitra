import { z } from "zod";
import { isValidIndianMobile, normalizeIndianMobile } from "../lib/phone.js";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .transform((value) => (value && value !== "#" ? value : "#"))
  .refine((value) => value === "#" || /^https?:\/\//i.test(value), {
    message: "Enter a valid URL (https://…) or leave blank",
  });

const optionalEmail = z
  .string()
  .trim()
  .max(160)
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Enter a valid email or leave empty",
  });

const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .transform((value) => (value ? normalizeIndianMobile(value) : ""))
  .refine((value) => !value || isValidIndianMobile(value), {
    message: "Enter a valid 10-digit Indian mobile number",
  });

export const updateSiteTopbarSchema = z.object({
  instagramUrl: optionalUrl.optional(),
  facebookUrl: optionalUrl.optional(),
  youtubeUrl: optionalUrl.optional(),
  email: optionalEmail.optional(),
  whatsapp: optionalPhone.optional(),
  callPhone: optionalPhone.optional(),
  callCtaLabel: z.string().trim().min(1).max(48).optional(),
});
