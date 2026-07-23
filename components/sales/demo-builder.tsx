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
const block = (
  type: DemoBlock["type"],
  title: string,
  body: string,
  button?: string,
): DemoBlock => ({ id: crypto.randomUUID(), type, title, body, button });
const templates = {
  launch: [
    block(
      "hero",
      "A sharper way to move forward",
      "A personalized digital experience built around your customers, your team, and your next stage.",
      "Start a conversation",
    ),
    block(
      "features",
      "Everything important, made effortless",
      "Clear services, compelling proof, and intuitive paths to conversion on every device.",
    ),
    block(
      "proof",
      "Trusted where it matters",
      "Use this section for results, testimonials, certifications, and the evidence your buyers need.",
    ),
    block(
      "cta",
      "Ready for the next chapter?",
      "Turn interest into action with one focused next step.",
      "Book a call",
    ),
    block(
      "footer",
      "Built for your brand",
      "A tailored demonstration prepared by The Forge.",
    ),
  ],
  local: [
    block(
      "hero",
      "The local team people recommend",
      "Show customers what makes this business the obvious choice nearby.",
      "Get a quote",
    ),
    block(
      "features",
      "Services without the guesswork",
      "Organize priority services around real customer questions and needs.",
    ),
    block(
      "proof",
      "Real work. Real outcomes.",
      "Feature reviews, recent projects, and local credentials.",
    ),
    block(
      "cta",
      "Let’s solve it together",
      "Make calling, booking, or requesting a quote effortless.",
      "Contact us",
    ),
  ],
  product: [
    block(
      "hero",
      "One product. A better workflow.",
      "Lead with the transformation, then make the product easy to explore.",
      "See it in action",
    ),
    block(
      "features",
      "Designed around the work",
      "Explain the three capabilities that create the greatest customer value.",
    ),
    block(
      "proof",
      "Results teams can measure",
      "Turn adoption, time saved, and revenue impact into credible proof.",
    ),
    block(
      "cta",
      "Try the better way",
      "Give qualified buyers a low-friction next step.",
      "Request a demo",
    ),
  ],
} as const;
const defaultBrand: DemoBrand = {
  primary: "#171717",
  accent: "#e65320",
  background: "#f6f3ed",
  font: "Arial",
};
export function DemoBuilder({ demos }: { demos: Demo[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Demo> | null>(null);
  const [blocks, setBlocks] = useState<DemoBlock[]>([]);
  const [brand, setBrand] = useState<DemoBrand>(defaultBrand);
  const [reusable, setReusable] = useState(false);
  const [pending, setPending] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  function open(demo?: Demo) {
    const value = demo ?? {
      template: "launch",
      status: "draft",
      brand: defaultBrand,
      blocks: templates.launch.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      })),
      reusable: false,
    };
    setEditing(value);
    setBlocks(value.blocks ?? []);
    setBrand(value.brand ?? defaultBrand);
    setReusable(value.reusable ?? false);
  }
  function applyTemplate(name: keyof typeof templates) {
    setBlocks(
      templates[name].map((item) => ({ ...item, id: crypto.randomUUID() })),
    );
    setEditing((current) => ({ ...current, template: name }));
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
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
              <div className="flex items-start justify-between">
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
                <div className="flex gap-1">
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
        <DialogContent className="max-h-[96vh] overflow-y-auto sm:max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Website demo builder</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form
              onSubmit={save}
              className="grid gap-6 xl:grid-cols-[420px_1fr]"
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
                  <Label>Starting template</Label>
                  <div className="mt-2 flex gap-2">
                    {Object.keys(templates).map((name) => (
                      <Button
                        key={name}
                        type="button"
                        size="sm"
                        variant={
                          editing.template === name ? "default" : "outline"
                        }
                        onClick={() =>
                          applyTemplate(name as keyof typeof templates)
                        }
                        className="capitalize"
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Primary</Label>
                    <Input
                      type="color"
                      value={brand.primary}
                      onChange={(e) =>
                        setBrand((value) => ({
                          ...value,
                          primary: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Input
                      type="color"
                      value={brand.accent}
                      onChange={(e) =>
                        setBrand((value) => ({
                          ...value,
                          accent: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Background</Label>
                    <Input
                      type="color"
                      value={brand.background}
                      onChange={(e) =>
                        setBrand((value) => ({
                          ...value,
                          background: e.target.value,
                        }))
                      }
                    />
                  </div>
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
                          ),
                        ])
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Add block" />
                      </SelectTrigger>
                      <SelectContent>
                        {["hero", "features", "proof", "cta", "footer"].map(
                          (type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ),
                        )}
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
                          <Badge variant="outline" className="w-fit capitalize">
                            {item.type}
                          </Badge>
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
                          {item.type === "hero" || item.type === "cta" ? (
                            <Input
                              value={item.button ?? ""}
                              onChange={(e) =>
                                update(item.id, { button: e.target.value })
                              }
                              placeholder="Button label"
                            />
                          ) : null}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setBlocks((current) =>
                              current.filter((value) => value.id !== item.id),
                            )
                          }
                        >
                          <Trash2 />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
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
                  {blocks.map((item) => (
                    <section
                      key={item.id}
                      className="px-6 py-14 sm:px-12"
                      style={{
                        background:
                          item.type === "hero"
                            ? brand.primary
                            : item.type === "cta"
                              ? brand.accent
                              : brand.background,
                        color:
                          item.type === "hero" || item.type === "cta"
                            ? "white"
                            : "#171717",
                      }}
                    >
                      <div className="mx-auto max-w-4xl">
                        <div className="text-[10px] uppercase tracking-[.2em] opacity-70">
                          {item.type}
                        </div>
                        <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
                          {item.title}
                        </h2>
                        <p className="mt-4 max-w-2xl leading-relaxed opacity-80">
                          {item.body}
                        </p>
                        {item.button ? (
                          <span className="mt-6 inline-block rounded-md bg-white px-4 py-3 text-sm font-semibold text-neutral-900">
                            {item.button}
                          </span>
                        ) : null}
                      </div>
                    </section>
                  ))}
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
                <Button variant="ember" disabled={pending || !blocks.length}>
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
