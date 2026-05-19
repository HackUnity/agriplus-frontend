import { z } from "zod";
import {
  DEFAULT_COUNTRY,
  projectCountries,
  sriLankaDistricts,
} from "@/features/projects/constants";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Give your project a simple name."),
  country: z.enum(projectCountries, { message: "Choose your country." }),
  location: z.enum(sriLankaDistricts, { message: "Choose your district." }),
  goal: z.string().min(1, "Choose the closest farming goal."),
});

export const createProjectDefaultValues = {
  country: DEFAULT_COUNTRY,
  goal: "Grow food for home",
} as const;

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
