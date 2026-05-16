"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Droplets, Leaf } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPlan } from "@/features/plans/services/plans.service";

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
        description="A beginner-friendly plan generated from your land details. Review the assumptions before following recommendations."
        actions={
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/progress`}>Open checklist</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Land suitability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-primary">
              {plan.suitabilityScore}%
            </div>
            <Progress value={plan.suitabilityScore} />
            <p className="text-sm leading-6 text-muted-foreground">
              {plan.summary}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assumptions to verify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.assumptions.map((assumption) => (
              <div key={assumption} className="flex gap-3 rounded-lg bg-muted p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm">{assumption}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended crops</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plan.recommendations.map((crop) => (
            <Card key={crop.crop}>
              <CardHeader>
                <Leaf className="h-6 w-6 text-primary" />
                <CardTitle>{crop.crop}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>{crop.fit}</p>
                <p>
                  Difficulty: <span className="font-semibold">{crop.difficulty}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" /> Water: {crop.waterNeeds}
                </p>
                <p>Timeline: {crop.timeline}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Risks and mitigations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {plan.risks.map((risk) => (
            <div key={risk} className="flex gap-3 rounded-lg border p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm leading-6 text-muted-foreground">{risk}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
