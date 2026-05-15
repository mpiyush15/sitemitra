import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const profileViewSchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, trim: true, maxlength: 64, index: true },
  },
  { timestamps: true },
);

profileViewSchema.index({ businessId: 1, sessionId: 1 }, { unique: true });
profileViewSchema.index({ businessId: 1, createdAt: -1 });

export type ProfileView = InferSchemaType<typeof profileViewSchema>;
export type ProfileViewDocument = HydratedDocument<ProfileView>;

export const ProfileViewModel = model("ProfileView", profileViewSchema);
