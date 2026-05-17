"use client";

import Link from "next/link";
import { ArrowDown, Leaf, ShoppingBasket, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="bg-brand-gradient relative overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-warning blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-soft blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <Leaf className="h-4 w-4 text-warning" />
              Grow with AgriPilot · Sell on AgriMarket
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Sri Lanka&apos;s fresh produce auction house
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/85">
              Plan your farm with AI guidance, then list your harvest for live
              bidding. Buyers compete fairly — farmers get better prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                variant="warning"
                className="text-primary-strong"
              >
                <a href="#marketplace">
                  Browse live auctions <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/signup">Start farming plan</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-warning" />
                Live countdown bids
              </span>
              <span className="flex items-center gap-2">
                <ShoppingBasket className="h-4 w-4 text-warning" />
                25 districts covered
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { n: "120+", l: "Active farmers" },
              { n: "48h", l: "Avg. auction window" },
              { n: "LKR", l: "Floor prices protected" },
              { n: "Live", l: "Real-time bidding" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-sm backdrop-blur transition-colors hover:bg-white/15"
              >
                <p className="font-serif text-3xl font-bold text-warning">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-white/80">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
