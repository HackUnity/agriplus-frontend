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
    <Card className="group flex flex-col overflow-hidden bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-accent">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="warning"
          className="absolute left-3 top-3 shadow-sm"
        >
          <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-warning-foreground/80" />
          Live
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-semibold text-primary-strong">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {listing.category.type} · {listing.category.name}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {listing.farmer.name} · {listing.district}
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/60 p-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Current bid</p>
            <p className="font-bold text-primary-strong">
              LKR {price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Floor / unit</p>
            <p className="font-medium text-foreground">
              LKR {listing.floorPricePerUnit.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {listing.quantity} {listing.unit} available · Start LKR{" "}
          {listing.startPrice.toLocaleString()}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <BidCountdown endsAt={listing.bidEndsAt} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {listing.bidCount} bids
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => onBidNow(listing.id)}
          >
            <Gavel className="mr-1 h-4 w-4" />
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
