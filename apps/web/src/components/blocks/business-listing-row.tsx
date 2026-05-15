import Link from "next/link";
import {
  HiChatBubbleLeftRight,
  HiCheckBadge,
  HiMapPin,
  HiOutlinePhone,
  HiStar,
} from "react-icons/hi2";
import type { ListingsSearchFilters } from "@/lib/listings-search";
import { buildBusinessProfileUrl } from "@/lib/listings-search";
import { telUrl } from "@/lib/public";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import type { BusinessCard } from "@/types/api";

type BusinessListingRowProps = {
  business: BusinessCard;
  searchFilters?: Pick<ListingsSearchFilters, "q" | "category" | "city">;
  className?: string;
  /** Only on featured listings view / homepage featured section. */
  showFeaturedBadge?: boolean;
  showVerifiedBadge?: boolean;
};

type PreviewImage = {
  src: string;
  overlay?: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRatingCount(count: number) {
  if (count >= 1000) {
    const compact = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${compact}k Ratings`;
  }
  return `${count} ${count === 1 ? "Rating" : "Ratings"}`;
}

function getPreviewImages(business: BusinessCard): PreviewImage[] {
  const unique = new Set<string>();
  const images: string[] = [];

  for (const src of [business.thumbnail, business.logo, ...(business.gallery ?? [])]) {
    if (!src || unique.has(src)) continue;
    unique.add(src);
    images.push(src);
  }

  if (images.length === 0) return [];

  const previews: PreviewImage[] = images.slice(0, 3).map((src) => ({ src }));
  const extraCount = images.length - 3;

  if (extraCount > 0 && previews[2]) {
    previews[2] = { ...previews[2], overlay: `+${extraCount}` };
  } else if (previews.length === 3 && (business.gallery?.length ?? 0) > 0) {
    previews[2] = { ...previews[2], overlay: "Gallery" };
  }

  return previews;
}

function getLocationLine(business: BusinessCard) {
  if (business.city && business.state) {
    return `${business.city}, ${business.state}`;
  }
  return business.city || business.state || business.category;
}

function PrimaryImage({ business, profileHref }: { business: BusinessCard; profileHref: string }) {
  const previews = getPreviewImages(business);
  const initials = getInitials(business.businessName);
  const primarySrc = previews[0]?.src;

  if (!primarySrc) {
    return (
      <Link
        href={profileHref}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-slate-800 text-2xl font-bold text-white"
      >
        {initials}
      </Link>
    );
  }

  return (
    <Link href={profileHref} className="block h-full w-full min-h-[12rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={primarySrc} alt={business.businessName} className="h-full min-h-[12rem] w-full object-cover" />
    </Link>
  );
}

export function BusinessListingRow({
  business,
  searchFilters,
  className,
  showFeaturedBadge = false,
  showVerifiedBadge = true,
}: BusinessListingRowProps) {
  const previews = getPreviewImages(business);
  const initials = getInitials(business.businessName);
  const showVerified = showVerifiedBadge && showPublicVerifiedBadge(business);
  const showRating = business.totalReviews > 0 && business.rating > 0;
  const isTopRated = showRating && business.rating >= 4;
  const profileHref = buildBusinessProfileUrl(business.slug, searchFilters);

  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      {/* Mobile image strip */}
      {previews.length > 0 ? (
        <div className="flex gap-1.5 p-4 pb-0 lg:hidden">
          {previews.map((image, index) => (
            <Link
              key={`${image.src}-${index}`}
              href={profileHref}
              className="relative min-w-0 flex-1 overflow-hidden rounded-md bg-muted"
            >
              <div className="aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" className="h-full w-full object-cover" />
              </div>
              {image.overlay ? (
                <span className="absolute inset-0 flex items-end justify-end bg-black/35 p-2">
                  <span className="rounded bg-black/55 px-2 py-0.5 text-xs font-semibold text-white">
                    {image.overlay}
                  </span>
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <Link
          href={profileHref}
          className="mx-3 mt-3 flex aspect-[16/7] items-center justify-center rounded-md bg-gradient-to-br from-primary to-slate-800 text-2xl font-bold text-white lg:hidden"
        >
          {initials}
        </Link>
      )}

      <div className="lg:flex lg:items-stretch">
        {/* Desktop image */}
        <div className="relative hidden w-56 shrink-0 self-stretch border-r border-border bg-muted lg:block xl:w-64">
          <PrimaryImage business={business} profileHref={profileHref} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:px-5 lg:py-5">
          {showFeaturedBadge && business.isFeatured ? (
            <p className="mb-1">
              <Badge variant="accent" className="border-0 bg-accent text-white shadow-sm">
                Featured
              </Badge>
            </p>
          ) : null}
          {isTopRated ? (
            <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
              <HiStar className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden />
              Top rated
            </p>
          ) : null}

          <div className="space-y-1.5 lg:flex-1">
            <Link href={profileHref} className="inline-flex items-start gap-1.5 hover:underline">
              <h2 className="text-lg font-bold leading-snug text-foreground lg:text-xl">
                {business.businessName}
              </h2>
              {showVerified ? (
                <HiCheckBadge className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" aria-label="Verified" />
              ) : null}
            </Link>

            {showRating ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-sm font-bold text-white">
                  {business.rating.toFixed(1)}
                  <HiStar className="h-3.5 w-3.5 fill-white text-white" aria-hidden />
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatRatingCount(business.totalReviews)}
                </span>
              </div>
            ) : null}

            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <HiMapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{getLocationLine(business)}</span>
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground">
              <span>{business.category}</span>
              {business.experience ? (
                <span className="text-muted-foreground">{business.experience} experience</span>
              ) : null}
            </div>

            {showVerified ? (
              <p className="text-sm font-medium text-rose-600 lg:hidden">
                Verified professional on Site Mitra
              </p>
            ) : null}

            {business.description ? (
              <p className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <HiChatBubbleLeftRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70"
                  aria-hidden
                />
                <span className="line-clamp-2 lg:line-clamp-1">{business.description}</span>
              </p>
            ) : null}
          </div>

          <div
            className={cn(
              "mt-3 grid gap-2 pt-1 lg:mt-4 lg:flex lg:flex-wrap lg:gap-2",
              business.phoneNumber ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {business.phoneNumber ? (
              <Link
                href={telUrl(business.phoneNumber)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 lg:min-w-[140px] lg:px-5"
              >
                <HiOutlinePhone className="h-4 w-4" aria-hidden />
                <span className="lg:hidden">Call</span>
                <span className="hidden lg:inline">{business.phoneNumber}</span>
              </Link>
            ) : null}
            <Link
              href={profileHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 lg:min-w-[140px]"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
