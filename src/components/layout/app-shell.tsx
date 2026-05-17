"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  Bell,
  LayoutDashboard,
  Leaf,
  ListChecks,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken } from "@/lib/auth/token";
import { useMarketplaceRole } from "@/features/marketplace/hooks/use-marketplace-role";
import { useNotificationUnread } from "@/features/marketplace/hooks/use-notification-unread";
import { listProjects } from "@/features/projects/services/projects.service";
import { cn } from "@/lib/utils";

const LAST_PROJECT_KEY = "agripilot:lastProjectId";

function getProjectIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/projects\/([^/]+)/);
  if (!match || match[1] === "new") {
    return null;
  }
  return match[1];
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/#marketplace") {
    return pathname === "/";
  }
  if (
    href === "/dashboard" ||
    href === "/settings" ||
    href === "/sell" ||
    href === "/marketplace-orders" ||
    href === "/notifications"
  ) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isFarmer, isBuyer } = useMarketplaceRole();
  const unreadNotifications = useNotificationUnread();
  const projectIdFromPath = getProjectIdFromPath(pathname);
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
    enabled: !isBuyer || isFarmer,
  });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (projectIdFromPath) {
      setActiveProjectId(projectIdFromPath);
      window.localStorage.setItem(LAST_PROJECT_KEY, projectIdFromPath);
      return;
    }

    const stored = window.localStorage.getItem(LAST_PROJECT_KEY);
    if (stored && projects.some((p) => p.id === stored)) {
      setActiveProjectId(stored);
      return;
    }

    if (projects[0]) {
      setActiveProjectId(projects[0].id);
    } else {
      setActiveProjectId(null);
    }
  }, [projectIdFromPath, projects]);

  const notificationsNav = {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
    badge: unreadNotifications > 0 ? unreadNotifications : undefined,
  };

  const navItems = useMemo(() => {
    if (isBuyer && !isFarmer) {
      return [
        {
          href: "/marketplace-orders",
          label: "My bids",
          icon: Package,
        },
        { href: "/#marketplace", label: "Marketplace", icon: ShoppingBag },
        notificationsNav,
      ];
    }

    const projectBase = activeProjectId
      ? `/projects/${activeProjectId}`
      : "/projects/new";
    const items = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: projectBase,
        label: "Project",
        icon: Leaf,
      },
      {
        href: activeProjectId
          ? `/projects/${activeProjectId}/progress`
          : "/projects/new",
        label: "Steps",
        icon: ListChecks,
      },
      {
        href: activeProjectId
          ? `/projects/${activeProjectId}/troubleshooting`
          : "/projects/new",
        label: "Ask AI",
        icon: Bot,
      },
    ];
    if (isFarmer) {
      items.push({ href: "/sell", label: "Sell", icon: Store });
    }
    items.push(
      { href: "/#marketplace", label: "Marketplace", icon: ShoppingBag },
      {
        href: "/marketplace-orders",
        label: isFarmer ? "Orders" : "My bids",
        icon: Package,
      },
      notificationsNav,
      { href: "/settings", label: "Settings", icon: Settings },
    );
    return items;
  }, [activeProjectId, isFarmer, isBuyer, unreadNotifications]);

  const logSidebarNavigation = (
    label: string,
    href: string,
    placement: "sidebar" | "bottom-nav",
  ) => {
    const hrefProjectId = getProjectIdFromPath(href);
    console.log("[AgriPlus] Sidebar click", {
      placement,
      label,
      href,
      pathname,
      projectIdFromPath,
      activeProjectId,
      hrefProjectId,
      inCorrectProjectContext:
        hrefProjectId === null || hrefProjectId === activeProjectId,
    });
  };

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-border bg-surface px-5 py-6 lg:flex">
        <Link
          href={isBuyer && !isFarmer ? "/marketplace-orders" : "/dashboard"}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-foreground">
              AgriPlus
            </p>
            <p className="text-xs text-muted-foreground">
              {isBuyer && !isFarmer
                ? "Marketplace buyer"
                : "Guided farm planning"}
            </p>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item.href);
            const badge = "badge" in item ? item.badge : undefined;

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() =>
                  logSidebarNavigation(item.label, item.href, "sidebar")
                }
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-mint hover:text-primary",
                  active &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {badge != null && badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      active
                        ? "bg-white/20 text-primary-foreground"
                        : "bg-warning text-forest-deep",
                    )}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <Button
          type="button"
          variant="ghost"
          className="mt-auto w-full justify-start gap-3 px-3 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </aside>
      <main className="pb-24 lg:pl-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-end lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
          {children}
        </div>
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-surface/95 backdrop-blur-md lg:hidden"
        style={{
          gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);
          const badge = "badge" in item ? item.badge : undefined;

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              onClick={() =>
                logSidebarNavigation(item.label, item.href, "bottom-nav")
              }
              className={cn(
                "relative flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-semibold text-muted-foreground sm:text-[11px]",
                active && "text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
              {badge != null && badge > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[9px] font-bold text-forest-deep">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
