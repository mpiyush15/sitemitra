import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const savedBusinessSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

savedBusinessSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export type SavedBusiness = InferSchemaType<typeof savedBusinessSchema>;
export type SavedBusinessDocument = HydratedDocument<SavedBusiness>;

export const SavedBusinessModel = model("SavedBusiness", savedBusinessSchema);
