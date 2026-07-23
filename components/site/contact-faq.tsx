"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "What happens during a growth audit?",
    answer:
      "We use the session to map the systems behind your acquisition, conversion, retention, and revenue, then identify the constraint with the greatest impact. You leave with a ranked, practical action plan.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "No formal deck is required. A clear view of your current goals, biggest challenge, and any useful performance numbers will help us make the conversation more specific.",
  },
  {
    question: "What kinds of businesses do you work with?",
    answer:
      "We work best with ambitious teams that have a real offer and some market signal, but need a stronger system to reach their next stage. If we are not the right fit, we will say so plainly.",
  },
  {
    question: "Can you help with one focused project?",
    answer:
      "Yes. We can solve a focused product, website, automation, marketing, or revenue problem when that is the clearest constraint. We can also connect several capabilities into a broader growth system.",
  },
  {
    question: "Do you work with teams outside your time zone?",
    answer:
      "Yes. The Forge is remote-first and works across US and UK time zones, with a documented, asynchronous process that keeps projects moving between live sessions.",
  },
];

export function ContactFaq() {
  return (
    <section className="border-border border-t">
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

        <Accordion type="single" collapsible className="border-border border-t">
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
