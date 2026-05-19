"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  Leaf,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero3DScene = dynamic(
  () => import("./hero-3d-scene").then((m) => m.Hero3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-mint" />
      </div>
    ),
  },
);

const stats = [
  { n: "120+", l: "Active farmers" },
  { n: "48h", l: "Avg. auction window" },
  { n: "25", l: "Districts covered" },
  { n: "Live", l: "Real-time bidding" },
];

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="leaf-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-leaf-soft bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest-deep">
              <Sparkles className="h-3.5 w-3.5" />
              AgriPlus · AgriMarket
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Sri Lanka&apos;s freshest{" "}
              <span className="text-primary">produce auction</span>,
              <br className="hidden sm:block" /> grown with AI guidance.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Plan your farm with beginner-friendly AI. Then list your harvest
              for live bidding. Buyers compete fairly — farmers get better
              prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#marketplace">
                  Browse live auctions <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">
                  Start farming plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                Live countdown bids
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Floor prices protected
              </span>
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                Harvest-fresh, direct from farms
              </span>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <p className="text-2xl font-extrabold text-primary">
                    {stat.n}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D scene */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-border bg-mint-soft shadow-[var(--shadow-3d)] sm:aspect-[5/4]">
              <Hero3DScene />

              {/* Floating UI chips on top of the scene */}
              <div className="float-y delay-1 pointer-events-none absolute left-4 top-6 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                Carrot · Plot A
              </div>
              <div className="float-y delay-2 pointer-events-none absolute right-4 top-16 rounded-2xl border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
                <p className="font-semibold text-foreground">Auction live</p>
                <p className="text-primary">LKR 4,250 · 12 bids</p>
              </div>
              <div className="float-y pointer-events-none absolute bottom-5 left-5 rounded-2xl border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
                <p className="font-semibold text-foreground">3D farm layout</p>
                <p className="text-muted-foreground">9 m × 6 m · 4 zones</p>
              </div>

              {/* Drag hint */}
              <div className="pointer-events-none absolute bottom-3 right-4 rounded-full border border-border bg-surface/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                Drag to rotate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
