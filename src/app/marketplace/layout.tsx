import { MarketplaceSiteHeader } from "@/features/marketplace/components/marketplace-site-header";
import { MarketplaceAuthProvider } from "@/features/marketplace/context/marketplace-auth";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceAuthProvider>
        <MarketplaceSiteHeader embedded />
        {children}
      </MarketplaceAuthProvider>
    </div>
  );
}
