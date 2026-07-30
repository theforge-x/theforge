import { Flame, ShieldCheck, Target, Zap } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { TeamMemberCard } from "@/components/site/team-member-card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the senior-led team behind theForge Revenue Systems and how we build accountable revenue systems for founder-led firms.",
};

const values = [
  {
    icon: Target,
    title: "Diagnosis before prescription",
    description:
      "We don't sell the service that pays best. We sell the fix for the constraint we actually find.",
  },
  {
    icon: ShieldCheck,
    title: "You own what we build",
    description:
      "Every system is documented and handed over. If we disappeared tomorrow, it would keep running.",
  },
  {
    icon: Zap,
    title: "Speed with a floor",
    description:
      "We move fast, but never faster than the system can be built correctly. Rushed systems break first.",
  },
  {
    icon: Flame,
    title: "Numbers, not vibes",
    description:
      "Every recommendation ships with an estimated impact. Every result gets reported against it.",
  },
];

const deliveryStandards = [
  "One senior engagement owner from diagnosis through handover.",
  "A named delivery pod that does not disappear after the sales call.",
  "A KPI baseline agreed before implementation begins.",
  "One weekly commercial scorecard during active delivery.",
  "Recorded walkthroughs of every major system.",
  "Client ownership of accounts, code, data and documentation.",
  "Fixed acceptance criteria and documented operating procedures.",
  "A 30- or 60-day post-launch stabilization period when the build needs it.",
];

const team = [
  {
    name: "Kelechi Egbuta",
    role: "Founder",
    image: "/about/kelechi-egbuta-3d.webp",
    strength: "Turning ambiguity into systems",
    summary:
      "Kelechi sees the whole machine. He connects positioning, product, technology and revenue into one operating system—then finds the single constraint keeping it from moving. His standard is simple: strategy should survive contact with reality, and every bold idea should eventually become something a team can run, measure and own.",
    credential: "Senior engagement owner for diagnosis and system architecture",
  },
  {
    name: "John Christopher",
    role: "Sales & Partnerships Lead",
    image: "/about/john-christopher-3d.webp",
    strength: "Making value unmistakable",
    summary:
      "John turns conversations into clarity and relationships into momentum. He is at his best where commercial instinct meets genuine curiosity—listening beyond the brief, uncovering the real buying problem and building partnerships that make both sides stronger. For John, a great sale is never pressure; it is a well-designed decision.",
    credential: "Partnerships, qualification and commercial alignment",
  },
  {
    name: "Marvelous Miracle",
    role: "Creative Director",
    image: "/about/marvelous-miracle-3d.webp",
    strength: "Giving strategy a pulse",
    summary:
      "Marvelous gives complex ideas a form people can feel immediately. She leads with taste, but never decoration for decoration's sake: every word, frame and interaction has a job to do. Her work turns sharp strategy into distinctive brands and digital experiences that earn attention, build trust and stay remembered.",
    credential: "Positioning, conversion experience and creative direction",
  },
];

const extendedTeam = [
  {
    name: "Praise Karachi",
    role: "Brand & Content Strategist",
    image: "/about/john-christopher-3d.webp",
    bio: "Praise turns positioning into a point of view people can recognize, trust and remember. He shapes the stories, editorial systems and content that give every growth move a clear voice.",
    credential: "Narrative, content systems and messaging support",
  },
  {
    name: "Caleb Onyenaturuchi",
    role: "Project Operations Lead",
    image: "/about/marvelous-miracle-3d.webp",
    bio: "Caleb keeps ambitious work moving with calm precision. He connects people, priorities and timelines so the right work gets done well and every handoff feels intentional.",
    credential: "Delivery coordination, timelines and operating cadence",
  },
  {
    name: "Chioma Favour",
    role: "Client Success Manager",
    image: "/about/kelechi-egbuta-3d.webp",
    bio: "Chioma makes sure the work creates momentum beyond launch. She translates client goals into clear next steps, protects the partnership and keeps outcomes in view.",
    credential: "Client communication, adoption and post-launch momentum",
  },
  {
    name: "Joshua Prince",
    role: "Marketing & Conversion Lead",
    image: "/about/john-christopher-3d.webp",
    bio: "Joshua bridges attention and action. He finds the friction in the customer journey and turns sharper messaging, journeys and experiments into measurable movement.",
    credential: "Conversion journeys, experiments and pipeline activation",
  },
];

