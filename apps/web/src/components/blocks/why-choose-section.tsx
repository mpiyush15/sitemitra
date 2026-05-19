import Link from "next/link";
import {
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiOutlineHomeModern,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import {
  WHY_CHOOSE_ITEMS,
  WHY_CHOOSE_STATS,
  WHY_CHOOSE_TRUST_POINTS,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

const ICON_MAP = {
  network: HiOutlineBuildingOffice2,
  local: HiOutlineMapPin,
  trust: HiOutlineShieldCheck,
  simple: HiOutlineHomeModern,
} as const;

type WhyChooseSectionProps = {
  className?: string;
};

export function WhyChooseSection({ className }: WhyChooseSectionProps) {
  return (
    <section
      id="why-choose"
      className={cn(
        "relative overflow-hidden border-y border-primary/10 bg-gradient-to-b from-slate-50 via-background to-slate-50/80 py-16 sm:py-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/[0.06] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Trust & mission
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Why choose Site Mitra
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            India&apos;s construction network built for clarity — helping homeowners and builders find
            the right professionals with confidence, not guesswork.
          </p>
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-sm lg:grid-cols-4">
          {WHY_CHOOSE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-card px-4 py-6 text-center sm:px-6 sm:py-7"
            >
              <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {stat.value}
                <span className="ml-1 text-base font-semibold text-accent sm:text-lg">
                  {stat.suffix}
                </span>
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md sm:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/[0.06] transition-transform duration-300 group-hover:scale-110"
                />
                <div className="relative flex gap-4 sm:gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/10 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {item.highlight}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-foreground sm:text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Trust footer strip */}
        <div className="rounded-2xl border border-primary/15 bg-primary px-6 py-8 text-center shadow-lg sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            The Site Mitra promise
          </p>
          <ul className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
            {WHY_CHOOSE_TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/95 sm:text-base"
              >
                <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-accent-soft" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/listings">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Browse professionals
              </Button>
            </Link>
            <Link href="/?auth=register-business">
              <Button
                size="lg"
                variant="outline"
                className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                List your business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
