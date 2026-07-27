import type { Metadata } from "next";

import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { IndustriesWeServe } from "@/components/site/industries-we-serve";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { PricingTiers } from "@/components/site/pricing-tiers";
import { ProcessSection } from "@/components/site/process-section";
import { ServicesGrid } from "@/components/site/services-grid";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Growth Constraint Map, Revenue System Sprint, and Temper Growth Partner engagements for founder-led service firms.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Revenue systems"
          title="One expensive problem, three clear ways to solve it."
          description="For founder-led service companies with a website, leads and tools already in place, but no reliable system for turning demand into revenue."
        />
        <ServicesGrid />
        <IndustriesWeServe />
        <ProcessSection />
        <PricingTiers />
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
