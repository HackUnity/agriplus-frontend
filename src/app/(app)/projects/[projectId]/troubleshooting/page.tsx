import { TroubleshootingChat } from "@/features/troubleshooting/components/troubleshooting-chat";

export default async function TroubleshootingPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ title?: string; description?: string }>;
}) {
  const { projectId } = await params;
  const { title, description } = await searchParams;

  const stepContext =
    title && description ? { title, description } : undefined;

  return (
    <TroubleshootingChat projectId={projectId} stepContext={stepContext} />
  );
}
