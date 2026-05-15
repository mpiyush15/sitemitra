const DEV_API_BASE = "http://localhost:4000/api";
const DEV_SITE_URL = "http://localhost:3000";

function trimUrl(value: string | undefined): string {
  return value?.trim().replace(/\/$/, "") ?? "";
}

/** Ensures `…/api` — accepts `http://host:4000` or `http://host:4000/api`. */
export function resolvePublicApiBaseUrl(): string {
  const raw = trimUrl(process.env.NEXT_PUBLIC_API_URL);
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[env] NEXT_PUBLIC_API_URL is required in production (e.g. https://your-api.railway.app/api)",
      );
    }
    return DEV_API_BASE;
  }
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

export function resolvePublicSiteUrl(): string {
  const raw = trimUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[env] NEXT_PUBLIC_SITE_URL is required in production (e.g. https://sitemitra.vercel.app)",
      );
    }
    return DEV_SITE_URL;
  }
  return raw;
}

export function isLocalhostUrl(url: string): boolean {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.startsWith("http://192.168.")
  );
}

function optionalPublicString(
  key: string,
  fallback: string,
): string {
  const value = process.env[key]?.trim();
  return value || fallback;
}

export const publicEnv = {
  apiBaseUrl: resolvePublicApiBaseUrl(),
  siteUrl: resolvePublicSiteUrl(),
  contact: {
    email: optionalPublicString(
      "NEXT_PUBLIC_CONTACT_EMAIL",
      "contact@sitemitra.com",
    ),
    phone: optionalPublicString("NEXT_PUBLIC_CONTACT_PHONE", "+91 99999 99999"),
    whatsapp: optionalPublicString(
      "NEXT_PUBLIC_CONTACT_WHATSAPP",
      "+919999999999",
    ),
  },
  office: optionalPublicString(
    "NEXT_PUBLIC_SITE_OFFICE",
    "Akola, Maharashtra, India",
  ),
  social: {
    instagram: optionalPublicString("NEXT_PUBLIC_SOCIAL_INSTAGRAM", "#"),
    facebook: optionalPublicString("NEXT_PUBLIC_SOCIAL_FACEBOOK", "#"),
    youtube: optionalPublicString("NEXT_PUBLIC_SOCIAL_YOUTUBE", "#"),
  },
} as const;
