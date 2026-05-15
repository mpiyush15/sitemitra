import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const paymentSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    provider: { type: String, default: "razorpay", enum: ["razorpay", "none"] },
    enabled: { type: Boolean, default: false },
    testMode: { type: Boolean, default: true },
    keyId: { type: String, default: "" },
    keySecret: { type: String, default: "", select: false },
    webhookSecret: { type: String, default: "", select: false },
  },
  { timestamps: true },
);

export type PaymentSettings = InferSchemaType<typeof paymentSettingsSchema>;
export type PaymentSettingsDocument = HydratedDocument<PaymentSettings>;

export const PaymentSettingsModel = model("PaymentSettings", paymentSettingsSchema);
