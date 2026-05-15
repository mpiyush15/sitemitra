import { z } from "zod";
import { INQUIRY_STATUS } from "../lib/constants.js";

export const createInquirySchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  city: z.string().trim().max(120).optional(),
  requirement: z.string().trim().min(10).max(2000),
});

export const updateInquiryStatusSchema = z.object({
  inquiryStatus: z.enum([
    INQUIRY_STATUS.NEW,
    INQUIRY_STATUS.CONTACTED,
    INQUIRY_STATUS.CLOSED,
  ]),
});

export const inquiryIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
