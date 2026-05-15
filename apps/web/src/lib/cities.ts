import { fetchCities } from "@/lib/public";
import { LAUNCH_CITIES } from "@/lib/constants";
import type { CityItem } from "@/types/api";

function fallbackCities(): CityItem[] {
  return LAUNCH_CITIES.map((cityName, index) => ({
    id: `fallback-${cityName.toLowerCase()}`,
    cityName,
    slug: cityName.toLowerCase(),
    sortOrder: index + 1,
    isActive: true,
  }));
}

export async function resolveCities(): Promise<CityItem[]> {
  const apiCities = await fetchCities();
  if (apiCities.length === 0) return fallbackCities();
  return apiCities.filter((city) => city.isActive);
}
