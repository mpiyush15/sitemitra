import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { MEMBERSHIP_PLANS } from "../lib/constants.js";

const socialLinksSchema = new Schema(
  {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  { _id: false },
);

const businessProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    subCategory: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "", maxlength: 4000 },
    services: { type: [String], default: [] },
    experience: { type: String, trim: true, default: "" },
    logo: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    profileBanner: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    whatsappNumber: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    website: { type: String, trim: true, default: "" },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    membershipType: {
      type: String,
      enum: Object.values(MEMBERSHIP_PLANS),
      default: MEMBERSHIP_PLANS.FREE,
      index: true,
    },
    verificationBadge: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false, index: true },
    /** Super admin can deactivate — hidden from public listings even if isPublished */
    isActive: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

businessProfileSchema.index({ category: 1, city: 1, membershipType: 1 });

export type BusinessProfile = InferSchemaType<typeof businessProfileSchema>;
export type BusinessProfileDocument = HydratedDocument<BusinessProfile>;

export const BusinessProfileModel = model("BusinessProfile", businessProfileSchema);
