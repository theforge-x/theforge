import type { Metadata } from "next";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Data & AI",
  description:
    "How theForge approaches client data, CRM permissions, automation, reporting and AI usage.",
};

const sections = [
  {
    title: "Client-Owned Systems",
    body: "Clients should own their CRM, analytics, automation, domain, hosting, ad, email and reporting accounts. theForge works inside those systems with documented access rather than creating dependency through hidden ownership.",
  },
  {
    title: "Least-Privilege Access",
    body: "We request the minimum useful permissions for the work agreed. Admin access should be time-bound where possible. Major configuration decisions, integration changes and automation rules should be documented before handover.",
  },
  {
    title: "Measurement Baselines",
    body: "Revenue-system work depends on honest baselines. We may use CRM exports, analytics reports, response-time logs, pipeline stages, conversion rates and dashboard screenshots to establish before-and-after measurements.",
  },
  {
    title: "AI-Assisted Work",
    body: "AI may assist research, drafting, analysis, workflow design, data classification or internal productivity. Sensitive client data should not be placed into third-party AI tools without an agreed basis and appropriate controls.",
  },
  {
    title: "Human Judgment",
    body: "Automation should support judgment, not replace accountability. We design human approvals, exception paths, audit trails and escalation points for workflows that affect customers, revenue or operations.",
  },
  {
    title: "Handover",
    body: "A completed system should include walkthroughs, operating procedures, credential-transfer guidance, owner responsibilities and a clear list of what theForge retains access to after launch, if anything.",
  },
];

export default function DataProcessingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Data & AI"
          title="Client-owned systems, careful access."
          description="Our approach to CRM permissions, automation, reporting and AI-assisted work."
        />
        <section className="mx-auto max-w-3xl px-6 py-20 text-sm leading-7 text-muted-foreground">
          {sections.map((section) => (
            <div key={section.title} className="mt-10 first:mt-0">
              <h2 className="font-display text-2xl text-foreground">
                {section.title}
              </h2>
              <p className="mt-4">{section.body}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
