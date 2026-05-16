import { TroubleshootingChat } from "@/features/troubleshooting/components/troubleshooting-chat";

export default async function TroubleshootingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <TroubleshootingChat projectId={projectId} />;
}
