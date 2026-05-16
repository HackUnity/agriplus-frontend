import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding.schema";
import type { Json } from "@/types/database.types";

const storageKey = (projectId: string) => `agripilot:onboarding:${projectId}`;

export async function saveLandDetails(
  projectId: string,
  values: OnboardingValues,
) {
  if (!hasSupabaseEnv) {
    window.localStorage.setItem(storageKey(projectId), JSON.stringify(values));
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from("project_land_details").upsert({
    project_id: projectId,
    details: values as unknown as Json,
  });

  if (error) {
    throw error;
  }
}

export function loadDraft(projectId: string): Partial<OnboardingValues> {
  if (typeof window === "undefined") {
    return {};
  }

  const draft = window.localStorage.getItem(storageKey(projectId));
  return draft ? (JSON.parse(draft) as Partial<OnboardingValues>) : {};
}
