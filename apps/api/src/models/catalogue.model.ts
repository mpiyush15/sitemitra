import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const catalogueSchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    fileUrl: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    uploadedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export type Catalogue = InferSchemaType<typeof catalogueSchema>;
export type CatalogueDocument = HydratedDocument<Catalogue>;

export const CatalogueModel = model("Catalogue", catalogueSchema);
