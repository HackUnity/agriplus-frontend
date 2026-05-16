import { ProjectDetailsContent } from "@/features/projects/components/project-details-content";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectDetailsContent projectId={projectId} />;
}
