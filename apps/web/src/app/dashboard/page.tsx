"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/ui/plan-badge";
import { Spinner } from "@/components/ui/spinner";
import { getProfile } from "@/lib/auth";
import { fetchBusinessAnalytics } from "@/lib/analytics";
import { ApiClientError } from "@/lib/api";
import type { ProfileResponse } from "@/types/api";

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [analytics, setAnalytics] = useState({
    profileVisitors: 0,
    enquiriesTotal: 0,
    enquiriesNew: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProfile(), fetchBusinessAnalytics().catch(() => null)])
      .then(([profileData, analyticsData]) => {
        setProfile(profileData);
        if (analyticsData) {
          setAnalytics(analyticsData);
        }
      })
      .catch((err) => {
        setError(err instanceof ApiClientError ? err.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return <p className="text-destructive">{error || "Something went wrong"}</p>;
  }

  const { user, businessProfile } = profile;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Business dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.fullName}. Manage your listing, inquiries, and membership.
        </p>
      </div>

      <DashboardOverview
        stats={{
          profileVisitors: analytics.profileVisitors,
          enquiriesTotal: analytics.enquiriesTotal,
          enquiriesNew: analytics.enquiriesNew,
          plan: user.membershipPlan,
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Plan:</span>
              <PlanBadge plan={user.membershipPlan} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {businessProfile ? (
              <div className="space-y-2">
                <p className="font-medium">{businessProfile.businessName}</p>
                <p className="text-muted-foreground">
                  {businessProfile.category} · {businessProfile.city}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={`/business/${businessProfile.slug}`}
                    className="font-medium text-accent hover:underline"
                  >
                    View public profile →
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="font-medium text-primary hover:underline"
                  >
                    Edit profile →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No business profile linked yet.{" "}
                <Link href="/dashboard/profile" className="font-medium text-primary hover:underline">
                  Set up your listing
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
