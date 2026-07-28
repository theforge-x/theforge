import type { Metadata } from "next";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Public terms for using theForge website, enquiries and case-study content.",
};

const sections = [
  {
    title: "Website Information",
    body: "This website provides general information about theForge Revenue Systems, a HubX company. It is not legal, financial or professional advice, and it is not a binding proposal unless confirmed in a separate written agreement.",
  },
  {
    title: "Engagements",
    body: "Engagement scopes, payment terms, access requirements, acceptance criteria, confidentiality, ownership, support windows and data-processing obligations are confirmed separately before work begins. We do not rely on vague retainers where the client cannot see what is being built or measured.",
  },
  {
    title: "Results And Case Studies",
    body: "Case studies, before-and-after metrics and aggregate figures are provided with context. They should not be read as promises of identical outcomes. Results depend on client execution, data quality, market conditions, access, sales discipline, timing and the measurement period.",
  },
  {
    title: "Client Ownership",
    body: "Our operating preference is that clients own their accounts, code, data, documentation and operating procedures. Where theForge configures systems, the handover should make the system understandable and operable by the client team.",
  },
  {
    title: "Acceptable Use",
    body: "You may not use this website, forms or client-access areas to submit unlawful material, attack systems, scrape private areas, impersonate another person, or interfere with service availability.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Terms"
          title="Clear work needs clear terms."
          description="High-level terms for using this website, contacting theForge and reading public case-study material."
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
          <p className="mt-10 border-l-2 border-primary pl-5 text-foreground">
            The working principle is accountability: define the constraint,
            agree the baseline, document what changes, and leave the client
            owning the system.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
