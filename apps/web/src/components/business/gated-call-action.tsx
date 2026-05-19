"use client";

import { HiOutlinePhone } from "react-icons/hi2";
import { useContactLoginGate } from "@/hooks/use-contact-login-gate";
import { telUrl } from "@/lib/public";
import { cn } from "@/lib/cn";

type GatedCallActionProps = {
  phone: string;
  className?: string;
};

export function GatedCallAction({ phone, className }: GatedCallActionProps) {
  const { ensureLoggedIn } = useContactLoginGate();

  return (
    <button
      type="button"
      onClick={() => {
        if (!ensureLoggedIn()) return;
        window.location.href = telUrl(phone);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700",
        className,
      )}
    >
      <HiOutlinePhone className="h-4 w-4" aria-hidden />
      Call now
    </button>
  );
}
