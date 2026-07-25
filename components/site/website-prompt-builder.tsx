"use client";

import { Check, ChevronLeft, ChevronRight, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BuilderData = {
  businessName: string;
  location: string;
  industry: string;
  audience: string;
  offer: string;
  goal: string;
  differentiator: string;
  tone: string;
  colors: string;
  pages: string;
  callToAction: string;
  contact: string;
};

const initialData: BuilderData = {
  businessName: "",
  location: "",
  industry: "",
  audience: "",
  offer: "",
  goal: "",
  differentiator: "",
  tone: "",
  colors: "",
  pages: "Home, About, Services, Contact",
  callToAction: "",
  contact: "",
};

const steps = [
  {
    eyebrow: "01 / Foundation",
    title: "Start with the business.",
    description:
      "Give the site enough context to feel specific from the first line.",
    fields: ["businessName", "location", "industry", "audience"] as const,
  },
  {
    eyebrow: "02 / Positioning",
    title: "Make the value clear.",
    description:
      "Describe what you sell, who it helps, and the outcome you want.",
    fields: ["offer", "goal", "differentiator"] as const,
  },
  {
    eyebrow: "03 / Direction",
    title: "Set the visual temperature.",
    description:
      "Give the AI a creative direction without boxing it into a template.",
    fields: ["tone", "colors", "pages"] as const,
  },
  {
    eyebrow: "04 / Conversion",
    title: "Tell the site what to do next.",
    description:
      "A beautiful site still needs a clear path for the right visitor.",
    fields: ["callToAction", "contact"] as const,
  },
];

const fieldLabels: Record<keyof BuilderData, string> = {
  businessName: "Business name",
  location: "Location",
  industry: "Industry or category",
  audience: "Ideal customer",
  offer: "What do you sell?",
  goal: "Primary website goal",
  differentiator: "What makes you different?",
  tone: "Brand personality",
  colors: "Color preferences",
  pages: "Pages or sections",
  callToAction: "Primary call to action",
  contact: "Contact details or booking link",
};

const fieldPlaceholders: Record<keyof BuilderData, string> = {
  businessName: "e.g. Northstar Dental",
  location: "e.g. Lagos, Nigeria / serving clients worldwide",
  industry: "e.g. premium dental care, construction, SaaS",
  audience: "e.g. busy professionals looking for preventative care",
  offer: "Describe your products, services, packages, or main offer.",
  goal: "e.g. generate qualified consultations and explain our premium difference",
  differentiator:
    "e.g. same-week appointments, transparent pricing, 20 years of expertise",
  tone: "e.g. confident, warm, editorial, precise, quietly premium",
  colors:
    "e.g. deep forest green, warm cream, copper accents; avoid bright blue",
  pages: "e.g. Home, About, Services, Case Studies, FAQ, Contact",
  callToAction:
    "e.g. Book a consultation / Request a quote / Start a free trial",
  contact: "e.g. hello@example.com, +234..., Calendly URL, or WhatsApp number",
};

function generatePrompt(data: BuilderData) {
  return `You are a senior brand strategist, UX designer, conversion copywriter, and front-end engineer. Create a beautiful, production-quality custom HTML website for the business below.

BUSINESS CONTEXT
- Business: ${data.businessName}
- Location and service area: ${data.location}
- Industry: ${data.industry}
- Ideal customer: ${data.audience}
- Offer: ${data.offer}
- Primary goal: ${data.goal}
- Differentiator: ${data.differentiator}

CREATIVE DIRECTION
- Brand personality: ${data.tone}
- Color preferences: ${data.colors}
- Required pages or sections: ${data.pages}

CONVERSION
- Primary call to action: ${data.callToAction}
- Contact or booking details: ${data.contact}

BUILD REQUIREMENTS
1. First, infer a clear positioning statement and a concise value proposition from the information above. Do not invent unsupported claims, statistics, testimonials, certifications, or awards.
2. Plan a clear information hierarchy before writing the HTML. Each section should earn its place and move the visitor toward the primary action.
3. Write sharp, specific website copy for this business. Avoid generic agency language, filler, clichés, and unexplained jargon.
4. Produce a responsive, semantic HTML document with accessible landmarks, heading hierarchy, labels, keyboard-friendly controls, descriptive image alt text, and visible focus states.
5. Use modern CSS in the same HTML file. Create a cohesive visual system with type scale, spacing rhythm, responsive layouts, tasteful depth, and subtle motion. Respect prefers-reduced-motion.
6. Use image placeholders from Unsplash or another clearly marked source only where imagery is needed, with comments explaining what kind of real image should replace each one.
7. Make the first viewport compelling, establish trust quickly, explain the offer clearly, handle likely objections, and repeat the primary CTA at natural decision points.
8. Include a mobile navigation pattern, hover and focus states, and a contact or lead-capture path using the supplied contact details.
9. Return the complete self-contained HTML file in one code block, followed by a short implementation note listing any assumptions and the highest-value content or assets the business should provide next.

The final result should feel made for ${data.businessName}, not adapted from a generic template.`;
}

export function WebsitePromptBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [prompt, setPrompt] = useState("");

  const currentStep = steps[step];
  const isComplete = currentStep.fields.every((field) => data[field].trim());

  function updateField(field: keyof BuilderData, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function handleNext() {
    if (!isComplete) {
      toast.error("Complete the fields in this step to continue.");
      return;
    }

    if (step === steps.length - 1) {
      setPrompt(generatePrompt(data));
      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    toast.success("Website prompt copied to your clipboard.");
  }

  return (
    <section className="border-y border-border/50 bg-secondary/25">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="mb-12 max-w-3xl">
          <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
            Forge a starting point
          </div>
          <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
            Turn your business context into a build brief.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
            Answer a few focused questions and get a tailored prompt you can
            hand to Claude, ChatGPT, or your preferred AI coding agent to
            generate the first version of your website.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {currentStep.eyebrow}
                </div>
                <h3 className="font-display mt-2 text-2xl">
                  {currentStep.title}
                </h3>
              </div>
              <span className="text-muted-foreground text-sm">
                {step + 1} / {steps.length}
              </span>
            </div>

            <div
              className="mb-8 flex gap-1.5"
              role="progressbar"
              aria-label="Builder progress"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={step + 1}
            >
              {steps.map((item, index) => (
                <div
                  key={item.eyebrow}
                  className={`h-1 flex-1 rounded-full transition-colors ${index <= step ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              {currentStep.description}
            </p>

            <div className="space-y-5">
              {currentStep.fields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`builder-${field}`}>
                    {fieldLabels[field]}
                  </Label>
                  {field === "offer" ||
                  field === "goal" ||
                  field === "differentiator" ||
                  field === "audience" ? (
                    <Textarea
                      id={`builder-${field}`}
                      value={data[field]}
                      onChange={(event) =>
                        updateField(field, event.target.value)
                      }
                      placeholder={fieldPlaceholders[field]}
                      rows={3}
                      required
                    />
                  ) : (
                    <Input
                      id={`builder-${field}`}
                      value={data[field]}
                      onChange={(event) =>
                        updateField(field, event.target.value)
                      }
                      placeholder={fieldPlaceholders[field]}
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
              >
                <ChevronLeft className="size-4" /> Back
              </Button>
              <Button type="button" onClick={handleNext} variant="ember">
                {step === steps.length - 1 ? "Generate prompt" : "Next step"}
                {step === steps.length - 1 ? (
                  <Sparkles className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary p-6 text-primary-foreground sm:p-8">
            {prompt ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">
                      Your generated brief
                    </div>
                    <h3 className="font-display mt-2 text-2xl">
                      Ready for your AI builder.
                    </h3>
                  </div>
                  <Check className="size-5 shrink-0 text-accent" />
                </div>
                <Textarea
                  readOnly
                  value={prompt}
                  aria-label="Generated website prompt"
                  className="min-h-120 resize-y border-primary-foreground/20 bg-black/15 font-mono text-xs leading-relaxed text-primary-foreground placeholder:text-primary-foreground/50"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-5"
                  onClick={copyPrompt}
                >
                  <Copy className="size-4" /> Copy prompt
                </Button>
              </>
            ) : (
              <div className="flex min-h-120 flex-col justify-between gap-10">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">
                    Prompt preview
                  </div>
                  <h3 className="font-display mt-2 text-2xl">
                    Your tailored build brief will appear here.
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground/75">
                    The finished prompt will include positioning guidance, page
                    structure, conversion direction, accessible HTML
                    requirements, and a visual system shaped around your
                    answers.
                  </p>
                </div>
                <div className="space-y-3 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/70">
                  <div className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full border border-primary-foreground/25 font-mono text-[10px]">
                      1
                    </span>
                    Answer the four short steps.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full border border-primary-foreground/25 font-mono text-[10px]">
                      2
                    </span>
                    Generate your custom prompt.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full border border-primary-foreground/25 font-mono text-[10px]">
                      3
                    </span>
                    Copy it into Claude or ChatGPT.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
