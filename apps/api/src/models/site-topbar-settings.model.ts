import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const siteTopbarSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    instagramUrl: { type: String, default: "", trim: true, maxlength: 500 },
    facebookUrl: { type: String, default: "", trim: true, maxlength: 500 },
    youtubeUrl: { type: String, default: "", trim: true, maxlength: 500 },
    email: { type: String, default: "", trim: true, maxlength: 160 },
    whatsapp: { type: String, default: "", trim: true, maxlength: 20 },
    callPhone: { type: String, default: "", trim: true, maxlength: 20 },
    callCtaLabel: { type: String, default: "Call us", trim: true, maxlength: 48 },
  },
  { timestamps: true },
);

export type SiteTopbarSettings = InferSchemaType<typeof siteTopbarSettingsSchema>;
export type SiteTopbarSettingsDocument = HydratedDocument<SiteTopbarSettings>;

export const SiteTopbarSettingsModel = model("SiteTopbarSettings", siteTopbarSettingsSchema);
