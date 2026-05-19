"use client";

import { useEffect, useState } from "react";

export type PlanningApiStatus = "checking" | "ready" | "unavailable";

export function usePlanningApiStatus() {
  const [status, setStatus] = useState<PlanningApiStatus>("checking");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/backend-health", { cache: "no-store" });
        const body = (await res.json().catch(() => ({}))) as {
          status?: string;
          detail?: string;
        };

        if (cancelled) return;

        if (res.ok && body.status === "ok") {
          setStatus("ready");
          setMessage(null);
          return;
        }

        setStatus("unavailable");
        setMessage(
          body.detail ??
            "Planning API is not reachable. Start the backend on port 5000.",
        );
      } catch {
        if (!cancelled) {
          setStatus("unavailable");
          setMessage(
            "Cannot reach the planning API. Start the backend and refresh this page.",
          );
        }
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, message };
}
