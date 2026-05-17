"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CATEGORIES_BY_TYPE,
  PRODUCT_TYPES,
  type ProductType,
} from "@/lib/marketplace/categories-data";
import { SRI_LANKA_DISTRICTS } from "@/lib/marketplace/districts";
import { cn } from "@/lib/utils";
import { marketplaceApi } from "../api";
import type { ProductCategory } from "../types";

const UNITS = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "metric_ton", label: "metric ton" },
  { value: "count", label: "count (pcs)" },
] as const;

const UNIT_LABEL: Record<string, string> = {
  kg: "kg",
  g: "g",
  metric_ton: "metric ton",
  count: "piece",
};

type SellListingFormProps = {
  onSuccess?: () => void;
};

function localDatetimeToUtcIso(localValue: string): string {
  if (!localValue) return localValue;
  return new Date(localValue).toISOString();
}

const selectClass =
  "mt-1.5 w-full appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors hover:border-leaf-soft focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

export function SellListingForm({ onSuccess }: SellListingFormProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [productType, setProductType] = useState<ProductType>("Vegetables");
  const [categoryId, setCategoryId] = useState("");
  const [unit, setUnit] = useState("kg");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: catData } = useQuery({
    queryKey: ["categories", productType],
    queryFn: () => marketplaceApi.categories(productType),
  });

  const categories = catData?.categories ?? [];
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const floorDisplay = useMemo(() => {
    if (!selectedCategory) return null;
    if (unit === "g") return selectedCategory.minPriceG;
    if (unit === "metric_ton") return selectedCategory.minPriceKg * 1000;
    if (unit === "count") return selectedCategory.minPriceCount ?? null;
    return selectedCategory.minPriceKg;
  }, [selectedCategory, unit]);

  const countSupported = Boolean(selectedCategory?.minPriceCount);
  const countNotSupported =
    unit === "count" && selectedCategory != null && !countSupported;

  useEffect(() => {
    setCategoryId("");
  }, [productType]);

  // When switching to a category that doesn't sell by count, fall back to kg.
  useEffect(() => {
    if (unit === "count" && selectedCategory && !selectedCategory.minPriceCount) {
      setUnit("kg");
    }
  }, [unit, selectedCategory]);

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const readers = Array.from(files)
      .slice(0, 5 - images.length)
      .map(
        (file) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.readAsDataURL(file);
          }),
      );
    void Promise.all(readers).then((urls) => {
      setImages((prev) => [...prev, ...urls].slice(0, 5));
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!images.length) {
      toast.error("Add at least one image");
      return;
    }
    if (countNotSupported) {
      toast.error("This category cannot be sold per piece. Pick a weight unit.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: String(fd.get("title")),
        categoryId,
        description: String(fd.get("description") || ""),
        quantity: Number(fd.get("quantity")),
        unit,
        district: String(fd.get("district")),
        images,
        harvestDate: String(fd.get("harvestDate")),
        startPrice: Number(fd.get("startPrice")),
        bidEndsAt: localDatetimeToUtcIso(String(fd.get("bidEndsAt"))),
      };
      const { listing } = await marketplaceApi.createListing(payload);
      if (onSuccess) {
        onSuccess();
        e.currentTarget.reset();
        setImages([]);
        setCategoryId("");
        setProductType("Vegetables");
        setUnit("kg");
      } else {
        setSummary(listing as unknown as Record<string, unknown>);
        setSubmitted(true);
      }
      toast.success("Listing submitted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  if (submitted && summary) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Listing submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Your listing was saved and is now visible on the marketplace for
            buyers to bid.
          </p>
          <ul className="space-y-1 rounded-xl bg-surface-muted p-4 text-sm">
            <li>
              <span className="text-muted-foreground">Product:</span>{" "}
              <strong className="text-foreground">{String(summary.title)}</strong>
            </li>
            <li>
              <span className="text-muted-foreground">Starting bid:</span>{" "}
              <strong className="text-foreground">
                LKR {Number(summary.startPrice).toLocaleString()}
              </strong>
            </li>
          </ul>
          <Button onClick={() => router.push("/#marketplace")}>
            View marketplace
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Product name</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. Fresh spinach"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Type</Label>
          <select
            className={selectClass}
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Category</Label>
          <select
            className={selectClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {(CATEGORIES_BY_TYPE[productType] ?? []).map((name) => {
              const cat = categories.find(
                (c: ProductCategory) => c.name === name,
              );
              return (
                <option key={name} value={cat?.id ?? ""} disabled={!cat}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {floorDisplay != null && (
        <div className="rounded-2xl border border-weather/40 bg-weather/15 p-4 text-sm">
          <p className="font-semibold text-foreground">
            Floor price (set by authority)
          </p>
          <p className="text-muted-foreground">
            LKR {floorDisplay.toLocaleString()} per {UNIT_LABEL[unit] ?? unit} — read only
          </p>
        </div>
      )}

      {countNotSupported && (
        <div className="rounded-2xl border border-warning/40 bg-warning/15 p-4 text-sm">
          <p className="font-semibold text-foreground">
            Selling by piece is not enabled for this category
          </p>
          <p className="text-muted-foreground">
            Choose a category like <strong>Coconut</strong> to sell per piece,
            or pick a weight unit (kg / g / metric ton).
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="quantity">
            {unit === "count" ? "Quantity (pieces)" : "Quantity"}
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min={unit === "count" ? 1 : 0.01}
            step={unit === "count" ? 1 : "any"}
            required
          />
        </div>
        <div>
          <Label>Unit</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {UNITS.map((u) => {
              const disabled =
                u.value === "count" && selectedCategory != null && !countSupported;
              return (
                <button
                  key={u.value}
                  type="button"
                  disabled={disabled}
                  title={
                    disabled
                      ? "This category cannot be sold per piece"
                      : undefined
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    unit === u.value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-surface text-muted-foreground hover:border-leaf-soft hover:text-primary",
                    disabled &&
                      "cursor-not-allowed opacity-50 hover:border-border hover:text-muted-foreground",
                  )}
                  onClick={() => !disabled && setUnit(u.value)}
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="district">Location (district)</Label>
        <select
          id="district"
          name="district"
          className={selectClass}
          required
        >
          {SRI_LANKA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} />
      </div>

      <div>
        <Label>Product images (max 5)</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="mt-1.5"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="h-20 w-20 rounded-xl border border-border object-cover"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="harvestDate">Harvest date</Label>
          <Input id="harvestDate" name="harvestDate" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bidEndsAt">Bid ends</Label>
          <Input
            id="bidEndsAt"
            name="bidEndsAt"
            type="datetime-local"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="startPrice">Starting bid (LKR)</Label>
        <Input
          id="startPrice"
          name="startPrice"
          type="number"
          min={1}
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Submitting…" : "List for bidding"}
      </Button>
    </form>
  );
}
