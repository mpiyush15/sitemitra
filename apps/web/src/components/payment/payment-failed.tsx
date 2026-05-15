import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PaymentFailed() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12 text-center">
      <Alert variant="error" title="Payment failed">
        Something went wrong. Please try again or contact support.
      </Alert>
      <Link href="/dashboard/upgrade">
        <Button variant="outline">Try again</Button>
      </Link>
    </div>
  );
}
