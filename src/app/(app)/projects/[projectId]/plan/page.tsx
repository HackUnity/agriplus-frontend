import { PlanContent } from "@/features/plans/components/plan-content";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <PlanContent projectId={projectId} />;
}
