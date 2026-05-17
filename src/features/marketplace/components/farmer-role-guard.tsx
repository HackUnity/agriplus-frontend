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
      <div className="rounded-lg border border-warning/40 bg-warning-soft/60 p-6 text-sm shadow-sm">
        <p className="font-semibold text-warning-foreground">
          Farmer tools only
        </p>
        <p className="mt-2 leading-6 text-muted-foreground">
          Buyer accounts can bid on listings and complete purchases after winning.
          To list produce, register or sign in as a farmer on the marketplace.
        </p>
        <Link
          href="/marketplace-orders"
          className="mt-4 inline-block font-medium text-primary underline-offset-4 hover:underline"
        >
          View your orders
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
