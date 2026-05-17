"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GoalCard } from "@/features/progress/components/goal-card";
import {
  loadProgressGoals,
  saveProgressGoals,
} from "@/features/progress/services/progress.service";
import {
  countSubtasks,
  updateSubtaskStatus,
} from "@/features/progress/utils/progress.utils";
import type { FarmingGoal } from "@/types/app.types";

export function ProgressTracker({ projectId }: { projectId: string }) {
  const [goals, setGoals] = useState<FarmingGoal[]>([]);
  const { total, completed, percent } = countSubtasks(goals);

  useEffect(() => {
    let cancelled = false;
    loadProgressGoals(projectId).then((loaded) => {
      if (!cancelled) {
        setGoals(loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function handleSubtaskChange(goalId: string, subtaskId: string) {
    setGoals((current) => {
      const updated = updateSubtaskStatus(current, goalId, subtaskId);
      void saveProgressGoals(projectId, updated);
      return updated;
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Farming progress tracker"
        description="Work through each goal and its sub-tasks. Goal status updates automatically as you complete sub-tasks."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            This project is {Math.round(percent)}% through the first plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={percent} />
          <p className="text-sm text-muted-foreground">
            Completed {completed} of {total} sub-tasks across {goals.length}{" "}
            goals.
          </p>
        </CardContent>
      </Card>

      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onSubtaskStatusChange={handleSubtaskChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Generate your farming plan from onboarding to see cultivation steps here.
        </p>
      )}
    </div>
  );
}
