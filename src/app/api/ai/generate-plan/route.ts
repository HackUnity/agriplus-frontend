import { NextResponse } from "next/server";
import { z } from "zod";
import { demoPlan } from "@/lib/demo-data";
import { onboardingSchema } from "@/features/onboarding/schemas/onboarding.schema";

const requestSchema = z.object({
  projectId: z.string().min(1),
  landDetails: onboardingSchema,
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid land details", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { projectId, landDetails } = parsed.data;
  const plan = {
    ...demoPlan,
    projectId,
    summary: `Based on ${landDetails.landArea} ${landDetails.landUnit}, ${landDetails.sunlight.toLowerCase()} of sunlight, and a ${landDetails.budget.toLowerCase()}, this beginner plan starts with resilient crops and a small weekly routine.`,
    assumptions: [
      `Soil type: ${landDetails.soilType}.`,
      `Water source: ${landDetails.waterSource}.`,
      `Available time: ${landDetails.weeklyTime} hours per week.`,
    ],
  };

  return NextResponse.json({ plan });
}
