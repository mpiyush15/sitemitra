import { NotFoundError } from "../lib/errors.js";
import { socialReelRepository } from "../repositories/social-reel.repository.js";
import type { SocialReelDocument, SocialReelPlatform } from "../models/social-reel.model.js";

function serializeReel(reel: SocialReelDocument) {
  return {
    id: reel._id.toString(),
    title: reel.title ?? "",
    platform: reel.platform,
    sourceUrl: reel.sourceUrl,
    sortOrder: reel.sortOrder ?? 0,
    isActive: reel.isActive ?? true,
    createdAt: reel.createdAt.toISOString(),
    updatedAt: reel.updatedAt.toISOString(),
  };
}

export const socialReelService = {
  async listActive() {
    const reels = await socialReelRepository.findActive();
    return reels.map(serializeReel);
  },

  async listAll() {
    const reels = await socialReelRepository.findAll();
    return reels.map(serializeReel);
  },

  async create(input: {
    title?: string;
    platform: SocialReelPlatform;
    sourceUrl: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const existing = await socialReelRepository.findAll();
    const reel = await socialReelRepository.create({
      title: input.title?.trim() ?? "",
      platform: input.platform,
      sourceUrl: input.sourceUrl.trim(),
      sortOrder: input.sortOrder ?? existing.length + 1,
      isActive: input.isActive ?? true,
    });
    return serializeReel(reel);
  },

  async update(
    id: string,
    input: Partial<{
      title: string;
      platform: SocialReelPlatform;
      sourceUrl: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    const reel = await socialReelRepository.findById(id);
    if (!reel) throw new NotFoundError("Reel not found");

    const data: Partial<{
      title: string;
      platform: SocialReelPlatform;
      sourceUrl: string;
      sortOrder: number;
      isActive: boolean;
    }> = {};

    if (input.title !== undefined) data.title = input.title.trim();
    if (input.platform !== undefined) data.platform = input.platform;
    if (input.sourceUrl !== undefined) data.sourceUrl = input.sourceUrl.trim();
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    const updated = await socialReelRepository.updateById(id, data);
    if (!updated) throw new NotFoundError("Reel not found");
    return serializeReel(updated);
  },

  async remove(id: string) {
    const deleted = await socialReelRepository.deleteById(id);
    if (!deleted) throw new NotFoundError("Reel not found");
    return { id };
  },
};
