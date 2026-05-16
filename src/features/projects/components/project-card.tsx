import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.location}</CardDescription>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="grid gap-3 text-sm">
          <p>
            <span className="font-semibold">Goal:</span> {project.goal}
          </p>
          <p>
            <span className="font-semibold">Area:</span> {project.area}
          </p>
        </div>
        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          Next: {project.nextAction}
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
