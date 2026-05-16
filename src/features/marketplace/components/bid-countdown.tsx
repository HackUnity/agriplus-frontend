"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function getUrgencyClass(msLeft: number): string {
  const hours = msLeft / (1000 * 60 * 60);
  if (hours <= 2) return "text-red-600 bg-red-50 border-red-200";
  if (hours <= 12) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-emerald-700 bg-emerald-50 border-emerald-200";
}

export function BidCountdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState("");
  const [urgency, setUrgency] = useState("");

  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("Ended");
        setUrgency("text-muted-foreground bg-muted border-border");
        return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLabel(`${h}h ${m}m ${s}s`);
      setUrgency(getUrgencyClass(ms));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums transition-colors",
        urgency,
      )}
    >
      {label}
    </span>
  );
}
