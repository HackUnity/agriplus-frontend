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

export const PLANT_PHOTO_TIPS = [
  "Take photos in daylight",
  "Capture affected area clearly",
  "Add both close-up and full plant images",
  "Avoid blurry photos",
] as const;

export const MAX_PLANT_PHOTO_BYTES = 4 * 1024 * 1024;
