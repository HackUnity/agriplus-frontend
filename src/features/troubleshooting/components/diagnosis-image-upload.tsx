"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const PHOTO_TIPS = [
  "Take photos in daylight",
  "Capture affected area clearly",
  "Add both close-up and full plant images",
  "Avoid blurry photos",
];

type DiagnosisImageUploadProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
};

export function DiagnosisImageUpload({
  value,
  onChange,
}: DiagnosisImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large", {
        description: "Please use a photo under 4 MB.",
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      onChange(typeof result === "string" ? result : undefined);
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast.error("Could not read the image. Please try again.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    processFile(file);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function clearImage() {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Plant photo (optional)</p>
        <p className="text-sm text-muted-foreground">
          Upload one image to help the assistant see the problem.
        </p>
      </div>

      <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        {PHOTO_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {tip}
          </li>
        ))}
      </ul>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {!value ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => !isLoading && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
            isLoading && "pointer-events-none opacity-70",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Uploading image…</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag & drop an image here, or click to upload
              </p>
              <p className="text-xs text-muted-foreground">JPG or PNG, under 4 MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative inline-block">
          <div className="h-28 w-28 overflow-hidden rounded-lg border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded plant symptom"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-7 w-7 rounded-full shadow"
            onClick={clearImage}
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
