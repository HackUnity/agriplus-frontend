"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LayoutDashboard, MapPin, Truck } from "lucide-react";
import { hasToken } from "@/lib/auth/token";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketplaceApi } from "../api";
import { useMarketplaceAuth } from "../context/marketplace-auth";
import { AuthModal } from "./auth-modal";
import { BidCountdown } from "./bid-countdown";

function quantityToKg(quantity: number, unit: string) {
  if (unit === "g") return quantity / 1000;
  if (unit === "metric_ton") return quantity * 1000;
  return quantity;
}

export function ListingDetail({ listingId }: { listingId: string }) {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useMarketplaceAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => marketplaceApi.listing(listingId),
    refetchInterval: 3000,
  });

  const { data: bidsData, refetch: refetchBids } = useQuery({
    queryKey: ["bids", listingId],
    queryFn: () => marketplaceApi.bids(listingId),
    refetchInterval: 3000,
  });

  const listing = data?.listing;
  const auctionClosed =
    data?.auctionClosed || (listing?.status !== "ACTIVE" && listing?.status !== "PENDING_APPROVAL");
  const winnerName = data?.winnerName;
  const bids = bidsData?.bids ?? [];
  const current = listing?.currentBid ?? listing?.startPrice ?? 0;
  const suggested = current + 50;

  useEffect(() => {
    if (!user?.district || !listing?.district) return;
    marketplaceApi
      .distance(user.district, listing.district)
      .then((r) => setDistanceKm(r.km))
      .catch(() => setDistanceKm(null));
  }, [user?.district, listing?.district]);

  const transportCost = useMemo(() => {
    if (distanceKm == null || !listing) return 0;
    const kg = quantityToKg(listing.quantity, listing.unit);
    return Math.round(distanceKm * kg * 0.5);
  }, [distanceKm, listing]);

  const placeBid = useCallback(async () => {
    const amount = Number(bidAmount);
    if (!listing) return;
    try {
      const res = await marketplaceApi.placeBid(listingId, amount);
      if (res.warning) toast.warning(res.warning);
      toast.success(`Bid placed: LKR ${amount.toLocaleString()}`);
      setConfirmOpen(false);
      setBidAmount("");
      void refetch();
      void refetchBids();
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bid failed");
    }
  }, [bidAmount, listing, listingId, queryClient, refetch, refetchBids]);

  if (isLoading || authLoading) {
    return <p className="p-8 text-center text-muted-foreground">Loading…</p>;
  }

  if (!listing) {
    return (
      <p className="p-8 text-center">
        Listing not found.{" "}
        <Link
          href="/#marketplace"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to marketplace
        </Link>
      </p>
    );
  }

  const totalEstimate = Number(bidAmount || suggested) + transportCost;
  const image =
    listing.images[0] ??
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800";

  function openBidFlow() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setBidAmount(String(suggested));
    setConfirmOpen(true);
  }

  const isOwnListing =
    Boolean(user?.userId) && user?.userId === listing.farmer.id;
  const isFarmer =
    user?.role?.toLowerCase() === "farmer" ||
    user?.role?.toLowerCase() === "admin";
  const showAccountLinks = Boolean(user) || hasToken();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {showAccountLinks && (
          <>
            {isFarmer && (
              <Button asChild variant="outline" size="sm">
                <Link href="/sell">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Sell dashboard
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace-orders">My orders</Link>
            </Button>
          </>
        )}
        <Button asChild variant="ghost" size="sm">
          <Link href="/#marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to marketplace
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-accent shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={listing.title} className="aspect-square w-full object-cover" />
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {listing.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          )}
          <p className="mt-6 leading-7 text-muted-foreground">
            {listing.description}
          </p>
        </div>

        <div className="space-y-6">
          {auctionClosed && (
            <Card className="border-warning/40 bg-warning-soft">
              <CardContent className="p-4 text-sm">
                <p className="font-semibold text-warning-foreground">
                  Auction ended
                </p>
                <p className="mt-1 text-muted-foreground">
                  This listing is no longer on the marketplace.
                  {listing.status === "SOLD" && winnerName
                    ? ` Sold to ${winnerName} (highest bid).`
                    : listing.status === "ENDED"
                      ? " It ended with no winning bid."
                      : null}
                </p>
                {user && (
                  <Link
                    href="/marketplace-orders"
                    className="mt-2 inline-block font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Check My bids & orders
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
          <div>
            <BidCountdown endsAt={listing.bidEndsAt} />
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-primary-strong">
              {listing.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {listing.category.type} · {listing.category.name}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {listing.farmer.name} · {listing.district}
          </div>

          <Card className="shadow-sm">
            <CardContent className="grid grid-cols-2 gap-4 p-5 text-sm">
              <div>
                <p className="text-muted-foreground">Current bid</p>
                <p className="text-xl font-bold text-primary-strong">
                  LKR {(listing.currentBid ?? listing.startPrice).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Floor / unit</p>
                <p className="font-medium text-foreground">
                  LKR {listing.floorPricePerUnit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium text-foreground">
                  {listing.quantity} {listing.unit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bids</p>
                <p className="font-medium text-foreground">{listing.bidCount}</p>
              </div>
            </CardContent>
          </Card>

          {user && distanceKm != null && (
            <Card className="border-warning/30 bg-warning-soft/60">
              <CardContent className="flex gap-3 p-4 text-sm">
                <Truck className="h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="font-medium text-foreground">
                    ~{distanceKm} km from {user.district} to {listing.district}
                  </p>
                  <p className="text-muted-foreground">
                    Est. transport: LKR {transportCost.toLocaleString()} (0.5 LKR/km/kg)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isOwnListing && (
            <p className="text-sm text-warning-foreground">
              You cannot bid on your own listing. Other farmers and buyers can bid.
            </p>
          )}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Suggested bid: LKR {suggested.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min ${suggested}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <Button
                onClick={openBidFlow}
                disabled={auctionClosed || listing.status !== "ACTIVE" || isOwnListing}
              >
                {isOwnListing ? "Your listing" : "Place bid"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bid history</CardTitle>
            </CardHeader>
            <CardContent className="max-h-48 overflow-y-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Bidder</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((b) => (
                    <tr key={b.id} className="border-b">
                      <td className="p-3">{b.bidderLabel}</td>
                      <td className="p-3 font-medium">
                        LKR {b.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(b.placedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle>Confirm your bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                You are bidding{" "}
                <strong className="text-foreground">
                  LKR {Number(bidAmount).toLocaleString()}
                </strong>{" "}
                for {listing.quantity} {listing.unit} of {listing.title} from{" "}
                {listing.district}.
              </p>
              <p>Estimated transport: LKR {transportCost.toLocaleString()}</p>
              <p className="font-semibold">
                Total estimated cost: LKR {totalEstimate.toLocaleString()}
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void placeBid()}>Confirm bid</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          setBidAmount(String(suggested));
          setConfirmOpen(true);
        }}
      />
    </div>
  );
}
