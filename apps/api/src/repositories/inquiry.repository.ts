import { INQUIRY_STATUS } from "../lib/constants.js";
import { InquiryModel, type InquiryDocument } from "../models/inquiry.model.js";
import type { InquiryStatus } from "../lib/constants.js";

export const inquiryRepository = {
  async create(data: {
    businessId: string;
    customerName: string;
    phone: string;
    city?: string;
    requirement: string;
  }) {
    return InquiryModel.create(data);
  },

  async findByBusinessId(businessId: string, limit = 100) {
    return InquiryModel.find({ businessId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<InquiryDocument[]>();
  },

  async countByBusinessId(businessId: string) {
    return InquiryModel.countDocuments({ businessId });
  },

  async countNewByBusinessId(businessId: string) {
    return InquiryModel.countDocuments({ businessId, inquiryStatus: INQUIRY_STATUS.NEW });
  },

  async countAll() {
    return InquiryModel.countDocuments();
  },

  async updateStatusForBusiness(
    inquiryId: string,
    businessId: string,
    inquiryStatus: InquiryStatus,
  ) {
    return InquiryModel.findOneAndUpdate(
      { _id: inquiryId, businessId },
      { inquiryStatus },
      { new: true },
    ).lean<InquiryDocument | null>();
  },
};
