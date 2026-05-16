"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_EMAIL = "demo@agripilot.test";
const DEMO_PASSWORD = "demo1234";

export function AuthCard({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState(mode === "login" ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(mode === "login" ? DEMO_PASSWORD : "");

  const continueToDashboard = () => {
    setSubmitting(true);
    router.push("/dashboard");
  };

  const title =
    mode === "login"
      ? "Welcome back"
      : mode === "signup"
        ? "Create your AgriPilot account"
        : "Reset your password";

  const description =
    mode === "forgot"
      ? "Enter your email and we will send reset instructions when Supabase is connected."
      : "Demo mode: click the button below to enter the workspace.";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {mode === "login" ? (
            <div className="rounded-lg border border-dashed bg-muted px-4 py-3 text-sm">
              <p className="font-semibold">Demo account</p>
              <p className="mt-1 text-muted-foreground">
                Email: <span className="font-mono">{DEMO_EMAIL}</span>
              </p>
              <p className="text-muted-foreground">
                Password: <span className="font-mono">{DEMO_PASSWORD}</span>
              </p>
              <Button
                type="button"
                className="mt-3 w-full"
                onClick={continueToDashboard}
                disabled={submitting}
              >
                {submitting ? "Opening workspace..." : "Enter as demo user"}
              </Button>
            </div>
          ) : null}

          <form
            noValidate
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              continueToDashboard();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode !== "forgot" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            ) : null}
            <Button className="w-full" type="submit" variant="outline" disabled={submitting}>
              {submitting ? "Opening workspace..." : "Continue with email"}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                <p>
                  New to AgriPilot?{" "}
                  <Link className="font-semibold text-primary" href="/signup">
                    Create an account
                  </Link>
                </p>
              </>
            ) : (
              <p>
                Already have an account?{" "}
                <Link className="font-semibold text-primary" href="/login">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
