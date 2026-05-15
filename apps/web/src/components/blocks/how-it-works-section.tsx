import Link from "next/link";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type HowItWorksSectionProps = {
  className?: string;
};

export function HowItWorksSection({ className }: HowItWorksSectionProps) {
  return (
    <section className={cn("space-y-8", className)}>
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Simple process</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          How Site Mitra works
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Find and contact trusted construction professionals in your city — free to browse, no account needed.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((item) => (
          <div
            key={item.step}
            className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6 sm:text-left"
          >
            <span className="text-2xl font-bold text-accent/80">{item.step}</span>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 px-6 py-8 text-center">
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">
          Ready to find the right professional?
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Whether you are building a home, renovating, or sourcing materials — search by city and
          category, compare profiles, and contact businesses directly when you are ready.
        </p>
        <Link href="/listings" className="mt-5 inline-block">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Browse listings
          </Button>
        </Link>
      </div>
    </section>
  );
}
