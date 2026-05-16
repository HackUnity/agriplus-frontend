import { saveProgressGoals } from "@/features/progress/services/progress.service";
import type { FarmingGoal, PlanPhase } from "@/types/app.types";
import type { FarmLayout, PipelineRunResponse } from "@/types/pipeline.types";

const pipelineKey = (projectId: string) => `agripilot:pipeline:${projectId}`;

export function savePipelineResult(projectId: string, result: PipelineRunResponse) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(pipelineKey(projectId), JSON.stringify(result));

  const phases = result.plan?.phases;
  if (phases?.length) {
    saveProgressGoals(projectId, phasesToGoals(phases));
  }
}

export function loadPipelineResult(
  projectId: string,
): PipelineRunResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(pipelineKey(projectId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PipelineRunResponse;
  } catch {
    return null;
  }
}

export function loadPipelineLayout(projectId: string): FarmLayout | null {
  const result = loadPipelineResult(projectId);
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
