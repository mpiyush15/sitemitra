import type { Metadata } from "next";
import { AboutPageContent } from "@/components/blocks/about-page-content";
import { buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildPageTitle("About"),
  description:
    "Learn about Site Mitra — India's construction network connecting homeowners with engineers, contractors, vendors, and professionals.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
