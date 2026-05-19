import { HiCheckBadge } from "react-icons/hi2";
import { cn } from "@/lib/cn";

type VerifiedBadgeProps = {
  className?: string;
  /** High-contrast pill for photos / dark overlays (listing thumbnails). */
  onImage?: boolean;
  /** Larger badge for public profile header. */
  size?: "default" | "lg";
};

export function VerifiedBadge({
  className,
  onImage = false,
  size = "default",
}: VerifiedBadgeProps) {
  const isLarge = size === "lg" && !onImage;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full leading-none",
        isLarge ? null : "font-semibold",
        isLarge
          ? "gap-1.5 border border-emerald-800 bg-emerald-600 px-3.5 py-1.5 text-sm font-bold text-white shadow-md sm:px-4 sm:py-2 sm:text-base"
          : cn(
              "gap-1 text-xs",
              onImage
                ? "border border-white/30 bg-emerald-600 px-2 py-1 text-white shadow-md"
                : "border border-emerald-500/35 bg-emerald-500/15 px-2.5 py-0.5 text-emerald-800 dark:text-emerald-300",
            ),
        className,
      )}
    >
      <HiCheckBadge
        className={cn(
          "shrink-0",
          isLarge
            ? "h-5 w-5 text-white sm:h-6 sm:w-6"
            : onImage
              ? "h-3.5 w-3.5"
              : "h-4 w-4",
        )}
        aria-hidden
      />
      Verified
    </span>
  );
}
