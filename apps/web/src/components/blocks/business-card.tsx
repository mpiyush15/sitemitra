import { BusinessListingCard } from "@/components/blocks/business-listing-card";
import type { BusinessCard } from "@/types/api";

type BusinessCardItemProps = {
  business: BusinessCard;
};

/** @deprecated Prefer `BusinessListingCard` directly. */
export function BusinessCardItem({ business }: BusinessCardItemProps) {
  return <BusinessListingCard business={business} />;
}

export { BusinessListingCard };
