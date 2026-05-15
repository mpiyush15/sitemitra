"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchAdminPlans,
  updateAdminPlan,
  type PlanItem,
} from "@/lib/plans";
import { ApiClientError } from "@/lib/api";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

export function PlansAdminPanel() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingSlug, setSavingSlug] = useState("");

  useEffect(() => {
    fetchAdminPlans()
      .then(setPlans)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load plans"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function savePlan(event: FormEvent<HTMLFormElement>, slug: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSavingSlug(slug);
    setError("");
    setMessage("");
    try {
      const updated = await updateAdminPlan(slug, {
        planName: String(form.get("planName") ?? ""),
        price: Number(form.get("price") ?? 0),
        durationDays: Number(form.get("durationDays") ?? 365),
        features: String(form.get("features") ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        isActive: form.get("isActive") === "on",
      });
      setPlans((rows) => rows.map((row) => (row.slug === slug ? { ...row, ...updated } : row)));
      setMessage(`${updated.planName} saved`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not save plan");
    } finally {
      setSavingSlug("");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-accent">{message}</p> : null}
      {plans.map((plan) => (
        <form
          key={plan.slug}
          onSubmit={(event) => savePlan(event, plan.slug)}
          className="space-y-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{plan.planName}</h3>
            <span className="text-xs uppercase text-muted-foreground">{plan.slug}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium">Display name</span>
              <Input name="planName" defaultValue={plan.planName} required />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Price (INR)</span>
              <Input name="price" type="number" min={0} step={1} defaultValue={plan.price} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Duration (days)</span>
              <Input
                name="durationDays"
                type="number"
                min={1}
                defaultValue={plan.durationDays}
              />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" name="isActive" defaultChecked={plan.isActive ?? true} />
              Active plan
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Features (one per line)</span>
            <Textarea
              name="features"
              rows={plan.slug === MEMBERSHIP_PLANS.STANDARD ? 8 : 5}
              defaultValue={plan.features.join("\n")}
            />
          </label>
          <Button type="submit" disabled={savingSlug === plan.slug}>
            {savingSlug === plan.slug ? "Saving..." : "Save plan"}
          </Button>
        </form>
      ))}
    </div>
  );
}
