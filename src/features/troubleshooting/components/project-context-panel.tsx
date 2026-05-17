"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudSun, Leaf, MapPin, Timer } from "lucide-react";
import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding.schema";
import { getProjectApi } from "@/lib/api/projects";
import { getPlan } from "@/features/plans/services/plans.service";
import { getProject } from "@/features/projects/services/projects.service";

export function ProjectContextPanel({ projectId }: { projectId: string }) {
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: detail } = useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: () => getProjectApi(projectId),
  });

  const { data: plan } = useQuery({
    queryKey: ["plan", projectId],
    queryFn: () => getPlan(projectId),
  });

  const draft = (detail?.land_details ?? {}) as Partial<OnboardingValues>;
  const activeGoal =
    plan?.goals.find((goal) => goal.status === "doing") ?? plan?.goals[0];

  const cropType =
    draft.cropPreference?.trim() ||
    plan?.recommendations[0]?.crop ||
    "Not set yet";

  const weather =
    [draft.season, project?.location].filter(Boolean).join(" · ") ||
    "Not set yet";

  const landConditions =
    draft.soilType && draft.drainage
      ? `${draft.soilType} soil · ${draft.drainage}`
      : draft.soilType || draft.waterSource
        ? [draft.soilType, draft.waterSource].filter(Boolean).join(" · ")
        : "Complete onboarding for land details";

  const timeline = activeGoal
    ? `${activeGoal.title} (${activeGoal.timing})`
    : (plan?.recommendations[0]?.timeline ?? "Not set yet");

  const items = [
    { label: "Crop type", value: cropType, icon: Leaf },
    { label: "Weather", value: weather, icon: CloudSun },
    { label: "Land conditions", value: landConditions, icon: MapPin },
    { label: "Project timeline", value: timeline, icon: Timer },
  ];

  return (
    <div className="rounded-xl border border-border bg-mint-gradient px-4 py-4 shadow-xs">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Using project context
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-2.5 text-sm">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-xs">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{label}</p>
              <p className="truncate text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
