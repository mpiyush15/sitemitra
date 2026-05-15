import { PaymentSettingsModel } from "../models/payment-settings.model.js";

const SETTINGS_KEY = "default";

export const paymentSettingsRepository = {
  async get() {
    let doc = await PaymentSettingsModel.findOne({ key: SETTINGS_KEY });
    if (!doc) {
      doc = await PaymentSettingsModel.create({ key: SETTINGS_KEY });
    }
    return doc;
  },

  async getWithSecrets() {
    let doc = await PaymentSettingsModel.findOne({ key: SETTINGS_KEY }).select("+keySecret +webhookSecret");
    if (!doc) {
      doc = await PaymentSettingsModel.create({ key: SETTINGS_KEY });
    }
    return doc;
  },

  async update(data: Partial<{
    provider: string;
    enabled: boolean;
    testMode: boolean;
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  }>) {
    return PaymentSettingsModel.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: data },
      { upsert: true, new: true },
    );
  },
};
