"use client";

import { FormEvent, useEffect, useState } from "react";
import { PaymentsTable } from "@/components/admin/payments-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchAdminPayments, type AdminPaymentRow } from "@/lib/admin-platform";
import {
  fetchPaymentSettings,
  updatePaymentSettings,
  type PaymentSettings,
} from "@/lib/plans";
import { ApiClientError } from "@/lib/api";

export function PaymentsAdminPanel() {
  const [payments, setPayments] = useState<AdminPaymentRow[]>([]);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminPayments(), fetchPaymentSettings()])
      .then(([paymentRows, paymentSettings]) => {
        setPayments(paymentRows);
        setSettings(paymentSettings);
      })
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load payments"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function onSaveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await updatePaymentSettings({
        provider: form.get("provider") as "razorpay" | "none",
        enabled: form.get("enabled") === "on",
        testMode: form.get("testMode") === "on",
        keyId: String(form.get("keyId") ?? ""),
        keySecret: String(form.get("keySecret") ?? ""),
        webhookSecret: String(form.get("webhookSecret") ?? ""),
      });
      setSettings(updated);
      setMessage("Payment settings saved");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
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
    <div className="space-y-8">
      <form
        onSubmit={onSaveSettings}
        className="space-y-4 rounded-xl border border-border bg-card p-4"
      >
        <div>
          <h3 className="text-lg font-semibold">Payment gateway</h3>
          <p className="text-sm text-muted-foreground">
            Keep disabled while price is ₹0. Enable Razorpay when ready — upgrade buttons will
            start checkout automatically.
          </p>
        </div>
        {settings ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Provider</span>
                <select
                  name="provider"
                  defaultValue={settings.provider}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3"
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="none">None</option>
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Key ID</span>
                <Input name="keyId" defaultValue={settings.keyId ?? ""} placeholder="rzp_test_..." />
              </label>
              <label className="space-y-1 text-sm sm:col-span-2">
                <span className="font-medium">Key secret</span>
                <Input
                  name="keySecret"
                  type="password"
                  placeholder={settings.hasKeySecret ? "Saved — enter to replace" : "Enter secret"}
                />
              </label>
              <label className="space-y-1 text-sm sm:col-span-2">
                <span className="font-medium">Webhook secret</span>
                <Input
                  name="webhookSecret"
                  type="password"
                  placeholder={
                    settings.hasWebhookSecret ? "Saved — enter to replace" : "Enter webhook secret"
                  }
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="enabled" defaultChecked={settings.enabled} />
                Enable online payments
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="testMode" defaultChecked={settings.testMode} />
                Test mode
              </label>
            </div>
          </>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-accent">{message}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save gateway settings"}
        </Button>
      </form>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Payment records</h3>
        <PaymentsTable
          payments={payments.map((payment) => ({
            id: payment.id,
            userId: payment.orderId,
            amount: payment.amount,
            status: payment.paymentStatus,
            createdAt: payment.createdAt,
          }))}
        />
      </div>
    </div>
  );
}
