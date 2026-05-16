"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { StepStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { demoPlan } from "@/lib/demo-data";
import type { FarmingStep, StepStatus } from "@/types/app.types";

const nextStatus: Record<StepStatus, StepStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
  blocked: "doing",
};

export function ProgressTracker({ projectId }: { projectId: string }) {
  const [steps, setSteps] = useState<FarmingStep[]>(demoPlan.steps);
  const completed = steps.filter((step) => step.status === "done").length;
  const percent = (completed / steps.length) * 100;

  function updateStep(stepId: string) {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId ? { ...step, status: nextStatus[step.status] } : step,
      ),
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Farming progress tracker"
        description="Follow the plan as simple actions. Update each step as you start or finish it."
      />

      <Card>
        <CardHeader>
          <CardTitle>This project is {Math.round(percent)}% through the first plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={percent} />
          <p className="text-sm text-muted-foreground">
            Project ID: {projectId}. Completed {completed} of {steps.length} steps.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card key={step.id}>
            <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <StepStatusBadge status={step.status} />
                </div>
                <p className="text-sm font-semibold text-primary">{step.timing}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <Button variant="outline" onClick={() => updateStep(step.id)}>
                Update status
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
