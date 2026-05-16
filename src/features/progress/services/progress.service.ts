import { demoPlan } from "@/lib/demo-data";
import { syncGoalStatuses } from "@/features/progress/utils/progress.utils";
import type { FarmingGoal } from "@/types/app.types";

const storageKey = (projectId: string) => `agripilot:progress:${projectId}`;

export function loadProgressGoals(projectId: string): FarmingGoal[] {
  if (typeof window === "undefined") {
    return syncGoalStatuses(demoPlan.goals);
  }

  const saved = window.localStorage.getItem(storageKey(projectId));
  if (!saved) {
    return syncGoalStatuses(demoPlan.goals);
  }

  try {
    return syncGoalStatuses(JSON.parse(saved) as FarmingGoal[]);
  } catch {
    return syncGoalStatuses(demoPlan.goals);
  }
}

export function saveProgressGoals(projectId: string, goals: FarmingGoal[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(projectId), JSON.stringify(goals));
}
