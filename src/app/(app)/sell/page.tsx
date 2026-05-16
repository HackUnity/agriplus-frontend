"use client";

import { PageHeader } from "@/components/common/page-header";
import { FarmerRoleGuard } from "@/features/marketplace/components/farmer-role-guard";
import { FarmerSellDashboard } from "@/features/marketplace/components/farmer-sell-dashboard";

export default function SellPage() {
  return (
    <FarmerRoleGuard>
      <PageHeader
        title="Sell / Marketplace"
        description="List produce, track bids on your items, and manage sales confirmations."
      />
      <FarmerSellDashboard />
    </FarmerRoleGuard>
  );
}
