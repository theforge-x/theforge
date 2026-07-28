"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const serviceCategories = [
  ["constraint-map", "Growth Constraint Map"],
  ["revenue-system-sprint", "Revenue System Sprint"],
  ["temper-growth-partner", "Temper Growth Partner"],
  ["not-sure", "Not sure yet"],
] as const;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      data.service = formData.getAll("service").join(", ");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Could not send message");
      setSubmitted(true);
      toast.success("Message sent — we'll reply within one business day.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send message",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-border/50 bg-card rounded-lg border p-10 text-center">
        <h3 className="font-display text-2xl">Message received.</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Someone from the studio will follow up within one business day to
          understand what you need and recommend the right next step.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border/50 bg-card flex flex-col gap-5 rounded-lg border p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Jordan Reyes" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jordan@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+234 (901) 123-4567"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Company name" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Engagement interest</legend>
          <div className="border-input grid gap-2 rounded-md border p-3 sm:grid-cols-2">
            {serviceCategories.map(([value, label]) => (
              <label
                key={value}
                htmlFor={`service-${value}`}
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <Checkbox
                  id={`service-${value}`}
                  name="service"
                  value={value}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Estimated budget</Label>
          <Select name="budget">
            <SelectTrigger id="budget" className="w-full">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diagnostic">$1.5K-$3K diagnostic</SelectItem>
              <SelectItem value="focused-build">$8K-$15K sprint</SelectItem>
              <SelectItem value="larger-build">$15K-$35K build</SelectItem>
              <SelectItem value="partner">$2.5K-$7.5K monthly</SelectItem>
              <SelectItem value="not-sure">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            It helps us shape a right-sized recommendation before we speak.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What's stalling growth right now?</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us where demand, follow-up, CRM, sales process or reporting is breaking down."
        />
      </div>

      <Button
        type="submit"
        size="lg"
        variant="ember"
        disabled={submitting}
        className="self-start"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send the constraint <ArrowUpRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
