"use client";

import {
  AlertTriangle,
  ArrowRight,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import {
  addOsConstraint,
  addOsPodAssignment,
  addOsScopeLine,
  advanceOsDeal,
  generateOsSow,
  type OsDealPayload as OsDealRecord,
  type OsWorkspacePayload,
  runOsCapacityCheck,
  type OsScopeLinePayload as ScopeLine,
  updateOsDeal,
  updateOsScopeLine,
} from "@/app/os/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type OsScorecardMetric,
  type OsTone,
  osAutomations,
  osPrinciples,
  osScorecard,
  osServiceModules,
  osStages,
  osTraceability,
} from "@/lib/theforge-os";
import { cn } from "@/lib/utils";

type DealStage =
  | "target"
  | "contacted"
  | "fit_conversation"
  | "diagnostic"
  | "proposal"
  | "closed_won"
  | "pod_finalized"
  | "kickoff";

const stageLabels: Record<DealStage, string> = {
  target: "Target",
  contacted: "Contacted",
  fit_conversation: "Fit conversation",
  diagnostic: "Diagnostic",
  proposal: "Proposal",
  closed_won: "Closed won",
  pod_finalized: "Pod finalized",
  kickoff: "Kickoff",
};

const stageOrder: DealStage[] = [
  "target",
  "contacted",
  "fit_conversation",
  "diagnostic",
  "proposal",
  "closed_won",
  "pod_finalized",
  "kickoff",
];

function toneClass(tone: OsTone) {
  return {
    brand: "border-primary/40 text-primary",
    success: "border-emerald-500/40 text-emerald-400",
    warning: "border-amber-500/40 text-amber-400",
    danger: "border-destructive/50 text-destructive",
    muted: "border-border text-muted-foreground",
  }[tone];
}

function currency(value: number) {
  return `$${value.toLocaleString()}`;
}

function lineTotals(lines: ScopeLine[]) {
  const price = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const cost = lines.reduce((sum, line) => sum + line.cost * line.quantity, 0);
  const margin = price ? Math.round(((price - cost) / price) * 100) : 0;
  return { price, cost, margin };
}

function gateStatus(deal: OsDealRecord) {
  const missing: string[] = [];
  if (deal.stage === "target") {
    if (!deal.contact) missing.push("contact");
    if (!deal.source) missing.push("source");
  }
  if (deal.stage === "contacted") {
    if (!deal.nextStep) missing.push("next step");
    if (!deal.decisionMaker) missing.push("decision-maker");
  }
  if (deal.stage === "fit_conversation") {
    if (!deal.sponsor) missing.push("sponsor");
    if (!deal.fitNotes) missing.push("fit notes");
  }
  if (deal.stage === "diagnostic") {
    if (!deal.budgetRange) missing.push("budget range");
    if (!deal.timeline) missing.push("timeline");
    if (!deal.constraints.length) missing.push("Constraint Map");
    if (!deal.successMeasures) missing.push("success measures");
  }
  if (deal.stage === "proposal") {
    if (!deal.scopeLines.length) missing.push("scope lines");
    if (!deal.sowGenerated) missing.push("SOW");
    if (!deal.podCapacityChecked) missing.push("capacity check");
  }
  if (deal.stage === "closed_won") {
    if (!deal.podAssignments.length) missing.push("pod assignments");
    if (deal.podAssignments.length < 2) missing.push("required pod depth");
  }
  return {
    clear: missing.length === 0,
    missing,
  };
}

