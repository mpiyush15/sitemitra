import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { MEMBERSHIP_PLANS } from "../lib/constants.js";

const membershipSchema = new Schema(
  {
    planName: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      enum: Object.values(MEMBERSHIP_PLANS),
    },
    price: { type: Number, required: true, min: 0 },
    features: { type: [String], default: [] },
    durationDays: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type Membership = InferSchemaType<typeof membershipSchema>;
export type MembershipDocument = HydratedDocument<Membership>;

export const MembershipModel = model("Membership", membershipSchema);
