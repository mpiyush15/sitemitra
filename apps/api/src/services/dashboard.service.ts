import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import { getProfileCompletion } from "../lib/profile-completion.js";
import { slugify, uniqueSlug } from "../lib/slug.js";
import { toSafeBusinessProfile } from "../lib/serializers.js";
import { BusinessProfileModel } from "../models/business-profile.model.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { deleteRemovedGalleryUrls } from "./dashboard-media.service.js";
import type {
  UpdateBusinessProfileInput,
} from "../validators/business-profile.validator.js";

async function ensureUniqueSlug(slug: string, userId: string) {
  const base = slugify(slug);
  let candidate = base;
  let attempt = 0;

  while (true) {
    const existing = await BusinessProfileModel.findOne({ slug: candidate });
    if (!existing || existing.userId.toString() === userId) {
      return candidate;
    }
    attempt += 1;
    candidate = uniqueSlug(base, String(attempt));
  }
}

export const dashboardService = {
  async getBusinessProfile(userId: string) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const completion = getProfileCompletion(profile);
    return {
      businessProfile: toSafeBusinessProfile(profile),
      profileCompletion: completion,
    };
  },

  async updateBusinessProfile(userId: string, input: UpdateBusinessProfileInput) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const update: Parameters<typeof businessProfileRepository.updateByUserId>[1] = {
      ...input,
    };

    // Media URLs are set only via multipart upload routes — never clear with empty PATCH values.
    for (const field of ["logo", "thumbnail", "profileBanner"] as const) {
      if (field in update && !update[field]) {
        delete update[field];
      }
    }

    if (input.gallery !== undefined) {
      await deleteRemovedGalleryUrls(profile.gallery ?? [], input.gallery);
    }

    if (input.slug) {
      update.slug = await ensureUniqueSlug(input.slug, userId);
    }

    const updated = await businessProfileRepository.updateByUserId(userId, update);
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    return {
      businessProfile: toSafeBusinessProfile(updated),
      profileCompletion: getProfileCompletion(updated),
    };
  },

  async setPublished(userId: string, publish: boolean) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const completion = getProfileCompletion(profile);
    if (publish && !completion.isComplete) {
      throw new ForbiddenError(
        `Complete your profile before publishing. Missing: ${completion.missing.join(", ")}`,
      );
    }

    const updated = await businessProfileRepository.updateByUserId(userId, {
      isPublished: publish,
    });
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    return {
      businessProfile: toSafeBusinessProfile(updated),
      profileCompletion: getProfileCompletion(updated),
    };
  },
};
