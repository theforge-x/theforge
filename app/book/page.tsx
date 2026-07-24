import type { Metadata } from "next";
import { connection } from "next/server";
import { AppointmentForm } from "@/components/site/appointment-form";
import { BookFaq } from "@/components/site/book-faq";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { getStudioSettings } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Book a Growth Audit",
  description:
    "Choose a time for a growth audit with The Forge and request your appointment.",
};

export default async function BookPage() {
  await connection();
  const settings = await getStudioSettings();

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Book a growth audit"
          title="Choose a time that works."
          description="Request a focused conversation about what is stalling growth. Once approved, your meeting link will be shared with you."
        />

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="mb-10 grid gap-6 border-b border-border pb-10 sm:grid-cols-3">
            <div>
              <div className="font-display text-2xl text-accent">01</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose an available time in your local timezone.
              </p>
            </div>
            <div>
              <div className="font-display text-2xl text-accent">02</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us briefly about the constraint you are facing.
              </p>
            </div>
            <div>
              <div className="font-display text-2xl text-accent">03</div>
              <p className="mt-2 text-sm text-muted-foreground">
                We confirm the session and send your meeting link.
              </p>
            </div>
          </div>

          <AppointmentForm duration={settings.appointmentDuration} />
        </section>
        <BookFaq />
      </main>
      <Footer />
    </>
  );
}
