import type { Metadata } from "next";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { WorkGrid } from "@/components/site/work-grid";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies from businesses we've built growth systems for.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Work"
          title="Proof, filed by discipline."
          description="Every engagement below started with the same audit process and ended with a documented, owned system."
        />
        <WorkGrid />
      </main>
      <Footer />
    </>
  );
}
