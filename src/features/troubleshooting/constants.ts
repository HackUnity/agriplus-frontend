export const DIAGNOSIS_CATEGORIES = [
  "Pest",
  "Disease",
  "Water",
  "Soil",
  "Leaves",
  "Growth",
  "Fruit",
  "Weather",
] as const;

export type DiagnosisCategory = (typeof DIAGNOSIS_CATEGORIES)[number];
