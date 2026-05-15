"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type FeatureToggleProps = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};

export function FeatureToggle({ label, checked = false, onChange, className }: FeatureToggleProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-accent"
      />
      <Label className="cursor-pointer font-normal">{label}</Label>
    </label>
  );
}
