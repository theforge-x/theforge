"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  mrr: { label: "MRR", color: "var(--chart-1)" },
  addedRevenue: { label: "Revenue added", color: "var(--chart-2)" },
};

export function RevenueChart({
  data,
}: {
  data: Array<Record<string, number | string>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Studio revenue</CardTitle>
        <CardDescription>
          Recurring revenue vs. client revenue added, last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <BarChart
            data={data}
            margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
          >
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
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mrr" fill="var(--color-mrr)" radius={4} />
            <Bar
              dataKey="addedRevenue"
              fill="var(--color-addedRevenue)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
