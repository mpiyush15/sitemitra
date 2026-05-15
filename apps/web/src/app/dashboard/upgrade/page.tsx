"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getProfile } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import {
  fetchPublicPlans,
  upgradeDashboardPlan,
  type PlanItem,
} from "@/lib/plans";

export default function DashboardUpgradePage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>(MEMBERSHIP_PLANS.FREE);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetchPublicPlans(), getProfile()])
      .then(([planRows, profile]) => {
        setPlans(planRows);
        setCurrentPlan(profile.user.membershipPlan);
      })
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load plans"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function upgrade() {
    setUpgrading(true);
    setError("");
    setMessage("");
    try {
      const result = await upgradeDashboardPlan(MEMBERSHIP_PLANS.STANDARD);
      setCurrentPlan(result.membershipPlan);
      setMessage(`Upgraded to ${result.planName}. Refresh your public profile to see new features.`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const standard = plans.find((plan) => plan.slug === MEMBERSHIP_PLANS.STANDARD);
  const isStandard = currentPlan === MEMBERSHIP_PLANS.STANDARD;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Upgrade plan</h2>
        <p className="text-sm text-muted-foreground">
          Standard unlocks gallery, services, reviews, catalogues, and better listing visibility.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-accent">{message}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.slug} className={plan.slug === MEMBERSHIP_PLANS.STANDARD ? "border-accent" : ""}>
            <CardHeader>
              <CardTitle>{plan.planName}</CardTitle>
              <CardDescription>
                {plan.price === 0 ? "Free for now" : `₹${plan.price} / ${plan.durationDays} days`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-inside list-disc space-y-1">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature}>{feature.replace(/_/g, " ")}</li>
                ))}
              </ul>
              {plan.slug === MEMBERSHIP_PLANS.STANDARD && !isStandard ? (
                <Button className="w-full" onClick={upgrade} disabled={upgrading}>
                  {upgrading ? "Upgrading..." : standard?.price === 0 ? "Upgrade free" : "Upgrade now"}
                </Button>
              ) : null}
              {currentPlan === plan.slug ? (
                <p className="font-medium text-accent">Your current plan</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
