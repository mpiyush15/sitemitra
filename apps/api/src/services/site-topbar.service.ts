import { siteTopbarSettingsRepository } from "../repositories/site-topbar-settings.repository.js";
import type { z } from "zod";
import type { updateSiteTopbarSchema } from "../validators/site-topbar.validator.js";

const SOCIAL_URL_KEYS = ["instagramUrl", "facebookUrl", "youtubeUrl"] as const;

function normalizeSocialUrl(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed || trimmed === "#") return "#";
  return trimmed;
}

function serialize(doc: {
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  email?: string;
  whatsapp?: string;
  callPhone?: string;
  callCtaLabel?: string;
}) {
  return {
    instagramUrl: normalizeSocialUrl(doc.instagramUrl),
    facebookUrl: normalizeSocialUrl(doc.facebookUrl),
    youtubeUrl: normalizeSocialUrl(doc.youtubeUrl),
    email: doc.email ?? "",
    whatsapp: doc.whatsapp ?? "",
    callPhone: doc.callPhone ?? "",
    callCtaLabel: doc.callCtaLabel?.trim() || "Call us",
  };
}

export const siteTopbarService = {
  async getPublic() {
    const doc = await siteTopbarSettingsRepository.get();
    return serialize(doc);
  },

  async getAdmin() {
    return this.getPublic();
  },

  async update(input: z.infer<typeof updateSiteTopbarSchema>) {
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(input)) {
      if (value === undefined) continue;
      let next = typeof value === "string" ? value : String(value);
      if (SOCIAL_URL_KEYS.includes(key as (typeof SOCIAL_URL_KEYS)[number])) {
        next = normalizeSocialUrl(next);
      }
      patch[key] = next;
    }
    const doc = await siteTopbarSettingsRepository.update(patch);
    return serialize(doc);
  },
};
