"use client";

import {
  Copy,
  Download,
  Eye,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import type { DemoBlock, DemoBrand } from "@/lib/demo-render";

type Demo = {
  id: string;
  leadId: string | null;
  title: string;
  prospectName: string;
  template: string;
  status: "draft" | "published";
  shareToken: string;
  brand: DemoBrand;
  blocks: DemoBlock[];
  reusable: boolean;
  leadEmail: string;
  company: string;
};

type BuilderMode = "builder" | "html";

type TemplateKey =
  | "launch"
  | "local"
  | "product"
  | "saas"
  | "clinic"
  | "restaurant"
  | "nonprofit"
  | "portfolio";

const blockTypes: DemoBlock["type"][] = [
  "hero",
  "features",
  "stats",
  "process",
  "proof",
  "pricing",
  "faq",
  "gallery",
  "cta",
  "footer",
];

const defaultBrand: DemoBrand = {
  primary: "#171717",
  accent: "#e65320",
  background: "#f6f3ed",
  text: "#171717",
  muted: "#6b6b6b",
  font: "Arial",
  radius: "18px",
  style: "minimal",
};

const brandPresets: Record<string, DemoBrand> = {
  Forge: defaultBrand,
  Slate: {
    primary: "#0f172a",
    accent: "#2563eb",
    background: "#f8fafc",
    text: "#0f172a",
    muted: "#64748b",
    font: "Inter",
    radius: "12px",
    style: "minimal",
  },
  Bloom: {
    primary: "#5b2149",
    accent: "#db2777",
    background: "#fff7ed",
    text: "#3b1d2f",
    muted: "#8b5f73",
    font: "Georgia",
    radius: "28px",
    style: "soft",
  },
  Signal: {
    primary: "#07111f",
    accent: "#00a884",
    background: "#eef6f3",
    text: "#07111f",
    muted: "#49635d",
    font: "Arial",
    radius: "6px",
    style: "bold",
  },
};

const block = (
  type: DemoBlock["type"],
  title: string,
  body: string,
  options: Partial<DemoBlock> = {},
): DemoBlock => ({
  id: crypto.randomUUID(),
  type,
  title,
  body,
  ...options,
});

const templates: Record<
  TemplateKey,
  {
    label: string;
    audience: string;
    description: string;
    brand: DemoBrand;
    blocks: DemoBlock[];
  }
> = {
  launch: {
    label: "Launch site",
    audience: "General business",
    description: "A clean concept for pitching a sharper marketing site.",
    brand: defaultBrand,
    blocks: [
      block(
        "hero",
        "A sharper way to move forward",
        "A personalized digital experience built around your customers, your team, and your next stage.",
        {
          button: "Start a conversation",
          buttonHref: "mailto:hello@theforge.ng",
        },
      ),
      block(
        "features",
        "Everything important, made effortless",
        "Clear services, compelling proof, and intuitive paths to conversion on every device.",
        {
          items: [
            "Positioning that explains the offer fast",
            "Conversion paths for every buyer intent",
            "Fast, responsive pages built to scale",
          ],
        },
      ),
      block(
        "proof",
        "Trusted where it matters",
        "Use this section for results, testimonials, certifications, and the evidence your buyers need.",
        {
          items: [
            "Customer outcomes",
            "Operating credibility",
            "Before-and-after proof",
          ],
        },
      ),
      block(
        "cta",
        "Ready for the next chapter?",
        "Turn interest into action with one focused next step.",
        {
          button: "Book a call",
          buttonHref: "mailto:hello@theforge.ng",
        },
      ),
      block(
        "footer",
        "Built for your brand",
        "A tailored demonstration prepared by The Forge.",
      ),
    ],
  },
  local: {
    label: "Local services",
    audience: "Trades, clinics, agencies",
    description: "A high-trust site for calls, bookings, and local proof.",
    brand: brandPresets.Slate,
    blocks: [
      block(
        "hero",
        "The local team people recommend",
        "Show customers what makes this business the obvious choice nearby.",
        {
          button: "Get a quote",
          buttonHref: "#contact",
        },
      ),
      block(
        "features",
        "Services without the guesswork",
        "Organize priority services around real customer questions and needs.",
        {
          items: [
            "Clear service categories",
            "Quote-ready enquiry flow",
            "Mobile-first contact paths",
          ],
        },
      ),
      block(
        "stats",
        "Proof customers can scan",
        "Turn local credibility into quick confidence signals.",
        {
          items: [
            "4.9★ average reviews",
            "1,200+ jobs completed",
            "24hr response target",
          ],
        },
      ),
      block(
        "proof",
        "Real work. Real outcomes.",
        "Feature reviews, recent projects, and local credentials.",
        {
          items: [
            "Recent project gallery",
            "Customer testimonials",
            "Licenses and service areas",
          ],
        },
      ),
      block(
        "cta",
        "Let’s solve it together",
        "Make calling, booking, or requesting a quote effortless.",
        {
          button: "Contact us",
          buttonHref: "#contact",
        },
      ),
    ],
  },
  product: {
    label: "Product landing",
    audience: "Productized offers",
    description: "A focused landing page for a product, course, or package.",
    brand: brandPresets.Signal,
    blocks: [
      block(
        "hero",
        "One product. A better workflow.",
        "Lead with the transformation, then make the product easy to explore.",
        {
          button: "See it in action",
          buttonHref: "#demo",
        },
      ),
      block(
        "features",
        "Designed around the work",
        "Explain the capabilities that create the greatest customer value.",
        {
          items: ["Faster setup", "Clear reporting", "Guided next steps"],
        },
      ),
      block(
        "pricing",
        "Simple package, clear value",
        "Show the offer without forcing a full proposal too early.",
        {
          meta: "From $2,500",
          items: [
            "Strategy session",
            "Launch-ready build",
            "30-day optimization window",
          ],
          button: "Request pricing",
          buttonHref: "#contact",
        },
      ),
      block(
        "cta",
        "Try the better way",
        "Give qualified buyers a low-friction next step.",
        {
          button: "Request a demo",
          buttonHref: "#contact",
        },
      ),
    ],
  },
  saas: {
    label: "SaaS demo",
    audience: "B2B software",
    description: "A conversion path for demo requests and feature validation.",
    brand: brandPresets.Signal,
    blocks: [
      block(
        "hero",
        "Turn scattered operations into one clear system",
        "A product story built around the buyer’s current workflow, risks, and measurable upside.",
        {
          button: "Book product walkthrough",
          buttonHref: "#contact",
        },
      ),
      block(
        "stats",
        "Impact the team can defend",
        "Use measurable claims and operational proof to support the demo ask.",
        {
          items: [
            "38% less manual follow-up",
            "12 hrs saved weekly",
            "2.4x faster handoff",
          ],
        },
      ),
      block(
        "features",
        "What the platform changes",
        "Frame the product around the operational jobs it improves.",
        {
          items: [
            "Centralized pipeline visibility",
            "Automated task routing",
            "Executive-ready reporting",
          ],
        },
      ),
      block(
        "process",
        "The buying path is clear",
        "Reduce uncertainty by showing exactly what happens after they engage.",
        {
          items: [
            "Discovery call",
            "Workflow mapping",
            "Guided pilot",
            "Rollout plan",
          ],
        },
      ),
      block(
        "cta",
        "See the workflow with your data",
        "Make the next step specific and valuable.",
        {
          button: "Schedule demo",
          buttonHref: "#contact",
        },
      ),
    ],
  },
  clinic: {
    label: "Clinic care",
    audience: "Healthcare and wellness",
    description: "A warm trust-first layout for appointments and services.",
    brand: brandPresets.Bloom,
    blocks: [
      block(
        "hero",
        "Care that feels clear before the first visit",
        "Help patients understand services, availability, and what to expect.",
        {
          button: "Book an appointment",
          buttonHref: "#booking",
        },
      ),
      block(
        "features",
        "Services organized around patient needs",
        "Make it easy to choose the right path without medical guesswork.",
        {
          items: [
            "Preventive care",
            "Specialist consultations",
            "Follow-up support",
          ],
        },
      ),
      block(
        "faq",
        "Questions answered early",
        "Reduce friction before patients contact the clinic.",
        {
          items: [
            "What should I bring?",
            "Do you accept insurance?",
            "Can I book same-day visits?",
          ],
        },
      ),
      block(
        "cta",
        "Ready to plan your visit?",
        "Give patients a clear, calm next step.",
        {
          button: "Request appointment",
          buttonHref: "#booking",
        },
      ),
    ],
  },
  restaurant: {
    label: "Restaurant",
    audience: "Food and hospitality",
    description: "A visual site for menus, bookings, and signature offers.",
    brand: {
      primary: "#2a130c",
      accent: "#c45a2c",
      background: "#fff8ef",
      text: "#2a130c",
      muted: "#7a594d",
      font: "Georgia",
      radius: "18px",
      style: "editorial",
    },
    blocks: [
      block(
        "hero",
        "A table worth planning your week around",
        "Present the experience, signature dishes, and reservation path immediately.",
        {
          button: "Reserve a table",
          buttonHref: "#reservations",
        },
      ),
      block(
        "gallery",
        "Signature moments",
        "Use a compact gallery section for dishes, ambience, and events.",
        {
          items: [
            "Seasonal tasting menu",
            "Private dining room",
            "Weekend brunch",
            "Chef’s specials",
          ],
        },
      ),
      block(
        "features",
        "Everything guests need",
        "Bring practical information into the main flow.",
        {
          items: [
            "Menus and dietary options",
            "Location and parking",
            "Events and catering",
          ],
        },
      ),
      block(
        "cta",
        "Join us this week",
        "Move guests from browsing to booking.",
        {
          button: "Book now",
          buttonHref: "#reservations",
        },
      ),
    ],
  },
  nonprofit: {
    label: "Nonprofit",
    audience: "Causes and campaigns",
    description: "A mission-led page for donations, volunteers, and proof.",
    brand: {
      primary: "#12352f",
      accent: "#e0a526",
      background: "#f4f0df",
      text: "#12352f",
      muted: "#65746b",
      font: "Arial",
      radius: "12px",
      style: "soft",
    },
    blocks: [
      block(
        "hero",
        "Make the mission impossible to ignore",
        "Explain the cause, the urgency, and the clearest way to contribute.",
        {
          button: "Support the work",
          buttonHref: "#donate",
        },
      ),
      block(
        "stats",
        "The need in clear numbers",
        "Use concise metrics to make the problem tangible.",
        {
          items: [
            "8 communities served",
            "4,500 people reached",
            "92% funds to programs",
          ],
        },
      ),
      block(
        "process",
        "How support becomes impact",
        "Show donors and partners where their contribution goes.",
        {
          items: [
            "Fund priority programs",
            "Deploy local teams",
            "Measure outcomes",
            "Report transparently",
          ],
        },
      ),
      block(
        "cta",
        "Help move the work forward",
        "Give supporters one primary action.",
        {
          button: "Donate today",
          buttonHref: "#donate",
        },
      ),
    ],
  },
  portfolio: {
    label: "Portfolio",
    audience: "Creatives and consultants",
    description: "A sharp personal site for proof, services, and contact.",
    brand: {
      primary: "#111111",
      accent: "#7c3aed",
      background: "#fafafa",
      text: "#111111",
      muted: "#666666",
      font: "Inter",
      radius: "0px",
      style: "bold",
    },
    blocks: [
      block(
        "hero",
        "Selected work for ambitious teams",
        "A concise portfolio concept that makes expertise, outcomes, and fit easy to evaluate.",
        {
          button: "Start a project",
          buttonHref: "#contact",
        },
      ),
      block(
        "gallery",
        "Featured work",
        "Group case studies around outcomes instead of screenshots alone.",
        {
          items: [
            "Growth website redesign",
            "Customer portal UX",
            "Launch campaign system",
          ],
        },
      ),
      block(
        "proof",
        "Why teams hire this partner",
        "Turn strengths into concrete buying criteria.",
        {
          items: [
            "Strategy before execution",
            "Fast senior-level delivery",
            "Clear communication rhythm",
          ],
        },
      ),
      block(
        "cta",
        "Have a project in mind?",
        "Convert qualified interest into a direct conversation.",
        {
          button: "Send brief",
          buttonHref: "#contact",
        },
      ),
    ],
  },
};

const cloneBlocks = (items: DemoBlock[]) =>
  items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    items: item.items ? [...item.items] : undefined,
  }));

