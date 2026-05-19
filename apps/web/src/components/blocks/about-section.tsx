import Image from "next/image";
import Link from "next/link";
import { ABOUT_CONTENT, SITE_NAME, SITE_PLATFORM_LINE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80";

type AboutSectionProps = {
  className?: string;
};

/** Brief homepage teaser — full story on /about */
export function AboutSection({ className }: AboutSectionProps) {
  return (
    <section id="about" className={cn("py-12 sm:py-14 lg:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {ABOUT_CONTENT.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              About {SITE_NAME}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {ABOUT_CONTENT.intro}
            </p>
            <p className="mt-2 text-sm font-medium text-primary/80">{SITE_PLATFORM_LINE}</p>
            <Link href="/about" className="mt-6 inline-block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Know more
              </Button>
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-md sm:aspect-[5/4] lg:aspect-[4/3]">
            <Image
              src={ABOUT_IMAGE}
              alt="Construction professionals collaborating on site plans"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
