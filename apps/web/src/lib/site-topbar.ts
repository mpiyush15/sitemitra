import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";

export type SiteTopbarSettings = {
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  email: string;
  whatsapp: string;
  callPhone: string;
  callCtaLabel: string;
};

export function telUrl(phoneDigits: string) {
  return `tel:+91${phoneDigits.replace(/\D/g, "").slice(-10)}`;
}

export function whatsappUrl(phoneDigits: string) {
  return `https://wa.me/91${phoneDigits.replace(/\D/g, "").slice(-10)}`;
}

export function normalizeSocialUrlInput(url: string): string {
  const trimmed = url.trim();
  return trimmed && trimmed !== "#" ? trimmed : "#";
}

/** Show empty field in admin when stored as placeholder `#`. */
export function socialUrlForForm(url: string): string {
  return url.trim() === "#" ? "" : url;
}

export function isUsableTopbarUrl(url: string) {
  const trimmed = url.trim();
  return Boolean(trimmed && trimmed !== "#");
}

export function isPlaceholderSocialUrl(url: string) {
  const trimmed = url.trim();
  return !trimmed || trimmed === "#";
}

/** Display 10-digit Indian mobile as `98765 43210`. */
export function formatTopbarPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return digits.trim() || "—";
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

export async function fetchSiteTopbar(): Promise<SiteTopbarSettings> {
  return apiFetch<SiteTopbarSettings>(API_ROUTES.siteTopbar);
}

export async function fetchAdminSiteTopbar(): Promise<SiteTopbarSettings> {
  return apiFetch<SiteTopbarSettings>(API_ROUTES.admin.membership.siteTopbar);
}

export async function updateAdminSiteTopbar(
  input: Partial<SiteTopbarSettings>,
): Promise<SiteTopbarSettings> {
  return apiFetch<SiteTopbarSettings>(API_ROUTES.admin.membership.siteTopbar, {
    method: "PATCH",
    body: input,
  });
}
