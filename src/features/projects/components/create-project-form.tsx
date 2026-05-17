"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  projectCountries,
  sriLankaDistricts,
} from "@/features/projects/constants";
import {
  createProjectDefaultValues,
  createProjectSchema,
  type CreateProjectValues,
} from "@/features/projects/schemas/create-project.schema";
import { createProject } from "@/features/projects/services/projects.service";

const selectClassName =
  "h-11 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs transition-colors hover:border-border-strong focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25";

export function CreateProjectForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: createProjectDefaultValues,
  });

  async function onSubmit(values: CreateProjectValues) {
    try {
      const project = await createProject(values);
      toast.success(`${values.name} created`, {
        description: "Next, answer a few land questions so AI can build a plan.",
      });
      router.push(`/projects/${project.id}/onboarding`);
    } catch (error) {
      toast.error("Could not create project", {
        description:
          error instanceof Error
            ? error.message
            : "Check that you are logged in and the backend is running.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project basics</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="Example: First vegetable garden"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              className={selectClassName}
              {...register("country")}
            >
              {projectCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country ? (
              <p className="text-sm text-destructive">
                {errors.country.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (district)</Label>
            <select
              id="location"
              className={selectClassName}
              defaultValue=""
              {...register("location")}
            >
              <option value="" disabled>
                Select district
              </option>
              {sriLankaDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.location ? (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Main goal</Label>
            <select id="goal" className={selectClassName} {...register("goal")}>
              <option>Grow food for home</option>
              <option>Earn small income</option>
              <option>Learn farming basics</option>
              <option>Test land suitability</option>
            </select>
            {errors.goal ? (
              <p className="text-sm text-destructive">{errors.goal.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create and continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
