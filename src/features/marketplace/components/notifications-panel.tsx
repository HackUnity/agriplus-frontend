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
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-[#F59E0B]" />
          <span className="font-serif text-lg font-semibold text-[#1B4332]">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </span>
        </div>
        {unreadCount > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={() => void markAllRead()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No notifications yet. Bids, auction results, and sales updates will appear
            here.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id}>
              <Card
                className={cn(
                  "transition-colors",
                  n.read ? "border-[#d9e2d2]" : "border-amber-300 bg-amber-50/80",
                )}
              >
                <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1B4332]">{n.title}</p>
                      {!n.read && (
                        <Badge variant="secondary" className="bg-[#F59E0B]/20 text-[#1B4332]">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                    {n.listingId && (
                      <Link
                        href={`/marketplace/${n.listingId}`}
                        className="text-xs text-[#1B4332] underline"
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

