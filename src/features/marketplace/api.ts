import { apiBaseUrl } from "@/lib/env";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
import type { ListingCard, MarketplaceUser, ProductCategory } from "./types";

function parseError(body: unknown): string {
  if (typeof body === "object" && body && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => (typeof d === "object" && d && "msg" in d ? String((d as { msg: string }).msg) : String(d))).join(" ");
    }
  }
  if (typeof body === "object" && body && "error" in body) {
    return String((body as { error: string }).error);
  }
  return "Request failed";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      "Cannot reach the backend. Start the API on port 5000 and check NEXT_PUBLIC_API_URL.",
    );
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseError(body));
  }
  return body as T;
}

export const marketplaceApi = {
  me: async () => {
    if (!getToken()) return { user: null as MarketplaceUser | null };
    try {
      return await apiFetch<{ user: MarketplaceUser }>("/marketplace/auth/me");
    } catch {
      return { user: null as MarketplaceUser | null };
    }
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    district: string;
    nic?: string;
    role?: "BUYER" | "FARMER";
  }) => {
    const result = await apiFetch<{
      user: MarketplaceUser;
      access_token?: string;
    }>("/marketplace/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (result.access_token) setToken(result.access_token);
    return { user: result.user };
  },

  login: async (email: string, password: string) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const tokenRes = await apiFetch<{ access_token: string }>(
      "/marketplace/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      },
    );
    setToken(tokenRes.access_token);
    const { user } = await apiFetch<{ user: MarketplaceUser }>(
      "/marketplace/auth/me",
    );
    return { user };
  },

  logout: () => {
    clearToken();
    return Promise.resolve({ ok: true });
  },

  categories: (type?: string) =>
    apiFetch<{ categories: ProductCategory[] }>(
      `/marketplace/categories${type ? `?type=${encodeURIComponent(type)}` : ""}`,
    ),

  listings: (params: Record<string, string | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    return apiFetch<{ listings: ListingCard[] }>(`/marketplace/listings?${q}`);
  },

  listing: (id: string) =>
    apiFetch<{
      listing: ListingCard;
      auctionClosed?: boolean;
      winnerName?: string | null;
    }>(`/marketplace/listings/${id}`),

  bids: (id: string) =>
    apiFetch<{
      bids: { id: string; amount: number; placedAt: string; bidderLabel: string }[];
    }>(`/marketplace/listings/${id}/bids`),

  placeBid: (id: string, amount: number) =>
    apiFetch<{
      bid: { id: string; amount: number };
      suggested: number;
      warning: string | null;
    }>(`/marketplace/listings/${id}/bid`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  distance: (from: string, to: string) =>
    apiFetch<{ km: number }>(
      `/marketplace/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  createListing: (data: Record<string, unknown>) =>
    apiFetch<{ listing: ListingCard }>("/marketplace/listings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  farmerSellDashboard: () =>
    apiFetch<{
      listings: (ListingCard & { status: string })[];
      recentBids: {
        id: string;
        listingId: string;
        listingTitle: string;
        amount: number;
        placedAt: string;
        bidderLabel: string;
      }[];
      notifications: {
        id: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
      }[];
      sales: {
        listingId: string;
        title: string;
        listingStatus: string;
        orderId: string | null;
        orderStatus: string | null;
        winningBid: number | null;
        buyerDistrict: string | null;
        buyerName: string | null;
      }[];
    }>("/marketplace/farmer/sell-dashboard"),

  myBids: () =>
    apiFetch<{
      bids: {
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
      }[];
    }>("/marketplace/my/bids"),

  removeBid: (bidId: string) =>
    apiFetch<{ ok: boolean }>(`/marketplace/bids/${bidId}`, {
      method: "DELETE",
    }),

  orders: () =>
    apiFetch<{ buyerOrders: unknown[]; farmerSales: unknown[] }>(
      "/marketplace/orders",
    ),

  notifications: () =>
    apiFetch<{
      notifications: {
        id: string;
        title: string;
        message: string;
        read: boolean;
        listingId: string | null;
        createdAt: string;
      }[];
      unreadCount: number;
    }>("/marketplace/notifications"),

  markNotificationRead: (id: string) =>
    apiFetch<{ notification: unknown }>(
      `/marketplace/notifications/${id}/read`,
      { method: "PATCH" },
    ),

  markAllNotificationsRead: () =>
    apiFetch<{ ok: boolean; markedRead: number }>(
      "/marketplace/notifications/read-all",
      { method: "POST" },
    ),

  confirmOrder: (orderId: string, action: string) =>
    apiFetch<{ order: unknown }>(`/marketplace/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    }),

  payhereCheckout: (orderId: string) =>
    apiFetch<{
      mock?: boolean;
      sandbox?: boolean;
      checkoutUrl: string;
      fields: Record<string, string>;
      downpaymentAmount: number;
      totalEstimate: number;
      message?: string;
    }>(`/marketplace/orders/${orderId}/payment/checkout`, {
      method: "POST",
    }),

  payhereMockConfirm: (orderId: string) =>
    apiFetch<{ order: { id: string; status: string } }>(
      `/marketplace/orders/${orderId}/payment/mock-confirm`,
      { method: "POST" },
    ),

  payhereConfirmReturn: (orderId: string) =>
    apiFetch<{ order: { id: string; status: string } }>(
      `/marketplace/orders/${orderId}/payment/confirm-return`,
      { method: "POST" },
    ),
};
