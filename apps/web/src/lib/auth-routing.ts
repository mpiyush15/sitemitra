import { ROLES } from "@/lib/constants";

const PLATFORM_ROLES = new Set<string>([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

export function isPlatformAdmin(role: string) {
  return PLATFORM_ROLES.has(role);
}

export function getPostAuthPath(role: string) {
  if (isPlatformAdmin(role)) return "/admin";
  return "/dashboard";
}
