"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CloudSun, Leaf, MapPin, Timer } from "lucide-react";
import { loadDraft } from "@/features/onboarding/services/land-details.service";
import { getPlan } from "@/features/plans/services/plans.service";
import { getProject } from "@/features/projects/services/projects.service";

export function ProjectContextPanel({ projectId }: { projectId: string }) {
  const draft = useMemo(() => loadDraft(projectId), [projectId]);

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: plan } = useQuery({
    queryKey: ["plan", projectId],
    queryFn: () => getPlan(projectId),
  });

  const activeGoal =
    plan?.goals.find((goal) => goal.status === "doing") ?? plan?.goals[0];

  const cropType =
    draft.cropPreference?.trim() ||
    plan?.recommendations[0]?.crop ||
    "Not set yet";

  const weather = [draft.season, project?.location].filter(Boolean).join(" · ") || "Not set yet";

  const landConditions =
    draft.soilType && draft.drainage
      ? `${draft.soilType} soil · ${draft.drainage}`
      : draft.soilType || draft.waterSource
        ? [draft.soilType, draft.waterSource].filter(Boolean).join(" · ")
        : "Complete onboarding for land details";

  const timeline = activeGoal
    ? `${activeGoal.title} (${activeGoal.timing})`
    : plan?.recommendations[0]?.timeline ?? "Not set yet";

  const items = [
    { label: "Crop type", value: cropType, icon: Leaf },
    { label: "Weather", value: weather, icon: CloudSun },
    { label: "Land conditions", value: landConditions, icon: MapPin },
    { label: "Project timeline", value: timeline, icon: Timer },
  ];

  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Using project context
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-2.5 text-sm">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
