"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
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
import { AuthApiError, getMe, login } from "@/lib/api/auth";
import { setToken } from "@/lib/auth/token";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/schemas/auth.schema";

export function AuthCard({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    if (mode === "forgot") return;
    setFormError(null);
    try {
      const token = await login(values);
      setToken(token.access_token);
      const user = await getMe(token.access_token);
      if (user.role.toLowerCase() === "buyer") {
        router.push("/marketplace-orders");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof AuthApiError) {
        setFormError(err.message);
      } else {
        setFormError("Could not sign in. Check your connection and try again.");
      }
    }
  }

  const title =
    mode === "login"
      ? "Welcome back"
      : mode === "signup"
        ? "Create your AgriPlus account"
        : "Reset your password";

  const description =
    mode === "forgot"
      ? "Password reset is not available yet. Contact support if you need help."
      : "Sign in with the email and password you used when registering.";

  if (mode !== "login") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
            {mode === "forgot" ? (
              <form noValidate className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" disabled />
                </div>
              </form>
            ) : null}
            <p>
              Already have an account?{" "}
              <Link className="font-semibold text-primary" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            noValidate
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {formError ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{formError}</p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>
              New to AgriPlus?{" "}
              <Link className="font-semibold text-primary" href="/signup">
                Create an account
              </Link>
            </p>
            <p>
              <Link className="font-semibold text-primary" href="/forgot-password">
                Forgot password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
