"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bot,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAskAiUrl } from "@/features/troubleshooting/utils/ask-ai-url";
import type { PlanPhase } from "@/types/app.types";

const PHASE_COLORS: {
  border: string;
  badge: string;
  number: string;
  icon: string;
}[] = [
  {
    border: "border-l-soil",
    badge: "bg-warning-soft text-warning-foreground border-transparent",
    number: "bg-warning-soft text-warning-foreground",
    icon: "text-soil",
  },
  {
    border: "border-l-growth",
    badge: "bg-success-soft text-success border-transparent",
    number: "bg-success-soft text-success",
    icon: "text-growth",
  },
  {
    border: "border-l-primary",
    badge: "bg-accent text-primary-strong border-transparent",
    number: "bg-accent text-primary-strong",
    icon: "text-primary",
  },
  {
    border: "border-l-water",
    badge: "bg-info-soft text-info border-transparent",
    number: "bg-info-soft text-info",
    icon: "text-water",
  },
];

function totalDays(phase: PlanPhase) {
  return phase.substages.reduce((sum, s) => sum + s.estimated_days, 0);
}

interface PlanPhasesProps {
  projectId: string;
  phases: PlanPhase[];
}

export function PlanPhases({ projectId, phases }: PlanPhasesProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Cultivation phases</h2>
        <Badge variant="outline" className="text-xs">
          {phases.length} phases
        </Badge>
      </div>

      <div className="space-y-3">
        {phases.map((phase, phaseIdx) => {
          const color = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
          const isOpen = openIndex === phaseIdx;
          const days = totalDays(phase);

          return (
            <Card
              key={phase.name}
              className={`overflow-hidden border-l-4 ${color.border} shadow-xs transition-shadow hover:shadow-md`}
            >
              <button
                type="button"
                onClick={() => toggle(phaseIdx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-foreground">{phase.name}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color.badge}`}
                  >
                    {phase.substages.length} steps
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    ~{days} day{days !== 1 ? "s" : ""}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <CardContent className="border-t px-5 pb-5 pt-4">
                  <ol className="space-y-4">
                    {phase.substages.map((substage) => (
                      <li
                        key={substage.step_number}
                        className="flex gap-4 rounded-lg border border-border bg-muted/40 p-4"
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.number}`}
                        >
                          {substage.step_number}
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-start gap-2">
                            <p className="font-semibold leading-snug">
                              {substage.title}
                            </p>
                            {substage.requires_physical_action_image && (
                              <span
                                className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${color.badge}`}
                                title="Field action — image guidance available"
                              >
                                <Camera className="h-3 w-3" />
                                Visual guide
                              </span>
                            )}
                          </div>

                          <p className="text-sm leading-6 text-muted-foreground">
                            {substage.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>
                                Est.{" "}
                                <strong className="text-foreground">
                                  {substage.estimated_days}
                                </strong>{" "}
                                day{substage.estimated_days !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={buildAskAiUrl(projectId, {
                                  title: substage.title,
                                  description: substage.description,
                                })}
                              >
                                <Bot className="h-4 w-4" />
                                Ask AI
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
