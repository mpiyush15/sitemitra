import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type { PublicReview } from "@/types/api";

export type BusinessEngagement = {
  saved: boolean;
  userReview: PublicReview | null;
};

export function fetchBusinessEngagement(slug: string) {
  return apiFetch<BusinessEngagement>(API_ROUTES.customer.engagement(slug));
}

export function toggleSavedBusiness(slug: string) {
  return apiFetch<{ saved: boolean }>(API_ROUTES.customer.saved(slug), { method: "POST" });
}

export function submitBusinessReview(slug: string, input: { rating: number; reviewText?: string }) {
  return apiFetch<PublicReview>(API_ROUTES.customer.review(slug), {
    method: "POST",
    body: input,
  });
}
