import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Join Site Mitra — grow your construction business</h2>
        <p className="text-primary-foreground/80">
          List your business, get discovered in Akola & Amravati, and get verified for
          priority visibility, gallery, and leads.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/?auth=register-business" className="w-full sm:w-auto">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:min-w-[180px]">
              List Your Business
            </Button>
          </Link>
          <Link href="/listings" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:min-w-[180px]"
            >
              Find Professionals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
