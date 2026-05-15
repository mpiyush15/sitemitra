import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type { CityItem } from "@/types/api";

export async function fetchAdminCities(): Promise<CityItem[]> {
  return apiFetch<CityItem[]>(API_ROUTES.admin.cities);
}

export async function createAdminCity(input: {
  cityName: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<CityItem> {
  return apiFetch<CityItem>(API_ROUTES.admin.cities, {
    method: "POST",
    body: input,
  });
}

export async function updateAdminCity(
  id: string,
  input: { cityName?: string; sortOrder?: number; isActive?: boolean },
): Promise<CityItem> {
  return apiFetch<CityItem>(`${API_ROUTES.admin.cities}/${id}`, {
    method: "PATCH",
    body: input,
  });
}
