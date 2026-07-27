import type { Metadata } from "next";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "theForge accessibility statement and continuous-improvement approach.",
};

const commitments = [
  "Use semantic page structure, labelled controls and clear navigation.",
  "Keep important actions keyboard-accessible.",
  "Maintain visible focus states for interactive elements.",
  "Review contrast, motion and responsive layouts as the site changes.",
  "Avoid hiding critical information behind interaction patterns that only work for one input method.",
  "Treat accessibility feedback as a product-quality issue, not a courtesy request.",
];

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Accessibility"
          title="Accessibility statement."
          description="We aim to make the public website usable, readable and navigable for as many visitors as possible."
        />
        <section className="mx-auto max-w-3xl px-6 py-20 text-sm leading-7 text-muted-foreground">
          <p>
            theForge builds systems people can actually operate. That value
            applies to our own website too. Accessibility is part of quality,
            clarity and accountability.
          </p>
          <h2 className="mt-10 font-display text-2xl text-foreground">
            Current Commitments
          </h2>
          <ul className="mt-4 space-y-3">
            {commitments.map((commitment) => (
              <li key={commitment} className="flex gap-3">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{commitment}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-10 font-display text-2xl text-foreground">
            Feedback
          </h2>
          <p className="mt-4">
            If you find an accessibility barrier, contact us through the public
            contact page with the page URL, device, browser and assistive
            technology used if relevant.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
