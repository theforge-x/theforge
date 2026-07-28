import type { Metadata } from "next";
import { connection } from "next/server";

import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { ICPFilter } from "@/components/site/icp-filter";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { WorkGrid } from "@/components/site/work-grid";
import { getPublishedCaseStudies } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies showing how theForge connects positioning, website, CRM, automation, follow-up and reporting.",
};

export default async function WorkPage() {
  await connection();
  const caseStudies = await getPublishedCaseStudies();
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Work"
          title="Client systems, not isolated deliverables."
          description="Each case shows a specific business constraint, the operating system built around it and the result or ownership improvement reported."
        />
        <WorkGrid caseStudies={caseStudies} />
        <ICPFilter />
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
