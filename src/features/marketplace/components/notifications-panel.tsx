"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { marketplaceApi } from "../api";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  listingId: string | null;
  createdAt: string;
};

export function NotificationsPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => marketplaceApi.notifications(),
    refetchInterval: 15000,
  });

  const notifications = (data?.notifications ?? []) as NotificationItem[];
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markRead(id: string) {
    try {
      await marketplaceApi.markNotificationRead(id);
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to mark as read");
    }
  }

  async function markAllRead() {
    try {
      await marketplaceApi.markAllNotificationsRead();
      toast.success("All notifications marked as read");
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading notifications…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-forest-deep">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
          <div>
            <p className="text-lg font-bold text-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
            <p className="text-xs text-muted-foreground">
              Bids, results and order updates appear here.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void markAllRead()}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No notifications yet. Bids, auction results, and sales updates will
            appear here.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id}>
              <Card
                className={cn(
                  "transition-colors",
                  n.read
                    ? "border-border bg-surface"
                    : "border-leaf-soft bg-mint-soft",
                )}
              >
                <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{n.title}</p>
                      {!n.read && <Badge variant="live">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                    {n.listingId && (
                      <Link
                        href={`/marketplace/${n.listingId}`}
                        className="text-xs font-semibold text-primary underline"
                      >
                        View listing
                      </Link>
                    )}
                  </div>
                  {!n.read && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => void markRead(n.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
