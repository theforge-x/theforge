import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "What is a growth audit?",
    answer:
      "A growth audit is a focused review of the systems behind acquisition, conversion, retention, and revenue. We look for the constraint with the greatest impact rather than jumping straight to a preferred service.",
  },
  {
    question: "Who is the audit for?",
    answer:
      "It is designed for founders and growth leaders who have a real offer and some market signal, but feel that growth is slower, less predictable, or more dependent on heroics than it should be.",
  },
  {
    question: "What happens during the 30-minute session?",
    answer:
      "We ask targeted questions about your goals, offer, audience, customer journey, channels, handoffs, and current numbers. We use the time to locate the most consequential constraint and discuss what could address it.",
  },
  {
    question: "Do I need to prepare a presentation?",
    answer:
      "No. A presentation is not required. Bring a clear view of what you are trying to achieve, where momentum is breaking down, and any useful performance numbers or examples you already have.",
  },
  {
    question: "What information is useful before the call?",
    answer:
      "Useful context includes your current growth target, primary offer, customer type, acquisition sources, conversion or retention concerns, and any recent change that made the problem more visible.",
  },
  {
    question: "Will I receive a written action plan?",
    answer:
      "Yes. You will leave with a ranked view of the issues discussed and practical next actions. The level of detail depends on the complexity of the situation and the information available in the session.",
  },
  {
    question: "Is the audit a sales call?",
    answer:
      "It is a working session first. If we see a problem we can help solve, we may explain what a next engagement could look like. There is no obligation to continue with us.",
  },
  {
    question: "What if my problem is not marketing?",
    answer:
      "That is fine. Growth constraints can sit in product, positioning, sales operations, customer experience, automation, retention, or the handoffs between them. The audit is intended to find the real bottleneck.",
  },
  {
    question: "What if I only need one focused project?",
    answer:
      "The audit can still help determine whether a focused project is the right intervention. We can recommend a website, product, campaign, automation, or other scoped build when that is the clearest solution.",
  },
  {
    question: "What happens after I request a time?",
    answer:
      "We review the request, confirm the session, and send the meeting details. If we need clarification before confirming, we will contact you using the information in your request.",
  },
];

export function BookFaq() {
  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="max-w-md">
          <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
            About the growth audit
          </div>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            Come prepared to find the constraint.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            The audit is a focused working session—not a generic discovery call.
            These answers explain what to expect and how to make the time
            useful.
          </p>
        </div>

        <Accordion type="single" collapsible className="border-border/50 border-t">
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
