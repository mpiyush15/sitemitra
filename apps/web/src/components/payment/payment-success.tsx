import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PaymentSuccess() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12 text-center">
      <Alert variant="success" title="Payment successful">
        Your Standard membership is now active. Thank you!
      </Alert>
      <Link href="/dashboard">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}
