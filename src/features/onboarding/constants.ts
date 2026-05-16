export const onboardingSteps = [
  {
    id: "land",
    title: "Land basics",
    description:
      "Estimate your growing area. Exact measurements can be improved later.",
    fields: ["landArea", "landUnit", "sunlight"],
  },
  {
    id: "soil-water",
    title: "Soil and water",
    description:
      "If you are not sure, choose the closest observable option.",
    fields: ["soilType", "drainage", "waterSource"],
  },
  {
    id: "goals",
    title: "Goals and resources",
    description:
      "This helps the AI recommend a plan that matches your time and budget.",
    fields: ["season", "goal", "weeklyTime", "budget", "cropPreference"],
  },
] as const;
