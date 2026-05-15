import { MembershipPlanCard } from "@/components/business/membership-plan-card";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

type UpgradePageProps = {
  selectedPlan?: string;
  onSelectPlan?: (plan: string) => void;
};

export function UpgradePage({ selectedPlan, onSelectPlan }: UpgradePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Choose your plan</h1>
        <p className="text-muted-foreground">Upgrade to Standard for premium visibility and tools.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MembershipPlanCard
          plan={MEMBERSHIP_PLANS.FREE}
          selected={selectedPlan === MEMBERSHIP_PLANS.FREE}
          onSelect={() => onSelectPlan?.(MEMBERSHIP_PLANS.FREE)}
        />
        <MembershipPlanCard
          plan={MEMBERSHIP_PLANS.STANDARD}
          selected={selectedPlan === MEMBERSHIP_PLANS.STANDARD}
          onSelect={() => onSelectPlan?.(MEMBERSHIP_PLANS.STANDARD)}
        />
      </div>
    </div>
  );
}
