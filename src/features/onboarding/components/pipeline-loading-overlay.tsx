"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sprout } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STAGES = [
  {
    id: "vision",
    label: "Analyzing your land photo",
    hint: "Reading terrain, soil clues, and obstacles from your image.",
    afterMs: 0,
  },
  {
    id: "plan",
    label: "Building your cultivation plan",
    hint: "Creating step-by-step phases matched to your crop and resources.",
    afterMs: 35_000,
  },
  {
    id: "layout",
    label: "Generating 3D farm layout",
    hint: "Placing beds, paths, and plants for the interactive plot view.",
    afterMs: 90_000,
  },
] as const;

function activeStageIndex(elapsedMs: number) {
  let index = 0;
  for (let i = STAGES.length - 1; i >= 0; i -= 1) {
    if (elapsedMs >= STAGES[i].afterMs) {
      index = i;
      break;
    }
  }
  return index;
}

function estimateProgress(elapsedMs: number) {
  const seconds = elapsedMs / 1000;
  if (seconds < 20) return Math.min(18, seconds * 0.9);
  if (seconds < 60) return 18 + (seconds - 20) * 0.55;
  if (seconds < 120) return 40 + (seconds - 60) * 0.35;
  return Math.min(92, 61 + (seconds - 120) * 0.08);
}

type PipelineLoadingOverlayProps = {
  cropName?: string;
};

export function PipelineLoadingOverlay({ cropName }: PipelineLoadingOverlayProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - started);
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  const activeIndex = activeStageIndex(elapsedMs);
  const progress = estimateProgress(elapsedMs);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pipeline-loading-title"
      aria-describedby="pipeline-loading-desc"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-sm">
            <Sprout className="h-8 w-8 text-primary" aria-hidden />
            <Loader2
              className="absolute -right-1 -top-1 h-6 w-6 animate-spin text-primary"
              aria-hidden
            />
          </div>
          <h2 id="pipeline-loading-title" className="text-xl font-bold text-foreground">
            Creating your farming plan
          </h2>
          <p
            id="pipeline-loading-desc"
            className="mt-2 text-sm leading-6 text-muted-foreground"
          >
            {cropName
              ? `Personalizing steps and a 3D layout for ${cropName}.`
              : "This runs vision analysis, plan generation, and 3D layout in one request."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Usually 1–3 minutes. Please keep this tab open.
          </p>
        </div>

        <div className="mt-8 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-xs text-muted-foreground">
            Working… {Math.round(progress)}%
          </p>
        </div>

        <ol className="mt-8 space-y-4">
          {STAGES.map((stage, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;
            return (
              <li key={stage.id} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                  ) : active ? (
                    <Loader2
                      className="h-5 w-5 animate-spin text-primary"
                      aria-hidden
                    />
                  ) : (
                    <div
                      className="h-5 w-5 rounded-full border-2 border-muted"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={
                      active
                        ? "font-semibold text-foreground"
                        : done
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                    }
                  >
                    {stage.label}
                  </p>
                  {active ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stage.hint}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
