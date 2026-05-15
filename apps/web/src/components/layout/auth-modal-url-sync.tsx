"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthModal, type AuthMode } from "@/components/layout/auth-modal-provider";

const AUTH_QUERY_MODES = new Set<AuthMode>(["login", "register", "register-business"]);

export function AuthModalUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (!auth || !AUTH_QUERY_MODES.has(auth as AuthMode)) return;

    openAuth(auth as AuthMode);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, openAuth]);

  return null;
}
