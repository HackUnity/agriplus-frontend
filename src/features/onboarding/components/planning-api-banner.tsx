"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { usePlanningApiStatus } from "@/features/onboarding/hooks/use-planning-api-status";

export function PlanningApiBanner() {
  const { status, message } = usePlanningApiStatus();

  if (status === "ready") {
    return null;
  }

  return (
    <div
      className="flex gap-3 rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-warning-foreground shadow-xs"
      role="status"
    >
      {status === "checking" ? (
        <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <div>
        <p className="font-semibold">
          {status === "checking"
            ? "Checking planning API connection…"
            : "Planning API not connected"}
        </p>
        {message && status === "unavailable" ? (
          <p className="mt-1 leading-6 opacity-90">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
