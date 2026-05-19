import { SiteTopbarSettingsModel } from "../models/site-topbar-settings.model.js";

const SETTINGS_KEY = "default";

const DEFAULTS = {
  key: SETTINGS_KEY,
  instagramUrl: "#",
  facebookUrl: "#",
  youtubeUrl: "#",
  email: "contact@sitemitra.com",
  whatsapp: "9999999999",
  callPhone: "9999999999",
  callCtaLabel: "Call us",
};

export const siteTopbarSettingsRepository = {
  async get() {
    let doc = await SiteTopbarSettingsModel.findOne({ key: SETTINGS_KEY });
    if (!doc) {
      doc = await SiteTopbarSettingsModel.create(DEFAULTS);
    }
    return doc;
  },

  async update(data: Partial<{
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    email: string;
    whatsapp: string;
    callPhone: string;
    callCtaLabel: string;
  }>) {
    return SiteTopbarSettingsModel.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },
};
