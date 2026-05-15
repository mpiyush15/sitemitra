import { cn } from "@/lib/cn";

type BrandRouteSpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const shells = {
  sm: { outer: "h-12 w-12", mid: "h-8 w-8", inner: "h-4 w-4", box: "h-16 w-16" },
  md: { outer: "h-16 w-16", mid: "h-11 w-11", inner: "h-6 w-6", box: "h-24 w-24" },
  lg: { outer: "h-20 w-20", mid: "h-14 w-14", inner: "h-8 w-8", box: "h-28 w-28" },
};

export function BrandRouteSpinner({ className, size = "md" }: BrandRouteSpinnerProps) {
  const s = shells[size];

  return (
    <div
      className={cn("relative flex items-center justify-center", s.box, className)}
      aria-hidden
    >
      <span
        className={cn(
          "absolute animate-[spin_1.2s_linear_infinite] rounded-full border-2 border-transparent border-t-primary border-r-accent",
          s.outer,
        )}
      />
      <span
        className={cn(
          "absolute animate-[spin_1s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-primary border-l-accent/70",
          s.mid,
        )}
      />
      <span
        className={cn(
          "absolute animate-pulse rounded-full bg-accent/90 shadow-[0_0_20px_rgba(212,98,42,0.45)]",
          s.inner,
        )}
      />
    </div>
  );
}
