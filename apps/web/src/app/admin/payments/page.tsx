import { PaymentsAdminPanel } from "@/components/admin/payments-admin-panel";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Payments</h2>
        <p className="text-sm text-muted-foreground">
          Configure Razorpay and view payment records. Keep disabled until you set plan prices.
        </p>
      </div>
      <PaymentsAdminPanel />
    </div>
  );
}
