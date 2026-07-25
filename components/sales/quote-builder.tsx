"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Printer,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Billing = "one-time" | "monthly";
type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  billing: Billing;
  category: string;
};
type Discovery = {
  industry: string;
  primaryGoal: string;
  currentState: string;
  urgency: string;
  budget: string;
};
type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
type Quote = {
  id: string;
  leadId: string | null;
  quoteNumber: string;
  title: string;
  status: QuoteStatus;
  currency: string;
  items: Item[];
  discovery: Discovery;
  discountPercent: number;
  depositPercent: number;
  estimatedTimeline: string;
  paymentTerms: string;
  notes: string;
  validUntil: string;
  shareToken: string;
  trainingMode: boolean;
  scenario: string | null;
  leadName: string;
  leadEmail: string;
  company: string;
  phone: string;
};
type Draft = Omit<Quote, "id" | "quoteNumber" | "shareToken"> & {
  id?: string;
  quoteNumber?: string;
  shareToken?: string;
};

const steps = ["Prospect", "Discover", "Recommend", "Price", "Review"];
const catalog: Omit<Item, "id">[] = [
  {
    name: "Growth & systems diagnosis",
    description:
      "Stakeholder discovery, funnel audit, opportunity map, and ranked roadmap.",
    quantity: 1,
    unitPrice: 1800,
    billing: "one-time",
    category: "Strategy",
  },
  {
    name: "Brand & experience direction",
    description:
      "Positioning, visual direction, customer journeys, and conversion-ready UI system.",
    quantity: 1,
    unitPrice: 3200,
    billing: "one-time",
    category: "Experience",
  },
  {
    name: "Conversion website",
    description:
      "Custom responsive website, CMS, analytics, SEO foundations, and launch support.",
    quantity: 1,
    unitPrice: 8500,
    billing: "one-time",
    category: "Digital product",
  },
  {
    name: "Web application",
    description:
      "Authenticated product with database, integrations, admin tooling, and deployment.",
    quantity: 1,
    unitPrice: 18000,
    billing: "one-time",
    category: "Digital product",
  },
  {
    name: "Mobile application",
    description:
      "Cross-platform mobile product with production deployment and analytics.",
    quantity: 1,
    unitPrice: 22000,
    billing: "one-time",
    category: "Digital product",
  },
  {
    name: "SEO growth foundation",
    description:
      "Technical SEO, search architecture, schema, priority pages, and reporting baseline.",
    quantity: 1,
    unitPrice: 4200,
    billing: "one-time",
    category: "Demand",
  },
  {
    name: "Demand generation system",
    description:
      "Campaign strategy, landing experiences, tracking, CRM handoffs, and optimization.",
    quantity: 1,
    unitPrice: 2800,
    billing: "monthly",
    category: "Demand",
  },
  {
    name: "CRM & revenue operations",
    description:
      "Pipeline design, CRM implementation, lifecycle automation, and team enablement.",
    quantity: 1,
    unitPrice: 6500,
    billing: "one-time",
    category: "Operations",
  },
  {
    name: "AI agent & chatbot",
    description:
      "Production AI assistant with knowledge, guardrails, integrations, and evaluation.",
    quantity: 1,
    unitPrice: 9000,
    billing: "one-time",
    category: "AI & automation",
  },
  {
    name: "Business process automation",
    description:
      "Workflow mapping and implementation across systems, teams, and data.",
    quantity: 1,
    unitPrice: 7200,
    billing: "one-time",
    category: "AI & automation",
  },
  {
    name: "Hosting, care & support",
    description:
      "Managed hosting, monitoring, updates, backups, and priority support.",
    quantity: 1,
    unitPrice: 450,
    billing: "monthly",
    category: "Ongoing",
  },
  {
    name: "Growth optimization partnership",
    description:
      "Ongoing experiments, reporting, engineering, and strategic direction.",
    quantity: 1,
    unitPrice: 3500,
    billing: "monthly",
    category: "Ongoing",
  },
];
const packages = [
  {
    name: "Launch",
    fit: "A focused business that needs a clear, credible digital foundation.",
    outcome: "Look credible and start converting",
    items: [
      "Growth & systems diagnosis",
      "Brand & experience direction",
      "Conversion website",
      "Hosting, care & support",
    ],
  },
  {
    name: "Growth Engine",
    fit: "An established team ready to turn visibility into a repeatable pipeline.",
    outcome: "Create and compound demand",
    popular: true,
    items: [
      "Growth & systems diagnosis",
      "Conversion website",
      "SEO growth foundation",
      "Demand generation system",
      "Growth optimization partnership",
    ],
  },
  {
    name: "Intelligent Operations",
    fit: "A growing company losing time to disconnected systems and manual work.",
    outcome: "Automate work and improve handoffs",
    items: [
      "Growth & systems diagnosis",
      "CRM & revenue operations",
      "AI agent & chatbot",
      "Business process automation",
      "Hosting, care & support",
    ],
  },
  {
    name: "Custom Platform",
    fit: "A complex opportunity requiring a purpose-built product and integrations.",
    outcome: "Build a durable digital advantage",
    items: [
      "Growth & systems diagnosis",
      "Brand & experience direction",
      "Web application",
      "Hosting, care & support",
    ],
  },
];
const emptyDiscovery: Discovery = {
  industry: "",
  primaryGoal: "",
  currentState: "",
  urgency: "Flexible",
  budget: "Not confirmed",
};
const newDraft = (): Draft => ({
  leadId: null,
  leadName: "",
  leadEmail: "",
  company: "",
  phone: "",
  title: "Digital growth proposal",
  status: "draft",
  currency: "USD",
  items: [],
  discovery: emptyDiscovery,
  discountPercent: 0,
  depositPercent: 50,
  estimatedTimeline: "4–6 weeks",
  paymentTerms:
    "50% to begin, remaining project balance tied to agreed delivery milestones.",
  notes: "",
  validUntil: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  trainingMode: true,
  scenario: null,
});

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.length === 3 ? currency : "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `${currency || "USD"} ${(value || 0).toLocaleString()}`;
  }
}

