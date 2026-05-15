import { BusinessProfilePage } from "@/components/business/business-profile-page";
import type { BusinessDetail } from "@/types/api";

type BusinessProfileViewProps = {
  business: BusinessDetail;
};

export function BusinessProfileView({ business }: BusinessProfileViewProps) {
  return <BusinessProfilePage business={business} />;
}
