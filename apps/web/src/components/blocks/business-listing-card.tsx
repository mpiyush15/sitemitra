import Link from "next/link";
import {
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineStar,
} from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { cn } from "@/lib/cn";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import type { BusinessCard } from "@/types/api";

type BusinessListingCardProps = {
  business: BusinessCard;
  className?: string;
  /** Only true on homepage featured section — nowhere else. */
  showFeaturedBadge?: boolean;
  /** Featured section is Standard-only; skip Verified there. Default: show on normal listings. */
  showVerifiedBadge?: boolean;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BusinessListingCard({
  business,
  className,
  showFeaturedBadge = false,
  showVerifiedBadge = true,
}: BusinessListingCardProps) {
  const isStandard = business.membershipType === "standard";
  const showVerified = showVerifiedBadge && showPublicVerifiedBadge(business);
  const listingImage = business.thumbnail || business.logo;
  const hasListingImage = Boolean(listingImage);
  const initials = getInitials(business.businessName);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/business/${business.slug}`} className="relative block aspect-square overflow-hidden bg-primary">
        {hasListingImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listingImage}
            alt={business.businessName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-slate-800">
            <span className="text-4xl font-bold tracking-tight text-white/90">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {showFeaturedBadge && business.isFeatured ? (
            <Badge variant="accent" className="border-0 bg-accent text-white shadow-sm">
              Featured
            </Badge>
          ) : null}
          {showVerified ? <VerifiedBadge onImage /> : null}
        </div>
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
          {business.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <Link
            href={`/business/${business.slug}`}
            className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
          >
            {business.businessName}
          </Link>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <HiOutlineMapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {business.city}
          </p>
        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {business.description || "Trusted construction professional on Site Mitra."}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          {isStandard && business.totalReviews > 0 ? (
            <p className="flex items-center gap-1 text-sm font-medium text-foreground">
              <HiOutlineStar className="h-4 w-4 text-amber-500" aria-hidden />
              {business.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">({business.totalReviews})</span>
            </p>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              View profile
            </span>
          )}
          <Link
            href={`/business/${business.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
          >
            Details
            <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
