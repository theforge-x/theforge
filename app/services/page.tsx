import type { Metadata } from "next";

import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { PricingTiers } from "@/components/site/pricing-tiers";
import { ProcessSection } from "@/components/site/process-section";
import { ServicesGrid } from "@/components/site/services-grid";
import { WebsitePromptBuilder } from "@/components/site/website-prompt-builder";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital products, AI automation, marketing, revenue operations, and growth strategy built as one connected system.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Services"
          title="Build the capability your next stage needs."
          description="From a focused product or campaign to a connected growth operating system, we bring strategy, design, engineering, automation, and distribution under one roof."
        />
        <ServicesGrid />
        <ProcessSection />
        <WebsitePromptBuilder />
        <PricingTiers />
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
