"use client";

import dynamic from "next/dynamic";
import { Cuboid } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FarmScene = dynamic(
  () =>
    import("@/features/farm-visualizer/components/farm-scene").then(
      (module) => module.FarmScene,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center rounded-xl bg-muted text-muted-foreground">
        Loading 3D farm prototype...
      </div>
    ),
  },
);

function FarmPrototypePanel({ projectId }: { projectId: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardContent className="p-3">
          <div className="h-[460px] overflow-hidden rounded-xl bg-muted">
            <FarmScene />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Cuboid className="h-7 w-7 text-primary" />
          <CardTitle>Layout legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>Project ID: {projectId}</p>
          <p>Green zones show starter crop beds.</p>
          <p>The front strip represents a walking path for access.</p>
          <p>The blue marker represents a water source or filling point.</p>
          <p>
            MVP rule: keep the first version understandable before adding a full
            editor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function FarmVisualizer({
  projectId,
  embedded = false,
}: {
  projectId: string;
  embedded?: boolean;
}) {
  if (embedded) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">3D farm prototype</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A simple planning view of zones, paths, and watering access — not a
            precise engineering drawing.
          </p>
        </div>
        <FarmPrototypePanel projectId={projectId} />
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="3D farm prototype"
        description="This is a simple planning visualization, not a precise engineering drawing. Use it to understand zones, paths, and watering access."
      />
      <FarmPrototypePanel projectId={projectId} />
    </div>
  );
}
