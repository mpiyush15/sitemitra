import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CityItem } from "@/types/api";

type CitiesSectionProps = {
  cities: CityItem[];
  className?: string;
};

export function CitiesSection({ cities, className }: CitiesSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">Cities we serve</h2>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold text-foreground sm:text-xl">
        {cities.map((city, index) => (
          <span key={city.id} className="inline-flex items-center gap-3">
            {index > 0 ? <span className="font-normal text-muted-foreground">|</span> : null}
            <Link
              href={`/listings?city=${encodeURIComponent(city.cityName)}`}
              className="text-primary transition-colors hover:text-accent"
            >
              {city.cityName}
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
