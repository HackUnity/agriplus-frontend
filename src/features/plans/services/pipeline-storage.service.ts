import { getProjectApi, savePipelineResultApi } from "@/lib/api/projects";
import { saveProgressGoals } from "@/features/progress/services/progress.service";
import type { FarmingGoal, PlanPhase } from "@/types/app.types";
import type { FarmLayout, PipelineRunResponse } from "@/types/pipeline.types";

export async function savePipelineResult(
  projectId: string,
  result: PipelineRunResponse,
) {
  await savePipelineResultApi(projectId, result);

  const phases = result.plan?.phases;
  if (phases?.length) {
    await saveProgressGoals(projectId, phasesToGoals(phases));
  }
}

export async function loadPipelineResult(
  projectId: string,
): Promise<PipelineRunResponse | null> {
  try {
    const project = await getProjectApi(projectId);
    return project.pipeline_result ?? null;
  } catch {
    return null;
  }
}

export async function loadPipelineLayout(
  projectId: string,
): Promise<FarmLayout | null> {
  const result = await loadPipelineResult(projectId);
  if (!result?.layout) {
    return null;
  }

  const nested = result.layout.layout;
  if (nested?.dimensions && Array.isArray(nested.elements)) {
    return nested;
  }

  const direct = result.layout as unknown as FarmLayout;
  if (direct.dimensions && Array.isArray(direct.elements)) {
    return direct;
  }

  return null;
}

function phasesToGoals(phases: PlanPhase[]): FarmingGoal[] {
  return phases.map((phase, phaseIndex) => ({
    id: `phase-${phaseIndex}`,
    title: phase.name,
    timing: `~${phase.substages.reduce((sum, s) => sum + s.estimated_days, 0)} days`,
    description: `${phase.substages.length} cultivation steps`,
    status: "todo",
    subtasks: phase.substages.map((substage) => ({
      id: `phase-${phaseIndex}-step-${substage.step_number}`,
      title: substage.title,
      status: "todo",
    })),
  }));
}
