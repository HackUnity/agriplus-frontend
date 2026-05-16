"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/features/plans/services/plans.service";
import { FarmVisualizer } from "@/features/farm-visualizer/components/farm-visualizer";
import { PlanPhases } from "@/features/plans/components/plan-phases";

export function PlanContent({ projectId }: { projectId: string }) {
  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", projectId],
    queryFn: () => getPlan(projectId),
  });

  if (isLoading || !plan) {
    return <p className="text-muted-foreground">Loading farming plan...</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI farming plan"
        description={plan.summary || "Step-by-step cultivation guide from your land details."}
        actions={
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/progress`}>Open checklist</Link>
          </Button>
        }
      />

      {plan.faqs && plan.faqs.length > 0 ? (
        <section className="space-y-3 rounded-lg border bg-muted/30 p-5">
          <h2 className="text-lg font-semibold">Crop FAQs</h2>
          <ul className="space-y-4">
            {plan.faqs.map((faq) => (
              <li key={faq.question} className="space-y-1">
                <p className="font-medium">{faq.question}</p>
                <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {plan.phases && plan.phases.length > 0 ? (
        <PlanPhases projectId={projectId} phases={plan.phases} />
      ) : (
        <p className="text-muted-foreground">No cultivation phases available yet.</p>
      )}

      <FarmVisualizer projectId={projectId} embedded />
    </div>
  );
}
