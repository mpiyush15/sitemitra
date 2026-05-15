import { ConflictError, NotFoundError } from "../lib/errors.js";
import { cityRepository } from "../repositories/city.repository.js";

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function serializeCity(city: { _id: { toString(): string }; cityName: string; slug: string; sortOrder?: number; isActive?: boolean }) {
  return {
    id: city._id.toString(),
    cityName: city.cityName,
    slug: city.slug,
    sortOrder: city.sortOrder ?? 0,
    isActive: city.isActive ?? true,
  };
}

export const cityService = {
  async listActive() {
    const cities = await cityRepository.findActive();
    return cities.map(serializeCity);
  },

  async listAll() {
    const cities = await cityRepository.findAll();
    return cities.map(serializeCity);
  },

  async create(input: { cityName: string; sortOrder?: number; isActive?: boolean }) {
    const slug = toSlug(input.cityName);
    const existing = await cityRepository.findAll();
    if (existing.some((c) => c.slug === slug)) {
      throw new ConflictError("A city with this name already exists");
    }

    const city = await cityRepository.create({
      cityName: input.cityName.trim(),
      slug,
      sortOrder: input.sortOrder ?? existing.length + 1,
      isActive: input.isActive ?? true,
    });

    return serializeCity(city);
  },

  async update(id: string, input: { cityName?: string; sortOrder?: number; isActive?: boolean }) {
    const city = await cityRepository.findById(id);
    if (!city) throw new NotFoundError("City not found");

    const data: { cityName?: string; slug?: string; sortOrder?: number; isActive?: boolean } = {};
    if (input.cityName !== undefined) {
      data.cityName = input.cityName.trim();
      data.slug = toSlug(input.cityName);
    }
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    const updated = await cityRepository.updateById(id, data);
    if (!updated) throw new NotFoundError("City not found");
    return serializeCity(updated);
  },
};