const journey = [
  {
    period: "Jun 2024",
    title: "The first spark",
    description:
      "theForge begins with one conviction: good businesses do not need more disconnected tactics—they need a growth engine designed as a system.",
  },
  {
    period: "Foundation",
    title: "From pages to pathways",
    description:
      "The work moves beyond simply making websites. Brand, product, data and conversion are treated as one connected customer journey.",
  },
  {
    period: "Expansion",
    title: "The system gets wider",
    description:
      "Automation, CRM, sales enablement and AI become part of the build, closing the distance between attention, opportunity and revenue.",
  },
  {
    period: "Today",
    title: "Built for compounding growth",
    description:
      "A focused multidisciplinary team now helps ambitious companies find the constraint, forge the solution and create an engine they can own.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <PageHeader
          eyebrow="About"
          title="A senior-led revenue-systems studio."
          description="theForge was started after watching good service companies outgrow referrals, add more tools, and still lose revenue in the handoffs between marketing, sales and operations."
        />

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div className="font-mono-eyebrow mb-4 text-[11px] uppercase text-accent">
              The belief behind the build
            </div>
            <h2 className="max-w-xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Growth should become an owned operating asset, not a monthly
              emergency.
            </h2>
          </div>

          <div className="space-y-7 text-lg leading-8 text-muted-foreground">
            <p>
              Most founder-led service companies do not have a demand problem
              alone. They have a handoff problem. The website, CRM, follow-up,
              reporting and sales conversations all exist, but they do not work
              as one revenue system.
            </p>
            <p>
              That is why our work starts before the deliverable. We study the
              offer, the audience, the buying journey, the handoffs and the
              numbers. A website may be part of the answer; so might a sharper
              narrative, CRM cleanup, routing logic, sales stages, automated
              follow-up or a dashboard that gives leadership a shared view of
              the pipeline.
            </p>
            <p>
              We work with a deliberately small number of clients. Every
              engagement begins with diagnosis and ends with something useful: a
              clearer decision, a stronger system and a team more capable than
              when we arrived. Lagos-founded. Globally delivered. Senior-led
              across US and UK working hours. theForge is a HubX company, with
              HubX registered in London, United Kingdom.
            </p>
          </div>
        </section>

        <section className="border-y border-border/50 bg-secondary/20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
                Delivery standard
              </div>
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
                Small team is the premium feature.
              </h2>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                No hand-offs into a black box. The senior people who diagnose
                the constraint remain accountable for the system that gets
                implemented.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {deliveryStandards.map((standard) => (
                <div
                  key={standard}
                  className="rounded-lg border border-border/60 bg-card p-5 text-sm leading-6 text-muted-foreground"
                >
                  {standard}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-secondary/25">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
                  The people at the anvil
                </div>
                <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
                  Small team. Serious range.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Strategy, commercial instinct and creative direction sit at the
                same table. The result is work that is desirable, viable and
                built to perform.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {team.map((member, index) => (
                <TeamMemberCard
                  key={member.name}
                  {...member}
                  index={String(index + 1).padStart(2, "0")}
                />
              ))}
            </div>

            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              Portraits are conceptual 3D interpretations created for theForge.
            </p>
          </div>
        </section>

        <section className="border-b border-border/50 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="mb-14 max-w-2xl">
              <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
                More hands at the anvil
              </div>
              <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
                The details that make the system hold.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                Every strong build depends on thoughtful people behind the
                scenes, turning strategy into consistent momentum for our
                clients.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {extendedTeam.map((member, index) => (
                <article
                  key={member.name}
                  className="group flex aspect-square flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_70px_-42px_var(--primary)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-primary/30 bg-secondary shadow-[0_0_0_6px_color-mix(in_srgb,var(--primary)_8%,transparent),0_12px_35px_-16px_var(--primary)]">
                      <Image
                        src={member.image}
                        alt={`Conceptual 3D portrait of ${member.name}`}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70">
                      {String(index + 4).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                      {member.role}
                    </div>
                    <h3 className="mt-2 font-display text-2xl tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {member.bio}
                    </p>
                    <p className="mt-4 border-t border-border/50 pt-4 text-xs leading-5 text-muted-foreground">
                      {member.credential}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              Additional portraits are conceptual 3D interpretations created for
              theForge.
            </p>
          </div>
        </section>

        <section className="relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_38%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
                Forged over time
              </div>
              <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
                From one conviction to a connected growth practice.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
                The tools have expanded. The principle has not: identify the
                constraint, build the right system and leave the business
                stronger.
              </p>
            </div>

            <div className="relative">
              <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-primary via-primary/50 to-border md:bottom-auto md:left-0 md:right-0 md:top-[19px] md:h-px md:w-auto" />
              <div className="grid gap-10 md:grid-cols-4 md:gap-5">
                {journey.map((milestone, index) => (
                  <article
                    key={milestone.title}
                    className="group relative grid grid-cols-[40px_1fr] gap-5 md:block"
                  >
                    <div className="relative z-10 grid size-10 place-items-center rounded-full border border-primary/40 bg-background shadow-[0_0_0_7px_var(--background)] transition-[border-color,box-shadow] duration-300 group-hover:border-primary group-hover:shadow-[0_0_0_7px_var(--background),0_0_30px_var(--primary)]">
                      <div className="size-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="pt-0.5 md:mt-8 md:pt-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {milestone.period}
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                        {milestone.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-16 max-w-2xl">
              <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
                How we operate
              </div>
              <h2 className="font-display text-4xl sm:text-5xl">
                Four working principles.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex gap-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <value.icon className="size-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
