"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Gavel, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketplaceApi } from "../api";
import { PayhereCheckout } from "./payhere-checkout";
import { BidCountdown } from "./bid-countdown";
type MyBid = {
  id: string;
  amount: number;
  placedAt: string;
  isLeading: boolean;
  canRemove: boolean;
  listing: {
    id: string;
    title: string;
    bidEndsAt: string;
    currentBid: number | null;
    startPrice: number;
    district: string;
    image: string | null;
  };
};

type BuyerOrder = {
  id: string;
  status: string;
  winningBid: number;
  transportCost: number;
  totalEstimate: number;
  downpaymentAmount?: number;
  downpaymentPaid?: boolean;
  listing: { id: string; title: string; district: string };
};

type PayhereSession = {
  orderId: string;
  checkoutUrl: string;
  fields: Record<string, string>;
  sandbox: boolean;
};

const PENDING_PAYHERE_ORDER_KEY = "agriplus_pending_payhere_order";

export function BuyerDashboard() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [payhereSession, setPayhereSession] = useState<PayhereSession | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [removingBidId, setRemovingBidId] = useState<string | null>(null);

  const { data: bidsData, isLoading: bidsLoading } = useQuery({
    queryKey: ["my-bids"],
    queryFn: () => marketplaceApi.myBids(),
    refetchInterval: 5000,
  });

  const { data: ordersData, refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => marketplaceApi.orders(),
    refetchInterval: 8000,
  });

  const confirmPaymentAfterReturn = useCallback(
    async (orderId: string) => {
      try {
        const result = await marketplaceApi.payhereConfirmReturn(orderId);
        if (result.order.status === "PAYMENT_CONFIRMED") {
          toast.success("Downpayment confirmed — your won items are secured");
        }
        void refetchOrders();
        void queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      } catch (e) {
        toast.error(
          e instanceof Error
            ? e.message
            : "Payment succeeded in PayHere but confirmation failed. Retry or contact support.",
        );
        void refetchOrders();
      } finally {
        window.sessionStorage.removeItem(PENDING_PAYHERE_ORDER_KEY);
      }
    },
    [refetchOrders, queryClient],
  );

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "return") {
      const pendingId = window.sessionStorage.getItem(PENDING_PAYHERE_ORDER_KEY);
      if (pendingId) {
        void confirmPaymentAfterReturn(pendingId);
      } else {
        toast.success("Payment submitted — refresh orders if status is unchanged");
        void refetchOrders();
      }
    } else if (payment === "cancel") {
      window.sessionStorage.removeItem(PENDING_PAYHERE_ORDER_KEY);
      toast.message("Payment cancelled");
    }
  }, [searchParams, refetchOrders, confirmPaymentAfterReturn]);

  const myBids = (bidsData?.bids ?? []) as MyBid[];
  const wonOrders = (ordersData?.buyerOrders ?? []) as BuyerOrder[];

  async function removeBid(bidId: string) {
    setRemovingBidId(bidId);
    try {
      await marketplaceApi.removeBid(bidId);
      toast.success("Bid removed");
      void queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove bid");
    } finally {
      setRemovingBidId(null);
    }
  }

  async function confirmPurchase(orderId: string) {
    try {
      await marketplaceApi.confirmOrder(orderId, "confirm_purchase");
      toast.success("Ready to pay downpayment");
      void refetchOrders();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function startPayhere(orderId: string) {
    setPayingOrderId(orderId);
    try {
      const session = await marketplaceApi.payhereCheckout(orderId);
      if (session.mock) {
        await marketplaceApi.payhereMockConfirm(orderId);
        toast.success("Downpayment recorded (mock mode)");
        void refetchOrders();
        return;
      }
      window.sessionStorage.setItem(PENDING_PAYHERE_ORDER_KEY, orderId);
      setPayhereSession({
        orderId,
        checkoutUrl: session.checkoutUrl,
        fields: session.fields,
        sandbox: session.sandbox ?? true,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start payment");
    } finally {
      setPayingOrderId(null);
    }
  }

  return (
    <div className="space-y-10">
      {payhereSession && (
        <PayhereCheckout
          checkoutUrl={payhereSession.checkoutUrl}
          fields={payhereSession.fields}
          sandbox={payhereSession.sandbox}
          onSubmitted={() => setPayhereSession(null)}
          onCompleted={() => {
            setPayhereSession(null);
            void confirmPaymentAfterReturn(payhereSession.orderId);
          }}
          onError={() => {
            window.sessionStorage.removeItem(PENDING_PAYHERE_ORDER_KEY);
            setPayhereSession(null);
          }}
        />
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-[#1B4332]">
          <Gavel className="h-5 w-5 text-[#F59E0B]" />
          My active bids
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Auctions you are bidding on. You can withdraw a bid before the auction ends
          (remove only — not edit).
        </p>
        {bidsLoading ? (
          <p className="text-sm text-muted-foreground">Loading bids…</p>
        ) : myBids.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No active bids.{" "}
              <Link href="/#marketplace" className="text-[#1B4332] underline">
                Browse the marketplace
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myBids.map((b) => (
              <Card key={b.id} className="border-[#d9e2d2]">
                <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1B4332]">{b.listing.title}</p>
                      {b.isLeading && (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          Leading
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your bid: LKR {b.amount.toLocaleString()} · {b.listing.district}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current high: LKR{" "}
                      {(b.listing.currentBid ?? b.listing.startPrice).toLocaleString()}
                    </p>
                    <BidCountdown endsAt={b.listing.bidEndsAt} />
                    <Link
                      href={`/marketplace/${b.listing.id}`}
                      className="text-xs text-[#1B4332] underline"
                    >
                      View listing
                    </Link>
                  </div>
                  {b.canRemove && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive"
                      disabled={removingBidId === b.id}
                      onClick={() => void removeBid(b.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {removingBidId === b.id ? "Removing…" : "Remove bid"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-[#1B4332]">
          <Trophy className="h-5 w-5 text-[#F59E0B]" />
          Won auctions — claim & pay
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          After an auction ends, confirm your purchase and pay the 20% downpayment
          through PayHere to secure the goods.
        </p>
        {wonOrders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No won auctions yet. When you win, they appear here automatically.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {wonOrders.map((o) => (
              <Card key={o.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{o.listing.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{o.listing.district}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Status:{" "}
                    <span className="font-medium capitalize">
                      {o.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </p>
                  <p>Winning bid: LKR {o.winningBid.toLocaleString()}</p>
                  <p>Transport est.: LKR {o.transportCost.toLocaleString()}</p>
                  <p className="font-medium">
                    Total est.: LKR {o.totalEstimate.toLocaleString()}
                  </p>
                  {o.downpaymentAmount != null && (
                    <p>20% downpayment: LKR {o.downpaymentAmount.toLocaleString()}</p>
                  )}
                  {o.status === "BID_WON" && (
                    <Button
                      size="sm"
                      className="bg-[#1B4332]"
                      onClick={() => void confirmPurchase(o.id)}
                    >
                      Claim & confirm purchase
                    </Button>
                  )}
                  {o.status === "PAYMENT_PENDING" && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-[#1B4332]"
                        disabled={payingOrderId === o.id}
                        onClick={() => void startPayhere(o.id)}
                      >
                        {payingOrderId === o.id
                          ? "Opening PayHere…"
                          : "Pay 20% via PayHere"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void confirmPaymentAfterReturn(o.id)}
                      >
                        I already paid — confirm
                      </Button>
                    </div>
                  )}
                  {o.status === "PAYMENT_CONFIRMED" && (
                    <p className="text-emerald-700">
                      Downpayment received — awaiting farmer dispatch.
                    </p>
                  )}
                  {(o.status === "DISPATCHED" || o.status === "DELIVERED") && (
                    <p className="text-muted-foreground">
                      Order {o.status.replace(/_/g, " ").toLowerCase()}.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
