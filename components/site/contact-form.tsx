"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
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
      <div className="border-border bg-card rounded-lg border p-10 text-center">
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
      className="border-border bg-card flex flex-col gap-5 rounded-lg border p-8"
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="service">Service Category</Label>
          <Select name="service">
            <SelectTrigger id="service" className="w-full">
              <SelectValue placeholder="Pick a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web development</SelectItem>
              <SelectItem value="mobile-app">Mobile app development</SelectItem>
              <SelectItem value="design-brand">UI/UX & branding</SelectItem>
              <SelectItem value="growth-marketing">
                SEO & growth marketing
              </SelectItem>
              <SelectItem value="automation-ai">
                Automation & AI solutions
              </SelectItem>
              <SelectItem value="strategy-consulting">
                Strategy & consulting
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Estimated budget</Label>
          <Select name="budget">
            <SelectTrigger id="budget" className="w-full">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lt10k">Under $10K</SelectItem>
              <SelectItem value="10k-100k">$10K – $100K</SelectItem>
              <SelectItem value="100k-1m">$100K – $1M</SelectItem>
              <SelectItem value="1m-plus">$1M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What's stalling growth right now?</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what's going on — one channel underperforming, retention leaking, pricing that hasn't kept up, or something else entirely."
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
            Off to theForge <ArrowUpRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
