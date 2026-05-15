import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { INQUIRY_STATUS } from "../lib/constants.js";

const inquirySchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: "" },
    requirement: { type: String, required: true, trim: true, maxlength: 2000 },
    inquiryStatus: {
      type: String,
      enum: Object.values(INQUIRY_STATUS),
      default: INQUIRY_STATUS.NEW,
      index: true,
    },
  },
  { timestamps: true },
);

inquirySchema.index({ businessId: 1, createdAt: -1 });

export type Inquiry = InferSchemaType<typeof inquirySchema>;
export type InquiryDocument = HydratedDocument<Inquiry>;

export const InquiryModel = model("Inquiry", inquirySchema);
