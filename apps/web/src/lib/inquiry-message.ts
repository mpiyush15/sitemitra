import { slugToLabel } from "@/lib/seo";

export type SearchInquiryContext = {
  q?: string;
  category?: string;
  city?: string;
};

export type BusinessInquiryDetails = {
  businessName: string;
  slug?: string;
  category?: string;
  city?: string;
  profileUrl?: string;
};

export const SEARCH_INQUIRY_STORAGE_KEY = "site-mitra:search-inquiry";

export function persistSearchInquiry(context: SearchInquiryContext) {
  if (typeof window === "undefined") return;

  const payload: SearchInquiryContext = {};
  const q = context.q?.trim();
  const category = context.category?.trim();
  const city = context.city?.trim();

  if (q) payload.q = q;
  if (category) payload.category = category;
  if (city) payload.city = city;

  if (Object.keys(payload).length === 0) {
    sessionStorage.removeItem(SEARCH_INQUIRY_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(SEARCH_INQUIRY_STORAGE_KEY, JSON.stringify(payload));
}

export function readSearchInquiry(): SearchInquiryContext {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(SEARCH_INQUIRY_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SearchInquiryContext;
  } catch {
    return {};
  }
}

export function buildWhatsAppInquiryMessage(
  business: BusinessInquiryDetails,
  search: SearchInquiryContext = {},
) {
  const businessName = business.businessName.trim() || "your business";
  const lines = [`Hi, I found *${businessName}* on Site Mitra.`, ""];

  const businessDetails: string[] = [];
  if (business.category) businessDetails.push(`Category: ${business.category}`);
  if (business.city) businessDetails.push(`City: ${business.city}`);
  if (business.profileUrl) businessDetails.push(`Profile: ${business.profileUrl}`);

  if (businessDetails.length > 0) {
    lines.push("Business details:", ...businessDetails.map((line) => `• ${line}`), "");
  }

  const searchDetails: string[] = [];
  if (search.q) searchDetails.push(`Search: ${search.q}`);
  if (search.category) searchDetails.push(`Category: ${slugToLabel(search.category)}`);
  if (search.city) searchDetails.push(`City: ${search.city}`);

  if (searchDetails.length > 0) {
    lines.push("I was looking for:", ...searchDetails.map((line) => `• ${line}`), "");
  }

  lines.push("I'd like to inquire about your services. Please share availability and quote.");
  return lines.join("\n");
}
