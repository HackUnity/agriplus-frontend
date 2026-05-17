import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "border-border-strong text-foreground",
        soft:
          "border-transparent bg-mint text-forest-deep",
        warning:
          "border-transparent bg-weather/25 text-foreground",
        success:
          "border-transparent bg-growth/25 text-forest-deep",
        info:
          "border-transparent bg-water/20 text-info",
        destructive:
          "border-transparent bg-destructive/15 text-destructive",
        live:
          "border-transparent bg-warning text-forest-deep shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
