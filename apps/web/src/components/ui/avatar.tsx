import { cn } from "@/lib/cn";

type AvatarProps = {
  src?: string;
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-base",
};

export function Avatar({ src, name = "?", className, size = "md" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizes[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
