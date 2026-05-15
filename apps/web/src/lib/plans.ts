import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";

export type PlanItem = {
  id: string;
  planName: string;
  slug: string;
  price: number;
  features: string[];
  durationDays: number;
  isActive?: boolean;
};

export type PaymentSettings = {
  provider: string;
  enabled: boolean;
  testMode: boolean;
  keyId?: string;
  hasKeySecret?: boolean;
  hasWebhookSecret?: boolean;
  hasKeys?: boolean;
};

export async function fetchPublicPlans(): Promise<PlanItem[]> {
  return apiFetch<PlanItem[]>(API_ROUTES.plans);
}

export async function fetchAdminPlans(): Promise<PlanItem[]> {
  return apiFetch<PlanItem[]>(API_ROUTES.admin.membership.plans);
}

export async function updateAdminPlan(
  slug: string,
  input: Partial<Pick<PlanItem, "planName" | "price" | "features" | "durationDays" | "isActive">>,
) {
  return apiFetch<PlanItem>(`${API_ROUTES.admin.membership.plans}/${slug}`, {
    method: "PATCH",
    body: input,
  });
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  return apiFetch<PaymentSettings>(API_ROUTES.admin.membership.paymentSettings);
}

export async function updatePaymentSettings(input: Partial<PaymentSettings & {
  keySecret?: string;
  webhookSecret?: string;
}>) {
  return apiFetch<PaymentSettings>(API_ROUTES.admin.membership.paymentSettings, {
    method: "PATCH",
    body: input,
  });
}

export async function upgradeDashboardPlan(planSlug: string) {
  return apiFetch<{ membershipPlan: string; planName: string }>(API_ROUTES.dashboard.upgrade, {
    method: "POST",
    body: { planSlug },
  });
}

export async function fetchPublicPaymentStatus(): Promise<PaymentSettings> {
  return apiFetch<PaymentSettings>(`${API_ROUTES.plans}/payment-status`);
}
