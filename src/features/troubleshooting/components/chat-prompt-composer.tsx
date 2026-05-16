"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Loader2, Plus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_PLANT_PHOTO_BYTES,
  PLANT_PHOTO_TIPS,
} from "@/features/troubleshooting/constants";
import { cn } from "@/lib/utils";

type ChatPromptComposerProps = {
  question: string;
  onQuestionChange: (value: string) => void;
  image?: string;
  onImageChange: (value: string | undefined) => void;
  onSubmit: (event?: FormEvent) => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
};

function PlantPhotoInstructions() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Plant photo tips</p>
      <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        {PLANT_PHOTO_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChatPromptComposer({
  question,
  onQuestionChange,
  image,
  onImageChange,
  onSubmit,
  loading = false,
  label,
  placeholder = "Ask about pests, watering, leaf color, soil, or growth…",
}: ChatPromptComposerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_PLANT_PHOTO_BYTES) {
      toast.error("Image is too large", {
        description: "Please use a photo under 4 MB.",
      });
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      onImageChange(typeof result === "string" ? result : undefined);
      setIsReading(false);
    };
    reader.onerror = () => {
      toast.error("Could not read the image. Please try again.");
      setIsReading(false);
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

  function handleAddPhotoClick() {
    if (image) {
      toast.message("One photo only", {
        description: "Remove the current photo to add a different one.",
      });
      return;
    }
    fileInputRef.current?.click();
  }

  const canSend = question.trim().length > 0 && !loading;

  return (
    <div className="space-y-3">
      <PlantPhotoInstructions />

      {image ? (
        <div className="relative inline-block">
          <div className="h-16 w-16 overflow-hidden rounded-lg border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Attached plant photo"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-1.5 -top-1.5 h-6 w-6 rounded-full shadow"
            onClick={() => onImageChange(undefined)}
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : null}

      <div className="space-y-2">
        {label ? (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </Label>
        ) : null}

        <div
          className={cn(
            "flex items-end gap-1 rounded-xl border bg-background p-2 shadow-sm",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            disabled={loading || isReading || Boolean(image)}
            onClick={handleAddPhotoClick}
            aria-label="Add plant photo"
          >
            {isReading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>

          <Textarea
            id={inputId}
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder={placeholder}
            disabled={loading}
            rows={3}
            className="min-h-[72px] flex-1 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (canSend) {
                  onSubmit();
                }
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className="shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
