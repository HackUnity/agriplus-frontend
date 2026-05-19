"use client";

import { StepStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { nextStatus } from "@/features/progress/utils/progress.utils";
import type { FarmingGoal } from "@/types/app.types";

type GoalCardProps = {
  goal: FarmingGoal;
  onSubtaskStatusChange: (goalId: string, subtaskId: string) => void;
};

const statusActionLabel: Record<string, string> = {
  doing: "in progress",
  done: "done",
  todo: "to do",
};

export function GoalCard({ goal, onSubtaskStatusChange }: GoalCardProps) {
  const completed = goal.subtasks.filter((task) => task.status === "done").length;
  const percent = goal.subtasks.length
    ? (completed / goal.subtasks.length) * 100
    : 0;

  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{goal.title}</h2>
            <StepStatusBadge status={goal.status} />
          </div>
          <p className="text-sm font-semibold text-primary">{goal.timing}</p>
          <p className="text-sm leading-6 text-muted-foreground">{goal.description}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Sub-tasks</span>
              <span>
                {completed} of {goal.subtasks.length} done
              </span>
            </div>
            <Progress value={percent} />
          </div>
        </div>

        <ul className="space-y-2">
          {goal.subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={
                    subtask.status === "done"
                      ? "text-sm text-muted-foreground line-through"
                      : "text-sm font-medium"
                  }
                >
                  {subtask.title}
                </span>
                <StepStatusBadge status={subtask.status} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSubtaskStatusChange(goal.id, subtask.id)}
              >
                Mark {statusActionLabel[nextStatus[subtask.status]] ?? nextStatus[subtask.status]}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
