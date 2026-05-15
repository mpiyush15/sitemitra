import { WHY_CHOOSE_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

type WhyChooseSectionProps = {
  className?: string;
};

export function WhyChooseSection({ className }: WhyChooseSectionProps) {
  return (
    <section id="why-choose" className={cn("space-y-8", className)}>
      <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Trust & mission</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Why choose Site Mitra
        </h2>
        <p className="mt-2 text-muted-foreground">
          We simplify finding trusted construction professionals while helping businesses grow in one
          digital network.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {WHY_CHOOSE_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-muted/30 p-5 text-center sm:p-6 sm:text-left"
          >
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
