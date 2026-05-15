import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type { SocialReelItem, SocialReelPlatform } from "@/types/api";

export async function fetchAdminSocialReels(): Promise<SocialReelItem[]> {
  return apiFetch<SocialReelItem[]>(API_ROUTES.admin.socialReels);
}

export async function createAdminSocialReel(input: {
  title?: string;
  platform: SocialReelPlatform;
  sourceUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<SocialReelItem> {
  return apiFetch<SocialReelItem>(API_ROUTES.admin.socialReels, {
    method: "POST",
    body: input,
  });
}

export async function updateAdminSocialReel(
  id: string,
  input: Partial<{
    title: string;
    platform: SocialReelPlatform;
    sourceUrl: string;
    sortOrder: number;
    isActive: boolean;
  }>,
): Promise<SocialReelItem> {
  return apiFetch<SocialReelItem>(`${API_ROUTES.admin.socialReels}/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminSocialReel(id: string) {
  return apiFetch<{ id: string }>(`${API_ROUTES.admin.socialReels}/${id}`, {
    method: "DELETE",
  });
}
