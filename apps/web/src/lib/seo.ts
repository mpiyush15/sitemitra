import { SITE_NAME } from "./constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function getSiteUrl(path = "") {
  return `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageTitle(...parts: string[]) {
  const filtered = parts.filter(Boolean);
  if (filtered.length === 0) return SITE_NAME;
  return `${filtered.join(" | ")} | ${SITE_NAME}`;
}

export function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function slugToLabel(slug: string) {
  return titleCase(slug.replace(/-/g, " "));
}
