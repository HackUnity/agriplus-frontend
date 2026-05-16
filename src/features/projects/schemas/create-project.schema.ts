import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Give your project a simple name."),
  location: z.string().min(2, "Add the nearest town or region."),
  goal: z.string().min(1, "Choose the closest farming goal."),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
