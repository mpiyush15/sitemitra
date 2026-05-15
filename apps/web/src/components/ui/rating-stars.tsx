import { cn } from "@/lib/cn";

type RatingStarsProps = {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
};

export function RatingStars({ value = 0, max = 5, onChange, className }: RatingStarsProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const star = i + 1;
    const filled = star <= Math.round(value);
    return { star, filled };
  });

  if (!onChange) {
    return (
      <div
        className={cn("inline-flex gap-0.5", className)}
        aria-label={`${value} out of ${max} stars`}
      >
        {stars.map(({ star, filled }) => (
          <span
            key={star}
            className={cn(
              "text-lg leading-none",
              filled ? "text-accent" : "text-muted-foreground/40",
            )}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex gap-0.5", className)} role="radiogroup">
      {stars.map(({ star, filled }) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={cn(
            "cursor-pointer text-lg leading-none hover:scale-110",
            filled ? "text-accent" : "text-muted-foreground/40",
          )}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
