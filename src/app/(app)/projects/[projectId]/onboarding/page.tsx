import { PageHeader } from "@/components/common/page-header";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Tell us about your land"
        description="Answer beginner-friendly questions so the AI can recommend crops, risks, and a practical step-by-step plan."
      />
      <OnboardingWizard projectId={projectId} />
    </div>
  );
}