export function TheForgeOsWorkspace({
  initialData,
}: {
  initialData: OsWorkspacePayload;
}) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [selectedDealId, setSelectedDealId] = useState(
    initialData.deals[0]?.id ?? "",
  );
  const [newConstraint, setNewConstraint] = useState({
    title: "",
    evidence: "",
    impact: 7,
    urgency: 7,
  });
  const [moduleToAdd, setModuleToAdd] = useState(osServiceModules[0]?.id ?? "");
  const [memberToAdd, setMemberToAdd] = useState(
    initialData.specialists[0]?.id ?? "",
  );
  const [roleToAdd, setRoleToAdd] = useState("Lead");

  const deals = data.deals;
  const specialists = data.specialists;
  const audit = data.audit;

  const selectedDeal =
    deals.find((deal) => deal.id === selectedDealId) ?? deals[0] ?? null;
  const totals = lineTotals(selectedDeal?.scopeLines ?? []);
  const selectedGate = selectedDeal
    ? gateStatus(selectedDeal)
    : { clear: false, missing: ["engagement"] };

  const scorecard = useMemo<OsScorecardMetric[]>(() => {
    const weightedPipeline = deals.reduce(
      (sum, deal) =>
        sum +
        deal.value *
          (deal.stage === "proposal"
            ? 0.65
            : deal.stage === "diagnostic"
              ? 0.35
              : 0.15),
      0,
    );
    return [
      {
        category: "Pipeline",
        metric: "Weighted pipeline",
        value: currency(Math.round(weightedPipeline)),
        signal: `${deals.length} active deals`,
        tone: "brand",
      },
      {
        category: "Margin",
        metric: "Selected scope margin",
        value: `${totals.margin}%`,
        signal: totals.margin < 45 ? "unsafe" : "healthy",
        tone: totals.margin < 45 ? "danger" : "success",
      },
      {
        category: "Stage gates",
        metric: "Selected gate",
        value: selectedGate.clear
          ? "Clear"
          : String(selectedGate.missing.length),
        signal: selectedGate.clear ? "ready to advance" : "missing fields",
        tone: selectedGate.clear ? "success" : "warning",
      },
      ...osScorecard.slice(2),
    ];
  }, [deals, selectedGate.clear, selectedGate.missing.length, totals.margin]);

  function run(action: () => Promise<OsWorkspacePayload>) {
    startTransition(async () => {
      const nextData = await action();
      setData(nextData);
      if (!nextData.deals.some((deal) => deal.id === selectedDealId)) {
        setSelectedDealId(nextData.deals[0]?.id ?? "");
      }
      if (!nextData.specialists.some((item) => item.id === memberToAdd)) {
        setMemberToAdd(nextData.specialists[0]?.id ?? "");
      }
    });
  }

  function updateSelectedDeal(update: Partial<OsDealRecord>) {
    if (!selectedDeal) return;
    setData((current) => ({
      ...current,
      deals: current.deals.map((deal) =>
        deal.id === selectedDeal.id ? { ...deal, ...update } : deal,
      ),
    }));
  }

  function advanceDeal() {
    if (!selectedDeal) return;
    startTransition(async () => {
      const saved = await updateOsDeal(selectedDeal.id, selectedDeal);
      setData(saved);
      setData(await advanceOsDeal(selectedDeal.id));
    });
  }

  function saveSelectedDeal() {
    if (!selectedDeal) return;
    run(() => updateOsDeal(selectedDeal.id, selectedDeal));
  }

  function addConstraint() {
    if (!selectedDeal) return;
    if (!newConstraint.title || !newConstraint.evidence) return;
    run(() => addOsConstraint(selectedDeal.id, newConstraint));
    setNewConstraint({ title: "", evidence: "", impact: 7, urgency: 7 });
  }

  function addScopeLine() {
    if (!selectedDeal) return;
    if (!moduleToAdd) return;
    run(() => addOsScopeLine(selectedDeal.id, moduleToAdd));
  }

  function persistScopeLine(line: ScopeLine) {
    run(() =>
      updateOsScopeLine(line.id, {
        quantity: line.quantity,
        price: line.price,
        cost: line.cost,
      }),
    );
  }

  function addPodAssignment() {
    if (!selectedDeal) return;
    if (!memberToAdd) return;
    run(() =>
      addOsPodAssignment({
        dealId: selectedDeal.id,
        engagementId: selectedDeal.engagementId,
        specialistId: memberToAdd,
        role: roleToAdd,
      }),
    );
    setRoleToAdd("Lead");
  }

  function generateSow() {
    if (!selectedDeal) return;
    run(() => generateOsSow(selectedDeal.id));
  }

  function capacityCheck() {
    if (!selectedDeal) return;
    run(() => runOsCapacityCheck(selectedDeal.id));
  }

  if (!selectedDeal) {
    return (
      <Card>
        <CardContent className="p-8 text-sm text-muted-foreground">
          No OS engagements exist yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="command" className="gap-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="font-mono-eyebrow text-[11px] uppercase text-accent">
            theForge OS · Phase 0/1
          </div>
          <h1 className="font-display mt-2 text-3xl tracking-tight">
            Operating system for diagnose → scope → pod → engagement.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            This first-phase workspace has editable opportunity records, stage
            gates, Constraint Map, module-based scope, live margin, pod
            assembly, conversion controls, audit events and the weekly
            scorecard.
          </p>
        </div>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="command">Command</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
          <TabsTrigger value="scope">Scope</TabsTrigger>
          <TabsTrigger value="foundry">Foundry</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="command" className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">Active deals</div>
              <div className="font-display mt-2 text-3xl">{deals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Selected stage
              </div>
              <div className="font-display mt-2 text-3xl">
                {stageLabels[selectedDeal.stage]}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">Scope margin</div>
              <div className="font-display mt-2 text-3xl">{totals.margin}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">Audit events</div>
              <div className="font-display mt-2 text-3xl">{audit.length}</div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Gates</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {osStages.map((stage) => (
                <div
                  key={stage.id}
                  className="grid gap-4 rounded-lg border border-border/60 p-4 lg:grid-cols-[0.75fr_1.15fr_0.45fr]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{stage.area}</Badge>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                        {stage.brand}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">
                      {stage.plain}
                    </h3>
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
                      <div className="font-display text-2xl">
                        {stage.records}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        records
                      </div>
                    </div>
                    {stage.blocked ? (
                      <Badge variant="destructive">
                        {stage.blocked} blocked
                      </Badge>
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
                <CardTitle>Selected Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  value={selectedDealId}
                  onChange={(event) => setSelectedDealId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.client}
                    </option>
                  ))}
                </select>
                <div>
                  <div className="text-sm font-semibold">
                    {selectedDeal.client}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {selectedDeal.desiredResult}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Current gate
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {stageLabels[selectedDeal.stage]}
                      </div>
                    </div>
                    <Badge
                      variant={selectedGate.clear ? "success" : "destructive"}
                    >
                      {selectedGate.clear ? "Ready" : "Blocked"}
                    </Badge>
                  </div>
                  {!selectedGate.clear ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Missing: {selectedGate.missing.join(", ")}
                    </p>
                  ) : null}
                </div>
                <Button onClick={advanceDeal} className="w-full">
                  {isPending ? "Saving..." : "Advance stage"}{" "}
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Scorecard</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {scorecard.map((item) => (
                  <div
                    key={`${item.category}-${item.metric}`}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {item.category}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          {item.metric}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(toneClass(item.tone))}
                      >
                        {item.signal}
                      </Badge>
                    </div>
                    <div className="font-display mt-3 text-2xl">
                      {item.value}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </TabsContent>

      <TabsContent value="pipeline" className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Record</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Client</Label>
                <Input
                  value={selectedDeal.client}
                  onChange={(event) =>
                    updateSelectedDeal({ client: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Contact</Label>
                <Input
                  value={selectedDeal.contact}
                  onChange={(event) =>
                    updateSelectedDeal({ contact: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Next step</Label>
                <Input
                  value={selectedDeal.nextStep}
                  onChange={(event) =>
                    updateSelectedDeal({ nextStep: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Decision-maker</Label>
                <Input
                  value={selectedDeal.decisionMaker}
                  onChange={(event) =>
                    updateSelectedDeal({ decisionMaker: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Sponsor</Label>
                <Input
                  value={selectedDeal.sponsor}
                  onChange={(event) =>
                    updateSelectedDeal({ sponsor: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Fit notes</Label>
                <Textarea
                  value={selectedDeal.fitNotes}
                  onChange={(event) =>
                    updateSelectedDeal({ fitNotes: event.target.value })
                  }
                  rows={4}
                />
              </div>
              <Button onClick={saveSelectedDeal} disabled={isPending}>
                {isPending ? "Saving..." : "Save opportunity"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Board</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {stageOrder.slice(0, 8).map((stage) => {
                const items = deals.filter((deal) => deal.stage === stage);
                return (
                  <div
                    key={stage}
                    className="min-h-48 rounded-lg border border-border/60 bg-secondary/20 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold">
                        {stageLabels[stage]}
                      </h3>
                      <Badge variant="outline">{items.length}</Badge>
                    </div>
                    <div className="grid gap-2">
                      {items.map((deal) => (
                        <button
                          type="button"
                          key={deal.id}
                          onClick={() => setSelectedDealId(deal.id)}
                          className={cn(
                            "rounded-md border bg-card p-3 text-left text-sm transition-colors hover:border-primary/50",
                            deal.id === selectedDeal.id &&
                              "border-primary/70 bg-primary/10",
                          )}
                        >
                          <div className="font-medium">{deal.client}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {currency(deal.value)} · {deal.owner}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="diagnostic" className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Workspace</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Business context</Label>
                <Textarea
                  value={selectedDeal.businessContext}
                  onChange={(event) =>
                    updateSelectedDeal({ businessContext: event.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Desired result</Label>
                <Textarea
                  value={selectedDeal.desiredResult}
                  onChange={(event) =>
                    updateSelectedDeal({ desiredResult: event.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Current systems</Label>
                <Input
                  value={selectedDeal.currentSystems}
                  onChange={(event) =>
                    updateSelectedDeal({ currentSystems: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Budget range</Label>
                  <Input
                    value={selectedDeal.budgetRange}
                    onChange={(event) =>
                      updateSelectedDeal({ budgetRange: event.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Timeline</Label>
                  <Input
                    value={selectedDeal.timeline}
                    onChange={(event) =>
                      updateSelectedDeal({ timeline: event.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Success measures</Label>
                <Input
                  value={selectedDeal.successMeasures}
                  onChange={(event) =>
                    updateSelectedDeal({ successMeasures: event.target.value })
                  }
                />
              </div>
              <Button onClick={saveSelectedDeal} disabled={isPending}>
                {isPending ? "Saving..." : "Save diagnostic"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Constraint Map</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3">
                {selectedDeal.constraints.map((constraint, index) => (
                  <div
                    key={constraint.id}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                          Rank {index + 1}
                        </div>
                        <h3 className="mt-1 text-sm font-semibold">
                          {constraint.title}
                        </h3>
                      </div>
                      <Badge variant="secondary">
                        {constraint.impact + constraint.urgency} score
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      {constraint.evidence}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border/60 p-4">
                <h3 className="text-sm font-semibold">Add constraint</h3>
                <div className="mt-4 grid gap-3">
                  <Input
                    placeholder="Constraint"
                    value={newConstraint.title}
                    onChange={(event) =>
                      setNewConstraint((value) => ({
                        ...value,
                        title: event.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Evidence"
                    value={newConstraint.evidence}
                    onChange={(event) =>
                      setNewConstraint((value) => ({
                        ...value,
                        evidence: event.target.value,
                      }))
                    }
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={newConstraint.impact}
                      onChange={(event) =>
                        setNewConstraint((value) => ({
                          ...value,
                          impact: Number(event.target.value),
                        }))
                      }
                    />
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={newConstraint.urgency}
                      onChange={(event) =>
                        setNewConstraint((value) => ({
                          ...value,
                          urgency: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <Button onClick={addConstraint}>
                    <Plus className="size-4" /> Add to map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="scope" className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">Client price</div>
              <div className="font-display mt-2 text-3xl">
                {currency(totals.price)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Projected cost
              </div>
              <div className="font-display mt-2 text-3xl">
                {currency(totals.cost)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">
                Projected margin
              </div>
              <div className="font-display mt-2 text-3xl">{totals.margin}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">SOW package</div>
              <div className="mt-2">
                <Badge
                  variant={selectedDeal.sowGenerated ? "success" : "outline"}
                >
                  {selectedDeal.sowGenerated ? "Generated" : "Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Scope Lines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDeal.scopeLines.map((line) => {
                const module = osServiceModules.find(
                  (item) => item.id === line.moduleId,
                );
                const lineMargin = line.price
                  ? Math.round(((line.price - line.cost) / line.price) * 100)
                  : 0;
                return (
                  <div
                    key={line.id}
                    className="grid gap-4 rounded-lg border border-border/60 p-4 lg:grid-cols-[1fr_90px_120px_120px_80px]"
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {module?.name ?? line.moduleId}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {module?.requiredRoles.join(", ")}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onBlur={() => persistScopeLine(line)}
                      onChange={(event) =>
                        updateSelectedDeal({
                          scopeLines: selectedDeal.scopeLines.map((item) =>
                            item.id === line.id
                              ? {
                                  ...item,
                                  quantity: Number(event.target.value),
                                }
                              : item,
                          ),
                        })
                      }
                    />
                    <Input
                      type="number"
                      value={line.price}
                      onBlur={() => persistScopeLine(line)}
                      onChange={(event) =>
                        updateSelectedDeal({
                          scopeLines: selectedDeal.scopeLines.map((item) =>
                            item.id === line.id
                              ? { ...item, price: Number(event.target.value) }
                              : item,
                          ),
                        })
                      }
                    />
                    <Input
                      type="number"
                      value={line.cost}
                      onBlur={() => persistScopeLine(line)}
                      onChange={(event) =>
                        updateSelectedDeal({
                          scopeLines: selectedDeal.scopeLines.map((item) =>
                            item.id === line.id
                              ? { ...item, cost: Number(event.target.value) }
                              : item,
                          ),
                        })
                      }
                    />
                    <Badge
                      variant={lineMargin < 45 ? "destructive" : "success"}
                      className="self-center justify-center"
                    >
                      {lineMargin}%
                    </Badge>
                  </div>
                );
              })}

              <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-end">
                <div className="grid flex-1 gap-2">
                  <Label>Add module</Label>
                  <select
                    value={moduleToAdd}
                    onChange={(event) => setModuleToAdd(event.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {osServiceModules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={addScopeLine}>
                  <Plus className="size-4" /> Add scope line
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={selectedDeal.sowGenerated ? "outline" : "ember"}
                onClick={generateSow}
                disabled={isPending}
                className="w-full"
              >
                <FileText className="size-4" />
                Generate proposal / SOW
              </Button>
              <Button
                variant={
                  selectedDeal.podCapacityChecked ? "outline" : "default"
                }
                onClick={capacityCheck}
                disabled={isPending}
                className="w-full"
              >
                <Users className="size-4" />
                Run provisional pod check
              </Button>
              <div className="rounded-lg border border-border/60 p-4">
                <div className="text-sm font-semibold">Acceptance criteria</div>
                <Textarea
                  className="mt-3"
                  rows={6}
                  value={selectedDeal.acceptanceCriteria}
                  onChange={(event) =>
                    updateSelectedDeal({
                      acceptanceCriteria: event.target.value,
                    })
                  }
                />
              </div>
              {totals.margin < 45 ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  Unsafe margin. Adjust scope, price or cost before proposal
                  exit.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="foundry" className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Talent Bench</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border px-0">
              {specialists.map((member) => (
                <div key={member.id} className="px-6 py-4">
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

          <Card>
            <CardHeader>
              <CardTitle>Pod Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {selectedDeal.podAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">
                          {assignment.memberName}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {assignment.role}
                        </p>
                      </div>
                      <Badge variant="outline">{assignment.capacity}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 rounded-lg border border-border/60 p-4">
                <select
                  value={memberToAdd}
                  onChange={(event) => setMemberToAdd(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {specialists.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <Input
                  value={roleToAdd}
                  onChange={(event) => setRoleToAdd(event.target.value)}
                  placeholder="Role on pod"
                />
                <Button onClick={addPodAssignment} disabled={isPending}>
                  <Plus className="size-4" /> Add assignment
                </Button>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Foundry gate</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Every required role staffed, contracts checked, no
                      unresolved capacity/cost conflict.
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedDeal.podAssignments.length >= 2
                        ? "success"
                        : "destructive"
                    }
                  >
                    {selectedDeal.podAssignments.length >= 2
                      ? "Ready"
                      : "Needs depth"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="controls" className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-4">
          {osPrinciples.map((principle) => (
            <Card key={principle.title}>
              <CardContent className="flex gap-4 p-5">
                <principle.icon className="mt-1 size-5 shrink-0 text-accent" />
                <div>
                  <h3 className="text-sm font-semibold">{principle.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {principle.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    <th className="px-6 py-3 text-left font-medium">
                      Playbook
                    </th>
                    <th className="px-6 py-3 text-left font-medium">Entity</th>
                    <th className="px-6 py-3 text-left font-medium">
                      Required
                    </th>
                    <th className="px-6 py-3 text-left font-medium">Section</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {osTraceability.map(
                    ([concept, entity, required, section]) => (
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
                    ),
                  )}
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
              <ShieldCheck className="mt-1 size-5 text-accent" />
              <div>
                <h3 className="text-sm font-semibold">Auditability</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Role, gate, stage, scope and pod changes write an event with
                  actor, target, action and detail.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border px-0">
            {audit.map((event) => (
              <div
                key={event.id}
                className="grid gap-2 px-6 py-4 text-sm md:grid-cols-[90px_160px_1fr]"
              >
                <div className="font-mono text-xs text-muted-foreground">
                  {event.time}
                </div>
                <div>
                  <div className="font-medium">{event.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {event.actor}
                  </div>
                </div>
                <div>
                  <div>{event.target}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {event.detail}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              Phase 0/1 now persists core OS records in Drizzle. Stage
              advancement, diagnostics, scope lines, proposal controls and pod
              assembly all write server-side activity events.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
