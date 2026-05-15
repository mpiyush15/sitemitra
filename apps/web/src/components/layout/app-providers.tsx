"use client";

import { Suspense, type ReactNode } from "react";
import { AuthModalHost, AuthModalProvider } from "@/components/layout/auth-modal-provider";
import { AuthModalUrlSync } from "@/components/layout/auth-modal-url-sync";
import { ScrollToTopOnNavigate } from "@/components/layout/scroll-to-top-on-navigate";
import { AuthTransitionProvider } from "@/lib/auth-transition";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthTransitionProvider>
      <AuthModalProvider>
        <Suspense fallback={null}>
          <AuthModalUrlSync />
          <ScrollToTopOnNavigate />
        </Suspense>
        {children}
        <AuthModalHost />
      </AuthModalProvider>
    </AuthTransitionProvider>
  );
}
