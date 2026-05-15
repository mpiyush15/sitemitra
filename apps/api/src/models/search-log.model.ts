import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const searchLogSchema = new Schema(
  {
    category: { type: String, trim: true, default: "", index: true },
    city: { type: String, trim: true, default: "", index: true },
    q: { type: String, trim: true, default: "" },
    label: { type: String, required: true, trim: true },
    count: { type: Number, default: 1, min: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

searchLogSchema.index({ category: 1, city: 1, q: 1 }, { unique: true });
searchLogSchema.index({ count: -1, lastSearchedAt: -1 });

export type SearchLog = InferSchemaType<typeof searchLogSchema>;
export type SearchLogDocument = HydratedDocument<SearchLog>;

export const SearchLogModel = model("SearchLog", searchLogSchema);
