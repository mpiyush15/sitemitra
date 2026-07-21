"use client";

import { useState, useEffect } from "react";
import { fetchCities } from "@/lib/public";
import { LAUNCH_CITIES } from "@/lib/constants";
import type { CityItem } from "@/types/api";

// Global cache to prevent redundant API calls across multiple components
let cachedCities: CityItem[] | null = null;
let fetchPromise: Promise<CityItem[]> | null = null;

function getFallbackCities(): CityItem[] {
  return LAUNCH_CITIES.map((cityName, index) => ({
    id: `fallback-${cityName.toLowerCase()}`,
    cityName,
    slug: cityName.toLowerCase(),
    sortOrder: index + 1,
    isActive: true,
  }));
}

export function useCities() {
  const [cities, setCities] = useState<CityItem[]>(cachedCities || []);
  const [cityNames, setCityNames] = useState<string[]>(
    cachedCities ? cachedCities.map((c) => c.cityName) : [...LAUNCH_CITIES],
  );
  const [loading, setLoading] = useState(!cachedCities);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cachedCities) {
      setCities(cachedCities);
      setCityNames(cachedCities.map((c) => c.cityName));
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetchCities()
        .then((data) => {
          const activeCities = data.filter((c) => c.isActive);
          // Only fallback if the database truly has 0 active cities
          cachedCities = activeCities.length > 0 ? activeCities : getFallbackCities();
          return cachedCities;
        })
        .catch((err) => {
          console.error("Failed to fetch cities:", err);
          cachedCities = getFallbackCities();
          return cachedCities;
        });
    }

    fetchPromise.then((loadedCities) => {
      setCities(loadedCities);
      setCityNames(loadedCities.map((c) => c.cityName));
      setLoading(false);
    });
  }, []);

  return { cities, cityNames, loading, error };
}
