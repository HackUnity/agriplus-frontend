import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  projectId: z.string().min(1),
  question: z.string().min(3),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  const { question } = parsed.data;

  return NextResponse.json({
    answer:
      `For "${question}", start by checking water consistency, leaf color, pest marks, and soil moisture. ` +
      "Take one photo, note when the symptom started, and avoid adding fertilizer until watering and drainage are clear.",
  });
}
