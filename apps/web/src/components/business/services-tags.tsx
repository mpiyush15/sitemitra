import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type ServicesTagsProps = {
  services: string[];
  className?: string;
};

export function ServicesTags({ services, className }: ServicesTagsProps) {
  if (services.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>No services listed.</p>;
  }

  return (
    <div className={cn("flex min-w-0 flex-wrap gap-2", className)}>
      {services.map((service) => (
        <Badge
          key={service}
          variant="outline"
          className="max-w-full whitespace-normal break-words text-left leading-snug"
        >
          {service}
        </Badge>
      ))}
    </div>
  );
}
