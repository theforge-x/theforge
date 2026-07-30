"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "What happens during a Growth Constraint Map?",
    answer:
      "We map the systems behind acquisition, conversion, follow-up, pipeline and revenue, then identify the constraint with the greatest impact. The paid diagnostic produces a system map, KPI baseline and prioritized roadmap.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "No formal deck is required. A clear view of your current goals, biggest challenge, and any useful performance numbers will help us make the conversation more specific.",
  },
  {
    question: "What kinds of businesses do you work with?",
    answer:
      "We work best with founder-led firms that have a real offer, high-consideration sales and enough demand to expose leaks between marketing, sales and operations.",
  },
  {
    question: "Can you help with one focused project?",
    answer:
      "Yes, when the focused project is the right intervention. We can scope a website, CRM, automation, follow-up or reporting build as part of a connected revenue system.",
  },
  {
    question: "Do you work with teams outside your time zone?",
    answer:
      "Yes. theForge is Lagos-founded and globally delivered across US and UK working hours, with a documented process that keeps projects moving between live sessions.",
  },
  {
    question: "What should I include in my message?",
    answer:
      "Share what you are trying to achieve, what feels stuck, any relevant timing, and the kind of help you think you need. A rough note is enough—we can ask for more detail if it is useful.",
  },
  {
    question: "What happens after I send an enquiry?",
    answer:
      "We review your note and reply within one business day. We may ask a clarifying question or recommend a fit conversation based on whether you need diagnosis, implementation or ongoing optimization.",
  },
  {
    question: "Do I have to book a diagnostic?",
    answer:
      "No. The contact form also works for a focused project, a partnership conversation or a question about how we work. We will recommend a Growth Constraint Map only when it is the most useful next step.",
  },
  {
    question: "Can you help if I know the project but not the solution?",
    answer:
      "Yes. That is often where we add the most value. We can help clarify the constraint, define the right scope, and identify the smallest useful build before discussing a larger engagement.",
  },
  {
    question: "Can you scope a focused project?",
    answer:
      "Yes. We can scope a focused website, CRM, automation, reporting or revenue improvement when that is the clearest problem to solve.",
  },
  {
    question: "What happens if we are not the right fit?",
    answer:
      "We will say so plainly rather than force a service into the conversation. When possible, we will point you toward a more appropriate next step or type of partner.",
  },
  {
    question: "How soon can a project start?",
    answer:
      "Start timing depends on the kind of work, the scope, and current studio capacity. We will give you a realistic view after understanding the problem and the decision timeline.",
  },
];

export function ContactFaq() {
  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="max-w-md">
          <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
            Frequently asked questions
          </div>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            A few things you may want to know.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Still unsure? Send us a note above and we’ll point you in the right
            direction.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="border-border/50 border-t"
        >
          {questions.map((item, index) => (
            <AccordionItem key={item.question} value={`question-${index + 1}`}>
              <AccordionTrigger className="py-5 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground max-w-2xl pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
