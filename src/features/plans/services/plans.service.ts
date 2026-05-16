import { demoPlan } from "@/lib/demo-data";
import { loadPipelineResult } from "@/features/plans/services/pipeline-storage.service";
import type { FarmingPlan } from "@/types/app.types";

export async function getPlan(projectId: string): Promise<FarmingPlan> {
  const pipeline = loadPipelineResult(projectId);

  if (pipeline?.plan?.phases?.length) {
    const crop = pipeline.plan.crop ?? "your crop";
    const plotHint =
      typeof pipeline.vision === "object" &&
      pipeline.vision &&
      "land_profile" in pipeline.vision
        ? "Land analysis and your form answers were used to build this plan."
        : "Generated from your land photo and onboarding answers.";

    return {
      id: pipeline.plan._id ?? `plan-${projectId}`,
      projectId,
      suitabilityScore: 0,
      summary: `${plotHint} Focus crop: ${crop}.`,
      assumptions: [],
      recommendations: [],
      risks: [],
      goals: [],
      phases: pipeline.plan.phases,
      faqs: pipeline.plan.faqs,
    };
  }

  return {
    ...demoPlan,
    projectId,
  };
}
