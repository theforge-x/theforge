import { asc } from "drizzle-orm";
import { CaseStudiesGrid } from "@/components/site/case-studies-grid";
import { CTASection } from "@/components/site/cta-section";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { ICPFilter } from "@/components/site/icp-filter";
import { IndustriesWeServe } from "@/components/site/industries-we-serve";
import { InsightsPreview } from "@/components/site/insights-preview";
import { LogoTicker } from "@/components/site/logo-ticker";
import { Navbar } from "@/components/site/navbar";
import { PredictableGrowthSection } from "@/components/site/predictable-growth-section";
import { PricingTiers } from "@/components/site/pricing-tiers";
import { ProcessSection } from "@/components/site/process-section";
import { ServicesGrid } from "@/components/site/services-grid";
import { Testimonials } from "@/components/site/testimonials";
import { clients as fallbackClients } from "@/lib/data";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getClientNames() {
  try {
    const rows = await db
      .select({ name: clients.name })
      .from(clients)
      .orderBy(asc(clients.name));
    return rows.map((client) => client.name);
  } catch {
    return fallbackClients.map((client) => client.name);
  }
}

export default async function Home() {
  const clientNames = await getClientNames();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoTicker items={clientNames} />
        <IndustriesWeServe />
        <ProcessSection />
        <ServicesGrid />
        <CaseStudiesGrid limit={4} />
        <PredictableGrowthSection />
        <PricingTiers />
        <InsightsPreview />
        <ICPFilter />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
