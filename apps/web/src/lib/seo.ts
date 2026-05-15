import { SITE_NAME } from "./constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function normalizeBase(url: string) {
  return url.replace(/\/$/, "");
}

function joinPath(base: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBase(base)}${normalized}`;
}

export function getSiteUrl(path = "") {
  return joinPath(siteUrl, path);
}

/** Share links: production uses NEXT_PUBLIC_SITE_URL; dev uses current browser origin. */
export function getBusinessProfileShareUrl(slug: string, browserOrigin?: string) {
  const segment = encodeURIComponent(slug);
  const path = `/business/${segment}`;
  const configured = normalizeBase(siteUrl);
  const isLocalConfigured =
    configured.includes("localhost") ||
    configured.includes("127.0.0.1") ||
    configured.startsWith("http://192.168.");

  if (browserOrigin && (isLocalConfigured || !process.env.NEXT_PUBLIC_SITE_URL)) {
    return joinPath(browserOrigin, path);
  }

  return joinPath(configured, path);
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
