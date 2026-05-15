"use client";

import { HeaderCompactSearch } from "@/components/layout/header-compact-search";
import { HeaderMobileSearch } from "@/components/layout/header-mobile-search";

type ListingsPageSearchProps = {
  cities: string[];
  defaultQuery?: string;
  defaultCategory?: string;
  defaultCity?: string;
};

export function ListingsPageSearch({
  cities,
  defaultQuery = "",
  defaultCategory = "",
  defaultCity = "",
}: ListingsPageSearchProps) {
  const defaults = {
    defaultQuery,
    defaultCategory,
    defaultCity,
    cities,
  };

  return (
    <>
      <HeaderMobileSearch
        {...defaults}
        showFilters
        className="w-full lg:hidden"
      />
      <HeaderCompactSearch
        {...defaults}
        className="hidden w-full lg:flex"
      />
    </>
  );
}
