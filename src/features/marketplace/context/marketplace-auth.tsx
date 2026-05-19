"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getToken } from "@/lib/auth/token";
import { marketplaceApi } from "../api";
import type { MarketplaceUser } from "../types";

type MarketplaceAuthContextValue = {
  user: MarketplaceUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (user: MarketplaceUser | null) => void;
};

const MarketplaceAuthContext = createContext<MarketplaceAuthContextValue | null>(
  null,
);

export function MarketplaceAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<MarketplaceUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: u } = await marketplaceApi.me();
      setUser(u ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, setUser }),
    [user, loading, refresh],
  );

  return (
    <MarketplaceAuthContext.Provider value={value}>
      {children}
    </MarketplaceAuthContext.Provider>
  );
}

export function useMarketplaceAuth() {
  const ctx = useContext(MarketplaceAuthContext);
  if (!ctx) {
    throw new Error(
      "useMarketplaceAuth must be used within MarketplaceAuthProvider",
    );
  }
  return ctx;
}
