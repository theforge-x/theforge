import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AppointmentForm } from "@/components/site/appointment-form";
import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { getStudioSettings } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a growth audit or get in touch with The Forge.",
};

export default async function ContactPage() {
  await connection();
  const settings = await getStudioSettings();
  const details = [
    { icon: Mail, label: settings.publicEmail },
    { icon: Phone, label: settings.phone },
    { icon: Clock, label: "Replies within 1 business day" },
    { icon: MapPin, label: "Remote-first, working across US & UK time zones" },
  ];
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Contact"
          title="Tell us where growth stalled."
          description="A quick note is enough to get started — we'll follow up to schedule the audit."
        />

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-2xl">What happens next</h2>
                <ol className="text-muted-foreground mt-4 flex flex-col gap-3 text-sm leading-relaxed">
                  <li>1. We review your note and confirm fit within a day.</li>
                  <li>2. We schedule your 60-minute growth audit.</li>
                  <li>3. You leave with a ranked, written action plan.</li>
                </ol>
              </div>
              <div className="border-border flex flex-col gap-3 border-t pt-6">
                {details.map((d) => (
                  <div
                    key={d.label}
                    className="text-muted-foreground flex items-center gap-3 text-sm"
                  >
                    <d.icon className="text-accent size-4 shrink-0" />
                    {d.label}
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
        <section id="book" className="border-border border-t">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <div className="mb-10 max-w-2xl">
              <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
                Book a call
              </div>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl">
                Choose a time that works.
              </h2>
              <p className="text-muted-foreground mt-3 text-sm">
                Request a conversation. Once approved, your meeting link will be
                shared with you.
              </p>
            </div>
            <AppointmentForm duration={settings.appointmentDuration} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
