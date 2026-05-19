import { NextResponse } from "next/server";

/**
 * Legacy stub — plan generation runs through ``POST /api/pipeline/run`` during
 * onboarding (see ``runAgronomyPipeline``). Nothing in the app calls this route.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Not implemented",
      detail:
        "Use POST /api/pipeline/run (onboarding wizard) for AI-generated cultivation plans.",
    },
    { status: 501 },
  );
}
