import { Badge } from "@/components/ui/badge";
import type { ProjectStatus, StepStatus } from "@/types/app.types";

const projectLabels: Record<ProjectStatus, string> = {
  draft: "Draft",
  onboarding: "Needs details",
  generating: "Generating",
  ready: "Plan ready",
  in_progress: "In progress",
  completed: "Completed",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const variant =
    status === "completed"
      ? "success"
      : status === "ready" || status === "in_progress"
        ? "accent"
        : status === "generating"
          ? "warning"
          : "secondary";

  return <Badge variant={variant}>{projectLabels[status]}</Badge>;
}

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const labels: Record<StepStatus, string> = {
    todo: "To do",
    doing: "Doing",
    done: "Done",
    blocked: "Blocked",
  };

  const variant =
    status === "done"
      ? "success"
      : status === "doing"
        ? "accent"
        : status === "blocked"
          ? "warning"
          : "secondary";

  return <Badge variant={variant}>{labels[status]}</Badge>;
}
