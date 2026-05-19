"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMarketplaceRole } from "../hooks/use-marketplace-role";

const BUYER_BLOCKED_PREFIXES = [
  "/dashboard",
  "/projects",
  "/sell",
  "/settings",
];
// /notifications and /marketplace-orders are allowed for buyers

/** Keep marketplace buyers on marketplace-only routes. */
export function BuyerRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isBuyer, isFarmer } = useMarketplaceRole();

  useEffect(() => {
    if (loading || isFarmer || !isBuyer) return;
    const blocked = BUYER_BLOCKED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    if (blocked) {
      router.replace("/marketplace-orders");
    }
  }, [loading, isBuyer, isFarmer, pathname, router]);

  return <>{children}</>;
}
