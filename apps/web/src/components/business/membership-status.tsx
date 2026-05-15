import { PlanBadge } from "@/components/ui/plan-badge";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { cn } from "@/lib/cn";

type MembershipStatusProps = {
  plan: string;
  expiresAt?: string | null;
  className?: string;
};

export function MembershipStatus({ plan, expiresAt, className }: MembershipStatusProps) {
  const isStandard = plan === MEMBERSHIP_PLANS.STANDARD;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <PlanBadge plan={plan} />
      <span className="text-sm text-muted-foreground">
        {isStandard && expiresAt
          ? `Expires ${new Date(expiresAt).toLocaleDateString()}`
          : isStandard
            ? "Active Standard plan"
            : "Free plan — upgrade for more features"}
      </span>
    </div>
  );
}
