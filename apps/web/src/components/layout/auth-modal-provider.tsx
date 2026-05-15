"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthModal, type AuthMode } from "@/components/layout/auth-modal";

export type { AuthMode };

type AuthModalContextValue = {
  open: boolean;
  mode: AuthMode;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuth = useCallback((next: AuthMode) => {
    setMode(next);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ open, mode, openAuth, closeAuth, setMode }),
    [open, mode, openAuth, closeAuth],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function AuthModalHost() {
  const { open, mode, closeAuth, setMode } = useAuthModal();

  return (
    <AuthModal
      open={open}
      mode={mode}
      onClose={closeAuth}
      onModeChange={setMode}
    />
  );
}
