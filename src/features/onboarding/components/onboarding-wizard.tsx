"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { onboardingSteps } from "@/features/onboarding/constants";
import {
  onboardingSchema,
  type OnboardingValues,
} from "@/features/onboarding/schemas/onboarding.schema";
import {
  loadDraft,
  saveLandDetails,
} from "@/features/onboarding/services/land-details.service";

const defaultValues: OnboardingValues = {
  landArea: 500,
  landUnit: "sqft",
  soilType: "Not sure",
  drainage: "Water drains in a few hours",
  waterSource: "Tap or well water",
  sunlight: "6 or more hours",
  season: "Current season",
  goal: "Grow food for home",
  weeklyTime: 5,
  budget: "Low starter budget",
  cropPreference: "Not sure",
};

export function OnboardingWizard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const draft = useMemo(() => loadDraft(projectId), [projectId]);
  const step = onboardingSteps[stepIndex];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { ...defaultValues, ...draft },
  });

  async function goNext() {
    const valid = await trigger(step.fields);
    if (!valid) {
      return;
    }

    setSaving(true);
    await saveLandDetails(projectId, getValues());
    setSaving(false);

    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  }

  async function onSubmit(values: OnboardingValues) {
    await saveLandDetails(projectId, values);
    const response = await fetch("/api/ai/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, landDetails: values }),
    });

    if (!response.ok) {
      toast.error("Plan generation failed", {
        description: "Your answers are saved. Please try again.",
      });
      return;
    }

    toast.success("Farming plan generated");
    router.push(`/projects/${projectId}/plan`);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Step {stepIndex + 1} of {onboardingSteps.length}
            </p>
            <CardTitle>{step.title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </div>
          <Progress value={((stepIndex + 1) / onboardingSteps.length) * 100} />
        </CardHeader>
        <CardContent className="space-y-5">
          {step.id === "land" ? (
            <>
              <NumberField
                id="landArea"
                label="How large is the growing area?"
                error={errors.landArea?.message}
                registration={register("landArea", { valueAsNumber: true })}
              />
              <SelectField
                id="landUnit"
                label="Area unit"
                options={["sqft", "perch", "acre"]}
                registration={register("landUnit")}
              />
              <SelectField
                id="sunlight"
                label="How much sunlight does it get?"
                options={["Less than 4 hours", "4 to 6 hours", "6 or more hours"]}
                registration={register("sunlight")}
                error={errors.sunlight?.message}
              />
            </>
          ) : null}

          {step.id === "soil-water" ? (
            <>
              <SelectField
                id="soilType"
                label="What does the soil feel like?"
                options={["Not sure", "Sandy", "Clay", "Loamy", "Rocky"]}
                registration={register("soilType")}
                error={errors.soilType?.message}
              />
              <SelectField
                id="drainage"
                label="After heavy rain, what happens?"
                options={[
                  "Water drains in a few hours",
                  "Water stays for a day",
                  "Soil dries very fast",
                  "Not sure",
                ]}
                registration={register("drainage")}
                error={errors.drainage?.message}
              />
              <SelectField
                id="waterSource"
                label="Main water source"
                options={["Tap or well water", "Rain only", "Canal or pond", "Not sure"]}
                registration={register("waterSource")}
                error={errors.waterSource?.message}
              />
            </>
          ) : null}

          {step.id === "goals" ? (
            <>
              <SelectField
                id="season"
                label="When do you want to start?"
                options={["Current season", "Next month", "After rainy season"]}
                registration={register("season")}
                error={errors.season?.message}
              />
              <SelectField
                id="goal"
                label="Main goal"
                options={[
                  "Grow food for home",
                  "Earn small income",
                  "Learn farming basics",
                  "Low-maintenance crops",
                ]}
                registration={register("goal")}
                error={errors.goal?.message}
              />
              <NumberField
                id="weeklyTime"
                label="Hours you can spend per week"
                error={errors.weeklyTime?.message}
                registration={register("weeklyTime", { valueAsNumber: true })}
              />
              <SelectField
                id="budget"
                label="Starter budget"
                options={[
                  "Low starter budget",
                  "Moderate budget",
                  "Can invest in irrigation/tools",
                ]}
                registration={register("budget")}
                error={errors.budget?.message}
              />
              <div className="space-y-2">
                <Label htmlFor="cropPreference">Crop preferences</Label>
                <Textarea
                  id="cropPreference"
                  placeholder="Example: tomatoes, greens, okra, or not sure"
                  {...register("cropPreference")}
                />
                {errors.cropPreference ? (
                  <p className="text-sm text-destructive">
                    {errors.cropPreference.message}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
            Not sure is acceptable. The AI will treat uncertain answers as
            assumptions and explain where better information would improve the
            plan.
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === 0 || isSubmitting}
          onClick={() => setStepIndex((current) => current - 1)}
        >
          Back
        </Button>
        <div className="flex items-center gap-3">
          {saving ? (
            <span className="text-sm text-muted-foreground">Saving draft...</span>
          ) : null}
          {stepIndex === onboardingSteps.length - 1 ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating plan..." : "Generate farming plan"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Save and continue
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function NumberField({
  id,
  label,
  error,
  registration,
}: {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" min={0} {...registration} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  registration,
  error,
}: {
  id: string;
  label: string;
  options: string[];
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        {...registration}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
