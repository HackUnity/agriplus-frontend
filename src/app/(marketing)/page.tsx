import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Cuboid, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Describe your land in simple words",
  "Get crop recommendations and a practical plan",
  "Track each farming step with beginner guidance",
  "Ask questions when plants show problems",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center gap-8">
          <div className="space-y-5">
            <p className="w-fit rounded-full bg-muted px-4 py-2 text-sm font-semibold text-primary">
              AI planning for first-time farmers
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Turn your land into a clear farming plan.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              AgriPilot guides beginner farmers from land details to crop
              recommendations, weekly tasks, troubleshooting, and a simple 3D
              farm layout.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Create your first project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Your beginner-friendly farming workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <div key={step} className="flex gap-3 rounded-lg bg-muted p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          {
            icon: Leaf,
            title: "Land suitability",
            text: "Plain-language analysis that explains what your land is ready for.",
          },
          {
            icon: Bot,
            title: "AI guidance",
            text: "Project-aware answers for pests, watering, yellow leaves, and delays.",
          },
          {
            icon: Cuboid,
            title: "3D layout",
            text: "A simple farm prototype that helps you visualize rows and zones.",
          },
        ].map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title}>
              <CardContent className="space-y-4 p-6">
                <Icon className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
