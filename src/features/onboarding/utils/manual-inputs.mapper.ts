import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding.schema";

const NOT_SURE = /^(not\s*sure|unsure|any|idk|don'?t\s*know)$/i;

export class CropSelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CropSelectionError";
  }
}

export function landAreaToSqft(
  area: number,
  unit: OnboardingValues["landUnit"],
): number {
  switch (unit) {
    case "sqft":
      return Math.round(area);
    case "perch":
      return Math.round(area * 272.25);
    case "acre":
      return Math.round(area * 43_560);
    default:
      return Math.round(area);
  }
}

/** Pipeline requires exactly one crop in ``crops_to_grow``. */
export function parseSingleCrop(cropPreference: string): string {
  const trimmed = cropPreference.trim();
  if (!trimmed || NOT_SURE.test(trimmed)) {
    throw new CropSelectionError(
      "Name one crop you want to grow (for example: tomatoes or okra). The AI plan works best with a single crop.",
    );
  }

  const first = trimmed
    .split(/[,;/\n]+/)
    .map((part) => part.trim())
    .find(Boolean);

  if (!first || NOT_SURE.test(first)) {
    throw new CropSelectionError(
      "Name one crop you want to grow (for example: tomatoes or okra).",
    );
  }

  return first;
}

function mapSunlight(sunlight: string): string | number {
  if (sunlight.includes("Less than 4")) {
    return 3;
  }
  if (sunlight.includes("4 to 6")) {
    return 5;
  }
  if (sunlight.includes("6 or more")) {
    return "6+";
  }
  return sunlight;
}

export function mapOnboardingToManualInputs(
  values: OnboardingValues,
): Record<string, unknown> {
  return {
    plot_area_sqft: landAreaToSqft(values.landArea, values.landUnit),
    crops_to_grow: [parseSingleCrop(values.cropPreference)],
    sunlight_hours_per_day: mapSunlight(values.sunlight),
    soil_type: values.soilType,
    soil_drainage: values.drainage,
    water_source: values.waterSource,
    purpose: values.goal,
    starting_season: values.season,
    budget_level: values.budget,
    weekly_time_hours: values.weeklyTime,
  };
}

export function dataUrlToFile(dataUrl: string, filename = "land.jpg"): File {
  const [header, base64] = dataUrl.split(",");
  if (!base64) {
    throw new Error("Invalid image data.");
  }
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}
