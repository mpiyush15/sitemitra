"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { PlanBadge } from "@/components/ui/plan-badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  assignAdminBusinessPlan,
  fetchAdminBusinesses,
  setAdminBusinessFeatured,
  setAdminBusinessListingActive,
  type AdminBusinessRow,
} from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import { getProfile } from "@/lib/auth";
import { MEMBERSHIP_PLANS, ROLES } from "@/lib/constants";

type FeaturedFilter = "all" | "featured" | "not_featured";

export function BusinessesAdminPanel() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";

  const [businesses, setBusinesses] = useState<AdminBusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [listingSavingId, setListingSavingId] = useState("");
  const [featuredSavingId, setFeaturedSavingId] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [searchQ, setSearchQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [cityFilter, setCityFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([getProfile(), fetchAdminBusinesses()])
      .then(([profile, rows]) => {
        if (cancelled) return;
        setIsSuperAdmin(profile.user.role === ROLES.SUPER_ADMIN);
        setBusinesses(rows);
      })
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load businesses"),
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set(businesses.map((b) => b.category).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [businesses]);

  const cityOptions = useMemo(() => {
    const set = new Set(businesses.map((b) => b.city).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    return businesses.filter((b) => {
      if (categoryFilter && b.category !== categoryFilter) return false;
      if (cityFilter && b.city !== cityFilter) return false;
      if (featuredFilter === "featured" && !b.isFeatured) return false;
      if (featuredFilter === "not_featured" && b.isFeatured) return false;
      if (!q) return true;
      const hay = `${b.businessName} ${b.category} ${b.city} ${b.email} ${b.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [businesses, searchQ, categoryFilter, cityFilter, featuredFilter]);

  const stats = useMemo(() => {
    const rows = filteredBusinesses;
    const total = rows.length;
    const featured = rows.filter((b) => b.isFeatured).length;
    const published = rows.filter((b) => b.isPublished).length;
    const active = rows.filter((b) => b.isActive).length;
    return [
      { label: "Total businesses", value: total },
      { label: "Featured", value: featured },
      { label: "Published", value: published },
      { label: "Active on platform", value: active },
    ];
  }, [filteredBusinesses]);

  async function onPlanChange(businessId: string, planSlug: string) {
    setSavingId(businessId);
    setError("");
    try {
      await assignAdminBusinessPlan(businessId, planSlug);
      setBusinesses((rows) =>
        rows.map((row) =>
          row.id === businessId ? { ...row, membershipType: planSlug } : row,
        ),
      );
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not assign plan");
    } finally {
      setSavingId("");
    }
  }

  async function onListingToggle(businessId: string, nextActive: boolean) {
    setListingSavingId(businessId);
    setError("");
    try {
      await setAdminBusinessListingActive(businessId, nextActive);
      setBusinesses((rows) =>
        rows.map((row) => (row.id === businessId ? { ...row, isActive: nextActive } : row)),
      );
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update listing visibility");
    } finally {
      setListingSavingId("");
    }
  }

  async function onFeaturedToggle(businessId: string, nextFeatured: boolean) {
    setFeaturedSavingId(businessId);
    setError("");
    try {
      await setAdminBusinessFeatured(businessId, nextFeatured);
      setBusinesses((rows) =>
        rows.map((row) => (row.id === businessId ? { ...row, isFeatured: nextFeatured } : row)),
      );
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update featured status");
    } finally {
      setFeaturedSavingId("");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          These counts use the same search and filters as the table below.
        </p>
        <AdminStatsCards stats={stats} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="admin-biz-search" className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <Input
            id="admin-biz-search"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Name, category, city, email…"
            className="h-9"
          />
        </div>
        <div>
          <label htmlFor="admin-biz-cat" className="mb-1 block text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Select
            id="admin-biz-cat"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9"
          >
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="admin-biz-city" className="mb-1 block text-xs font-medium text-muted-foreground">
            City
          </label>
          <Select
            id="admin-biz-city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-9"
          >
            <option value="">All cities</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="admin-biz-featured" className="mb-1 block text-xs font-medium text-muted-foreground">
            Featured
          </label>
          <Select
            id="admin-biz-featured"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as FeaturedFilter)}
            className="h-9"
          >
            <option value="all">All</option>
            <option value="featured">Featured only</option>
            <option value="not_featured">Not featured</option>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredBusinesses.length}</span> of{" "}
        <span className="font-semibold text-foreground">{businesses.length}</span> businesses
        {isSuperAdmin ? (
          <span className="hidden sm:inline">
            {" "}
            — pick rows from this list to toggle <span className="font-medium text-foreground">Featured</span> for
            the homepage.
          </span>
        ) : null}
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Assign</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map((business) => (
              <tr key={business.id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{business.businessName}</td>
                <td className="px-4 py-3 text-muted-foreground">{business.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{business.city}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {business.isPublished ? "Yes" : "Draft"}
                </td>
                <td className="px-4 py-3">
                  {isSuperAdmin ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={listingSavingId === business.id}
                      onClick={() => onListingToggle(business.id, !business.isActive)}
                    >
                      {listingSavingId === business.id ? (
                        <Spinner className="h-4 w-4" />
                      ) : business.isActive ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">
                      {business.isActive ? "Active" : "Hidden"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isSuperAdmin ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={
                        business.isFeatured
                          ? "border-amber-600 bg-amber-50 font-semibold text-amber-900 hover:bg-amber-100"
                          : ""
                      }
                      disabled={featuredSavingId === business.id}
                      onClick={() => onFeaturedToggle(business.id, !business.isFeatured)}
                    >
                      {featuredSavingId === business.id ? (
                        <Spinner className="h-4 w-4" />
                      ) : business.isFeatured ? (
                        "Featured"
                      ) : (
                        "Set featured"
                      )}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">{business.isFeatured ? "Yes" : "No"}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={business.membershipType} />
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                    value={business.membershipType}
                    disabled={savingId === business.id}
                    onChange={(event) => onPlanChange(business.id, event.target.value)}
                  >
                    <option value={MEMBERSHIP_PLANS.FREE}>Free</option>
                    <option value={MEMBERSHIP_PLANS.STANDARD}>Standard</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {businesses.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No businesses registered yet.</p>
        ) : filteredBusinesses.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No businesses match these filters.</p>
        ) : null}
      </div>
    </div>
  );
}
