import Link from "next/link";
import { CategoryIcon } from "@/components/icons/category-icon";
import type { CategoryItem } from "@/types/api";

export type CategoryGridItem = CategoryItem & { iconKey?: string };

type CategoryGridProps = {
  categories: CategoryGridItem[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Categories will appear once connected to database.</p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((category) => {
        const iconKey =
          category.iconKey ??
          ("icon" in category && typeof category.icon === "string" ? category.icon : "building");

        return (
          <Link
            key={category.id}
            href={`/listings/${category.slug}`}
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-2 text-center transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:gap-3 sm:rounded-2xl sm:p-4 lg:p-5"
          >
            <CategoryIcon
              iconKey={iconKey}
              size="md"
              className="transition-colors group-hover:bg-accent group-hover:text-white sm:h-14 sm:w-14 sm:text-3xl lg:h-16 lg:w-16 lg:text-4xl"
            />
            <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-foreground sm:text-xs lg:text-sm">
              {category.categoryName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
