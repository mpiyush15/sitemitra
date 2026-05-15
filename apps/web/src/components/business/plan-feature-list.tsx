import { cn } from "@/lib/cn";

type PlanFeatureListProps = {
  features: string[];
  className?: string;
};

export function PlanFeatureList({ features, className }: PlanFeatureListProps) {
  if (features.length === 0) {
    return <p className="text-sm text-muted-foreground">No features listed.</p>;
  }

  return (
    <ul className={cn("space-y-2 text-sm", className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <span className="text-accent">✓</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
