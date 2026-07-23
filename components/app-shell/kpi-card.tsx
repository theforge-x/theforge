import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
}) {
  return (
    <Card className="py-5">
      <CardContent className="flex items-start justify-between px-5">
        <div>
          <div className="text-muted-foreground text-xs font-medium">
            {label}
          </div>
          <div className="font-display mt-1.5 text-3xl">{value}</div>
          {delta ? (
            <div
              className={cn(
                "mt-1.5 text-xs font-medium",
                deltaPositive ? "text-emerald-400" : "text-destructive",
              )}
            >
              {delta}
            </div>
          ) : null}
        </div>
        <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-md">
          <Icon className="text-accent size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
