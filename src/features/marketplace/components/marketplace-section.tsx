"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRODUCT_TYPES } from "@/lib/marketplace/categories-data";
import { SRI_LANKA_DISTRICTS } from "@/lib/marketplace/districts";
import { marketplaceApi } from "../api";
import { useMarketplaceAuth } from "../context/marketplace-auth";
import type { ListingCard } from "../types";
import { AuthModal } from "./auth-modal";
import { ProductCard } from "./product-card";

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

  return (
    <section id="marketplace" className="scroll-mt-20 bg-[#faf8f3] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F59E0B]">
            Live auctions
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#1B4332] sm:text-4xl">
            Fresh produce marketplace
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Bid on harvest-fresh goods from farmers across Sri Lanka. Prices update
            in real time.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search product, farmer, district…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-input bg-white px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="ending">Ending soonest</option>
            <option value="newest">Newest</option>
            <option value="bids">Most bids</option>
            <option value="price">Lowest price</option>
            <option value="nearest" disabled={!user}>
              Nearest {user ? "" : "(login)"}
            </option>
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4 rounded-xl border border-[#d9e2d2] bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#1B4332]">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </p>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm"
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
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                District
              </label>
              <select
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm"
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={endingSoon}
                onChange={(e) => setEndingSoon(e.target.checked)}
              />
              Ending within 24h
            </label>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setType("");
                setDistrict("");
                setSearch("");
                setEndingSoon(false);
              }}
            >
              Clear filters
            </Button>
          </aside>

          <div>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading listings…</p>
            ) : listings.length === 0 ? (
              <p className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                No active listings match your filters.
              </p>
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
