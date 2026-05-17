import { getProjectApi, saveProgressGoalsApi } from "@/lib/api/projects";
import { syncGoalStatuses } from "@/features/progress/utils/progress.utils";
import type { FarmingGoal } from "@/types/app.types";

export async function loadProgressGoals(
  projectId: string,
): Promise<FarmingGoal[]> {
  try {
    const project = await getProjectApi(projectId);
    if (project.progress_goals?.length) {
      return syncGoalStatuses(project.progress_goals);
    }
  } catch {
    // fall through
  }
  return [];
}

export async function saveProgressGoals(
  projectId: string,
  goals: FarmingGoal[],
) {
  await saveProgressGoalsApi(projectId, goals);
}