export function QuoteBuilder({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const totals = useMemo(() => {
    const once =
      draft?.items
        .filter((item) => item.billing === "one-time")
        .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ?? 0;
    const monthly =
      draft?.items
        .filter((item) => item.billing === "monthly")
        .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ?? 0;
    const discounted = once * (1 - (draft?.discountPercent ?? 0) / 100);
    return {
      once,
      monthly,
      discounted,
      due: discounted * ((draft?.depositPercent ?? 0) / 100),
    };
  }, [draft]);

  function open(quote?: Quote) {
    setDraft(
      quote
        ? {
            ...quote,
            discovery: { ...emptyDiscovery, ...quote.discovery },
            items: quote.items.map((item) => ({
              ...item,
              billing: item.billing ?? "one-time",
              category: item.category ?? "Custom",
            })),
          }
        : newDraft(),
    );
    setStep(0);
    setCatalogOpen(false);
  }
  function patch(value: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...value } : current));
  }
  function patchDiscovery(value: Partial<Discovery>) {
    setDraft((current) =>
      current
        ? { ...current, discovery: { ...current.discovery, ...value } }
        : current,
    );
  }
  function addItem(source?: Omit<Item, "id">) {
    const item: Item = source
      ? { ...source, id: crypto.randomUUID() }
      : {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          billing: "one-time",
          category: "Custom",
        };
    setDraft((current) =>
      current ? { ...current, items: [...current.items, item] } : current,
    );
  }
  function updateItem(id: string, value: Partial<Item>) {
    setDraft((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === id ? { ...item, ...value } : item,
            ),
          }
        : current,
    );
  }
  function removeItem(id: string) {
    setDraft((current) =>
      current
        ? { ...current, items: current.items.filter((item) => item.id !== id) }
        : current,
    );
  }
  function applyPackage(itemNames: string[], packageName: string) {
    const selected = itemNames
      .map((name) => catalog.find((item) => item.name === name))
      .filter(Boolean) as Omit<Item, "id">[];
    setDraft((current) =>
      current
        ? {
            ...current,
            scenario: packageName,
            items: selected.map((item) => ({
              ...item,
              id: crypto.randomUUID(),
            })),
          }
        : current,
    );
    setStep(3);
  }
  async function save(status?: QuoteStatus) {
    if (!draft) return;
    if (!draft.company || !draft.leadName || !draft.leadEmail || !draft.title) {
      toast.error("Complete the prospect details before saving.");
      setStep(0);
      return;
    }
    if (
      (status !== "draft" && !draft.items.length) ||
      draft.items.some((item) => !item.name)
    ) {
      toast.error("Add at least one complete scope item.");
      setStep(3);
      return;
    }
    setPending(true);
    try {
      const payload = { ...draft, status: status ?? draft.status };
      const response = await fetch("/api/sales/quotes", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save quote");
      toast.success(
        status === "sent" ? "Quote saved and ready to share" : "Quote saved",
      );
      setDraft(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save quote",
      );
    } finally {
      setPending(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete this quote?")) return;
    const response = await fetch(`/api/sales/quotes?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Quote deleted");
      router.refresh();
    } else toast.error("Could not delete quote");
  }

  const active = quotes.filter(
    (quote) => quote.status === "draft" || quote.status === "sent",
  ).length;
  const won = quotes.filter((quote) => quote.status === "accepted").length;
  const pipeline = quotes
    .filter((quote) => quote.status !== "declined")
    .reduce((sum, quote) => {
      const once = quote.items
        .filter((item) => (item.billing ?? "one-time") === "one-time")
        .reduce((value, item) => value + item.quantity * item.unitPrice, 0);
      return sum + once * (1 - quote.discountPercent / 100);
    }, 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open proposals", value: String(active) },
          { label: "Accepted", value: String(won) },
          { label: "Pipeline value", value: money(pipeline, "USD") },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="text-muted-foreground text-xs">
                {metric.label}
              </div>
              <div className="font-display mt-2 text-2xl">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl">Proposals</h3>
          <p className="text-muted-foreground text-xs">
            Draft, present, share, and track every commercial conversation.
          </p>
        </div>
        <Button variant="ember" onClick={() => open()}>
          <Plus /> Build a quote
        </Button>
      </div>
      <div className="grid gap-4">
        {quotes.map((quote) => {
          const once =
            quote.items
              .filter((item) => (item.billing ?? "one-time") === "one-time")
              .reduce(
                (value, item) => value + item.quantity * item.unitPrice,
                0,
              ) *
            (1 - quote.discountPercent / 100);
          const monthly = quote.items
            .filter((item) => item.billing === "monthly")
            .reduce((value, item) => value + item.quantity * item.unitPrice, 0);
          return (
            <Card key={quote.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="min-w-0 text-left"
                  onClick={() => open(quote)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{quote.title}</span>
                    <Badge
                      variant={
                        quote.status === "accepted" ? "success" : "outline"
                      }
                      className="capitalize"
                    >
                      {quote.status}
                    </Badge>
                    {quote.trainingMode ? (
                      <Badge variant="secondary">Guided</Badge>
                    ) : null}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {quote.quoteNumber} · {quote.company} ·{" "}
                    {money(once, quote.currency)}
                    {monthly ? ` + ${money(monthly, quote.currency)}/mo` : ""}
                  </div>
                </button>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" asChild>
                    <a
                      href={`/proposal/${quote.shareToken}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open proposal"
                    >
                      <Printer />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${location.origin}/proposal/${quote.shareToken}`,
                      );
                      toast.success("Share link copied");
                    }}
                    aria-label="Copy share link"
                  >
                    <Copy />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(quote.id)}
                    aria-label="Delete quote"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!quotes.length ? (
          <Card>
            <CardContent className="text-muted-foreground p-12 text-center text-sm">
              <FileText className="mx-auto mb-3 size-8 opacity-50" />
              No proposals yet. Use the guided builder to shape the first one.
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Dialog
        open={draft !== null}
        onOpenChange={(value) => !value && setDraft(null)}
      >
        <DialogContent className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] grid-rows-[minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:h-[96dvh] sm:max-h-[96dvh] sm:max-w-[1180px]">
          {draft ? (
            <div className="flex h-full min-h-0 flex-col overflow-hidden">
              <DialogHeader className="border-border/50 shrink-0 border-b px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 pr-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-0">
                  <div>
                    <DialogTitle>Forge proposal builder</DialogTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Turn discovery into a clear recommendation and a
                      client-ready commercial story.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:mr-8">
                    <GraduationCap className="text-primary size-4" />
                    <Label htmlFor="guided-mode" className="text-xs">
                      Guided mode
                    </Label>
                    <Switch
                      id="guided-mode"
                      checked={draft.trainingMode}
                      onCheckedChange={(trainingMode) =>
                        patch({ trainingMode })
                      }
                    />
                  </div>
                </div>
              </DialogHeader>
              <div className="border-border/50 bg-secondary/30 shrink-0 border-b px-5 py-3">
                <ol
                  className="mx-auto flex max-w-4xl gap-1"
                  aria-label="Quote progress"
                >
                  {steps.map((name, index) => (
                    <li key={name} className="flex-1">
                      <button
                        type="button"
                        onClick={() => setStep(index)}
                        className="w-full text-left"
                      >
                        <span
                          className={cn(
                            "block h-1.5 rounded-full transition-colors",
                            index <= step ? "bg-primary" : "bg-border",
                          )}
                        />
                        <span
                          className={cn(
                            "mt-1.5 block text-[10px] font-semibold uppercase tracking-wider",
                            index === step
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {index + 1}. {name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-h-0 touch-pan-y overscroll-contain overflow-y-auto p-5 sm:p-7">
                  <div className="mx-auto max-w-3xl">
                    {draft.trainingMode ? (
                      <div className="border-primary/25 bg-primary/5 mb-6 flex gap-3 rounded-lg border p-4">
                        <Sparkles className="text-primary mt-0.5 size-4 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">
                            {
                              [
                                "Lead with context, not a price.",
                                "Diagnose before recommending.",
                                "Recommend the smallest complete system.",
                                "Price the outcome and make trade-offs visible.",
                                "Review the story from the buyer’s perspective.",
                              ][step]
                            }
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {
                              [
                                "Capture enough detail to personalize every page of the proposal.",
                                "Write down the constraint, desired change, timing, and investment signal.",
                                "Start from a proven configuration, then remove anything that does not support the goal.",
                                "Separate project investment from recurring services and clarify the first payment.",
                                "Make the scope, timing, investment, and next step answerable in under two minutes.",
                              ][step]
                            }
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {step === 0 ? (
                      <section className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl">
                            Who are we helping?
                          </h2>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Start with the buyer and the opportunity—not the
                            list of services.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Business name">
                            <Input
                              value={draft.company}
                              onChange={(e) =>
                                patch({ company: e.target.value })
                              }
                              placeholder="Northstar Health"
                            />
                          </Field>
                          <Field label="Industry">
                            <Input
                              value={draft.discovery.industry}
                              onChange={(e) =>
                                patchDiscovery({ industry: e.target.value })
                              }
                              placeholder="Healthcare, SaaS, professional services…"
                            />
                          </Field>
                          <Field label="Primary contact">
                            <Input
                              value={draft.leadName}
                              onChange={(e) =>
                                patch({ leadName: e.target.value })
                              }
                              placeholder="Jordan Lee"
                            />
                          </Field>
                          <Field label="Work email">
                            <Input
                              type="email"
                              value={draft.leadEmail}
                              onChange={(e) =>
                                patch({ leadEmail: e.target.value })
                              }
                              placeholder="jordan@northstar.com"
                            />
                          </Field>
                          <Field label="Phone">
                            <Input
                              value={draft.phone}
                              onChange={(e) => patch({ phone: e.target.value })}
                              placeholder="Optional"
                            />
                          </Field>
                          <Field label="Proposal title">
                            <Input
                              value={draft.title}
                              onChange={(e) => patch({ title: e.target.value })}
                            />
                          </Field>
                        </div>
                      </section>
                    ) : null}

                    {step === 1 ? (
                      <section className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl">
                            What must change?
                          </h2>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Good discovery creates the logic for the
                            recommendation.
                          </p>
                        </div>
                        <Field label="Primary business outcome">
                          <Textarea
                            rows={3}
                            value={draft.discovery.primaryGoal}
                            onChange={(e) =>
                              patchDiscovery({ primaryGoal: e.target.value })
                            }
                            placeholder="What should be measurably better after this engagement?"
                          />
                        </Field>
                        <Field label="Current constraint">
                          <Textarea
                            rows={4}
                            value={draft.discovery.currentState}
                            onChange={(e) =>
                              patchDiscovery({ currentState: e.target.value })
                            }
                            placeholder="What is happening now, what has already been tried, and where is the friction?"
                          />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Choice
                            label="Timing"
                            value={draft.discovery.urgency}
                            options={[
                              "Immediate",
                              "This quarter",
                              "Next quarter",
                              "Flexible",
                            ]}
                            onChange={(urgency) => patchDiscovery({ urgency })}
                          />
                          <Choice
                            label="Investment signal"
                            value={draft.discovery.budget}
                            options={[
                              "Under $5K",
                              "$5K–$15K",
                              "$15K–$40K",
                              "$40K+",
                              "Not confirmed",
                            ]}
                            onChange={(budget) => patchDiscovery({ budget })}
                          />
                        </div>
                      </section>
                    ) : null}

                    {step === 2 ? (
                      <section className="space-y-7">
                        <div>
                          <h2 className="font-display text-2xl">
                            Recommend a complete system.
                          </h2>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Choose the closest starting point. Everything
                            remains editable.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {packages.map((item) => {
                            const packageItems = item.items
                              .map((name) =>
                                catalog.find((entry) => entry.name === name),
                              )
                              .filter(Boolean) as Omit<Item, "id">[];
                            const once = packageItems
                              .filter((entry) => entry.billing === "one-time")
                              .reduce((sum, entry) => sum + entry.unitPrice, 0);
                            const monthly = packageItems
                              .filter((entry) => entry.billing === "monthly")
                              .reduce((sum, entry) => sum + entry.unitPrice, 0);
                            return (
                              <button
                                type="button"
                                key={item.name}
                                onClick={() =>
                                  applyPackage(item.items, item.name)
                                }
                                className="border-border/50 hover:border-primary/60 bg-card relative rounded-xl border p-5 text-left transition-all hover:shadow-sm"
                              >
                                {item.popular ? (
                                  <Badge
                                    className="absolute right-4 top-4"
                                    variant="success"
                                  >
                                    Recommended
                                  </Badge>
                                ) : null}
                                <div className="font-display text-xl">
                                  {item.name}
                                </div>
                                <p className="text-primary mt-1 text-sm font-medium">
                                  {item.outcome}
                                </p>
                                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                                  {item.fit}
                                </p>
                                <div className="mt-4 text-lg font-semibold">
                                  {money(once, draft.currency)}
                                  {monthly ? (
                                    <span className="text-muted-foreground text-xs">
                                      {" "}
                                      + {money(monthly, draft.currency)}/mo
                                    </span>
                                  ) : null}
                                </div>
                                <ul className="mt-4 space-y-1.5">
                                  {item.items.map((name) => (
                                    <li
                                      key={name}
                                      className="flex gap-2 text-xs"
                                    >
                                      <Check className="text-primary size-3.5 shrink-0" />
                                      {name}
                                    </li>
                                  ))}
                                </ul>
                              </button>
                            );
                          })}
                        </div>
                        <div className="border-border/50 rounded-lg border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">
                                Prefer an à-la-carte scope?
                              </div>
                              <p className="text-muted-foreground text-xs">
                                Browse every Forge capability and assemble it
                                manually.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCatalogOpen(!catalogOpen)}
                            >
                              {catalogOpen ? "Hide catalog" : "Open catalog"}
                            </Button>
                          </div>
                          {catalogOpen ? (
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                              {catalog.map((item) => (
                                <button
                                  type="button"
                                  key={item.name}
                                  onClick={() => addItem(item)}
                                  className="hover:bg-secondary flex items-center justify-between rounded-md border p-3 text-left"
                                >
                                  <div>
                                    <div className="text-xs font-medium">
                                      {item.name}
                                    </div>
                                    <div className="text-muted-foreground mt-0.5 text-[10px]">
                                      {item.category} ·{" "}
                                      {item.billing === "monthly"
                                        ? `${money(item.unitPrice, draft.currency)}/mo`
                                        : money(item.unitPrice, draft.currency)}
                                    </div>
                                  </div>
                                  <Plus className="size-4" />
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </section>
                    ) : null}

                    {step === 3 ? (
                      <section className="space-y-6">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <h2 className="font-display text-2xl">
                              Shape the investment.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                              Make scope, recurring services, and payment
                              expectations unmistakable.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addItem()}
                          >
                            <Plus /> Custom item
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {draft.items.map((item) => (
                            <div
                              key={item.id}
                              className="border-border/50 bg-card grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_90px_140px_130px_36px]"
                            >
                              <div className="grid gap-2">
                                <Input
                                  value={item.name}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Service or deliverable"
                                />
                                <Input
                                  value={item.description}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Describe the outcome, not just the activity"
                                />
                              </div>
                              <Field label="Qty">
                                <Input
                                  type="number"
                                  min={0.01}
                                  step="0.01"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      quantity: Number(e.target.value),
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Unit price">
                                <Input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      unitPrice: Number(e.target.value),
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Billing">
                                <Select
                                  value={item.billing}
                                  onValueChange={(billing: Billing) =>
                                    updateItem(item.id, { billing })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="one-time">
                                      One-time
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                      Monthly
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="mt-5"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                        {!draft.items.length ? (
                          <div className="border-border/50 text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
                            Choose a package, open the catalog, or add a custom
                            item.
                          </div>
                        ) : null}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <Field label="Currency">
                            <Input
                              maxLength={3}
                              value={draft.currency}
                              onChange={(e) =>
                                patch({
                                  currency: e.target.value.toUpperCase(),
                                })
                              }
                            />
                          </Field>
                          <Field label="Discount">
                            <div className="relative">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={draft.discountPercent}
                                onChange={(e) =>
                                  patch({
                                    discountPercent: Number(e.target.value),
                                  })
                                }
                              />
                              <span className="text-muted-foreground absolute right-3 top-2 text-sm">
                                %
                              </span>
                            </div>
                          </Field>
                          <Field label="Deposit due">
                            <div className="relative">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={draft.depositPercent}
                                onChange={(e) =>
                                  patch({
                                    depositPercent: Number(e.target.value),
                                  })
                                }
                              />
                              <span className="text-muted-foreground absolute right-3 top-2 text-sm">
                                %
                              </span>
                            </div>
                          </Field>
                          <Field label="Estimated timeline">
                            <Input
                              value={draft.estimatedTimeline}
                              onChange={(e) =>
                                patch({ estimatedTimeline: e.target.value })
                              }
                            />
                          </Field>
                        </div>
                        <Field label="Payment terms">
                          <Textarea
                            rows={3}
                            value={draft.paymentTerms}
                            onChange={(e) =>
                              patch({ paymentTerms: e.target.value })
                            }
                          />
                        </Field>
                      </section>
                    ) : null}

                    {step === 4 ? (
                      <section className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl">
                            Review the buying story.
                          </h2>
                          <p className="text-muted-foreground mt-1 text-sm">
                            This is what the client needs to understand before
                            saying yes.
                          </p>
                        </div>
                        <div className="border-border/50 bg-card overflow-hidden rounded-xl border">
                          <div className="bg-forge-black px-6 py-8 text-white">
                            <div className="text-gold text-[10px] font-semibold uppercase tracking-[.18em]">
                              Prepared for {draft.company || "the prospect"}
                            </div>
                            <h3 className="font-display mt-3 text-3xl">
                              {draft.title}
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm text-white/60">
                              {draft.discovery.primaryGoal ||
                                "Add the desired business outcome in discovery to make this recommendation more compelling."}
                            </p>
                          </div>
                          <div className="space-y-6 p-6">
                            <div className="grid gap-5 sm:grid-cols-3">
                              <ReviewFact
                                label="Current constraint"
                                value={
                                  draft.discovery.currentState || "Not captured"
                                }
                              />
                              <ReviewFact
                                label="Timing"
                                value={draft.discovery.urgency}
                              />
                              <ReviewFact
                                label="Delivery"
                                value={draft.estimatedTimeline}
                              />
                            </div>
                            <div>
                              <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                                Recommended scope
                              </div>
                              <div className="mt-3 divide-y divide-border">
                                {draft.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4 py-3"
                                  >
                                    <div>
                                      <div className="text-sm font-medium">
                                        {item.name}
                                      </div>
                                      <div className="text-muted-foreground mt-1 text-xs">
                                        {item.description}
                                      </div>
                                    </div>
                                    <div className="shrink-0 text-sm font-medium">
                                      {money(
                                        item.quantity * item.unitPrice,
                                        draft.currency,
                                      )}
                                      {item.billing === "monthly" ? "/mo" : ""}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Field label="Client-facing notes">
                              <Textarea
                                rows={4}
                                value={draft.notes}
                                onChange={(e) =>
                                  patch({ notes: e.target.value })
                                }
                                placeholder="Add assumptions, exclusions, a recommendation rationale, or the next action."
                              />
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-3">
                              <Field label="Valid until">
                                <Input
                                  type="date"
                                  value={draft.validUntil}
                                  onChange={(e) =>
                                    patch({ validUntil: e.target.value })
                                  }
                                />
                              </Field>
                              <Field label="Proposal status">
                                <Select
                                  value={draft.status}
                                  onValueChange={(status: QuoteStatus) =>
                                    patch({ status })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "draft",
                                      "sent",
                                      "accepted",
                                      "declined",
                                    ].map((value) => (
                                      <SelectItem
                                        key={value}
                                        value={value}
                                        className="capitalize"
                                      >
                                        {value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>

                <aside className="border-border/50 bg-card hidden min-h-0 border-l lg:flex lg:flex-col">
                  <div className="border-border/50 border-b p-5">
                    <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[.15em]">
                      Live quote
                    </div>
                    <div className="font-display mt-2 text-xl">
                      {draft.company || "New prospect"}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {draft.scenario
                        ? `${draft.scenario} configuration`
                        : "Custom configuration"}
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <div className="space-y-3">
                      {draft.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-medium">
                              {item.name || "Untitled item"}
                            </div>
                            <div className="text-muted-foreground">
                              {item.billing === "monthly"
                                ? "Recurring"
                                : "Project"}
                            </div>
                          </div>
                          <span className="shrink-0">
                            {money(
                              item.quantity * item.unitPrice,
                              draft.currency,
                            )}
                            {item.billing === "monthly" ? "/mo" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-border/50 space-y-3 border-t p-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Project subtotal
                      </span>
                      <span>{money(totals.once, draft.currency)}</span>
                    </div>
                    {draft.discountPercent ? (
                      <div className="text-primary flex justify-between text-xs">
                        <span>Discount</span>
                        <span>−{draft.discountPercent}%</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-base font-semibold">
                      <span>Project total</span>
                      <span>{money(totals.discounted, draft.currency)}</span>
                    </div>
                    {totals.monthly ? (
                      <div className="flex justify-between text-sm">
                        <span>Monthly services</span>
                        <span>{money(totals.monthly, draft.currency)}/mo</span>
                      </div>
                    ) : null}
                    <div className="bg-secondary flex justify-between rounded-md p-3 text-xs">
                      <span>Due to begin</span>
                      <span className="font-semibold">
                        {money(totals.due, draft.currency)}
                      </span>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="border-border/50 bg-background flex shrink-0 flex-col-reverse gap-2 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                >
                  <ArrowLeft /> Back
                </Button>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    onClick={() => save("draft")}
                  >
                    {pending ? <Loader2 className="animate-spin" /> : null} Save
                    draft
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button
                      type="button"
                      variant="ember"
                      onClick={() =>
                        setStep((value) =>
                          Math.min(steps.length - 1, value + 1),
                        )
                      }
                    >
                      Next: {steps[step + 1]} <ArrowRight />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ember"
                      disabled={pending}
                      onClick={() => save("sent")}
                    >
                      {pending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Send />
                      )}{" "}
                      Save & prepare to share
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/50 hover:border-primary/50",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </div>
      <p className="mt-2 line-clamp-4 text-xs leading-relaxed">{value}</p>
    </div>
  );
}
