import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type Category = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<Category>;

export const CategoryModel = model("Category", categorySchema);
