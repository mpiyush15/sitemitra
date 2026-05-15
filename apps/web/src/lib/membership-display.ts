import { MEMBERSHIP_PLANS } from "@/lib/constants";

/** Public UI: Verified badge only for Standard plan (not Free). Plan names stay off customer pages. */
export function showPublicVerifiedBadge(business: {
  membershipType?: string;
  isPremium?: boolean;
}): boolean {
  return (
    business.membershipType === MEMBERSHIP_PLANS.STANDARD || business.isPremium === true
  );
}
