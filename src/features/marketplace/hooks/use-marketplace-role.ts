"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { marketplaceApi } from "../api";

export function useMarketplaceRole() {
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    setHasAuth(Boolean(getToken()));
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["marketplace-me"],
    queryFn: () => marketplaceApi.me(),
    enabled: hasAuth,
    staleTime: 60_000,
  });

  const role = data?.user?.role?.toLowerCase() ?? "";
  const isFarmer = role === "farmer" || role === "admin";
  const isBuyer = role === "buyer";

  return {
    user: data?.user ?? null,
    loading: hasAuth && isLoading,
    isFarmer,
    isBuyer,
    refetch,
  };
}
