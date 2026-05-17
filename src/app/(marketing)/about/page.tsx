import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cuboid,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceSiteHeader } from "@/features/marketplace/components/marketplace-site-header";

const steps = [
  "Describe your land in simple words",
  "Get crop recommendations and a practical plan",
  "Track each farming step with beginner guidance",
  "List harvest on AgriMarket for live bidding",
];

const features = [
  {
    icon: Leaf,
    title: "Land suitability",
    text: "Plain-language analysis that explains what your land is ready for.",
    accent: "bg-mint text-forest-deep",
  },
  {
    icon: Bot,
    title: "AI guidance",
    text: "Project-aware answers for pests, watering, yellow leaves, and delays.",
    accent: "bg-water/15 text-info",
  },
  {
    icon: Cuboid,
    title: "3D layout",
    text: "A simple farm prototype that helps you visualize rows and zones.",
    accent: "bg-weather/25 text-foreground",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketplaceSiteHeader embedded />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center gap-7">
          <div className="space-y-5">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-leaf-soft bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest-deep">
              <Sparkles className="h-3.5 w-3.5" />
              AI planning for first-time farmers
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Turn your land into a clear, doable farming plan.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              AgriPlus guides beginner farmers from land details to crop
              recommendations, weekly tasks, troubleshooting, and a simple 3D
              farm layout — then sell your harvest below.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Create your first project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#marketplace">Browse marketplace</Link>
            </Button>
          </div>
        </div>

        <Card className="bg-surface">
          <CardContent className="space-y-4 p-6">
            <p className="text-base font-semibold text-primary">
              Your beginner-friendly farming workspace
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-4 transition-colors hover:border-leaf-soft hover:bg-mint-soft"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm font-medium text-foreground">
                    {step}
                  </p>
                  <CheckCircle2 className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
            What you get
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            From soil to sale — built for first-time farmers
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <CardContent className="space-y-4 p-6">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {feature.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-base font-semibold text-primary">
            <Leaf className="h-4 w-4" />
            AgriPlus · AgriMarket
          </div>
          <p>© {new Date().getFullYear()} AgriPlus. Built for Sri Lankan farmers.</p>
        </div>
      </footer>
    </main>
  );
}
