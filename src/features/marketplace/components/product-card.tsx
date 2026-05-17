"use client";

import Link from "next/link";
import { Gavel, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ListingCard } from "../types";
import { BidCountdown } from "./bid-countdown";

type ProductCardProps = {
  listing: ListingCard;
  onBidNow: (listingId: string) => void;
};

export function ProductCard({ listing, onBidNow }: ProductCardProps) {
  const price = listing.currentBid ?? listing.startPrice;
  const image =
    listing.images[0] ??
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600";

  return (
    <Card className="group flex flex-col overflow-hidden border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-leaf-soft hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-mint">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge variant="live" className="absolute left-3 top-3 gap-1 uppercase">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-forest-deep" />
          Live
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-foreground">
            {listing.title}
          </h3>
          <p className="text-xs font-medium uppercase tracking-wide text-leaf">
            {listing.category.type} · {listing.category.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-leaf" />
          {listing.farmer.name} · {listing.district}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-3 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Current bid
            </p>
            <p className="text-lg font-extrabold text-primary">
              LKR {price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Floor / unit
            </p>
            <p className="font-medium text-foreground">
              LKR {listing.floorPricePerUnit.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {listing.quantity} {listing.unit} available · Start LKR{" "}
          {listing.startPrice.toLocaleString()}
        </p>

        <div className="flex items-center justify-between">
          <BidCountdown endsAt={listing.bidEndsAt} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {listing.bidCount} bids
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => onBidNow(listing.id)}
          >
            <Gavel className="h-4 w-4" />
            Bid Now
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/marketplace/${listing.id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
