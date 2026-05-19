"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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
import { AuthApiError, login, register } from "@/lib/api/auth";
import { setToken } from "@/lib/auth/token";
import {
  signupSchema,
  type SignupValues,
} from "@/features/auth/schemas/auth.schema";

type FormState = "idle" | "submitting" | "success" | "error";

export function SignupForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupValues) {
    setFormState("submitting");
    setFormError(null);

    try {
      await register({
        first_name: values.firstName.trim(),
        surname: values.surname.trim(),
        email: values.email,
        password: values.password,
      });
      const token = await login({
        email: values.email,
        password: values.password,
      });
      setToken(token.access_token);
      setFormState("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setFormState("idle");
      if (err instanceof AuthApiError) {
        setFormError(err.message);
      } else {
        setFormError("Could not create your account. Check your connection and try again.");
      }
    }
  }

  if (formState === "success") {
    const { firstName, surname } = getValues();
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="space-y-4 py-12">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-xl font-bold">Account created</h2>
            <p className="text-sm text-muted-foreground">
              Welcome, {firstName} {surname}. Taking you to your workspace…
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
          <CardTitle>Create your AgriPlus account</CardTitle>
          <CardDescription>
            Start planning your first farming project in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {formError ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{formError}</p>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  {...registerField("firstName")}
                />
                {errors.firstName ? (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  aria-invalid={!!errors.surname}
                  {...registerField("surname")}
                />
                {errors.surname ? (
                  <p className="text-sm text-destructive">
                    {errors.surname.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...registerField("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="8+ chars, upper, lower, number, symbol"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...registerField("password")}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...registerField("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={formState === "submitting"}
            >
              {formState === "submitting"
                ? "Creating your account…"
                : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
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
