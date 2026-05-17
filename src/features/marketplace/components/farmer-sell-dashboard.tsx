"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Gavel,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketplaceApi } from "../api";
import type { ListingCard } from "../types";
import { SellListingForm } from "./sell-listing-form";
import { BidCountdown } from "./bid-countdown";
import { cn } from "@/lib/utils";

type Tab = "add" | "listings" | "activity";

type Dashboard = {
  listings: (ListingCard & { status: string })[];
  recentBids: {
    id: string;
    listingId: string;
    listingTitle: string;
    amount: number;
    placedAt: string;
    bidderLabel: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  sales: {
    listingId: string;
    title: string;
    listingStatus: string;
    currentBid: number | null;
    orderId: string | null;
    orderStatus: string | null;
    winningBid: number | null;
    buyerDistrict: string | null;
    buyerName: string | null;
  }[];
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-success-soft text-success border-transparent",
  PENDING_APPROVAL: "bg-warning-soft text-warning-foreground border-transparent",
  SOLD: "bg-info-soft text-info border-transparent",
  ENDED: "bg-muted text-muted-foreground border-transparent",
  CANCELLED: "bg-destructive-soft text-destructive border-transparent",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ");
}

export function FarmerSellDashboard() {
  const [tab, setTab] = useState<Tab>("add");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["farmer-sell-dashboard"],
    queryFn: () => marketplaceApi.farmerSellDashboard(),
    refetchInterval: 8000,
  });

  const dashboard = data as Dashboard | undefined;

  async function markDispatched(orderId: string) {
    try {
      await marketplaceApi.confirmOrder(orderId, "mark_dispatched");
      toast.success("Marked as dispatched");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  function onListingCreated() {
    toast.success("Listing published!");
    void queryClient.invalidateQueries({ queryKey: ["farmer-sell-dashboard"] });
    void queryClient.invalidateQueries({ queryKey: ["listings"] });
    setTab("listings");
  }

  const tabs: { id: Tab; label: string; icon: typeof PlusCircle; badge?: number }[] = [
    { id: "add", label: "Add listing", icon: PlusCircle },
    {
      id: "listings",
      label: "My listings",
      icon: Package,
      badge: dashboard?.listings.length,
    },
    {
      id: "activity",
      label: "Bids & sales",
      icon: Gavel,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {badge != null && badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  tab === id
                    ? "bg-white/20 text-white"
                    : "bg-accent text-primary-strong",
                )}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "add" && <SellListingForm onSuccess={onListingCreated} />}

      {tab === "listings" && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-primary-strong">
            Your listings
          </h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !dashboard?.listings.length ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No listings yet. Use &quot;Add listing&quot; to publish your first
                product.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {dashboard.listings.map((listing) => {
                const price = listing.currentBid ?? listing.startPrice;
                const img =
                  listing.images[0] ??
                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400";
                return (
                  <Card
                    key={listing.id}
                    className="overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex gap-4 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="line-clamp-1 font-semibold text-primary-strong">
                            {listing.title}
                          </h3>
                          <Badge
                            className={cn(
                              "shrink-0 capitalize",
                              STATUS_STYLES[listing.status] ?? "",
                            )}
                          >
                            {statusLabel(listing.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {listing.quantity} {listing.unit} · {listing.district}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {listing.currentBid
                            ? `Current bid: LKR ${price.toLocaleString()}`
                            : `Start: LKR ${listing.startPrice.toLocaleString()}`}
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            · {listing.bidCount} bids
                          </span>
                        </p>
                        {listing.status === "ACTIVE" && (
                          <BidCountdown endsAt={listing.bidEndsAt} />
                        )}
                        <Button asChild variant="ghost" size="sm" className="h-auto p-0">
                          <Link href={`/marketplace/${listing.id}`}>View on marketplace</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === "activity" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-primary-strong">
              <Gavel className="h-5 w-5 text-warning" />
              Recent bids
            </h2>
            {!dashboard?.recentBids.length ? (
              <p className="text-sm text-muted-foreground">
                When buyers bid on your produce, updates appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {dashboard.recentBids.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 text-sm shadow-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {b.listingTitle}
                      </p>
                      <p className="text-muted-foreground">
                        {b.bidderLabel} ·{" "}
                        {new Date(b.placedAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-primary-strong">
                      LKR {b.amount.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-primary-strong">
              <ShoppingBag className="h-5 w-5 text-warning" />
              Sales & confirmations
            </h2>
            {!dashboard?.sales.length ? (
              <p className="text-sm text-muted-foreground">
                Completed or ended auctions will show here with buyer and payment
                status.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {dashboard.sales.map((sale) => (
                  <Card key={sale.listingId} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between gap-2 text-base">
                        <span className="line-clamp-1">{sale.title}</span>
                        <Badge
                          className={cn(
                            "shrink-0 capitalize",
                            STATUS_STYLES[sale.listingStatus] ?? "",
                          )}
                        >
                          {statusLabel(sale.listingStatus)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {sale.winningBid != null && (
                        <p className="flex items-center gap-1 font-medium text-primary-strong">
                          <TrendingUp className="h-4 w-4 text-warning" />
                          Winning bid: LKR {sale.winningBid.toLocaleString()}
                        </p>
                      )}
                      {sale.orderStatus && (
                        <p>
                          Order:{" "}
                          <span className="font-medium capitalize text-foreground">
                            {statusLabel(sale.orderStatus)}
                          </span>
                        </p>
                      )}
                      {sale.buyerDistrict && (
                        <p className="text-muted-foreground">
                          Buyer: {sale.buyerName ?? "Pending"} · {sale.buyerDistrict}
                        </p>
                      )}
                      {sale.orderId && sale.orderStatus === "PAYMENT_CONFIRMED" && (
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => void markDispatched(sale.orderId!)}
                        >
                          Mark ready for dispatch
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
