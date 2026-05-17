import { apiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth/token";
import type { FarmingGoal } from "@/types/app.types";
import type { PipelineRunResponse } from "@/types/pipeline.types";
import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding.schema";
import type { CreateProjectValues } from "@/features/projects/schemas/create-project.schema";

export type ProjectRecord = {
  id: string;
  name: string;
  country?: string | null;
  location?: string | null;
  goal?: string | null;
  status: string;
  area: string;
  next_action: string;
  updated_at: string;
};

export type ProjectDetailRecord = ProjectRecord & {
  land_details?: OnboardingValues | null;
  pipeline_result?: PipelineRunResponse | null;
  progress_goals?: FarmingGoal[] | null;
};

function parseError(body: unknown): string {
  if (typeof body === "object" && body && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          typeof item === "object" && item && "msg" in item
            ? String((item as { msg: string }).msg)
            : String(item),
        )
        .join(" ");
    }
  }
  return "Request failed";
}

async function projectsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to manage projects.");
  }

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      "Cannot reach the backend. Start the API on port 5000 and check NEXT_PUBLIC_API_URL.",
    );
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseError(body));
  }
  return body as T;
}

export async function createProjectApi(
  values: CreateProjectValues,
): Promise<ProjectRecord> {
  return projectsFetch<ProjectRecord>("/projects", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function listProjectsApi(): Promise<ProjectRecord[]> {
  return projectsFetch<ProjectRecord[]>("/projects");
}

export async function getProjectApi(
  projectId: string,
): Promise<ProjectDetailRecord> {
  return projectsFetch<ProjectDetailRecord>(`/projects/${projectId}`);
}

export async function saveLandDetailsApi(
  projectId: string,
  details: OnboardingValues,
): Promise<ProjectDetailRecord> {
  return projectsFetch<ProjectDetailRecord>(`/projects/${projectId}/land-details`, {
    method: "PUT",
    body: JSON.stringify({ details }),
  });
}

export async function savePipelineResultApi(
  projectId: string,
  result: PipelineRunResponse,
): Promise<ProjectDetailRecord> {
  return projectsFetch<ProjectDetailRecord>(
    `/projects/${projectId}/pipeline-result`,
    {
      method: "PUT",
      body: JSON.stringify({
        vision: result.vision,
        plan: result.plan,
        layout: result.layout,
        timings_ms: result.timings_ms,
      }),
    },
  );
}

export async function saveProgressGoalsApi(
  projectId: string,
  goals: FarmingGoal[],
): Promise<ProjectDetailRecord> {
  return projectsFetch<ProjectDetailRecord>(
    `/projects/${projectId}/progress-goals`,
    {
      method: "PUT",
      body: JSON.stringify({ goals }),
    },
  );
}

export async function setProjectStatusApi(
  projectId: string,
  status: string,
): Promise<ProjectRecord> {
  return projectsFetch<ProjectRecord>(`/projects/${projectId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
