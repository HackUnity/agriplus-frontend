"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/features/plans/services/plans.service";
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
        description="Step-by-step cultivation guide generated from your land details."
        actions={
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/progress`}>Open checklist</Link>
          </Button>
        }
      />

      {plan.phases && plan.phases.length > 0 ? (
        <PlanPhases phases={plan.phases} />
      ) : (
        <p className="text-muted-foreground">No cultivation phases available yet.</p>
      )}
    </div>
  );
}
