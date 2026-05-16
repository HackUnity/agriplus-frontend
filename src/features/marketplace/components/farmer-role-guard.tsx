"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMarketplaceRole } from "../hooks/use-marketplace-role";

export function FarmerRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, isFarmer, user } = useMarketplaceRole();

  useEffect(() => {
    if (!loading && user && !isFarmer) {
      router.replace("/marketplace-orders");
    }
  }, [loading, user, isFarmer, router]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Checking account…</p>
    );
  }

  if (user && !isFarmer) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-6 text-sm">
        <p className="font-medium text-[#1B4332]">Farmer tools only</p>
        <p className="mt-2 text-muted-foreground">
          Buyer accounts can bid on listings and complete purchases after winning.
          To list produce, register or sign in as a farmer on the marketplace.
        </p>
        <Link
          href="/marketplace-orders"
          className="mt-4 inline-block text-[#1B4332] underline"
        >
          View your orders
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
