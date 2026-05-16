"use client";

import { useMemo, useState, type FormEvent } from "react";
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
import { LandImageField } from "@/features/onboarding/components/land-image-field";
import { PipelineLoadingOverlay } from "@/features/onboarding/components/pipeline-loading-overlay";
import { PlanningApiBanner } from "@/features/onboarding/components/planning-api-banner";
import { usePlanningApiStatus } from "@/features/onboarding/hooks/use-planning-api-status";
import { onboardingSteps } from "@/features/onboarding/constants";
import {
  onboardingSchema,
  type OnboardingValues,
} from "@/features/onboarding/schemas/onboarding.schema";
import {
  loadDraft,
  saveLandDetails,
} from "@/features/onboarding/services/land-details.service";
import {
  CropSelectionError,
  dataUrlToFile,
  mapOnboardingToManualInputs,
} from "@/features/onboarding/utils/manual-inputs.mapper";
import { runAgronomyPipeline } from "@/lib/api/pipeline";
import { savePipelineResult } from "@/features/plans/services/pipeline-storage.service";

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
  cropPreference: "",
};

export function OnboardingWizard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [pendingCropName, setPendingCropName] = useState<string | undefined>();
  const { status: apiStatus } = usePlanningApiStatus();
  const draft = useMemo(() => loadDraft(projectId), [projectId]);
  const step = onboardingSteps[stepIndex];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { ...defaultValues, ...draft },
  });

  const landImage = watch("landImage");

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

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (stepIndex < onboardingSteps.length - 1) {
      await goNext();
      return;
    }

    await handleSubmit(onSubmit)(event);
  }

  async function onSubmit(values: OnboardingValues) {
    await saveLandDetails(projectId, values);

    if (!values.landImage) {
      toast.error("Land photo required", {
        description:
          "Upload a photo of your plot on step 1 so the AI can analyze it with your answers.",
      });
      setStepIndex(0);
      return;
    }

    let manualInputs: Record<string, unknown>;
    try {
      manualInputs = mapOnboardingToManualInputs(values);
    } catch (error) {
      const message =
        error instanceof CropSelectionError
          ? error.message
          : "Could not read your crop preference.";
      toast.error("Check crop preference", { description: message });
      return;
    }

    const crops = manualInputs.crops_to_grow;
    const cropLabel = Array.isArray(crops) ? crops[0] : undefined;
    setPendingCropName(typeof cropLabel === "string" ? cropLabel : undefined);
    setGeneratingPlan(true);

    try {
      const imageFile = dataUrlToFile(values.landImage);
      const result = await runAgronomyPipeline(imageFile, manualInputs);
      savePipelineResult(projectId, result);
      toast.success("Farming plan generated", {
        description: result.plan.crop
          ? `Personalized plan for ${result.plan.crop}.`
          : undefined,
      });
      router.push(`/projects/${projectId}/plan`);
    } catch (error) {
      toast.error("Plan generation failed", {
        description:
          error instanceof Error
            ? error.message
            : "Your answers are saved. Please try again.",
      });
    } finally {
      setGeneratingPlan(false);
      setPendingCropName(undefined);
    }
  }

  const busy = saving || isSubmitting || generatingPlan;

  return (
    <>
      {generatingPlan ? (
        <PipelineLoadingOverlay cropName={pendingCropName} />
      ) : null}

      <form className="space-y-6" onSubmit={handleFormSubmit} aria-busy={generatingPlan}>
      <PlanningApiBanner />
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
              <LandImageField
                value={landImage}
                onChange={(image) =>
                  setValue("landImage", image, { shouldDirty: true })
                }
                error={errors.landImage?.message}
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
                  placeholder="One crop only, e.g. tomatoes or okra"
                  {...register("cropPreference")}
                />
                <p className="text-xs text-muted-foreground">
                  The AI plan supports one crop per plot. List your main choice only.
                </p>
                {errors.cropPreference ? (
                  <p className="text-sm text-destructive">
                    {errors.cropPreference.message}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
            For soil, water, and sunlight, &quot;Not sure&quot; is fine — the AI will
            note assumptions. You must name one crop and upload a land photo before
            generating your plan.
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === 0 || busy}
          onClick={() => setStepIndex((current) => current - 1)}
        >
          Back
        </Button>
        <div className="flex items-center gap-3">
          {saving ? (
            <span className="text-sm text-muted-foreground">Saving draft...</span>
          ) : null}
          {stepIndex === onboardingSteps.length - 1 ? (
            <Button
              type="submit"
              disabled={busy || apiStatus === "unavailable"}
            >
              Generate farming plan
            </Button>
          ) : (
            <Button type="submit" disabled={busy}>
              Save and continue
            </Button>
          )}
        </div>
      </div>
    </form>
    </>
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
