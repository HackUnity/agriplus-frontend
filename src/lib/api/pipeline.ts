import type { PipelineRunResponse } from "@/types/pipeline.types";

function parsePipelineError(body: unknown): string {
  if (typeof body === "object" && body) {
    if ("detail" in body && typeof (body as { detail: unknown }).detail === "string") {
      return (body as { detail: string }).detail;
    }
    if ("error" in body) {
      const err = body as { error: string; detail?: string; failed_step?: string };
      const parts = [err.error];
      if (err.failed_step) {
        parts.push(`(step: ${err.failed_step})`);
      }
      if (err.detail) {
        parts.push(err.detail);
      }
      return parts.join(" — ");
    }
  }
  return "Pipeline request failed.";
}

function assertPipelineResponse(body: unknown): PipelineRunResponse {
  if (!body || typeof body !== "object") {
    throw new Error("The planning API returned an empty response.");
  }

  const plan = (body as PipelineRunResponse).plan;
  if (!plan?.phases?.length) {
    throw new Error(
      "The plan was generated but contains no cultivation phases. Try again with a clearer land photo.",
    );
  }

  return body as PipelineRunResponse;
}

/**
 * Runs the full agronomy pipeline via the same-origin Next.js proxy
 * (``/api/pipeline/run`` → backend ``/api/pipeline/run``).
 */
export async function runAgronomyPipeline(
  image: File,
  manualInputs: Record<string, unknown>,
): Promise<PipelineRunResponse> {
  const form = new FormData();
  form.append("image", image);
  form.append("manual_inputs", JSON.stringify(manualInputs));

  let response: Response;
  try {
    response = await fetch("/api/pipeline/run", {
      method: "POST",
      body: form,
    });
  } catch {
    throw new Error(
      "Network error while contacting the planning API. Check that the Next.js dev server and backend are both running.",
    );
  }

  const body = (await response.json().catch(() => ({}))) as unknown;

  if (response.status === 503) {
    throw new Error(
      parsePipelineError(body) ||
        "Backend unreachable. Start the API on port 5000 (see NEXT_PUBLIC_API_URL).",
    );
  }

  if (response.status === 404) {
    throw new Error(
      "Planning endpoint not found. Restart the backend so /api/pipeline/run is mounted.",
    );
  }

  if (!response.ok) {
    throw new Error(parsePipelineError(body));
  }

  return assertPipelineResponse(body);
}
