import { DM_Sans, Playfair_Display } from "next/font/google";
import { MarketplaceSiteHeader } from "@/features/marketplace/components/marketplace-site-header";
import { MarketplaceAuthProvider } from "@/features/marketplace/context/marketplace-auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${dmSans.variable} min-h-screen bg-[#faf8f3] font-[family-name:var(--font-dm-sans)]`}
    >
      <MarketplaceAuthProvider>
        <MarketplaceSiteHeader embedded />
        {children}
      </MarketplaceAuthProvider>
    </div>
  );
}
