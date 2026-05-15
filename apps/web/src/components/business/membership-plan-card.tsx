import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanFeatureList } from "@/components/business/plan-feature-list";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const PLAN_FEATURES: Record<string, string[]> = {
  [MEMBERSHIP_PLANS.FREE]: [
    "Basic business listing",
    "Contact via WhatsApp & phone",
    "Search visibility",
  ],
  [MEMBERSHIP_PLANS.STANDARD]: [
    "Verified badge",
    "Photo gallery & catalogues",
    "Customer reviews",
    "Featured placement",
    "Priority support",
  ],
};

type MembershipPlanCardProps = {
  plan: string;
  priceLabel?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export function MembershipPlanCard({
  plan,
  priceLabel,
  selected,
  onSelect,
  className,
}: MembershipPlanCardProps) {
  const isStandard = plan === MEMBERSHIP_PLANS.STANDARD;
  const title = isStandard ? "Standard" : "Free";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        selected && "ring-2 ring-accent",
        className,
      )}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {isStandard && <Badge variant="accent">Popular</Badge>}
        </div>
        <CardDescription>
          {priceLabel ?? (isStandard ? "₹999 / year" : "₹0")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanFeatureList features={PLAN_FEATURES[plan] ?? []} />
      </CardContent>
    </Card>
  );
}
