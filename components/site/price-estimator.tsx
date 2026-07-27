"use client";

import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const growthModes = {
  steady: {
    label: "Steady compounding",
    multiplier: 0.08,
    description: "A focused system for improving what already works.",
  },
  aggressive: {
    label: "Aggressive growth",
    multiplier: 0.12,
    description: "A fuller build for a team pushing into its next stage.",
  },
} as const;

type GrowthMode = keyof typeof growthModes;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PriceEstimator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000);
  const [onlineShare, setOnlineShare] = useState(40);
  const [growthMode, setGrowthMode] = useState<GrowthMode>("steady");

  const estimate = useMemo(() => {
    const digitallyInfluencedRevenue = monthlyRevenue * (onlineShare / 100);
    const rawBudget =
      digitallyInfluencedRevenue * growthModes[growthMode].multiplier;
    const budget = Math.min(
      50000,
      Math.max(1500, Math.round(rawBudget / 100) * 100),
    );

    return {
      budget,
      diagnosis: Math.round(budget * 0.2),
      build: Math.round(budget * 0.5),
      compounding: Math.round(budget * 0.3),
    };
  }, [growthMode, monthlyRevenue, onlineShare]);

  return (
    <section className="border-border/50 border-y bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono-eyebrow text-accent mb-3 flex items-center gap-2 text-[11px] uppercase">
            <SlidersHorizontal className="size-3.5" />
            Investment estimator
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">
            Find the right scale for the next move.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Use three signals to get a directional investment range. It is a
            starting point for the conversation—not a fixed quote.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-border/50 bg-card rounded-lg border p-7 sm:p-8">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="estimator-revenue"
                  className="text-sm font-medium"
                >
                  Monthly revenue
                </label>
                <Input
                  id="estimator-revenue"
                  type="number"
                  min={0}
                  step={5000}
                  value={monthlyRevenue}
                  onChange={(event) =>
                    setMonthlyRevenue(Math.max(0, Number(event.target.value)))
                  }
                  className="text-lg"
                />
                <p className="text-muted-foreground text-xs">
                  Your current average monthly revenue in USD.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="estimator-online-share"
                    className="text-sm font-medium"
                  >
                    Revenue influenced online
                  </label>
                  <span className="font-mono text-sm text-accent">
                    {onlineShare}%
                  </span>
                </div>
                <input
                  id="estimator-online-share"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={onlineShare}
                  onChange={(event) =>
                    setOnlineShare(Number(event.target.value))
                  }
                  className="accent-primary w-full"
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Mostly offline</span>
                  <span>Fully digital</span>
                </div>
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium">Growth ambition</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(Object.keys(growthModes) as GrowthMode[]).map((mode) => {
                    const selected = growthMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setGrowthMode(mode)}
                        className={`rounded-md border p-3 text-left text-sm transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input hover:border-primary hover:bg-background"
                        }`}
                      >
                        {growthModes[mode].label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-muted-foreground text-xs">
                  {growthModes[growthMode].description}
                </p>
              </fieldset>
            </div>
          </div>

          <div className="border-primary/40 bg-card rounded-lg border p-7 sm:p-8">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-[0.16em]">
              Directional recommendation
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl sm:text-5xl">
                  {formatCurrency(estimate.budget)}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  indicative monthly investment
                </p>
              </div>
              <span className="bg-accent/15 text-accent rounded-full px-3 py-1 text-xs">
                {growthModes[growthMode].label}
              </span>
            </div>

            <div className="border-border/50 mt-8 divide-y border-y">
              {[
                ["Diagnosis & direction", estimate.diagnosis],
                ["System build", estimate.build],
                ["Compounding & optimisation", estimate.compounding],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-4 text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {formatCurrency(Number(value))}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mt-6 max-w-xl text-sm leading-relaxed">
              We calibrate the final scope around the constraint, team and
              opportunity—not revenue alone. The first step is finding out what
              deserves to be built.
            </p>
            <Button asChild variant="ember" className="mt-7">
              <Link href="/contact">
                Talk through the estimate <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
