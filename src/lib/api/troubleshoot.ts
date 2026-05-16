import { demoPlanPhases } from "@/lib/demo-data";
import { loadPipelineResult } from "@/features/plans/services/pipeline-storage.service";

export type AskExpertPayload = {
  cultivation_plan: Record<string, unknown>;
  question: string;
  targetedStepDescription?: string;
};

export function buildCultivationPlanForExpert(
  projectId: string,
): Record<string, unknown> | null {
  const pipeline = loadPipelineResult(projectId);
  if (pipeline?.plan?.phases?.length) {
    return pipeline.plan as Record<string, unknown>;
  }

  if (demoPlanPhases.length > 0) {
    return {
      phases: demoPlanPhases,
      crop: "mixed vegetables (demo plan)",
    };
  }

  return null;
}

function parseAskExpertError(body: unknown): string {
  if (typeof body === "object" && body) {
    if ("detail" in body && typeof (body as { detail: unknown }).detail === "string") {
      return (body as { detail: string }).detail;
    }
    if ("error" in body) {
      const err = body as { error: string; detail?: string };
      return err.detail ? `${err.error}: ${err.detail}` : err.error;
    }
  }
  return "Could not get an answer from the AI service.";
}

/**
 * Ask the troubleshooting assistant via the same-origin proxy
 * (``/api/ai/troubleshoot`` → backend ``/api/pipeline/ask-expert``).
 */
export async function askTroubleshootingExpert(
  payload: AskExpertPayload,
): Promise<{ answer: string }> {
  let response: Response;
  try {
    response = await fetch("/api/ai/troubleshoot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Network error while contacting the AI assistant. Check that the dev server and backend are running.",
    );
  }

  const body = (await response.json().catch(() => ({}))) as {
    answer?: string;
    error?: string;
    detail?: string;
  };

  if (response.status === 503) {
    throw new Error(
      parseAskExpertError(body) ||
        "Backend unreachable. Start the API on port 5000 (see NEXT_PUBLIC_API_URL).",
    );
  }

  if (!response.ok) {
    throw new Error(parseAskExpertError(body));
  }

  if (!body.answer?.trim()) {
    throw new Error("The AI service returned an empty answer.");
  }

  return { answer: body.answer };
}
