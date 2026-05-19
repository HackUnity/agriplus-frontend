"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function getUrgencyClass(msLeft: number): string {
  const hours = msLeft / (1000 * 60 * 60);
  if (hours <= 2) return "bg-destructive/12 text-destructive border-destructive/30";
  if (hours <= 12) return "bg-weather/25 text-foreground border-weather/40";
  return "bg-growth/20 text-forest-deep border-growth/40";
}

export function BidCountdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState("");
  const [urgency, setUrgency] = useState("");

  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("Ended");
        setUrgency("bg-surface-muted text-muted-foreground border-border");
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors",
        urgency,
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
