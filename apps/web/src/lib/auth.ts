import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/session";
import type { AuthSession, ProfileResponse } from "@/types/api";
import type { MembershipPlan, Role } from "@/lib/constants";

const PROFILE_CACHE_MS = 60_000;

let profileCache: { data: ProfileResponse; at: number } | null = null;
let profileInflight: Promise<ProfileResponse> | null = null;

export function clearProfileCache() {
  profileCache = null;
  profileInflight = null;
}

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city?: string;
  role?: Role;
  businessName?: string;
  category?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function registerUser(input: RegisterInput) {
  return apiFetch<AuthSession>(API_ROUTES.auth.register, {
    method: "POST",
    body: input,
  }).then((session) => {
    setStoredToken(session.token);
    clearProfileCache();
    return session;
  });
}

export function loginUser(input: LoginInput) {
  return apiFetch<AuthSession>(API_ROUTES.auth.login, {
    method: "POST",
    body: input,
  }).then((session) => {
    setStoredToken(session.token);
    clearProfileCache();
    return session;
  });
}

export function getProfile(options?: { force?: boolean }) {
  if (!getStoredToken()) {
    return Promise.reject(new Error("Not authenticated"));
  }

  const force = options?.force ?? false;
  const now = Date.now();

  if (!force && profileCache && now - profileCache.at < PROFILE_CACHE_MS) {
    return Promise.resolve(profileCache.data);
  }

  if (!force && profileInflight) {
    return profileInflight;
  }

  profileInflight = apiFetch<ProfileResponse>(API_ROUTES.auth.profile)
    .then((data) => {
      profileCache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      profileInflight = null;
    });

  return profileInflight;
}

export async function logoutUser() {
  try {
    await apiFetch<{ loggedOut: boolean }>(API_ROUTES.auth.logout, {
      method: "POST",
    });
  } catch {
    // Clear local session even if API is unreachable
  } finally {
    clearStoredToken();
    clearProfileCache();
  }
}

export function isStandardPlan(plan: MembershipPlan | string) {
  return plan === "standard";
}
