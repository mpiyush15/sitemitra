import Image from "next/image";
import Link from "next/link";
import { HeroSearchBar } from "@/components/blocks/hero-search-bar";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT } from "@/lib/constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[560px] lg:min-h-[620px]">
      <Image
        src={HERO_IMAGE}
        alt="Construction site"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/75 to-primary/90" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-3 pb-14 pt-10 sm:px-4 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="w-full">
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/75 sm:text-left sm:text-xs">
            Search professionals
          </p>
          <HeroSearchBar />
        </div>

        <div className="mx-auto mt-7 flex max-w-4xl flex-1 flex-col justify-center space-y-5 text-center text-white sm:mt-9 lg:mt-11">
          <p className="text-sm font-medium uppercase tracking-widest text-white/85 sm:text-base">
            {HERO_CONTENT.eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {HERO_CONTENT.heading}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
            {HERO_CONTENT.subheading}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/listings">
              <Button className="w-full min-w-[160px] bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                Find Professionals
              </Button>
            </Link>
            <Link href="/?auth=register-business">
              <Button
                variant="outline"
                className="w-full min-w-[160px] border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
