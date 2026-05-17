"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCT_TYPES } from "@/lib/marketplace/categories-data";
import { SRI_LANKA_DISTRICTS } from "@/lib/marketplace/districts";
import { cn } from "@/lib/utils";
import { marketplaceApi } from "../api";
import { useMarketplaceAuth } from "../context/marketplace-auth";
import type { ListingCard } from "../types";
import { AuthModal } from "./auth-modal";
import { ProductCard } from "./product-card";

const SORT_OPTIONS = [
  { value: "ending", label: "Ending soonest" },
  { value: "newest", label: "Newest" },
  { value: "bids", label: "Most bids" },
  { value: "price", label: "Lowest price" },
  { value: "nearest", label: "Nearest" },
] as const;

const QUICK_TYPES = ["Vegetables", "Fruits", "Grains", "Spices"] as const;

const fieldClass =
  "w-full appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors hover:border-leaf-soft focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

export function MarketplaceSection() {
  const router = useRouter();
  const { user } = useMarketplaceAuth();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [district, setDistrict] = useState("");
  const [sort, setSort] = useState("ending");
  const [endingSoon, setEndingSoon] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingListingId, setPendingListingId] = useState<string | null>(null);

  const queryKey = useMemo(
    () => ["listings", search, type, district, sort, endingSoon],
    [search, type, district, sort, endingSoon],
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      marketplaceApi.listings({
        search: search || undefined,
        type: type || undefined,
        district: district || undefined,
        sort,
        endingSoon: endingSoon ? "true" : undefined,
      }),
    refetchInterval: 5000,
  });

  const listings = data?.listings ?? [];

  const handleBidNow = useCallback(
    (listingId: string) => {
      if (!user) {
        setPendingListingId(listingId);
        setAuthOpen(true);
        return;
      }
      router.push(`/marketplace/${listingId}`);
    },
    [user, router],
  );

  const onAuthSuccess = useCallback(() => {
    if (pendingListingId) {
      router.push(`/marketplace/${pendingListingId}`);
      setPendingListingId(null);
    }
  }, [pendingListingId, router]);

  useEffect(() => {
    const onScroll = () => {
      if (document.getElementById("marketplace")) {
        void refetch();
      }
    };
    window.addEventListener("focus", onScroll);
    return () => window.removeEventListener("focus", onScroll);
  }, [refetch]);

  const hasFilters = Boolean(search || type || district || endingSoon);
  const clearAll = () => {
    setType("");
    setDistrict("");
    setSearch("");
    setEndingSoon(false);
  };

  return (
    <section
      id="marketplace"
      className="scroll-mt-20 bg-surface-muted/60 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-deep">
              <Sparkles className="h-3.5 w-3.5" />
              Live auctions
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Fresh produce marketplace
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              Bid on harvest-fresh goods from farmers across Sri Lanka. Prices
              update in real time — every 5 seconds.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            {QUICK_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType((cur) => (cur === t ? "" : t))}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  type === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-leaf-soft hover:text-primary",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Card className="mb-8 border-border bg-surface">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search product, farmer, district…"
                className="h-12 rounded-xl pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={cn(fieldClass, "h-12 lg:w-56")}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.value === "nearest" && !user}
                >
                  {opt.label}
                  {opt.value === "nearest" && !user ? " (login)" : ""}
                </option>
              ))}
            </select>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-5 self-start rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-leaf" />
              Filters
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </label>
              <select
                className={fieldClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All types</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                District
              </label>
              <select
                className={fieldClass}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">All districts</option>
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-surface-muted p-3 text-sm transition-colors hover:border-leaf-soft">
              <input
                type="checkbox"
                checked={endingSoon}
                onChange={(e) => setEndingSoon(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border-strong accent-primary"
              />
              <div>
                <p className="font-medium text-foreground">Ending within 24h</p>
                <p className="text-xs text-muted-foreground">
                  Show auctions closing today
                </p>
              </div>
            </label>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={clearAll}
            >
              Clear filters
            </Button>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                {isLoading
                  ? "Loading auctions…"
                  : `${listings.length} active auction${listings.length === 1 ? "" : "s"}`}
              </span>
              <span className="hidden sm:flex sm:items-center sm:gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
                Live · refreshes every 5s
              </span>
            </div>

            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[28rem] animate-pulse rounded-2xl border border-border bg-surface"
                  />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card className="border-dashed bg-surface">
                <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-primary">
                    <Search className="h-5 w-5" />
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    No active listings match your filters
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different district, type, or clear filters.
                  </p>
                  {hasFilters && (
                    <Button
                      variant="soft"
                      size="sm"
                      className="mt-2"
                      onClick={clearAll}
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing: ListingCard) => (
                  <ProductCard
                    key={listing.id}
                    listing={listing}
                    onBidNow={handleBidNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={onAuthSuccess}
      />
    </section>
  );
}
