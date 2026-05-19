import { z } from "zod";

export const onboardingSchema = z.object({
  landArea: z.number().positive("Add the land size, even an estimate."),
  landUnit: z.enum(["sqft", "perch", "acre"]),
  landImage: z.string().optional(),
  soilType: z.string().min(1, "Choose the closest soil option."),
  drainage: z.string().min(1, "Choose what happens after heavy rain."),
  waterSource: z.string().min(1, "Choose the main water source."),
  sunlight: z.string().min(1, "Choose daily sunlight level."),
  season: z.string().min(1, "Choose the current or planned season."),
  goal: z.string().min(1, "Choose your main farming goal."),
  weeklyTime: z
    .number()
    .min(1, "Add how many hours per week you can spend."),
  budget: z.string().min(1, "Choose a practical starter budget."),
  cropPreference: z.string().min(1, "Add crops you like or write 'not sure'."),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
