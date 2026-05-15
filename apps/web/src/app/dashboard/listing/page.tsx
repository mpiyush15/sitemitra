"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getProfile } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";

export default function DashboardListingPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile.businessProfile?.slug) {
          router.replace(`/business/${profile.businessProfile.slug}`);
          return;
        }
        setError("no-profile");
      })
      .catch((err) => {
        if (err instanceof ApiClientError && err.status === 401) {
          router.replace("/?auth=login");
          return;
        }
        setError(err instanceof ApiClientError ? err.message : "Failed to load listing");
      });
  }, [router]);

  if (error === "no-profile") {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-primary">No public listing yet</h2>
        <p className="text-sm text-muted-foreground">
          Complete your business profile to publish your listing on Site Mitra.
        </p>
        <Link href="/dashboard/profile" className="font-medium text-accent hover:underline">
          Set up business profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}
