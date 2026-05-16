"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bot, Cuboid, FileText, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ProjectStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProject } from "@/features/projects/services/projects.service";

export function ProjectDetailsContent({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading project...</p>;
  }

  if (!project) {
    return <p className="text-muted-foreground">Project not found.</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={project.name}
        description={`${project.location} · ${project.goal}`}
        actions={<ProjectStatusBadge status={project.status} />}
      />

      <Card className="bg-muted">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">Next action</p>
            <h2 className="mt-2 text-2xl font-bold">{project.nextAction}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Beginner tip: keep your first growing area small enough to water
              and inspect without stress.
            </p>
          </div>
          <Button asChild>
            <Link href={`/projects/${project.id}/onboarding`}>
              Continue setup
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "AI farming plan",
            icon: FileText,
            href: `/projects/${project.id}/plan`,
            text: "Suitability, recommendations, risks, and timeline.",
          },
          {
            title: "Progress tracker",
            icon: ListChecks,
            href: `/projects/${project.id}/progress`,
            text: "Weekly steps with practical instructions.",
          },
          {
            title: "3D farm layout",
            icon: Cuboid,
            href: `/projects/${project.id}/visualization`,
            text: "Prototype rows, zones, paths, and water lines.",
          },
          {
            title: "Troubleshooting",
            icon: Bot,
            href: `/projects/${project.id}/troubleshooting`,
            text: "Ask project-aware farming questions.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="flex flex-col">
              <CardHeader>
                <Icon className="h-7 w-7 text-primary" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
                <Button asChild variant="outline">
                  <Link href={item.href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project readiness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={68} />
          <p className="text-sm text-muted-foreground">
            Land profile and plan are available. Complete weekly tasks to
            increase readiness.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
