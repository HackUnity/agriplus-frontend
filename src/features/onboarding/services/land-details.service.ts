import {
  getProjectApi,
  saveLandDetailsApi,
} from "@/lib/api/projects";
import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding.schema";

export async function saveLandDetails(
  projectId: string,
  values: OnboardingValues,
) {
  await saveLandDetailsApi(projectId, values);
}

export async function loadLandDetails(
  projectId: string,
): Promise<Partial<OnboardingValues>> {
  try {
    const project = await getProjectApi(projectId);
    return (project.land_details ?? {}) as Partial<OnboardingValues>;
  } catch {
    return {};
  }
}
