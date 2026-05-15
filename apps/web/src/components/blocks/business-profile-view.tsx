import Link from "next/link";
import type { ComponentType } from "react";
import {
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import { BusinessEnquiryCard } from "@/components/blocks/business-enquiry-card";
import { BusinessContactActions } from "@/components/blocks/business-contact-actions";
import { GalleryGrid } from "@/components/blocks/gallery-grid";
import { ServicesTags } from "@/components/business/services-tags";
import { SocialLinks } from "@/components/business/social-links";
import { RatingStars } from "@/components/ui/rating-stars";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppImage } from "@/components/ui/app-image";
import type { BusinessDetail } from "@/types/api";

const cardHeaderClass = "p-4 pb-2 sm:p-6 sm:pb-2";
const cardContentClass = "min-w-0 p-4 pt-0 sm:p-6 sm:pt-0";

type BusinessProfileViewProps = {
  business: BusinessDetail;
};

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {href ? (
          <a href={href} className="break-words text-muted-foreground hover:text-accent">
            {value}
          </a>
        ) : (
          <p className="break-words text-muted-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

export function BusinessProfileView({ business }: BusinessProfileViewProps) {
  const isPremium = business.isPremium;
  const showVerified = showPublicVerifiedBadge(business);
  const coverImage = isPremium
    ? business.profileBanner || business.gallery[0] || business.logo
    : "";
  const socialLinks = {
    ...business.socialLinks,
    website: business.website,
  };

  return (
    <div className="min-w-0 max-w-full space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative h-36 bg-gradient-to-br from-primary via-primary/90 to-slate-800 sm:h-52">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="relative min-w-0 px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-3 sm:gap-4">
              {isPremium ? (
                <AppImage
                  src={business.logo}
                  alt={business.businessName}
                  width={112}
                  height={112}
                  fallbackText={business.businessName.slice(0, 2).toUpperCase()}
                  className="relative z-10 -mt-10 h-20 w-20 shrink-0 rounded-2xl border-4 border-card object-cover shadow-md sm:-mt-14 sm:h-28 sm:w-28"
                />
              ) : null}
              <div className={`min-w-0 flex-1 space-y-1.5 sm:space-y-2 ${isPremium ? "pt-1 sm:pt-2" : "pt-4"}`}>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h1 className="min-w-0 break-words text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {business.businessName}
                  </h1>
                  {showVerified ? <VerifiedBadge /> : null}
                </div>
                <p className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
                  <HiOutlineBriefcase className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="break-words">
                    {business.category}
                    {business.subCategory ? ` · ${business.subCategory}` : ""}
                  </span>
                </p>
                <p className="flex min-w-0 items-start gap-1.5 text-sm text-muted-foreground sm:text-base">
                  <HiOutlineMapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="break-words">
                    {business.city}
                    {business.state ? `, ${business.state}` : ""}
                  </span>
                </p>
                {business.totalReviews > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <RatingStars value={business.rating} />
                    <span className="text-sm text-muted-foreground">
                      ({business.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <BusinessContactActions
              whatsappNumber={business.whatsappNumber}
              phoneNumber={business.phoneNumber}
              businessName={business.businessName}
              slug={business.slug}
              category={business.category}
              city={business.city}
              className="md:pt-2"
            />
          </div>
        </div>
      </section>

      <div className="grid min-w-0 gap-5 lg:grid-cols-3 lg:gap-8">
        <aside className="order-1 min-w-0 space-y-4 lg:order-2">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className={cardHeaderClass}>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className={cardContentClass}>
              <div className="space-y-4">
                {business.phoneNumber && (
                  <DetailRow icon={HiOutlinePhone} label="Phone" value={business.phoneNumber} />
                )}
                {business.email && (
                  <DetailRow
                    icon={HiOutlineEnvelope}
                    label="Email"
                    value={business.email}
                    href={`mailto:${business.email}`}
                  />
                )}
                {business.whatsappNumber && (
                  <DetailRow icon={HiOutlinePhone} label="WhatsApp" value={business.whatsappNumber} />
                )}
                {business.website && (
                  <DetailRow icon={HiOutlineGlobeAlt} label="Website" value={business.website} />
                )}
                {!business.phoneNumber &&
                  !business.email &&
                  !business.whatsappNumber &&
                  !business.website && (
                  <p className="text-sm text-muted-foreground">Contact details not added yet.</p>
                )}
                <BusinessContactActions
                  whatsappNumber={business.whatsappNumber}
                  phoneNumber={business.phoneNumber}
                  businessName={business.businessName}
                  slug={business.slug}
                  category={business.category}
                  city={business.city}
                />
              </div>
            </CardContent>
          </Card>

          <BusinessEnquiryCard
            businessSlug={business.slug}
            businessName={business.businessName}
            defaultCity={business.city}
          />

          <Card className="min-w-0 overflow-hidden">
            <CardHeader className={cardHeaderClass}>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className={cardContentClass}>
              <DetailRow
                icon={HiOutlineMapPin}
                label="Service area"
                value={[business.city, business.state].filter(Boolean).join(", ") || "Not specified"}
              />
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden">
            <CardHeader className={cardHeaderClass}>
              <CardTitle>Social & links</CardTitle>
            </CardHeader>
            <CardContent className={cardContentClass}>
              <SocialLinks links={socialLinks} />
            </CardContent>
          </Card>

          {business.isPremium && business.catalogues.length > 0 && (
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className={cardHeaderClass}>
                <CardTitle>Catalogues</CardTitle>
              </CardHeader>
              <CardContent className={cardContentClass}>
                <div className="space-y-2">
                  {business.catalogues.map((item) => (
                    <Link
                      key={item.id}
                      href={item.fileUrl}
                      className="block break-words text-sm font-medium text-accent hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        <div className="order-2 min-w-0 space-y-5 lg:order-1 lg:col-span-2 lg:space-y-6">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className={cardHeaderClass}>
              <CardTitle>About</CardTitle>
              <CardDescription>Business overview and experience</CardDescription>
            </CardHeader>
            <CardContent className={`${cardContentClass} space-y-3 text-sm leading-relaxed text-muted-foreground`}>
              <p className="break-words">{business.description || "No description provided yet."}</p>
              {business.experience && (
                <p className="break-words">
                  <span className="font-medium text-foreground">Experience: </span>
                  {business.experience}
                </p>
              )}
            </CardContent>
          </Card>

          {isPremium ? (
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className={cardHeaderClass}>
                <CardTitle>Services offered</CardTitle>
                <CardDescription>What this business provides</CardDescription>
              </CardHeader>
              <CardContent className={cardContentClass}>
                <ServicesTags services={business.services} />
              </CardContent>
            </Card>
          ) : null}

          {isPremium ? (
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className={cardHeaderClass}>
                <CardTitle>Project gallery</CardTitle>
                <CardDescription>
                  {business.gallery.length > 0
                    ? `${business.gallery.length} project photos`
                    : "Photos from the business dashboard appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent className={cardContentClass}>
                <GalleryGrid images={business.gallery} placeholderCount={6} />
              </CardContent>
            </Card>
          ) : null}

          {business.isPremium && business.reviews.length > 0 && (
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className={cardHeaderClass}>
                <CardTitle>Customer reviews</CardTitle>
              </CardHeader>
              <CardContent className={`${cardContentClass} space-y-4`}>
                {business.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <p className="font-medium text-foreground">{review.customerName}</p>
                    <p className="text-sm text-accent">★ {review.rating}/5</p>
                    <p className="break-words text-sm text-muted-foreground">{review.reviewText}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!isPremium ? (
            <p className="break-words rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Gallery, services, reviews, and catalogues unlock with a verified listing on Site Mitra.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
