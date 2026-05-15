"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TopNotificationBar } from "@/components/layout/top-notification-bar";

function PublicSiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNotificationBar />
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <PageTransition className="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </PageTransition>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlatformRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (isPlatformRoute) {
    return <>{children}</>;
  }

  return <PublicSiteChrome>{children}</PublicSiteChrome>;
}
