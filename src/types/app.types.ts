export type ProjectStatus =
  | "draft"
  | "onboarding"
  | "generating"
  | "ready"
  | "in_progress"
  | "completed";

export type StepStatus = "todo" | "doing" | "done" | "blocked";

export type CropRecommendation = {
  crop: string;
  fit: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  waterNeeds: "Low" | "Medium" | "High";
  timeline: string;
};

export type SubTask = {
  id: string;
  title: string;
  status: StepStatus;
};

export type FarmingGoal = {
  id: string;
  title: string;
  timing: string;
  description: string;
  status: StepStatus;
  subtasks: SubTask[];
};

export type PlanSubstage = {
  step_number: number;
  title: string;
  description: string;
  estimated_days: number;
  requires_physical_action_image: boolean;
  image_prompt_context: string | null;
};

export type PlanPhase = {
  name: string;
  substages: PlanSubstage[];
};

export type FarmingPlan = {
  id: string;
  projectId: string;
  suitabilityScore: number;
  summary: string;
  assumptions: string[];
  recommendations: CropRecommendation[];
  risks: string[];
  goals: FarmingGoal[];
  phases?: PlanPhase[];
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
