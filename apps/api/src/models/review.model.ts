import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, trim: true, default: "", maxlength: 2000 },
    isApproved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

reviewSchema.index({ businessId: 1, createdAt: -1 });

export type Review = InferSchemaType<typeof reviewSchema>;
export type ReviewDocument = HydratedDocument<Review>;

export const ReviewModel = model("Review", reviewSchema);
