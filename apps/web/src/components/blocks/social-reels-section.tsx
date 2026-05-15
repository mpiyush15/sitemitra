import { SocialReelsPlayer } from "@/components/blocks/social-reels-player";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { SocialReelItem } from "@/types/api";

type SocialReelsSectionProps = {
  reels: SocialReelItem[];
  className?: string;
};

export function SocialReelsSection({ reels, className }: SocialReelsSectionProps) {
  return (
    <section className={cn("min-w-0 space-y-6 overflow-hidden", className)}>
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight">From our socials</h2>
        <p className="text-muted-foreground">Watch reels and updates from Site Mitra</p>
      </div>

      {reels.length > 0 ? (
        <div className="-mx-4 sm:mx-0">
          <SocialReelsPlayer reels={reels} />
        </div>
      ) : (
        <EmptyState
          title="No reels yet"
          description="Super admin can link Instagram, YouTube Shorts, or Facebook reels from Admin → Social reels."
        />
      )}
    </section>
  );
}
