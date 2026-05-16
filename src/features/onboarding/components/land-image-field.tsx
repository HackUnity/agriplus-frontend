"use client";

import { useId, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type LandImageFieldProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  error?: string;
};

export function LandImageField({ value, onChange, error }: LandImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large", {
        description: "Please use a photo under 4 MB.",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      onChange(typeof result === "string" ? result : undefined);
    };
    reader.onerror = () => {
      toast.error("Could not read the image. Please try again.");
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={inputId}>Land photo (optional)</Label>
        <p className="text-sm text-muted-foreground">
          The AI reads this photo together with your form answers to judge land
          condition, layout, and risks. Skip if you do not have a photo yet.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <p className="font-semibold text-foreground">
          How to take the photo (for accurate AI analysis)
        </p>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Show the full plot.</span>{" "}
            Step back so the whole growing area fits in the frame. Include boundaries
            such as fences, walls, or paths if you can.
          </li>
          <li>
            <span className="font-medium text-foreground">Use natural daylight.</span>{" "}
            Shoot in the morning or late afternoon. Avoid night photos, heavy shade, or
            strong glare so soil color and plant health are easy to see.
          </li>
          <li>
            <span className="font-medium text-foreground">Make the ground clear.</span>{" "}
            Tilt slightly downward so soil texture, wet or dry patches, weeds, stones,
            slope, and any standing water are visible—not only the sky or tree tops.
          </li>
          <li>
            <span className="font-medium text-foreground">Keep it sharp and real.</span>{" "}
            Use a recent photo with no filters or heavy editing. Hold the phone steady
            so the image is not blurry.
          </li>
        </ol>
        <p className="mt-3 text-xs">
          A clear photo helps the AI match what it sees with your land size, soil, and
          water answers—so your plan is more accurate. JPG or PNG, under 4 MB.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Choose your photo below when you are happy with it.
      </p>

      <Input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-semibold"
        onChange={handleFileChange}
      />
      {value ? (
        <div className="space-y-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Uploaded image</p>
            <Button type="button" variant="outline" size="sm" onClick={clearImage}>
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="overflow-hidden rounded-md border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded land area"
              className="max-h-72 w-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <ImagePlus className="h-5 w-5 shrink-0" />
          No image uploaded yet.
        </div>
      )}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
