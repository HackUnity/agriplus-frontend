import { NextResponse } from "next/server";
import { z } from "zod";
import { apiBaseUrl } from "@/lib/env";

const requestSchema = z.object({
  cultivation_plan: z.record(z.string(), z.unknown()),
  question: z.string().min(1),
  targetedStepDescription: z.string().optional(),
});

/**
 * Same-origin proxy to ``POST /api/pipeline/ask-expert`` on the backend.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", detail: "cultivation_plan and question are required." },
      { status: 400 },
    );
  }

  const { cultivation_plan, question, targetedStepDescription } = parsed.data;

  try {
    const backendRes = await fetch(`${apiBaseUrl}/api/pipeline/ask-expert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cultivation_plan,
        question,
        targetedStepDescription,
      }),
      cache: "no-store",
    });

    const text = await backendRes.text();
    let payload: unknown = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        {
          error: "Invalid backend response",
          detail: "The AI API did not return JSON.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, { status: backendRes.status });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Network error contacting the AI API.";
    return NextResponse.json(
      {
        error: "Backend unreachable",
        detail: `${detail} Ensure the API is running at ${apiBaseUrl}.`,
      },
      { status: 503 },
    );
  }
}
