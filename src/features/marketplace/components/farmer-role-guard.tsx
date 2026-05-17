"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sprout } from "lucide-react";
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
    return <p className="text-sm text-muted-foreground">Checking account…</p>;
  }

  if (user && !isFarmer) {
    return (
      <div className="rounded-2xl border border-weather/40 bg-weather/15 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-leaf">
            <Sprout className="h-5 w-5" />
          </span>
          <div className="space-y-2 text-sm">
            <p className="text-base font-bold text-foreground">
              Farmer tools only
            </p>
            <p className="text-muted-foreground">
              Buyer accounts can bid on listings and complete purchases after
              winning. To list produce, register or sign in as a farmer on the
              marketplace.
            </p>
            <Link
              href="/marketplace-orders"
              className="inline-block font-semibold text-primary underline"
            >
              View your orders →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
