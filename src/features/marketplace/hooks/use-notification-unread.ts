"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth/token";
import { marketplaceApi } from "../api";

export function useNotificationUnread() {
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    setHasAuth(Boolean(getToken()));
  }, []);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => marketplaceApi.notifications(),
    enabled: hasAuth,
    refetchInterval: 30000,
    staleTime: 10_000,
  });

  return data?.unreadCount ?? 0;
}
