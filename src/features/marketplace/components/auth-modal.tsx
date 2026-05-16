"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SRI_LANKA_DISTRICTS } from "@/lib/marketplace/districts";
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-serif text-2xl font-bold text-[#1B4332]">
          {tab === "register" ? "Join AgriMarket" : "Sign in to bid"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Buy fresh produce directly from Sri Lankan farmers.
        </p>
        <div className="mt-4 flex gap-2 rounded-lg bg-[#edf2e8] p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium ${tab === "register" ? "bg-white shadow" : ""}`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium ${tab === "login" ? "bg-white shadow" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {tab === "register" && (
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
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
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="district">Your district</Label>
                <select
                  id="district"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
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
              <div>
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
            className="w-full bg-[#1B4332] hover:bg-[#2d6a4f]"
            disabled={loading}
          >
            {loading ? "Please wait…" : tab === "register" ? "Create account" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
