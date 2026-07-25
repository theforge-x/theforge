import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ContactFaq } from "@/components/site/contact-faq";
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
          description="Tell us what you are working through, and we will help identify the most useful next conversation."
        />

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-2xl">What happens next</h2>
                <ol className="text-muted-foreground mt-4 flex flex-col gap-3 text-sm leading-relaxed">
                  <li>
                    1. We review your note and reply within one business day.
                  </li>
                  <li>
                    2. We clarify what you need and point you to the right next
                    conversation.
                  </li>
                  <li>
                    3. If there is a fit, we align on scope, timing and the best
                    way to move forward.
                  </li>
                </ol>
              </div>
              <div className="border-border/50 flex flex-col gap-3 border-t pt-6">
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
        <ContactFaq />
      </main>
      <Footer />
    </>
  );
}
