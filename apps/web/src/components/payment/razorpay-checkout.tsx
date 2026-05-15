"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RazorpayCheckoutProps = {
  amountLabel?: string;
  onPay?: () => void;
};

export function RazorpayCheckout({ amountLabel = "₹999", onPay }: RazorpayCheckoutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete payment</CardTitle>
        <CardDescription>Razorpay checkout integration placeholder</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold">{amountLabel}</p>
        <Button onClick={onPay}>Pay with Razorpay</Button>
      </CardContent>
    </Card>
  );
}
