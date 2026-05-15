"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthTransitionOverlay } from "@/components/layout/auth-transition-overlay";

type AuthTransitionContextValue = {
  transitionTo: (navigate: () => void) => Promise<void>;
  isTransitioning: boolean;
};

const AuthTransitionContext = createContext<AuthTransitionContextValue | null>(null);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAuthTransition() {
  const ctx = useContext(AuthTransitionContext);
  if (!ctx) {
    throw new Error("useAuthTransition must be used within AuthTransitionProvider");
  }
  return ctx;
}

export function AuthTransitionProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const transitionTo = useCallback(async (navigate: () => void) => {
    setExiting(false);
    setVisible(true);
    await wait(450);
    navigate();
    await wait(350);
    setExiting(true);
    await wait(500);
    setVisible(false);
    setExiting(false);
  }, []);

  const value = useMemo(
    () => ({ transitionTo, isTransitioning: visible }),
    [transitionTo, visible],
  );

  return (
    <AuthTransitionContext.Provider value={value}>
      {children}
      {visible && <AuthTransitionOverlay exiting={exiting} />}
    </AuthTransitionContext.Provider>
  );
}
