import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { MEMBERSHIP_PLANS, PAYMENT_STATUS } from "../lib/constants.js";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", index: true },
    paymentId: { type: String, default: "" },
    orderId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },
    membershipPlan: {
      type: String,
      enum: Object.values(MEMBERSHIP_PLANS),
      required: true,
    },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type Payment = InferSchemaType<typeof paymentSchema>;
export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentModel = model("Payment", paymentSchema);
