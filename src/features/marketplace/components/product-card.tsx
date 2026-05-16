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
    <Card className="group overflow-hidden border-[#d9e2d2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#edf2e8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-[#F59E0B] text-[#1B4332]">
          Live
        </Badge>
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-semibold text-[#1B4332]">
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
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Current bid</p>
            <p className="font-bold text-[#1B4332]">
              LKR {price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Floor / unit</p>
            <p className="font-medium">
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
        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 bg-[#1B4332] hover:bg-[#2d6a4f]"
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
