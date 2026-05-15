import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";

export type BusinessAnalytics = {
  profileVisitors: number;
  enquiriesTotal: number;
  enquiriesNew: number;
};

export type PlatformAnalytics = {
  profileVisitors: number;
  uniqueVisitors: number;
  enquiriesTotal: number;
};

const VISITOR_SESSION_KEY = "site-mitra:visitor-session";

export function getOrCreateVisitorSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem(VISITOR_SESSION_KEY);
  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(VISITOR_SESSION_KEY, sessionId);
  }

  return sessionId;
}

export async function recordProfileView(slug: string, sessionId: string) {
  return apiFetch<{ recorded: boolean }>(`${API_ROUTES.businesses}/${slug}/views`, {
    method: "POST",
    body: { sessionId },
  });
}

export async function fetchBusinessAnalytics(): Promise<BusinessAnalytics> {
  return apiFetch<BusinessAnalytics>(API_ROUTES.dashboard.analytics);
}

export async function fetchPlatformAnalytics(): Promise<PlatformAnalytics> {
  return apiFetch<PlatformAnalytics>(API_ROUTES.admin.analytics);
}
