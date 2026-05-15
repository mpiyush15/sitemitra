import { cn } from "@/lib/cn";
import Image from "next/image";
import type { ComponentProps } from "react";

type AppImageProps = ComponentProps<typeof Image> & {
  fallbackText?: string;
};

export function AppImage({ src, alt, className, fallbackText, ...props }: AppImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground",
          className,
        )}
      >
        {fallbackText ?? alt?.charAt(0)?.toUpperCase() ?? "?"}
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} className={cn("rounded-lg object-cover", className)} {...props} />
  );
}
