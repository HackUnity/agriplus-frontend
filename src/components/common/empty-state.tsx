import { ReactNode } from "react";
import { Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed bg-mint-gradient">
      <CardContent className="flex flex-col items-center gap-5 py-14 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary-strong shadow-sm"
          aria-hidden
        >
          <Sprout className="h-6 w-6" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
