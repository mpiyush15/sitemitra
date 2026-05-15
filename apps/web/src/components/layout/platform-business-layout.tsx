"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { PlatformShell } from "@/components/layout/platform-shell";
import { Spinner } from "@/components/ui/spinner";
import { getProfile } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";
import { isPlatformAdmin } from "@/lib/auth-routing";
import { ROLES } from "@/lib/constants";
import { useLogout } from "@/lib/use-logout";
import {
  filterBusinessNav,
  getBusinessRoleLabel,
} from "@/lib/business-nav";
import type { ProfileResponse } from "@/types/api";

export function PlatformBusinessLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout, loggingOut } = useLogout();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (isPlatformAdmin(data.user.role)) {
          router.replace("/admin");
          return;
        }
        if (data.user.role === ROLES.USER) {
          router.replace("/");
          return;
        }
        setProfile(data);
      })
      .catch((err) => {
        if (err instanceof ApiClientError && err.status === 401) {
          router.replace("/?auth=login");
          return;
        }
        setError(err instanceof ApiClientError ? err.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100/80">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100/80 p-6 text-center">
        <p className="text-destructive">{error || "Unable to open business dashboard"}</p>
      </div>
    );
  }

  const sections = filterBusinessNav(profile.user.role);
  const roleLabel = getBusinessRoleLabel(profile.user.role, profile.user.membershipPlan);

  return (
    <PlatformShell
      sections={sections}
      homeHref="/dashboard"
      homeSubtitle="Business"
      fullName={profile.user.fullName}
      userEmail={profile.user.email}
      roleLabel={roleLabel}
      onLogout={logout}
      loggingOut={loggingOut}
    >
      {children}
    </PlatformShell>
  );
}
