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
  createProjectSchema,
  type CreateProjectValues,
} from "@/features/projects/schemas/create-project.schema";

export function CreateProjectForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      goal: "Grow food for home",
    },
  });

  async function onSubmit(values: CreateProjectValues) {
    toast.success(`${values.name} created`, {
      description: "Next, answer a few land questions so AI can build a plan.",
    });
    router.push("/projects/demo-project/onboarding");
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Nearest town, district, or region"
              {...register("location")}
            />
            {errors.location ? (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Main goal</Label>
            <select
              id="goal"
              className="h-11 w-full rounded-md border bg-background px-3 text-sm"
              {...register("goal")}
            >
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
