import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const citySchema = new Schema(
  {
    cityName: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type City = InferSchemaType<typeof citySchema>;
export type CityDocument = HydratedDocument<City>;

export const CityModel = model("City", citySchema);
