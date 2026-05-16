import type { FarmingGoal, StepStatus, SubTask } from "@/types/app.types";

export const nextStatus: Record<StepStatus, StepStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
  blocked: "doing",
};

export function deriveGoalStatus(subtasks: SubTask[]): StepStatus {
  if (subtasks.length === 0) {
    return "todo";
  }

  if (subtasks.some((task) => task.status === "blocked")) {
    return "blocked";
  }

  if (subtasks.every((task) => task.status === "done")) {
    return "done";
  }

  if (subtasks.some((task) => task.status === "doing" || task.status === "done")) {
    return "doing";
  }

  return "todo";
}

export function syncGoalStatuses(goals: FarmingGoal[]): FarmingGoal[] {
  return goals.map((goal) => ({
    ...goal,
    status: deriveGoalStatus(goal.subtasks),
  }));
}

export function countSubtasks(goals: FarmingGoal[]) {
  const subtasks = goals.flatMap((goal) => goal.subtasks);
  const completed = subtasks.filter((task) => task.status === "done").length;

  return {
    total: subtasks.length,
    completed,
    percent: subtasks.length ? (completed / subtasks.length) * 100 : 0,
  };
}

export function updateSubtaskStatus(
  goals: FarmingGoal[],
  goalId: string,
  subtaskId: string,
): FarmingGoal[] {
  const updated = goals.map((goal) => {
    if (goal.id !== goalId) {
      return goal;
    }

    const subtasks = goal.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, status: nextStatus[subtask.status] }
        : subtask,
    );

    return {
      ...goal,
      subtasks,
      status: deriveGoalStatus(subtasks),
    };
  });

  return syncGoalStatuses(updated);
}
