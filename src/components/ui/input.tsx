import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs",
      "placeholder:text-muted-foreground/80",
      "transition-[border-color,box-shadow] duration-150",
      "hover:border-border-strong",
      "focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/25",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/25",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
