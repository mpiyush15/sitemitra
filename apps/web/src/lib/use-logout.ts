"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { logoutUser } from "@/lib/auth";

export function useLogout() {
  const router = useRouter();
  const { closeAuth } = useAuthModal();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
      closeAuth();
      router.replace("/");
      router.refresh();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setLoggingOut(false);
    }
  }, [closeAuth, loggingOut, router]);

  return { logout, loggingOut };
}
