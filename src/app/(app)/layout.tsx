import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { BuyerRouteGuard } from "@/features/marketplace/components/buyer-route-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <BuyerRouteGuard>
        <AppShell>{children}</AppShell>
      </BuyerRouteGuard>
    </AuthGuard>
  );
}
