import { DM_Sans, Playfair_Display } from "next/font/google";
import { MarketplaceAuthProvider } from "@/features/marketplace/context/marketplace-auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)]`}
    >
      <MarketplaceAuthProvider>{children}</MarketplaceAuthProvider>
    </div>
  );
}
