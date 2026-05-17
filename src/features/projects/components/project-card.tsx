import Link from "next/link";
import { ArrowRight, MapPin, Sprout, Target } from "lucide-react";
import { ProjectStatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/app.types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-primary-strong">
              {project.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {project.location}
            </CardDescription>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="leading-6">
            <span className="font-medium text-muted-foreground">Goal: </span>
            {project.goal}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-growth" />
          <p className="leading-6">
            <span className="font-medium text-muted-foreground">Area: </span>
            {project.area}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>
            Open project <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
