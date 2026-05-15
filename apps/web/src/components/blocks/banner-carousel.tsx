import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

export type BannerItem = {
  id: string;
  imageUrl: string;
  title?: string;
  href?: string;
};

type BannerCarouselProps = {
  banners: BannerItem[];
  className?: string;
};

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  if (banners.length === 0) {
    return (
      <EmptyState
        title="No banners"
        description="Promotional banners will appear here."
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex gap-4 overflow-x-auto snap-x snap-mandatory", className)}>
      {banners.map((banner) => {
        const content = (
          <AppImage
            src={banner.imageUrl}
            alt={banner.title ?? "Promotional banner"}
            width={800}
            height={240}
            className="aspect-[10/3] w-full min-w-[320px] snap-start rounded-xl object-cover"
          />
        );
        return banner.href ? (
          <Link key={banner.id} href={banner.href} className="block min-w-[320px] flex-1">
            {content}
          </Link>
        ) : (
          <div key={banner.id} className="min-w-[320px] flex-1">
            {content}
          </div>
        );
      })}
    </div>
  );
}
