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
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-5 text-center text-white">
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

        <div className="mx-auto mt-10 w-full max-w-5xl lg:mt-14">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
