import { AppError, NotFoundError } from "../lib/errors.js";
import { getProfileCompletion } from "../lib/profile-completion.js";
import { toSafeBusinessProfile } from "../lib/serializers.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import {
  compressImageToBannerWebp,
  compressImageToSquareWebp,
  compressImageToWebp,
  deleteObjectByPublicUrl,
  uploadBusinessGalleryImageWebp,
  uploadBusinessLogoWebp,
  uploadBusinessProfileBannerWebp,
  uploadBusinessThumbnailWebp,
} from "./storage.service.js";

const MAX_GALLERY_IMAGES = 10;

async function requireProfile(userId: string) {
  const profile = await businessProfileRepository.findByUserId(userId);
  if (!profile) {
    throw new NotFoundError("Business profile not found");
  }
  return profile;
}

function profileResponse(profile: NonNullable<Awaited<ReturnType<typeof requireProfile>>>) {
  return {
    businessProfile: toSafeBusinessProfile(profile),
    profileCompletion: getProfileCompletion(profile),
  };
}

type UploadedImage = { buffer: Buffer; mimetype: string };

export const dashboardMediaService = {
  async uploadLogo(userId: string, file: UploadedImage) {
    const profile = await requireProfile(userId);
    const webp = await compressImageToSquareWebp(file.buffer, file.mimetype);
    const logo = await uploadBusinessLogoWebp(profile._id.toString(), webp);
    const oldLogo = profile.logo ?? "";

    const updated = await businessProfileRepository.updateByUserId(userId, { logo });
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    if (oldLogo) {
      await deleteObjectByPublicUrl(oldLogo);
    }

    return profileResponse(updated);
  },

  async uploadThumbnail(userId: string, file: UploadedImage) {
    const profile = await requireProfile(userId);
    const webp = await compressImageToSquareWebp(file.buffer, file.mimetype);
    const thumbnail = await uploadBusinessThumbnailWebp(profile._id.toString(), webp);
    const oldThumbnail = profile.thumbnail ?? "";

    const updated = await businessProfileRepository.updateByUserId(userId, { thumbnail });
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    if (oldThumbnail) {
      await deleteObjectByPublicUrl(oldThumbnail);
    }

    return profileResponse(updated);
  },

  async uploadProfileBanner(userId: string, file: UploadedImage) {
    const profile = await requireProfile(userId);
    const webp = await compressImageToBannerWebp(file.buffer, file.mimetype);
    const profileBanner = await uploadBusinessProfileBannerWebp(profile._id.toString(), webp);
    const oldBanner = profile.profileBanner ?? "";

    const updated = await businessProfileRepository.updateByUserId(userId, { profileBanner });
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    if (oldBanner) {
      await deleteObjectByPublicUrl(oldBanner);
    }

    return profileResponse(updated);
  },

  async uploadGalleryImages(userId: string, files: UploadedImage[]) {
    if (!files.length) {
      throw new AppError(400, "IMAGE_REQUIRED", "At least one image file is required");
    }

    const profile = await requireProfile(userId);
    const current = profile.gallery ?? [];
    const room = MAX_GALLERY_IMAGES - current.length;

    if (room <= 0) {
      throw new AppError(
        400,
        "GALLERY_FULL",
        `Gallery already has the maximum of ${MAX_GALLERY_IMAGES} images`,
      );
    }

    const profileId = profile._id.toString();
    const newUrls: string[] = [];

    for (const file of files.slice(0, room)) {
      const webp = await compressImageToWebp(file.buffer, file.mimetype);
      newUrls.push(await uploadBusinessGalleryImageWebp(profileId, webp));
    }

    const gallery = [...current, ...newUrls];
    const updated = await businessProfileRepository.updateByUserId(userId, { gallery });
    if (!updated) {
      throw new NotFoundError("Business profile not found");
    }

    return profileResponse(updated);
  },
};

export async function deleteRemovedGalleryUrls(
  previous: string[],
  next: string[],
): Promise<void> {
  const nextSet = new Set(next);
  for (const url of previous) {
    if (!nextSet.has(url)) {
      await deleteObjectByPublicUrl(url);
    }
  }
}
