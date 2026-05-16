import { FarmVisualizer } from "@/features/farm-visualizer/components/farm-visualizer";

export default async function VisualizationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <FarmVisualizer projectId={projectId} />;
}
