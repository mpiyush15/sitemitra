import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { MEMBERSHIP_PLANS, ROLES } from "../lib/constants.js";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, default: "", index: true },
    /** Home city for customer (user) accounts */
    city: { type: String, trim: true, default: "", maxlength: 120 },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.BUSINESS,
      index: true,
    },
    membershipPlan: {
      type: String,
      enum: Object.values(MEMBERSHIP_PLANS),
      default: MEMBERSHIP_PLANS.FREE,
      index: true,
    },
    membershipExpiresAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $type: "string", $gt: "" } },
  },
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model("User", userSchema);
