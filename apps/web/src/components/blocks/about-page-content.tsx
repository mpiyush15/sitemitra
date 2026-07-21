"use client";

import Link from "next/link";
import {
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { ABOUT_CONTENT, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { useCities } from "@/hooks/use-cities";

export function AboutPageContent() {
  const { cityNames } = useCities();
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.05] via-transparent to-transparent"
      />

      {/* Hero */}
      <section className="relative border-b border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {ABOUT_CONTENT.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {ABOUT_CONTENT.title}
          </h1>
          <p className="mt-2 text-sm font-medium text-foreground/80">{SITE_TAGLINE}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{ABOUT_CONTENT.intro}</p>
        </div>
      </section>

      {/* Three boxes — one row on desktop */}
      <section className="relative border-b border-border bg-muted/15">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            <InfoCard
              icon={HiOutlineBuildingOffice2}
              title={ABOUT_CONTENT.purpose.title}
              body={ABOUT_CONTENT.purpose.body}
              footer={cityNames.length > 0 ? `Serving ${cityNames.join(" & ")}.` : "Serving you."}
            />
            <InfoCard
              icon={HiOutlineUserGroup}
              title={ABOUT_CONTENT.forCustomers.title}
              items={ABOUT_CONTENT.forCustomers.items}
            />
            <InfoCard
              icon={HiOutlineBuildingOffice2}
              title={ABOUT_CONTENT.forProfessionals.title}
              items={ABOUT_CONTENT.forProfessionals.items}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Join {SITE_NAME} — whether you are building a home or growing your construction business.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/listings">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse listings
              </Button>
            </Link>
            <Link href="/?auth=register-business">
              <Button variant="outline">List your business</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  footer,
  items,
}: {
  icon: typeof HiOutlineUserGroup;
  title: string;
  body?: string;
  footer?: string;
  items?: readonly string[];
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="text-base font-bold leading-snug text-foreground sm:text-lg">{title}</h2>
      </div>
      {body ? (
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      ) : null}
      {items ? (
        <ul className="mt-4 flex-1 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {footer ? <p className="mt-4 text-xs text-muted-foreground">{footer}</p> : null}
    </article>
  );
}
