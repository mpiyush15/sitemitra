import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const PLATFORMS = ["instagram", "youtube", "facebook"] as const;

const socialReelSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 120, default: "" },
    platform: { type: String, enum: PLATFORMS, required: true },
    sourceUrl: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type SocialReelPlatform = (typeof PLATFORMS)[number];
export type SocialReel = InferSchemaType<typeof socialReelSchema>;
export type SocialReelDocument = HydratedDocument<SocialReel>;

export const SocialReelModel = model("SocialReel", socialReelSchema);
