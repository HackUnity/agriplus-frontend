import type { PlanFaq, PlanPhase } from "@/types/app.types";

export type LayoutCoordinates = {
  x: number;
  y: number;
  z: number;
};

export type LayoutElement = {
  type: string;
  coordinates?: LayoutCoordinates;
  start_point?: LayoutCoordinates;
  end_point?: LayoutCoordinates;
  spacing?: number;
};

export type FarmLayout = {
  dimensions: {
    width: number;
    length: number;
  };
  elements: LayoutElement[];
};

export type PipelinePlanPayload = {
  phases: PlanPhase[];
  crop?: string;
  faqs?: PlanFaq[];
  _id?: string | null;
  created_at?: string | null;
};

export type PipelineLayoutPayload = {
  layout?: FarmLayout;
  _id?: string | null;
  created_at?: string | null;
};

export type PipelineRunResponse = {
  vision: Record<string, unknown>;
  plan: PipelinePlanPayload;
  layout: PipelineLayoutPayload & { layout?: FarmLayout };
  timings_ms?: Record<string, number>;
};
