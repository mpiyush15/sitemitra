import { CatalogueModel } from "../models/catalogue.model.js";

export const catalogueRepository = {
  findByBusinessId(businessId: string) {
    return CatalogueModel.find({ businessId }).sort({ uploadedAt: -1 });
  },
};
