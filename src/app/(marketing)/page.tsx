import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Cuboid, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHero } from "@/features/marketplace/components/landing-hero";
import { MarketplaceSection } from "@/features/marketplace/components/marketplace-section";
import { MarketplaceSiteHeader } from "@/features/marketplace/components/marketplace-site-header";

const steps = [
  "Describe your land in simple words",
  "Get crop recommendations and a practical plan",
  "Track each farming step with beginner guidance",
  "List harvest on AgriMarket for live bidding",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <MarketplaceSiteHeader />

      <LandingHero />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center gap-8">
          <div className="space-y-5">
            <p className="w-fit rounded-full border border-border bg-accent px-4 py-1.5 text-sm font-semibold text-primary-strong">
              AI planning for first-time farmers
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-primary-strong sm:text-4xl">
              Turn your land into a clear farming plan.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              AgriPilot guides beginner farmers from land details to crop
              recommendations, weekly tasks, troubleshooting, and a simple 3D farm
              layout — then sell your harvest below.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Create your first project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#marketplace">Browse marketplace</a>
            </Button>
          </div>
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-serif text-primary-strong">
              Your beginner-friendly farming workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-lg border border-border bg-mint-gradient p-4 transition-colors hover:border-border-strong"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                  {idx + 1}
                </div>
                <p className="pt-0.5 text-sm font-medium text-foreground">
                  {step}
                </p>
                <CheckCircle2 className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-success" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:px-6 md:grid-cols-3 lg:px-8">
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
            <Card
              key={feature.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-strong">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <MarketplaceSection />
    </main>
  );
}
