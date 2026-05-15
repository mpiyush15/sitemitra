import type { ApiError, ApiSuccess } from "@/types/api";
import { getApiBaseUrl } from "@/lib/api";

export type PublicHeroBanner = {
  id: string;
  title: string;
  imageUrl: string;
  redirectUrl: string;
  showOverlay: boolean;
};

export async function fetchPublicHeroBanners(): Promise<PublicHeroBanner[]> {
  const res = await fetch(`${getApiBaseUrl()}/banners`, {
    credentials: "omit",
    cache: "no-store",
  });
  const payload = (await res.json()) as ApiSuccess<PublicHeroBanner[]> | ApiError;
  if (!res.ok || !payload.success) {
    const msg = payload.success ? res.statusText : payload.error.message;
    throw new Error(msg || "Failed to load banners");
  }
  return payload.data;
}
