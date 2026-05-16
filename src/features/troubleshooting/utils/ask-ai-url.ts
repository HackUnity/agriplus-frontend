export function buildAskAiUrl(
  projectId: string,
  context: { title: string; description: string },
) {
  const params = new URLSearchParams({
    title: context.title,
    description: context.description,
  });

  return `/projects/${projectId}/troubleshooting?${params.toString()}`;
}
