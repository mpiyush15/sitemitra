import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    imageUrl: { type: String, required: true },
    redirectUrl: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    /** Gradient + title/CTA on homepage hero slide */
    showOverlay: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Banner = InferSchemaType<typeof bannerSchema>;
export type BannerDocument = HydratedDocument<Banner>;

export const BannerModel = model("Banner", bannerSchema);
