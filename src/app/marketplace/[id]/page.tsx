import { ListingDetail } from "@/features/marketplace/components/listing-detail";

type PageProps = { params: Promise<{ id: string }> };

export default async function MarketplaceListingPage({ params }: PageProps) {
  const { id } = await params;
  return <ListingDetail listingId={id} />;
}
