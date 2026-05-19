import Link from "next/link";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PlanUpgradeLockProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PlanUpgradeLock({ title, description, className }: PlanUpgradeLockProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-accent/35 bg-muted/30 px-4 py-5 text-center sm:px-6",
        className,
      )}
    >
      <HiOutlineLockClosed className="mx-auto h-6 w-6 text-accent" aria-hidden />
      <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <Link href="/dashboard/upgrade" className="mt-4 inline-block">
        <Button type="button" size="sm" variant="outline" className="border-primary/25">
          Upgrade to Standard
        </Button>
      </Link>
    </div>
  );
}
