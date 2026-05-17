import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/env";

/** Allow long-running vision → plan → layout pipeline (local dev + Vercel). */
export const maxDuration = 300;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * Same-origin proxy to ``POST /api/pipeline/run`` on the Flask/FastAPI backend.
 * Avoids CORS issues and keeps ``NEXT_PUBLIC_API_URL`` server-side only.
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data", detail: "Expected multipart image and manual_inputs." },
      { status: 400 },
    );
  }

  if (!formData.has("image")) {
    return NextResponse.json(
      { error: "No 'image' field in request" },
      { status: 400 },
    );
  }

  try {
    const backendRes = await fetch(`${apiBaseUrl}/api/pipeline/run`, {
      method: "POST",
      body: formData,
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
          detail: "The planning API did not return JSON.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, { status: backendRes.status });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Network error contacting the planning API.";
    return NextResponse.json(
      {
        error: "Backend unreachable",
        detail: `${detail} Ensure the API is running at ${apiBaseUrl}.`,
      },
      { status: 503 },
    );
  }
}
