"use client";

import { useState } from "react";
import { Leaf, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SRI_LANKA_DISTRICTS } from "@/lib/marketplace/districts";
import { cn } from "@/lib/utils";
import { marketplaceApi } from "../api";
import { useMarketplaceAuth } from "../context/marketplace-auth";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: "login" | "register";
};

export function AuthModal({
  open,
  onClose,
  onSuccess,
  defaultTab = "register",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const { setUser, refresh } = useMarketplaceAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    district: "Colombo",
    nic: "",
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "register") {
        const { user } = await marketplaceApi.register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          district: form.district,
          nic: form.nic || undefined,
          role: "BUYER",
        });
        setUser(user);
        toast.success("Welcome to AgriMarket!");
      } else {
        const { user } = await marketplaceApi.login(form.email, form.password);
        setUser(user);
        toast.success("Signed in");
      }
      await refresh();
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-lift)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-mint hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">
              {tab === "register" ? "Join AgriMarket" : "Welcome back"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Buy fresh produce directly from Sri Lankan farmers.
            </p>
          </div>
        </div>

        <div className="flex gap-1 rounded-full bg-mint p-1">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition-all",
              tab === "register"
                ? "bg-surface text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab("register")}
          >
            Register
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition-all",
              tab === "login"
                ? "bg-surface text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab("login")}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {tab === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {tab === "register" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">Your district</Label>
                <select
                  id="district"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nic">NIC (optional)</Label>
                <Input
                  id="nic"
                  value={form.nic}
                  onChange={(e) => setForm({ ...form, nic: e.target.value })}
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Please wait…" : tab === "register" ? "Create account" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
