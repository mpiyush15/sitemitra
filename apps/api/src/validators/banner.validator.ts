import { z } from "zod";

export const bannerIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

/** JSON body for PATCH /admin/membership/banners/:id */
export const bannerUpdateJsonSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    redirectUrl: z.string().trim().max(2000).optional(),
    sortOrder: z.number().int().min(0).max(9999).optional(),
    isActive: z.boolean().optional(),
    showOverlay: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field is required",
  });

/** Multipart text fields for POST /admin/membership/banners */
export const bannerCreateFormSchema = z.object({
  title: z.string().trim().min(1).max(160),
  redirectUrl: z.string().trim().max(2000).optional().default(""),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  showOverlay: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (v === undefined ? true : v === true || v === "true")),
});
