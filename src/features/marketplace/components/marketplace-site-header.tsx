"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Leaf, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasToken } from "@/lib/auth/token";
import { marketplaceApi } from "../api";

type MarketplaceSiteHeaderProps = {
  /** When true, logo links to dashboard if logged in (marketplace sub-routes). */
  embedded?: boolean;
};

export function MarketplaceSiteHeader({ embedded = false }: MarketplaceSiteHeaderProps) {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!hasToken()) {
      setLoggedIn(false);
      setReady(true);
      return;
    }
    marketplaceApi
      .me()
      .then(({ user }) => {
        if (user) {
          setLoggedIn(true);
          setUserName(user.name);
          const role = user.role?.toLowerCase() ?? "";
          setIsFarmer(role === "farmer" || role === "admin");
        } else {
          setLoggedIn(false);
        }
      })
      .catch(() => setLoggedIn(false))
      .finally(() => setReady(true));
  }, []);

  const isBuyer = loggedIn && !isFarmer && userName != null;
  const homeHref = loggedIn
    ? isFarmer
      ? "/dashboard"
      : isBuyer
        ? "/marketplace-orders"
        : "/dashboard"
    : "/";
  const logoLabel =
    loggedIn && isFarmer
      ? "AgriPlus · Dashboard"
      : loggedIn && !isFarmer
        ? "AgriPlus · My bids"
        : "AgriPlus";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {embedded && loggedIn && (
            <Button asChild variant="outline" size="sm" className="shrink-0 gap-1">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
          )}
          <Link href={homeHref} className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-lg font-extrabold text-foreground">
                {logoLabel}
              </span>
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.15em] text-leaf sm:block">
                Fresh produce auctions
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!ready ? (
            <span className="px-2 text-xs text-muted-foreground">…</span>
          ) : loggedIn ? (
            <>
              {isFarmer && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/sell">
                    <Store className="h-4 w-4" />
                    Sell
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link href="/#marketplace">Marketplace</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/about">About</Link>
              </Button>
              {!isFarmer && (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/marketplace-orders">My bids</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/notifications">Notifications</Link>
                  </Button>
                </>
              )}
              {isFarmer && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/notifications">Notifications</Link>
                </Button>
              )}
              <Button asChild size="sm">
                <Link href={isFarmer ? "/dashboard" : "/marketplace-orders"}>
                  <LayoutDashboard className="h-4 w-4 sm:inline" />
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {userName ? `Hi, ${userName.split(" ")[0]}` : "Account"}
                  </span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <a href={embedded ? "/#marketplace" : "#marketplace"}>Marketplace</a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/about">About</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
