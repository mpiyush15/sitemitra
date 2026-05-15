import { cn } from "@/lib/cn";

type SlugPreviewProps = {
  slug: string;
  className?: string;
};

export function SlugPreview({ slug, className }: SlugPreviewProps) {
  const path = slug ? `/business/${slug}` : "/business/your-slug";
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Profile URL: <span className="font-mono text-foreground">{path}</span>
    </p>
  );
}
