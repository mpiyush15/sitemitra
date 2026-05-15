import { NotFoundError } from "../lib/errors.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";
import { inquiryRepository } from "../repositories/inquiry.repository.js";
import type { CreateInquiryInput, UpdateInquiryStatusInput } from "../validators/inquiry.validator.js";

function toInquiryItem(inquiry: {
  _id: { toString(): string };
  customerName: string;
  phone: string;
  city?: string;
  requirement: string;
  inquiryStatus: string;
  createdAt: Date;
}) {
  return {
    id: inquiry._id.toString(),
    customerName: inquiry.customerName,
    phone: inquiry.phone,
    city: inquiry.city ?? "",
    requirement: inquiry.requirement,
    status: inquiry.inquiryStatus,
    createdAt: inquiry.createdAt,
  };
}

export const inquiryService = {
  async createForSlug(slug: string, input: CreateInquiryInput) {
    const business = await businessProfileRepository.findBySlug(slug);
    if (!business) {
      throw new NotFoundError("Business not found");
    }

    const inquiry = await inquiryRepository.create({
      businessId: business._id.toString(),
      customerName: input.customerName,
      phone: input.phone,
      city: input.city ?? "",
      requirement: input.requirement,
    });

    return {
      id: inquiry._id.toString(),
      message: "Enquiry sent successfully",
    };
  },

  async listForBusinessUser(userId: string) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const inquiries = await inquiryRepository.findByBusinessId(profile._id.toString());
    return inquiries.map(toInquiryItem);
  },

  async updateStatusForBusinessUser(
    userId: string,
    inquiryId: string,
    input: UpdateInquiryStatusInput,
  ) {
    const profile = await businessProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Business profile not found");
    }

    const updated = await inquiryRepository.updateStatusForBusiness(
      inquiryId,
      profile._id.toString(),
      input.inquiryStatus,
    );

    if (!updated) {
      throw new NotFoundError("Inquiry not found");
    }

    return toInquiryItem(updated);
  },
};
