import type { Metadata } from "next";
import { connection } from "next/server";

import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { WorkGrid } from "@/components/site/work-grid";
import { getPublishedCaseStudies } from "@/lib/data-access";
import { ICPFilter } from "@/components/site/icp-filter";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies from businesses we've built growth systems for.",
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
          title="Proof, filed by discipline."
          description="Every engagement below started with the same audit process and ended with a documented, owned system."
        />
        <WorkGrid caseStudies={caseStudies} />
        <ICPFilter />
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
