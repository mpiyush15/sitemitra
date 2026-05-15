import { CityModel } from "../models/city.model.js";

export const cityRepository = {
  findActive() {
    return CityModel.find({ isActive: true }).sort({ sortOrder: 1, cityName: 1 });
  },

  findAll() {
    return CityModel.find().sort({ sortOrder: 1, cityName: 1 });
  },

  findById(id: string) {
    return CityModel.findById(id);
  },

  create(data: { cityName: string; slug: string; sortOrder?: number; isActive?: boolean }) {
    return CityModel.create(data);
  },

  updateById(
    id: string,
    data: Partial<{ cityName: string; slug: string; sortOrder: number; isActive: boolean }>,
  ) {
    return CityModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  },
};
