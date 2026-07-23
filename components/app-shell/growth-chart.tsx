"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const config: ChartConfig = {
  leads: { label: "Leads", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
};

export function GrowthChart({
  data,
}: {
  data: Array<Record<string, number | string>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline growth</CardTitle>
        <CardDescription>
          Leads generated vs. conversions, last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <AreaChart
            data={data}
            margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={32}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="leads"
              type="monotone"
              fill="url(#fillLeads)"
              stroke="var(--color-leads)"
              strokeWidth={2}
            />
            <Area
              dataKey="conversions"
              type="monotone"
              fill="url(#fillConversions)"
              stroke="var(--color-conversions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