const itemsToText = (items?: string[]) => (items ?? []).join("\n");

const textToItems = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const htmlBlock = (html = ""): DemoBlock =>
  block("html", "Imported HTML demo", "Raw HTML imported into the demo.", {
    html,
  });

export function DemoBuilder({ demos }: { demos: Demo[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Demo> | null>(null);
  const [blocks, setBlocks] = useState<DemoBlock[]>([]);
  const [mode, setMode] = useState<BuilderMode>("builder");
  const [brand, setBrand] = useState<DemoBrand>(defaultBrand);
  const [reusable, setReusable] = useState(false);
  const [pending, setPending] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);

  function open(demo?: Demo) {
    const value = demo ?? {
      template: "launch",
      status: "draft",
      brand: defaultBrand,
      blocks: cloneBlocks(templates.launch.blocks),
      reusable: false,
    };
    setEditing(value);
    setBlocks(value.blocks ?? []);
    setMode(value.blocks?.[0]?.type === "html" ? "html" : "builder");
    setBrand({ ...defaultBrand, ...(value.brand ?? {}) });
    setReusable(value.reusable ?? false);
  }

  function applyTemplate(name: TemplateKey) {
    setBlocks(cloneBlocks(templates[name].blocks));
    setBrand(templates[name].brand);
    setMode("builder");
    setEditing((current) => ({ ...current, template: name }));
  }

  function changeMode(nextMode: BuilderMode) {
    setMode(nextMode);
    if (nextMode === "html") {
      const currentHtml = blocks.find((item) => item.type === "html")?.html;
      setBlocks([htmlBlock(currentHtml)]);
      setEditing((current) => ({ ...current, template: "html" }));
      return;
    }
    setBlocks(cloneBlocks(templates.launch.blocks));
    setBrand(defaultBrand);
    setEditing((current) => ({ ...current, template: "launch" }));
  }

  function updateImportedHtml(html: string) {
    setBlocks((current) => {
      const currentBlock = current.find((item) => item.type === "html");
      return [{ ...(currentBlock ?? htmlBlock()), html }];
    });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (mode === "html" && !blocks[0]?.html?.trim()) {
      toast.error("Add HTML before saving this demo");
      return;
    }
    setPending(true);
    try {
      const form = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/sales/demos", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editing.id,
          leadId: editing.leadId ?? null,
          template: editing.template ?? "launch",
          brand,
          blocks,
          reusable,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save demo");
      toast.success(editing.id ? "Demo updated" : "Demo created");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save demo",
      );
    } finally {
      setPending(false);
    }
  }

  async function duplicate(id: string) {
    const response = await fetch("/api/sales/demos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      toast.success("Demo duplicated");
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this demo?")) return;
    const response = await fetch(`/api/sales/demos?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Demo deleted");
      router.refresh();
    }
  }

  function update(id: string, patch: Partial<DemoBlock>) {
    setBlocks((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function drop(index: number) {
    if (dragging === null || dragging === index) return;
    setBlocks((current) => {
      const next = [...current];
      const [moved] = next.splice(dragging, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragging(null);
  }

  function previewBackground(item: DemoBlock) {
    if (item.type === "hero") return brand.primary;
    if (item.type === "cta") return brand.accent;
    if (brand.style === "editorial" && blocks.indexOf(item) % 2)
      return "#ffffff99";
    return brand.background;
  }

  function previewColor(item: DemoBlock) {
    return item.type === "hero" || item.type === "cta"
      ? "white"
      : (brand.text ?? "#171717");
  }

  const importedHtml = blocks.find((item) => item.type === "html")?.html ?? "";

  return (
    <>
      <div className="flex justify-end">
        <Button variant="ember" onClick={() => open()}>
          <Plus />
          New website demo
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {demos.map((demo) => (
          <Card key={demo.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => open(demo)}
                >
                  <div className="font-medium">{demo.title}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {demo.prospectName} · {demo.template} template
                  </div>
                </button>
                <div className="flex flex-wrap justify-end gap-1">
                  <Badge
                    variant={
                      demo.status === "published" ? "success" : "outline"
                    }
                    className="capitalize"
                  >
                    {demo.status}
                  </Badge>
                  {demo.reusable ? (
                    <Badge variant="secondary">Reusable</Badge>
                  ) : null}
                </div>
              </div>
              <div className="border-border mt-4 flex flex-wrap gap-1 border-t pt-4">
                <Button size="sm" variant="ghost" asChild>
                  <a
                    href={`/demo/${demo.shareToken}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Eye />
                    Preview
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${location.origin}/demo/${demo.shareToken}`,
                    );
                    toast.success("Demo link copied");
                  }}
                >
                  <Copy />
                  Share
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={`/api/sales/demos/${demo.id}/export`}>
                    <Download />
                    HTML
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicate(demo.id)}
                >
                  <Copy />
                  Duplicate
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(demo.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!demos.length ? (
          <Card className="md:col-span-2">
            <CardContent className="text-muted-foreground p-10 text-center text-sm">
              Create a personalized mockup from a reusable starting point.
            </CardContent>
          </Card>
        ) : null}
      </div>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[96vh] overflow-y-auto sm:max-w-[96vw]">
          <DialogHeader>
            <DialogTitle>Website demo builder</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form
              onSubmit={save}
              className="grid gap-6 xl:grid-cols-[460px_1fr]"
            >
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>Demo title</Label>
                    <Input
                      name="title"
                      defaultValue={editing.title}
                      placeholder="Acme website concept"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Prospect</Label>
                    <Input
                      name="prospectName"
                      defaultValue={editing.prospectName}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Company</Label>
                    <Input
                      name="company"
                      defaultValue={editing.company}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>Prospect email</Label>
                    <Input
                      name="leadEmail"
                      type="email"
                      defaultValue={editing.leadEmail}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Select name="status" defaultValue={editing.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2 pb-2">
                    <Switch checked={reusable} onCheckedChange={setReusable} />
                    <Label>Reusable template</Label>
                  </div>
                </div>

                <div>
                  <Label>Demo creation method</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => changeMode("builder")}
                      className={`border-border rounded-lg border p-3 text-left transition hover:border-foreground ${
                        mode === "builder"
                          ? "bg-secondary border-foreground"
                          : "bg-card"
                      }`}
                    >
                      <div className="text-sm font-medium">Use builder</div>
                      <p className="text-muted-foreground mt-1 text-xs leading-5">
                        Start from templates, edit blocks, and customize brand
                        settings.
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => changeMode("html")}
                      className={`border-border rounded-lg border p-3 text-left transition hover:border-foreground ${
                        mode === "html"
                          ? "bg-secondary border-foreground"
                          : "bg-card"
                      }`}
                    >
                      <div className="text-sm font-medium">Import HTML</div>
                      <p className="text-muted-foreground mt-1 text-xs leading-5">
                        Paste a complete HTML page and save it directly as the
                        website demo.
                      </p>
                    </button>
                  </div>
                </div>

                {mode === "html" ? (
                  <div className="flex flex-col gap-2">
                    <Label>HTML input</Label>
                    <Textarea
                      value={importedHtml}
                      onChange={(e) => updateImportedHtml(e.target.value)}
                      rows={18}
                      placeholder="Paste a complete HTML document, or a standalone HTML fragment with inline CSS."
                      className="font-mono text-xs"
                    />
                    <p className="text-muted-foreground text-xs leading-5">
                      Imported HTML is previewed in a sandboxed iframe. Export
                      downloads the same HTML you paste here.
                    </p>
                  </div>
                ) : null}

                {mode === "builder" ? (
                  <>
                    <div>
                      <Label>Template library</Label>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {Object.entries(templates).map(([name, template]) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => applyTemplate(name as TemplateKey)}
                            className={`border-border rounded-lg border p-3 text-left transition hover:border-foreground ${
                              editing.template === name
                                ? "bg-secondary border-foreground"
                                : "bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {template.label}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {template.blocks.length} blocks
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {template.audience}
                            </p>
                            <p className="text-muted-foreground mt-2 text-xs leading-5">
                              {template.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Brand system</Label>
                        <Select
                          onValueChange={(value) =>
                            setBrand(brandPresets[value])
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Preset" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(brandPresets).map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {(
                          [
                            "primary",
                            "accent",
                            "background",
                            "text",
                            "muted",
                          ] as const
                        ).map((key) => (
                          <div key={key} className="flex flex-col gap-2">
                            <Label className="capitalize">{key}</Label>
                            <Input
                              type="color"
                              value={brand[key] ?? defaultBrand[key]}
                              onChange={(e) =>
                                setBrand((value) => ({
                                  ...value,
                                  [key]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        ))}
                        <div className="flex flex-col gap-2">
                          <Label>Font family</Label>
                          <Input
                            value={brand.font}
                            onChange={(e) =>
                              setBrand((value) => ({
                                ...value,
                                font: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Style</Label>
                          <Select
                            value={brand.style ?? "minimal"}
                            onValueChange={(value) =>
                              setBrand((current) => ({
                                ...current,
                                style: value as DemoBrand["style"],
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="editorial">
                                Editorial
                              </SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="soft">Soft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Corner radius</Label>
                          <Select
                            value={brand.radius ?? "18px"}
                            onValueChange={(value) =>
                              setBrand((current) => ({
                                ...current,
                                radius: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0px">Sharp</SelectItem>
                              <SelectItem value="6px">Small</SelectItem>
                              <SelectItem value="12px">Medium</SelectItem>
                              <SelectItem value="18px">Large</SelectItem>
                              <SelectItem value="28px">Pill</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Content blocks · drag to reorder</Label>
                        <Select
                          onValueChange={(value) =>
                            setBlocks((current) => [
                              ...current,
                              block(
                                value as DemoBlock["type"],
                                "New section",
                                "Add prospect-specific content here.",
                                {
                                  items: [
                                    "First supporting point",
                                    "Second supporting point",
                                    "Third supporting point",
                                  ],
                                },
                              ),
                            ])
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Add block" />
                          </SelectTrigger>
                          <SelectContent>
                            {blockTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="capitalize"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <ul className="space-y-2">
                        {blocks.map((item, index) => (
                          <li
                            key={item.id}
                            draggable
                            onDragStart={() => setDragging(index)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => drop(index)}
                            className="border-border bg-card grid grid-cols-[24px_1fr_32px] gap-2 rounded-lg border p-3"
                          >
                            <GripVertical className="text-muted-foreground mt-2 size-4 cursor-grab" />
                            <div className="grid gap-2">
                              <div className="grid gap-2 sm:grid-cols-[130px_1fr]">
                                <Select
                                  value={item.type}
                                  onValueChange={(value) =>
                                    update(item.id, {
                                      type: value as DemoBlock["type"],
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {blockTypes.map((type) => (
                                      <SelectItem
                                        key={type}
                                        value={type}
                                        className="capitalize"
                                      >
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  value={item.eyebrow ?? ""}
                                  onChange={(e) =>
                                    update(item.id, { eyebrow: e.target.value })
                                  }
                                  placeholder="Eyebrow label"
                                />
                              </div>
                              <Input
                                value={item.title}
                                onChange={(e) =>
                                  update(item.id, { title: e.target.value })
                                }
                              />
                              <Textarea
                                value={item.body}
                                onChange={(e) =>
                                  update(item.id, { body: e.target.value })
                                }
                                rows={2}
                              />
                              {[
                                "features",
                                "proof",
                                "stats",
                                "process",
                                "pricing",
                                "faq",
                                "gallery",
                              ].includes(item.type) ? (
                                <Textarea
                                  value={itemsToText(item.items)}
                                  onChange={(e) =>
                                    update(item.id, {
                                      items: textToItems(e.target.value),
                                    })
                                  }
                                  rows={3}
                                  placeholder="One list item per line"
                                />
                              ) : null}
                              {item.type === "pricing" ? (
                                <Input
                                  value={item.meta ?? ""}
                                  onChange={(e) =>
                                    update(item.id, { meta: e.target.value })
                                  }
                                  placeholder="Price or package label"
                                />
                              ) : null}
                              {item.type === "hero" ||
                              item.type === "cta" ||
                              item.type === "pricing" ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <Input
                                    value={item.button ?? ""}
                                    onChange={(e) =>
                                      update(item.id, {
                                        button: e.target.value,
                                      })
                                    }
                                    placeholder="Button label"
                                  />
                                  <Input
                                    value={item.buttonHref ?? ""}
                                    onChange={(e) =>
                                      update(item.id, {
                                        buttonHref: e.target.value,
                                      })
                                    }
                                    placeholder="Button URL, #anchor, or mailto:"
                                  />
                                </div>
                              ) : null}
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setBlocks((current) =>
                                  current.filter(
                                    (value) => value.id !== item.id,
                                  ),
                                )
                              }
                            >
                              <Trash2 />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>

              <div
                className="border-border overflow-hidden rounded-xl border"
                style={{ background: brand.background, fontFamily: brand.font }}
              >
                <div className="bg-secondary/70 flex items-center gap-2 border-b px-4 py-2">
                  <span className="size-2 rounded-full bg-red-400" />
                  <span className="size-2 rounded-full bg-yellow-400" />
                  <span className="size-2 rounded-full bg-green-400" />
                  <span className="text-muted-foreground ml-3 text-[10px]">
                    Instant responsive preview
                  </span>
                </div>
                <div className="max-h-[75vh] overflow-y-auto text-neutral-900">
                  {mode === "html" ? (
                    importedHtml.trim() ? (
                      <iframe
                        title="Imported HTML preview"
                        sandbox=""
                        srcDoc={importedHtml}
                        className="h-[72vh] w-full border-0 bg-white"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-[72vh] items-center justify-center p-8 text-center text-sm">
                        Paste HTML to preview the imported demo.
                      </div>
                    )
                  ) : (
                    blocks.map((item) => (
                      <section
                        key={item.id}
                        className={`px-6 py-14 sm:px-12 ${brand.style === "soft" ? "" : "border-b"}`}
                        style={{
                          background: previewBackground(item),
                          color: previewColor(item),
                        }}
                      >
                        <div className="mx-auto max-w-4xl">
                          <div className="text-[10px] uppercase tracking-[.2em] opacity-70">
                            {item.eyebrow || item.type}
                          </div>
                          <h2
                            className={`mt-3 text-3xl font-bold sm:text-5xl ${brand.style === "bold" ? "tracking-tighter" : ""}`}
                          >
                            {item.title}
                          </h2>
                          <p className="mt-4 max-w-2xl leading-relaxed opacity-80">
                            {item.body}
                          </p>
                          {item.type === "pricing" && item.meta ? (
                            <div
                              className="mt-5 inline-block rounded-[var(--demo-radius)] px-4 py-3 text-sm font-bold text-white"
                              style={
                                {
                                  background: brand.primary,
                                  "--demo-radius": brand.radius,
                                } as CSSProperties
                              }
                            >
                              {item.meta}
                            </div>
                          ) : null}
                          {item.items?.length ? (
                            <div
                              className={
                                item.type === "stats"
                                  ? "mt-7 grid gap-3 sm:grid-cols-3"
                                  : "mt-7 grid gap-3 sm:grid-cols-2"
                              }
                            >
                              {item.items.map((listItem) => (
                                <div
                                  key={listItem}
                                  className="border bg-white/50 p-4 leading-relaxed"
                                  style={{
                                    borderRadius: brand.radius,
                                    color: brand.text,
                                  }}
                                >
                                  {listItem}
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {item.button ? (
                            <span
                              className="mt-6 inline-block bg-white px-4 py-3 text-sm font-semibold text-neutral-900"
                              style={{ borderRadius: brand.radius }}
                            >
                              {item.button}
                            </span>
                          ) : null}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </div>

              <DialogFooter className="xl:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="ember"
                  disabled={
                    pending ||
                    !blocks.length ||
                    (mode === "html" && !importedHtml.trim())
                  }
                >
                  {pending ? <Loader2 className="animate-spin" /> : <Save />}
                  Save demo
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
