"use client";

import type * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: React.ReactNode;
    color?: string;
  }
>;

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const style = Object.entries(config).reduce<Record<string, string>>(
    (acc, [key, val]) => {
      if (val.color) acc[`--color-${key}`] = val.color;
      return acc;
    },
    {},
  );

  return (
    <div
      data-slot="chart"
      data-chart={id}
      className={cn(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border flex aspect-video justify-center text-xs",
        className,
      )}
      style={style as React.CSSProperties}
      {...props}
    >
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = "dot",
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
  className?: string;
  indicator?: "dot" | "line";
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "bg-popover text-popover-foreground grid min-w-[9rem] gap-1.5 rounded-lg border border-border/50 px-3 py-2 text-xs shadow-md",
        className,
      )}
    >
      {label ? <div className="font-medium">{label}</div> : null}
      {payload.map((item, idx) => (
        <div key={item.dataKey ?? idx} className="flex items-center gap-2">
          <span
            className={cn(
              indicator === "dot"
                ? "size-2 rounded-full"
                : "h-2 w-3 rounded-xs",
            )}
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="ml-auto font-mono font-medium text-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

export { ChartContainer, ChartTooltip, ChartTooltipContent };
