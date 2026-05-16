import { demoProjects } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/app.types";

export async function listProjects(): Promise<Project[]> {
  if (!hasSupabaseEnv) {
    return demoProjects;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((project) => ({
    id: project.id,
    name: project.name,
    location: project.location ?? "Location not added",
    goal: project.goal ?? "Goal not added",
    area: "Land details pending",
    status: project.status as Project["status"],
    nextAction:
      project.status === "ready"
        ? "Review your farming plan"
        : "Complete onboarding details",
    updatedAt: new Date(project.updated_at).toLocaleDateString(),
  }));
}

export async function getProject(projectId: string): Promise<Project | null> {
  const demoProject =
    demoProjects.find((project) => project.id === projectId) ?? demoProjects[0];

  if (!hasSupabaseEnv) {
    return demoProject;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    location: data.location ?? "Location not added",
    goal: data.goal ?? "Goal not added",
    area: "Land details pending",
    status: data.status as Project["status"],
    nextAction: data.status === "ready" ? "Review your plan" : "Continue setup",
    updatedAt: new Date(data.updated_at).toLocaleDateString(),
  };
}
