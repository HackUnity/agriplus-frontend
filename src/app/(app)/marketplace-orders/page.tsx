"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BuyerDashboard } from "@/features/marketplace/components/buyer-dashboard";
import { marketplaceApi } from "@/features/marketplace/api";
import { useMarketplaceRole } from "@/features/marketplace/hooks/use-marketplace-role";
import { getToken } from "@/lib/auth/token";

type FarmerSale = {
  listingId: string;
  title: string;
  status?: string;
  orderId?: string;
  winner?: { name?: string; district?: string };
};

function FarmerOrdersSection() {
  const { data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => marketplaceApi.orders(),
    enabled: Boolean(getToken()),
    refetchInterval: 8000,
  });

  async function act(orderId: string, action: string) {
    try {
      await marketplaceApi.confirmOrder(orderId, action);
      toast.success("Updated");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  const farmerSales = (data?.farmerSales ?? []) as FarmerSale[];

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Your sales</h2>
      {farmerSales.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sales yet.</p>
      ) : (
        <div className="space-y-4">
          {farmerSales.map((s) => (
            <Card key={s.listingId}>
              <CardContent className="p-4 text-sm">
                <p className="font-medium">{s.title}</p>
                <p className="text-muted-foreground">
                  Status: {s.status?.replace(/_/g, " ") ?? "—"}
                </p>
                {s.winner?.district && <p>Buyer district: {s.winner.district}</p>}
                {s.orderId && s.status === "PAYMENT_CONFIRMED" && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => void act(s.orderId!, "mark_dispatched")}
                  >
                    Mark dispatched
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function OrdersPageContent() {
  const { loading, isFarmer, isBuyer } = useMarketplaceRole();

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (isBuyer && !isFarmer) {
    return <BuyerDashboard />;
  }

  if (isFarmer) {
    return (
      <>
        <BuyerDashboard />
        <FarmerOrdersSection />
      </>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Sign in with a marketplace account to view bids and orders.
    </p>
  );
}

export default function MarketplaceOrdersPage() {
  const { isBuyer } = useMarketplaceRole();

  return (
    <>
      <PageHeader
        title={isBuyer ? "My bids & orders" : "Marketplace orders"}
        description={
          isBuyer
            ? "Active bids, won auctions, and PayHere downpayment to claim goods."
            : "Bids you placed, sales from your listings, and order status."
        }
      />
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <OrdersPageContent />
      </Suspense>
    </>
  );
}
