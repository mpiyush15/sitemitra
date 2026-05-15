import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryListingsPage({ params }: PageProps) {
  const { category } = await params;
  redirect(`/listings?category=${encodeURIComponent(category)}`);
}
