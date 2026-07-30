import type { Metadata } from "next";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How theForge, a HubX company, handles enquiry, appointment, client and website data.",
};

const sections = [
  {
    title: "Who We Are",
    body: [
      "theForge is a HubX company. HubX is registered in London, United Kingdom. theForge operates as a revenue-systems studio for founder-led firms and handles data only where it helps us respond, diagnose, deliver, secure or improve the systems we build.",
      "Our default posture is simple: client systems should be owned by the client, access should be purposeful, and measurement should make decisions clearer without turning people into data points.",
    ],
  },
  {
    title: "What We Collect",
    body: [
      "We may collect contact details, appointment requests, company information, project context, messages, billing context, client portal account information and technical usage data from the website.",
      "During an engagement, we may also process CRM exports, analytics views, pipeline data, automation rules, sales-stage definitions, dashboard screenshots, support notes and other operational material needed to diagnose or build a revenue system.",
    ],
  },
  {
    title: "Why We Use It",
    body: [
      "We use data to reply to enquiries, assess fit, prepare diagnostic work, deliver agreed services, maintain account security, document handover, improve workflows and meet legal or administrative obligations.",
      "We do not treat raw data as strategy. We use it to understand constraints, test assumptions, establish baselines and help the client make better commercial decisions.",
    ],
  },
  {
    title: "How We Protect Client Access",
    body: [
      "When an engagement requires CRM, analytics, automation, website, cloud, email or advertising access, the client should own the underlying accounts wherever possible.",
      "We prefer named user access, least-privilege permissions, documented configuration changes and removal of access at handover or offboarding.",
    ],
  },
  {
    title: "Retention And Requests",
    body: [
      "We keep information only for as long as it remains useful for the purpose it was collected, for legitimate business records, or for legal and security reasons.",
      "You can contact us to request correction, deletion, export or restriction of personal information. Some records may need to be retained where required for legal, accounting, security or contractual reasons.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Privacy"
          title="Data should clarify the system, not create dependency."
          description="How theForge collects, uses and protects enquiry, appointment, client and operational data."
        />
        <section className="mx-auto max-w-3xl px-6 py-20 text-sm leading-7 text-muted-foreground">
          {sections.map((section) => (
            <div key={section.title} className="mt-10 first:mt-0">
              <h2 className="font-display text-2xl text-foreground">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
          <p className="mt-10 border-l-2 border-primary pl-5 text-foreground">
            For privacy questions, data requests or access-removal requests,
            contact the studio using the public email listed on the contact
            page.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
