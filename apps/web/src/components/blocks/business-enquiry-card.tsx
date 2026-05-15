"use client";

import { InquiryForm } from "@/components/forms/inquiry-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BusinessEnquiryCardProps = {
  businessSlug: string;
  businessName: string;
  defaultCity?: string;
};

const cardHeaderClass = "p-4 pb-2 sm:p-6 sm:pb-2";
const cardContentClass = "min-w-0 p-4 pt-0 sm:p-6 sm:pt-0";

export function BusinessEnquiryCard({
  businessSlug,
  businessName,
  defaultCity,
}: BusinessEnquiryCardProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className={cardHeaderClass}>
        <CardTitle>Send enquiry</CardTitle>
        <CardDescription>
          Share your details and requirement. This goes only to {businessName}&apos;s
          dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className={cardContentClass}>
        <InquiryForm
          businessSlug={businessSlug}
          defaultCity={defaultCity}
        />
      </CardContent>
    </Card>
  );
}
