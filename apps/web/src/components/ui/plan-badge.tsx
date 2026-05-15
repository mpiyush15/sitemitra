import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

type PlanBadgeProps = { plan: string };

export function PlanBadge({ plan }: PlanBadgeProps) {
  const isStandard = plan === MEMBERSHIP_PLANS.STANDARD;
  return (
    <Badge variant={isStandard ? "accent" : "outline"}>
      {isStandard ? "Standard" : "Free"}
    </Badge>
  );
}
