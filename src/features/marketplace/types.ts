export type MarketplaceUser = {
  userId: string;
  email: string;
  role: string;
  name: string;
  district: string;
};

export type ListingUnit = "kg" | "g" | "metric_ton" | "count";

export type ListingCard = {
  id: string;
  title: string;
  description: string | null;
  quantity: number;
  unit: string;
  district: string;
  images: string[];
  harvestDate: string;
  startPrice: number;
  currentBid: number | null;
  bidEndsAt: string;
  status: string;
  createdAt: string;
  farmer: { id: string; name: string; district: string };
  category: {
    id: string;
    type: string;
    name: string;
    minPriceKg: number;
    minPriceG: number;
    minPriceCount?: number | null;
  };
  floorPricePerUnit: number;
  bidCount: number;
};

export type ProductCategory = {
  id: string;
  type: string;
  name: string;
  minPriceKg: number;
  minPriceG: number;
  minPriceCount?: number | null;
};
