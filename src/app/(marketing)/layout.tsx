import { MarketplaceAuthProvider } from "@/features/marketplace/context/marketplace-auth";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <MarketplaceAuthProvider>{children}</MarketplaceAuthProvider>
    </div>
  );
}
