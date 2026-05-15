import { CategoryModel } from "../models/category.model.js";

export const categoryRepository = {
  findActive() {
    return CategoryModel.find({ isActive: true }).sort({ sortOrder: 1, categoryName: 1 });
  },

  findAll() {
    return CategoryModel.find().sort({ sortOrder: 1, categoryName: 1 });
  },

  findBySlug(slug: string) {
    return CategoryModel.findOne({ slug: slug.toLowerCase(), isActive: true });
  },
};
