"use client";

import { PageHeader } from "@/components/common/page-header";
import { NotificationsPanel } from "@/features/marketplace/components/notifications-panel";

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Bids, auction results, payments, and sales updates."
      />
      <NotificationsPanel />
    </>
  );
}
