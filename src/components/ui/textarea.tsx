import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs leading-6",
      "placeholder:text-muted-foreground/80",
      "transition-[border-color,box-shadow] duration-150",
      "hover:border-border-strong",
      "focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/25",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/25",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
