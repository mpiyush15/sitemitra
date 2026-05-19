"use client";

import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { getStoredToken } from "@/lib/session";

/** Guests must log in before Call / WhatsApp on public listings & profiles. */
export function useContactLoginGate() {
  const { openAuth } = useAuthModal();

  function ensureLoggedIn(): boolean {
    if (getStoredToken()) return true;
    openAuth("login");
    return false;
  }

  return { ensureLoggedIn, isLoggedIn: Boolean(getStoredToken()) };
}
