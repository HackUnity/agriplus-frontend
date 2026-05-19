import { Leaf } from "lucide-react";
import { LandingCarousel } from "@/features/marketplace/components/landing-carousel";
import { LandingHero } from "@/features/marketplace/components/landing-hero";
import { MarketplaceSection } from "@/features/marketplace/components/marketplace-section";
import { MarketplaceSiteHeader } from "@/features/marketplace/components/marketplace-site-header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketplaceSiteHeader />

      <LandingHero />

      <LandingCarousel />

      <MarketplaceSection />

      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-base font-semibold text-primary">
            <Leaf className="h-4 w-4" />
            AgriPlus · AgriMarket
          </div>
          <p>© {new Date().getFullYear()} AgriPlus. Built for Sri Lankan farmers.</p>
        </div>
      </footer>
    </main>
  );
}
