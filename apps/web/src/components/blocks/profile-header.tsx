import { ContactActions } from "@/components/blocks/contact-actions";
import { RatingStars } from "@/components/ui/rating-stars";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import { AppImage } from "@/components/ui/app-image";
import type { BusinessDetail } from "@/types/api";

type ProfileHeaderProps = {
  business: Pick<
    BusinessDetail,
    | "businessName"
    | "category"
    | "city"
    | "state"
    | "logo"
    | "membershipType"
    | "verificationBadge"
    | "isFeatured"
    | "rating"
    | "totalReviews"
    | "whatsappNumber"
    | "phoneNumber"
  >;
};

export function ProfileHeader({ business }: ProfileHeaderProps) {
  const showVerified = showPublicVerifiedBadge(business);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start">
      <AppImage
        src={business.logo}
        alt={business.businessName}
        width={96}
        height={96}
        className="h-24 w-24 shrink-0 rounded-xl object-cover"
      />
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{business.businessName}</h1>
          {showVerified ? <VerifiedBadge /> : null}
        </div>
        <p className="text-muted-foreground">
          {business.category} · {business.city}, {business.state}
        </p>
        <div className="flex items-center gap-2">
          <RatingStars value={business.rating} />
          {business.totalReviews > 0 && (
            <span className="text-sm text-muted-foreground">
              ({business.totalReviews} reviews)
            </span>
          )}
        </div>
        <ContactActions
          whatsappNumber={business.whatsappNumber}
          phoneNumber={business.phoneNumber}
          business={{
            businessName: business.businessName,
            category: business.category,
            city: business.city,
          }}
          inquiryContext={{}}
        />
      </div>
    </div>
  );
}
