import { ProgressTracker } from "@/features/progress/components/progress-tracker";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProgressTracker projectId={projectId} />;
}
