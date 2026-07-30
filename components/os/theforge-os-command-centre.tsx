import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  LockKeyhole,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  type OsTone,
  osActivationSteps,
  osAutomations,
  osPodBench,
  osPrinciples,
  osScorecard,
  osServiceModules,
  osStages,
  osTraceability,
} from "@/lib/theforge-os";
import { cn } from "@/lib/utils";

function toneClass(tone: OsTone) {
  return {
    brand: "border-primary/40 text-primary",
    success: "border-emerald-500/40 text-emerald-400",
    warning: "border-amber-500/40 text-amber-400",
    danger: "border-destructive/50 text-destructive",
    muted: "border-border text-muted-foreground",
  }[tone];
}

export function TheForgeOsCommandCentre() {
  const blockedStages = osStages.reduce((sum, stage) => sum + stage.blocked, 0);
  const activeRecords = osStages.reduce((sum, stage) => sum + stage.records, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="font-mono-eyebrow text-[11px] uppercase text-accent">
            theForge OS
          </div>
          <h1 className="font-display mt-2 text-3xl tracking-tight">
            Diagnose, scope, staff, deliver and prove in one operating layer.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Internal-first command centre for the wedge: diagnose the
            constraint, construct a commercial scope, validate margin, assemble
            a pod, and convert into an engagement.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <div className="text-muted-foreground text-xs">Active records</div>
            <div className="font-display mt-1 text-2xl">{activeRecords}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <div className="text-muted-foreground text-xs">Blocked gates</div>
            <div className="font-display mt-1 text-2xl">{blockedStages}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <div className="text-muted-foreground text-xs">Modules</div>
            <div className="font-display mt-1 text-2xl">
              {osServiceModules.length}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <div className="text-muted-foreground text-xs">Bench</div>
            <div className="font-display mt-1 text-2xl">
              {osPodBench.length}
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Gates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {osStages.map((stage) => (
              <div
                key={stage.id}
                className="grid gap-4 rounded-lg border border-border/60 p-4 lg:grid-cols-[0.8fr_1.15fr_0.45fr]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{stage.area}</Badge>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {stage.brand}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{stage.plain}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stage.status} · {stage.owner}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-medium">{stage.gate}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stage.exitCriteria.map((criteria) => (
                      <Badge key={criteria} variant="outline">
                        {criteria}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <div className="text-right">
                    <div className="font-display text-2xl">{stage.records}</div>
                    <div className="text-xs text-muted-foreground">records</div>
                  </div>
                  {stage.blocked ? (
                    <Badge variant="destructive">{stage.blocked} blocked</Badge>
                  ) : (
                    <Badge variant="success">clear</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Activation Path</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {osActivationSteps.map((step, index) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-md bg-secondary">
                    <step.icon className="size-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{step.label}</div>
                    <Progress
                      value={index < 4 ? 100 : 40}
                      className="mt-2 h-1"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Principles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {osPrinciples.map((principle) => (
                <div key={principle.title} className="flex gap-3">
                  <principle.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div>
                    <div className="text-sm font-medium">{principle.title}</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {principle.body}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {osScorecard.map((item) => (
          <Card key={`${item.category}-${item.metric}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-muted-foreground text-xs">
                    {item.category}
                  </div>
                  <div className="mt-1 text-sm font-medium">{item.metric}</div>
                </div>
                <Badge variant="outline" className={cn(toneClass(item.tone))}>
                  {item.signal}
                </Badge>
              </div>
              <div className="font-display mt-4 text-3xl">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Scope & Margin Studio Modules</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {osServiceModules.map((module) => (
              <div
                key={module.id}
                className="rounded-lg border border-border/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid size-9 place-items-center rounded-md bg-secondary">
                    <module.icon className="size-4 text-accent" />
                  </div>
                  <Badge variant="outline">{module.marginBand}</Badge>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{module.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {module.duration} · {module.effort}
                </p>
                <div className="mt-4 grid gap-2">
                  {module.deliverables.map((deliverable) => (
                    <div key={deliverable} className="flex gap-2 text-xs">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {deliverable}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Talent Foundry</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border px-0">
            {osPodBench.map((member) => (
              <div key={member.name} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {member.type} · {member.timezone}
                    </div>
                  </div>
                  <Badge variant="secondary">{member.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{member.rate}</span>
                  <span>{member.availability}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Phase 5 Automation Templates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {osAutomations.map((automation, index) => (
              <div
                key={automation}
                className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-7 place-items-center rounded-md bg-secondary font-mono text-[10px] text-accent">
                    {index + 1}
                  </div>
                  <span className="text-sm">{automation}</span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traceability Matrix</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto px-0">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Playbook</th>
                  <th className="px-6 py-3 text-left font-medium">Entity</th>
                  <th className="px-6 py-3 text-left font-medium">Required</th>
                  <th className="px-6 py-3 text-left font-medium">Section</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {osTraceability.map(([concept, entity, required, section]) => (
                  <tr key={concept}>
                    <td className="px-6 py-3">{concept}</td>
                    <td className="px-6 py-3 font-mono text-xs text-primary">
                      {entity}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {required}
                    </td>
                    <td className="px-6 py-3">{section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex gap-4 p-5">
            <LockKeyhole className="mt-1 size-5 text-accent" />
            <div>
              <h3 className="text-sm font-semibold">Isolation gate</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                workspace_id everywhere, RLS as database backstop, app-layer
                permission checks, signed file access, no sequential IDs.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-4 p-5">
            <CircleDollarSign className="mt-1 size-5 text-accent" />
            <div>
              <h3 className="text-sm font-semibold">Margin-safe scope</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Scope lines compute price, cost and margin before the pod is
                committed or the proposal is sent.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-4 p-5">
            <CalendarDays className="mt-1 size-5 text-accent" />
            <div>
              <h3 className="text-sm font-semibold">Weekly rhythm</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Monday pipeline, mid-week delivery, Friday stored scorecard and
                risk review.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            This is the operational MVP surface. It expresses the full OS model
            and playbook gates in the product UI; persistent schema for
            Engagement, Diagnostic, ScopeLine, Specialist, HandoffRecord and
            Evidence should be added in the Phase 0/1 migration once the team
            signs off on the playbook-to-product traceability matrix.
          </p>
        </div>
      </div>
    </div>
  );
}
