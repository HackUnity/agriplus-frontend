"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileSettings() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Settings and profile"
        description="Manage the basic profile details that help AgriPilot adjust explanations for your farming experience."
      />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);
              window.setTimeout(() => {
                setSaving(false);
                toast.success("Profile saved");
              }, 400);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Beginner Farmer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience level</Label>
              <select
                id="experience"
                defaultValue="beginner"
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs transition-colors hover:border-border-strong focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
              >
                <option value="beginner">Beginner</option>
                <option value="some">Some farming experience</option>
                <option value="advanced">Experienced farmer</option>
              </select>
            </div>
            <Button disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
