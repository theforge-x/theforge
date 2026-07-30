import { ArrowRight, Check, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join theForge as a Growth Advisor and help founder-led firms find the constraint holding their growth back.",
};

const responsibilities = [
  "Prepare thoroughly for each 30-minute Growth Constraint Map conversation by reviewing the prospect’s business, offer, audience, and available context.",
  "Ask precise, curious questions that uncover where demand, follow-up, pipeline, delivery, or reporting is creating drag.",
  "Turn each conversation into a clear, evidence-led Growth Constraint Map that names the primary constraint, contributing factors, and highest-leverage next move.",
  "Write concise summaries that a client can understand and an internal delivery team can use without needing to repeat the discovery process.",
  "Keep the CRM and meeting notes accurate, timely, and useful for the next person in the client journey.",
  "Collaborate with senior advisors and delivery leads to test your diagnosis, learn the language of systems thinking, and improve the quality of every map.",
];

const requirements = [
  "Strong written communication: you can make a complex business problem feel clear without flattening the nuance.",
  "Commercial curiosity: you want to understand how a business makes money, where customers come from, and what happens between interest and revenue.",
  "A diagnostic mindset: you look for patterns, bottlenecks, handoff failures, and root causes instead of reaching for the most obvious tactic.",
  "Comfort speaking with founders and senior operators in a focused, time-bound conversation.",
  "The discipline to prepare, listen closely, document accurately, and follow through without being chased.",
  "Evidence of thoughtful work in sales, strategy, consulting, customer success, operations, research, writing, or a related field. A conventional degree is not required.",
];

const values = [
  {
    title: "Diagnosis before prescription",
    description:
      "We do not recommend a service because it is familiar or easy to sell. We find the constraint first, then earn the right to discuss a fix.",
  },
  {
    title: "Numbers, not vibes",
    description:
      "Good judgment gets stronger when it is connected to evidence. We ask what changed, where it changed, and how we would know if the fix worked.",
  },
  {
    title: "Clarity is a deliverable",
    description:
      "A useful map gives a founder language for the problem and a team a better starting point. We write so people can act.",
  },
  {
    title: "Own the handoff",
    description:
      "The conversation is not complete when the call ends. The quality of the map determines how well the next team can create momentum.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Careers at theForge"
          title="Find the constraint. Make growth clearer."
          description="We are looking for a thoughtful Growth Advisor to turn focused founder conversations into useful Growth Constraint Maps—and to grow into a senior owner of diagnosis over time."
        />

        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                Open position
              </div>
              <h2 className="font-display mt-3 text-4xl sm:text-5xl">
                Growth Advisor
              </h2>
              <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed">
                The Growth Advisor is the first layer of diagnosis at theForge.
                You will lead or support 30-minute conversations with
                founder-led firms, listen for the constraint beneath the
                symptoms, and draft the map that makes the next decision easier.
              </p>
              <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed">
                This is a commission-based role for someone who wants to build
                real commercial judgment—not simply move leads through a script.
                You will be trusted with the quality of the client experience
                and coached toward a Senior Growth Advisor path with greater
                ownership and compensation.
              </p>
            </div>

            <aside className="border-border/60 bg-card rounded-lg border p-7 sm:p-8">
              <div className="font-mono-eyebrow text-muted-foreground text-[11px] uppercase">
                Role snapshot
              </div>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="mt-1 font-medium">
                    30-minute diagnostic meetings and written maps
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Compensation</dt>
                  <dd className="mt-1 font-medium">Commission-based</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Progression</dt>
                  <dd className="mt-1 font-medium">
                    Growth Advisor → Senior Growth Advisor
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Working style</dt>
                  <dd className="mt-1 font-medium">
                    Remote-friendly, async preparation, live client sessions
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="border-border/50 border-y bg-muted/20">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
            <div className="max-w-2xl">
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                The work
              </div>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                Make the real problem visible.
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                Most growth conversations stay at the level of symptoms: “we
                need more leads,” “our close rate is down,” or “the team is too
                busy.” Your job is to help us get underneath that language
                without making the client feel examined or sold to.
              </p>
            </div>

            <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {responsibilities.map((responsibility) => (
                <div key={responsibility} className="flex gap-3">
                  <Check className="text-primary mt-0.5 size-5 shrink-0" />
                  <p className="text-sm leading-relaxed">{responsibility}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                What we are looking for
              </div>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                A sharp listener with a builder’s instinct.
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                You do not need to arrive knowing theForge’s frameworks. You do
                need to be genuinely interested in how businesses work and
                willing to do the careful thinking required to separate a root
                constraint from a loud symptom.
              </p>
            </div>
            <div className="grid gap-5">
              {requirements.map((requirement) => (
                <div key={requirement} className="flex gap-3">
                  <Check className="text-primary mt-0.5 size-5 shrink-0" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {requirement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-border/50 border-y">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
            <div className="max-w-2xl">
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                How we work
              </div>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                Values are useful when they change the work.
              </h2>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title}>
                  <h3 className="font-display text-xl">{value.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
            <div>
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                The path
              </div>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                Earn more ownership as your diagnosis gets stronger.
              </h2>
            </div>
            <div className="space-y-6 text-sm leading-relaxed">
              <p className="text-muted-foreground">
                As a Growth Advisor, your first responsibility is consistency:
                prepare well, run useful conversations, and produce maps that
                are specific enough to guide a real next step. Compensation is
                tied to the agreed commission structure and the value of the
                work that moves forward.
              </p>
              <p className="text-muted-foreground">
                Senior Growth Advisors take on more complex diagnostic work,
                mentor newer advisors, improve the map methodology, and own more
                of the journey from first conversation to commercial
                recommendation. That increased responsibility comes with
                stronger compensation and a larger voice in how we serve
                clients.
              </p>
              <p className="font-medium">
                We are building a profession around better diagnosis—not a
                ladder based on tenure alone.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto flex max-w-5xl flex-col gap-7 px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
            <div>
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                Interested?
              </div>
              <h2 className="font-display mt-3 text-3xl">
                Show us how you think.
              </h2>
              <p className="text-secondary-foreground/70 mt-3 max-w-xl text-sm leading-relaxed">
                Send a short note about your background, why diagnostic work
                interests you, and one example of a constraint you helped make
                clearer. We care more about the quality of your thinking than a
                perfectly packaged application.
              </p>
            </div>
            <Link
              href="mailto:hello@theforge.ng?subject=Growth%20Advisor%20application"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors"
            >
              Apply by email
              <Mail className="size-4" />
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
