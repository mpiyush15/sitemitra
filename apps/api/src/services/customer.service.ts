import { ROLES } from "../lib/constants.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors.js";
import { toPublicReview } from "../lib/public-serializers.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { reviewRepository } from "../repositories/review.repository.js";
import { savedBusinessRepository } from "../repositories/saved-business.repository.js";
import type { CreateCustomerReviewInput } from "../validators/review.validator.js";

async function resolveBusiness(slug: string) {
  const profile = await businessProfileRepository.findBySlug(slug);
  if (!profile) throw new NotFoundError("Business not found");
  return profile;
}

export const customerService = {
  async getBusinessEngagement(slug: string, userId: string) {
    const profile = await resolveBusiness(slug);
    const businessId = profile._id.toString();

    const [saved, userReview] = await Promise.all([
      savedBusinessRepository.findByUserAndBusiness(userId, businessId),
      reviewRepository.findByUserAndBusiness(userId, businessId),
    ]);

    return {
      saved: Boolean(saved),
      userReview: userReview ? toPublicReview(userReview) : null,
    };
  },

  async toggleSaved(slug: string, userId: string) {
    const profile = await resolveBusiness(slug);
    const businessId = profile._id.toString();
    const existing = await savedBusinessRepository.findByUserAndBusiness(userId, businessId);

    if (existing) {
      await savedBusinessRepository.remove(userId, businessId);
      return { saved: false };
    }

    await savedBusinessRepository.save(userId, businessId);
    return { saved: true };
  },

  async createReview(
    slug: string,
    userId: string,
    customerName: string,
    role: string,
    input: CreateCustomerReviewInput,
  ) {
    if (role !== ROLES.USER) {
      throw new ForbiddenError("Only registered customer accounts can write reviews");
    }

    const profile = await resolveBusiness(slug);
    const businessId = profile._id.toString();

    const existing = await reviewRepository.findByUserAndBusiness(userId, businessId);
    if (existing) {
      throw new ConflictError("You have already reviewed this business");
    }

    const review = await reviewRepository.create({
      businessId,
      userId,
      customerName,
      rating: input.rating,
      reviewText: input.reviewText ?? "",
      isApproved: true,
    });

    await reviewRepository.syncBusinessRating(businessId);

    return toPublicReview(review);
  },
};
