import { redirect } from "next/navigation";
import { slugToLabel } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string; city: string }>;
};

export default async function CategoryCityListingsPage({ params }: PageProps) {
  const { category, city } = await params;
  redirect(
    `/listings?category=${encodeURIComponent(category)}&city=${encodeURIComponent(slugToLabel(city))}`,
  );
}
