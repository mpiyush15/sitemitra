import { z } from "zod";

const socialLinksSchema = z.object({
  facebook: z.string().trim().max(500).optional(),
  instagram: z.string().trim().max(500).optional(),
  linkedin: z.string().trim().max(500).optional(),
  youtube: z.string().trim().max(500).optional(),
});

export const updateBusinessProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(160).optional(),
  slug: z.string().trim().min(2).max(120).optional(),
  category: z.string().trim().min(1).max(120).optional(),
  subCategory: z.string().trim().max(120).optional(),
  city: z.string().trim().min(1).max(120).optional(),
  state: z.string().trim().max(120).optional(),
  description: z.string().trim().max(4000).optional(),
  services: z.array(z.string().trim().min(1).max(120)).max(24).optional(),
  experience: z.string().trim().max(500).optional(),
  logo: z.string().trim().max(2000).optional(),
  thumbnail: z.string().trim().max(2000).optional(),
  profileBanner: z.string().trim().max(2000).optional(),
  gallery: z.array(z.string().trim().max(2000)).max(10).optional(),
  whatsappNumber: z.string().trim().max(30).optional(),
  phoneNumber: z.string().trim().max(30).optional(),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Invalid email" }),
  website: z.string().trim().max(500).optional(),
  socialLinks: socialLinksSchema.optional(),
});

export const publishBusinessProfileSchema = z.object({
  publish: z.boolean(),
});

export type UpdateBusinessProfileInput = z.infer<typeof updateBusinessProfileSchema>;
