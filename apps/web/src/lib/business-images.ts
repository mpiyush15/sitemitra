import type { BusinessCard } from "@/types/api";

/** Unique listing images: thumbnail, logo, then gallery — for featured card hover. */
export function getBusinessListingImages(business: BusinessCard): string[] {
  const seen = new Set<string>();
  const images: string[] = [];

  for (const src of [business.thumbnail, business.logo, ...(business.gallery ?? [])]) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    images.push(src);
  }

  return images;
}

export function getBusinessInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
