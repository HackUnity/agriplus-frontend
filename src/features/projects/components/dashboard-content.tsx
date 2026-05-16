"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/features/projects/components/project-card";
import { listProjects } from "@/features/projects/services/projects.service";

export function DashboardContent() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your farming projects"
        description="Create projects for each land area, then AgriPilot will guide planning, crop selection, tasks, and troubleshooting."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" /> New project
            </Link>
          </Button>
        }
      />

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold opacity-80">Recommended next action</p>
            <h2 className="mt-2 text-2xl font-bold">
              Start small, finish your land details, then generate a practical plan.
            </h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/projects/demo-project/onboarding">Continue onboarding</Link>
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-72" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="We could not load your projects"
          description="Check your connection and try again. Your saved projects will appear here once Supabase is connected."
        />
      ) : projects?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Create your first farming project"
          description="You only need a project name, location, and goal to begin. The detailed land questionnaire comes next."
          action={
            <Button asChild>
              <Link href="/projects/new">Create project</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
