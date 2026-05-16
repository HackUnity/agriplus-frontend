"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasToken } from "@/lib/auth/token";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // TESTING: auth bypass — restore token check before shipping
    // if (!hasToken()) {
    //   router.replace("/login");
    //   return;
    // }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
