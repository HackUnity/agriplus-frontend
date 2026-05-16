export type ProjectStatus =
  | "draft"
  | "onboarding"
  | "generating"
  | "ready"
  | "in_progress";

export type StepStatus = "todo" | "doing" | "done" | "blocked";

export type CropRecommendation = {
  crop: string;
  fit: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  waterNeeds: "Low" | "Medium" | "High";
  timeline: string;
};

export type FarmingStep = {
  id: string;
  title: string;
  timing: string;
  description: string;
  status: StepStatus;
};

export type FarmingPlan = {
  id: string;
  projectId: string;
  suitabilityScore: number;
  summary: string;
  assumptions: string[];
  recommendations: CropRecommendation[];
  risks: string[];
  steps: FarmingStep[];
};

export type Project = {
  id: string;
  name: string;
  location: string;
  goal: string;
  area: string;
  status: ProjectStatus;
  nextAction: string;
  updatedAt: string;
};
