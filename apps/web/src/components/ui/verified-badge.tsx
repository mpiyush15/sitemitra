import { HiCheckBadge } from "react-icons/hi2";
import { cn } from "@/lib/cn";

type VerifiedBadgeProps = {
  className?: string;
  /** High-contrast pill for photos / dark overlays (listing thumbnails). */
  onImage?: boolean;
};

export function VerifiedBadge({ className, onImage = false }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full text-xs font-semibold leading-none",
        onImage
          ? "border border-white/30 bg-emerald-600 px-2 py-1 text-white shadow-md"
          : "border border-emerald-500/35 bg-emerald-500/15 px-2.5 py-0.5 text-emerald-800 dark:text-emerald-300",
        className,
      )}
    >
      <HiCheckBadge className={cn("shrink-0", onImage ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
      Verified
    </span>
  );
}
