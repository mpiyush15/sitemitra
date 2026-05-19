"use client";

import { useEffect, useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStoredToken } from "@/lib/session";

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
  const { openAuth } = useAuthModal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredToken()));
  }, []);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className={cardHeaderClass}>
        <CardTitle>Send enquiry</CardTitle>
        <CardDescription>
          Share your details and requirement. This goes only to {businessName}&apos;s dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className={cardContentClass}>
        {isLoggedIn ? (
          <InquiryForm businessSlug={businessSlug} defaultCity={defaultCity} />
        ) : (
          <div className="space-y-3 py-4 text-center">
            <HiOutlineLockClosed className="mx-auto h-7 w-7 text-accent" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Log in or sign up to send an enquiry to this business.
            </p>
            <Button type="button" className="w-full sm:w-auto" onClick={() => openAuth("login")}>
              Log in / Sign up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
