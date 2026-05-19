import {
  createProjectApi,
  getProjectApi,
  listProjectsApi,
  type ProjectRecord,
} from "@/lib/api/projects";
import type { CreateProjectValues } from "@/features/projects/schemas/create-project.schema";
import type { Project, ProjectStatus } from "@/types/app.types";

function mapProject(record: ProjectRecord): Project {
  return {
    id: record.id,
    name: record.name,
    location: record.location ?? "Location not added",
    goal: record.goal ?? "Goal not added",
    area: record.area,
    status: record.status as ProjectStatus,
    nextAction: record.next_action,
    updatedAt: record.updated_at
      ? new Date(record.updated_at).toLocaleDateString()
      : "",
  };
}

export async function createProject(
  values: CreateProjectValues,
): Promise<Project> {
  const record = await createProjectApi(values);
  return mapProject(record);
}

export async function listProjects(): Promise<Project[]> {
  const records = await listProjectsApi();
  return records.map(mapProject);
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const record = await getProjectApi(projectId);
    return mapProject(record);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return null;
    }
    throw error;
  }
}

export { getProjectApi };
