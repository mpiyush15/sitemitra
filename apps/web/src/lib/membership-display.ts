import { MEMBERSHIP_PLANS } from "@/lib/constants";

/** Public UI: Verified badge only for Standard plan (not Free). Plan names stay off customer pages. */
export function isPremiumBusiness(business: {
  membershipType?: string;
  isPremium?: boolean;
}): boolean {
  return (
    business.membershipType === MEMBERSHIP_PLANS.STANDARD || business.isPremium === true
  );
}

/** Public UI: Verified badge only for Standard plan (not Free). */
export function showPublicVerifiedBadge(business: {
  membershipType?: string;
  isPremium?: boolean;
}): boolean {
  return isPremiumBusiness(business);
}

/** Public UI: WhatsApp button only for Standard / paid listings. */
export function showPublicBusinessWhatsApp(business: {
  membershipType?: string;
  isPremium?: boolean;
}): boolean {
  return isPremiumBusiness(business);
}
