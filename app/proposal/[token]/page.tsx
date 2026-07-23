import { eq } from "drizzle-orm";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { PrintProposalButton } from "@/components/sales/print-proposal-button";
import { getStudioSettings } from "@/lib/data-access";
import { db } from "@/lib/db";
import { leads, salesQuotes } from "@/lib/db/schema";

type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  billing?: "one-time" | "monthly";
  category?: string;
};
type Discovery = {
  industry?: string;
  primaryGoal?: string;
  currentState?: string;
  urgency?: string;
  budget?: string;
};

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [[row], settings] = await Promise.all([
    db
      .select({ quote: salesQuotes, lead: leads })
      .from(salesQuotes)
      .leftJoin(leads, eq(salesQuotes.leadId, leads.id))
      .where(eq(salesQuotes.shareToken, token))
      .limit(1),
    getStudioSettings(),
  ]);
  if (!row) notFound();

  const items = (row.quote.items as Item[]).map((item) => ({
    ...item,
    billing: item.billing ?? ("one-time" as const),
    category: item.category ?? "Project scope",
  }));
  const discovery = (row.quote.discovery ?? {}) as Discovery;
  const projectItems = items.filter((item) => item.billing === "one-time");
  const recurringItems = items.filter((item) => item.billing === "monthly");
  const projectSubtotal = projectItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const recurringTotal = recurringItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const projectTotal = projectSubtotal * (1 - row.quote.discountPercent / 100);
  const deposit = projectTotal * (row.quote.depositPercent / 100);

  return (
    <main className="proposal-page min-h-screen bg-[#e9e9e5] px-4 py-8 text-[#111927] sm:px-6 sm:py-12">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/5 print:rounded-none print:shadow-none">
        <header className="bg-[#101b32] px-7 py-8 text-white sm:px-12 sm:py-10">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            <div className="flex items-center gap-3">
              <BrandMark className="size-10" />
              <div>
                <div className="font-display text-xl">
                  {settings.studioName}
                </div>
                <p className="mt-0.5 text-xs text-white/55">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <div className="text-xs leading-6 text-white/60 sm:text-right">
              <div className="font-mono font-semibold text-[#9ef7cd]">
                {row.quote.quoteNumber}
              </div>
              <div>Valid until {row.quote.validUntil}</div>
            </div>
          </div>
          <div className="mt-16 max-w-3xl sm:mt-24">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ef7cd]">
              Growth proposal · {row.lead?.company}
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
              {row.quote.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
              {discovery.primaryGoal ||
                "A focused plan to turn your next digital investment into measurable business progress."}
            </p>
          </div>
        </header>

        <div className="space-y-16 px-7 py-12 sm:px-12 sm:py-16">
          <section>
            <Eyebrow>Our understanding</Eyebrow>
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-[#dfe3e8] sm:grid-cols-3">
              <Fact
                label="Current constraint"
                value={discovery.currentState || "To be confirmed together."}
              />
              <Fact label="Priority" value={discovery.urgency || "Flexible"} />
              <Fact
                label="Delivery window"
                value={row.quote.estimatedTimeline}
              />
            </div>
          </section>

          <section>
            <Eyebrow>Recommended scope</Eyebrow>
            <h2 className="font-display mt-3 text-3xl">
              A complete path to the outcome
            </h2>
            <div className="mt-7 space-y-4">
              {projectItems.map((item, index) => (
                <ScopeItem
                  key={item.id}
                  item={item}
                  index={index}
                  currency={row.quote.currency}
                />
              ))}
              {recurringItems.length ? (
                <div className="mt-9">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#526076]">
                    Ongoing services
                  </div>
                  {recurringItems.map((item, index) => (
                    <ScopeItem
                      key={item.id}
                      item={item}
                      index={projectItems.length + index}
                      currency={row.quote.currency}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="break-inside-avoid">
            <Eyebrow>Investment</Eyebrow>
            <div className="mt-6 grid gap-8 rounded-2xl bg-[#101b32] p-7 text-white sm:grid-cols-[1fr_1.2fr] sm:p-9">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-[#9ef7cd]">
                  Project investment
                </div>
                <div className="font-display mt-3 text-4xl">
                  {money(projectTotal, row.quote.currency)}
                </div>
                {recurringTotal ? (
                  <div className="mt-4 text-sm text-white/65">
                    Plus {money(recurringTotal, row.quote.currency)} per month
                  </div>
                ) : null}
              </div>
              <div className="space-y-3 border-white/15 text-sm sm:border-l sm:pl-8">
                <PriceLine
                  label="Project subtotal"
                  value={money(projectSubtotal, row.quote.currency)}
                />
                {row.quote.discountPercent ? (
                  <PriceLine
                    label="Preferred investment adjustment"
                    value={`−${row.quote.discountPercent}%`}
                    accent
                  />
                ) : null}
                <PriceLine
                  label={`${row.quote.depositPercent}% due to begin`}
                  value={money(deposit, row.quote.currency)}
                  strong
                />
              </div>
            </div>
          </section>

          <section className="grid gap-10 border-t border-[#dfe3e8] pt-12 sm:grid-cols-2">
            <div>
              <Eyebrow>Commercial terms</Eyebrow>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#526076]">
                {row.quote.paymentTerms}
              </p>
            </div>
            <div>
              <Eyebrow>Notes & assumptions</Eyebrow>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#526076]">
                {row.quote.notes ||
                  "Final milestones and delivery dates will be confirmed during kickoff."}
              </p>
            </div>
          </section>

          <section className="break-inside-avoid rounded-2xl border border-[#dfe3e8] p-7 sm:flex sm:items-center sm:justify-between sm:p-9">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 className="font-display mt-3 text-2xl">
                Ready to move forward?
              </h2>
              <p className="mt-2 text-sm text-[#526076]">
                Reply to confirm the scope, then we’ll schedule kickoff and
                issue the first invoice.
              </p>
            </div>
            <ArrowRight className="mt-5 size-8 text-[#e88622] sm:mt-0" />
          </section>
        </div>

        <footer className="flex flex-col gap-5 border-t border-[#dfe3e8] px-7 py-8 text-xs text-[#526076] sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div>
            Prepared for {row.lead?.name} · {row.lead?.email}
            <br />
            Questions? {settings.publicEmail} · {settings.phone}
          </div>
          <PrintProposalButton />
        </footer>
      </article>
    </main>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d46f13]">
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f7f8f8] p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#758196]">
        {label}
      </div>
      <p className="mt-3 text-sm leading-6 text-[#263247]">{value}</p>
    </div>
  );
}

function ScopeItem({
  item,
  index,
  currency,
}: {
  item: Item;
  index: number;
  currency: string;
}) {
  return (
    <div className="grid break-inside-avoid grid-cols-[32px_1fr] gap-4 border-b border-[#e6e8eb] py-5 sm:grid-cols-[40px_1fr_auto]">
      <div className="flex size-8 items-center justify-center rounded-full bg-[#e9fff4] text-[#126b4d]">
        <Check className="size-4" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{item.name}</h3>
          <span className="rounded-full bg-[#f0f2f4] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#667287]">
            {item.category}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667287]">
          {item.description}
        </p>
      </div>
      <div className="col-start-2 text-sm font-semibold sm:col-start-auto sm:text-right">
        {item.quantity > 1 ? `${item.quantity} × ` : ""}
        {money(item.unitPrice, currency)}
        {item.billing === "monthly" ? " / month" : ""}
        <div className="mt-1 text-[10px] font-normal text-[#8b94a3]">
          Phase {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

function PriceLine({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${
        accent
          ? "text-[#9ef7cd]"
          : strong
            ? "border-t border-white/15 pt-3 font-semibold"
            : "text-white/65"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
