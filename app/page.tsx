import { CaseStudiesGrid } from "@/components/site/case-studies-grid";
import { CTASection } from "@/components/site/cta-section";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { ICPFilter } from "@/components/site/icp-filter";
import { LogoTicker } from "@/components/site/logo-ticker";
import { Navbar } from "@/components/site/navbar";
import { PricingTiers } from "@/components/site/pricing-tiers";
import { ProcessSection } from "@/components/site/process-section";
import { ServicesGrid } from "@/components/site/services-grid";
import { Testimonials } from "@/components/site/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoTicker />
        <ProcessSection />
        <ServicesGrid />
        <CaseStudiesGrid limit={4} />
        <PricingTiers />
        <ICPFilter />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
