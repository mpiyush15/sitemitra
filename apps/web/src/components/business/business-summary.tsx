import { VerifiedBadge } from "@/components/ui/verified-badge";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import type { BusinessCard } from "@/types/api";

type BusinessSummaryProps = {
  business: BusinessCard;
};

export function BusinessSummary({ business }: BusinessSummaryProps) {
  const showVerified = showPublicVerifiedBadge(business);

  return (
    <div className="space-y-2 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold">{business.businessName}</p>
        {showVerified ? <VerifiedBadge /> : null}
      </div>
      <p className="text-sm text-muted-foreground">
        {business.category} · {business.city}
      </p>
      {business.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{business.description}</p>
      )}
    </div>
  );
}
