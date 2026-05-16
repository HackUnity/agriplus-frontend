import { demoPlan } from "@/lib/demo-data";
import type { FarmingPlan } from "@/types/app.types";

export async function getPlan(projectId: string): Promise<FarmingPlan> {
  return {
    ...demoPlan,
    projectId,
  };
}
