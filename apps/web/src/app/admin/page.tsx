"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { Spinner } from "@/components/ui/spinner";
import { fetchPlatformAnalytics, type PlatformAnalytics } from "@/lib/analytics";
import { ApiClientError } from "@/lib/api";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PlatformAnalytics | null>(null);

  useEffect(() => {
    fetchPlatformAnalytics()
      .then(setData)
      .catch((err) => {
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Could not load platform analytics.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">Platform Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          High-level analytics and top performers across the entire platform.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : data ? (
        <>
          {/* Main Stats */}
          <AdminStatsCards
            stats={[
              { label: "Total Businesses", value: data.businessesCount },
              { label: "Total Users", value: data.usersCount },
              { label: "Total Reviews", value: data.reviewsCount },
              { label: "Total Enquiries", value: data.enquiriesTotal },
              { label: "Profile Visits", value: data.profileVisitors },
              { label: "Unique Visitors", value: data.uniqueVisitors },
            ]}
            className="sm:grid-cols-2 lg:grid-cols-3"
          />

          {/* Leaderboards Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Top Businesses */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-card-foreground">Top 5 Businesses</h3>
              {data.topBusinesses?.length > 0 ? (
                <div className="space-y-4">
                  {data.topBusinesses.map((b, idx) => (
                    <Link
                      key={b.id}
                      href={`/admin/businesses?category=${encodeURIComponent(b.category)}`}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium text-sm text-card-foreground">
                          {b.businessName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {b.category} • {b.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          {b.rating?.toFixed(1)} <FaStar className="h-3 w-3 fill-amber-400 text-amber-400" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">{b.totalReviews} reviews</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No businesses found.</p>
              )}
            </div>

            {/* Top Categories */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-card-foreground">Top 5 Categories</h3>
              {data.topCategories?.length > 0 ? (
                <div className="space-y-4">
                  {data.topCategories.map((c, idx) => (
                    <Link
                      key={c.id}
                      href={`/admin/businesses?category=${encodeURIComponent(c.categoryName)}`}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-xl">
                        {c.icon}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium text-sm text-card-foreground">
                          {c.categoryName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {c.businessCount}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No categories found.</p>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">Recent Reviews</h3>
                <Link href="/admin/reviews" className="text-xs font-medium text-primary hover:underline">
                  View all
                </Link>
              </div>
              {data.recentReviews?.length > 0 ? (
                <div className="space-y-4">
                  {data.recentReviews.map((r) => (
                    <div key={r.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="overflow-hidden">
                          <p className="truncate text-sm font-medium text-card-foreground">
                            {r.customerName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            on <span className="font-medium text-foreground">{r.businessName}</span>
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-3 w-3 ${i < r.rating ? "fill-current" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs italic text-muted-foreground">
                        &quot;{r.reviewText}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
