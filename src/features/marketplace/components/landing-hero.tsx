"use client";

import Link from "next/link";
import { ArrowDown, Leaf, ShoppingBasket, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2d6a4f] to-[#1B4332] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#F59E0B] blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <Leaf className="h-4 w-4 text-[#F59E0B]" />
              Grow with AgriPilot · Sell on AgriMarket
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Sri Lanka&apos;s fresh produce auction house
            </h1>
            <p className="max-w-xl text-lg text-emerald-100/90">
              Plan your farm with AI guidance, then list your harvest for live
              bidding. Buyers compete fairly — farmers get better prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#F59E0B] text-[#1B4332] hover:bg-amber-400"
              >
                <a href="#marketplace">
                  Browse live auctions <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/signup">Start farming plan</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-emerald-100">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#F59E0B]" />
                Live countdown bids
              </span>
              <span className="flex items-center gap-2">
                <ShoppingBasket className="h-4 w-4 text-[#F59E0B]" />
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
                className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur"
              >
                <p className="font-serif text-3xl font-bold text-[#F59E0B]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-emerald-100">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
