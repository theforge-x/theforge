export type CaseStudySeed = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
};

export const caseStudySeeds: CaseStudySeed[] = [
  {
    id: "case-onyx-referral-engine",
    projectId: "p-1",
    title: "From partner referrals to a dependable legal intake engine",
    slug: "onyx-legal-referral-rebuild",
    excerpt:
      "How Onyx Legal Group turned relationship-led growth into a visible, measurable referral and corporate-client intake system.",
    category: "Revenue Operations",
    featuredImage: "/work/onyx-referral-dashboard.webp",
    seoTitle: "Onyx Legal Group referral engine case study",
    seoDescription:
      "How Onyx Legal Group rebuilt referral intake into a measurable, multi-stage system for qualified corporate matters.",
    body: `## The situation
Onyx Legal Group had earned a strong reputation and a valuable network, but its growth motion lived largely in partner memory. Referrals arrived through private conversations, handoffs varied by relationship, and the team had no shared view of which sources produced the right matters. The firm was successful, yet the system behind that success was difficult to see, improve, or hand over.

## The constraint
The problem was not a lack of trust or demand. It was the absence of a consistent path between a warm introduction and a qualified, retained corporate client. Important context was scattered across inboxes and notes. Follow-up depended on individual habits. Partners could not compare referral quality, identify stalled opportunities, or distinguish a valuable relationship from a merely active one.

## What we built
We mapped the complete referral journey and converted it into five operational stages: received, triaged, qualified, matter-ready, and retained. Each stage received a clear owner, a minimum information standard, a next action, and a service-level expectation.

- A single intake record captures source, relationship context, matter type, urgency, and commercial fit.
- Qualification prompts help the team make consistent decisions without flattening professional judgment.
- Partner views show every active introduction, its next action, and the relationship behind it.
- Source reporting separates referral volume from qualified-matter and retained-client contribution.
- Follow-up reminders protect the personal quality of the experience while removing reliance on memory.

## How the system changed the work
Partners gained a common operating picture without turning relationship development into a call-centre process. The intake team can now identify missing context early, route matters deliberately, and keep introducers informed. Leadership can see which networks create strategic work and where an otherwise strong introduction loses momentum.

## Measurement snapshot
Baseline period: April-June 2025. Launch date: 15 September 2025. Measurement period: October-December 2025.

- Qualified corporate intake increased from 22 qualified matters in the baseline quarter to 36 in the first full measured quarter, a 64% lift.
- Median first response to a warm introduction moved from 18 business hours to 5 business hours.
- Referral source attribution improved from 41% of matters carrying a usable source to 93%.
- Stalled qualified introductions older than 14 days fell from 11 open items to 3.

Evidence used: anonymised CRM stage exports, referral-source dashboard screenshots, intake SLA logs, and a partner review of the opportunity-stage definitions.

## The durable outcome
Onyx now owns a referral engine that preserves discretion and trust while adding the structure required to compound them. The system can be taught, audited, and improved. More importantly, growth is no longer hidden inside a handful of individual inboxes.`,
  },
  {
    id: "case-onyx-client-retention",
    projectId: "p-1",
    title: "Designing a corporate-client retention system around trust",
    slug: "onyx-corporate-client-retention-system",
    excerpt:
      "A relationship workflow that connects matter delivery, executive follow-up, and repeat corporate instructions without making the experience feel automated.",
    category: "Client Retention",
    featuredImage: "/work/onyx-retention-workflow.webp",
    seoTitle: "Onyx corporate client retention case study",
    seoDescription:
      "A case study in connecting legal matter delivery, relationship follow-up, and repeat corporate instructions.",
    body: `## The opportunity behind the first matter
Onyx Legal Group often delivered excellent work for a corporate client and then waited for the next instruction to arrive. The relationships were strong, but the moments that turn a completed matter into a durable account were inconsistent. Matter teams focused correctly on delivery; relationship continuity depended on a partner remembering when and how to reconnect.

## The design principle
The retention system could not feel like marketing automation. Corporate legal relationships are built through judgment, relevance, and confidence. We therefore designed a workflow that uses automation to surface the right moment while keeping every meaningful interaction human.

## The relationship architecture
We connected the end of a matter to a deliberate sequence of value-building actions.

- Matter close-out captures outcomes, emerging risks, stakeholder context, and possible next needs.
- A partner review determines the most useful follow-up rather than sending a generic message.
- Account maps keep legal, commercial, and executive relationships visible in one place.
- Relevance prompts surface regulatory, governance, or operational developments connected to the client.
- Quiet-account signals show when a strategically important relationship is losing contact.
- Referral and repeat-instruction loops record the relationship actions that preceded new work.

## What changed operationally
The firm can distinguish a completed matter from a completed relationship. Partners receive concise prompts with enough context to act intelligently. Teams can coordinate contact so a valued client experiences one firm rather than several disconnected practices. Leadership gains a portfolio view of account health without reducing trust to a simplistic score.

## Measurement snapshot
Baseline period: July-September 2025. Launch date: 6 January 2026. Measurement period: February-April 2026.

- Repeat-instruction rate among active corporate clients increased from 29% to 38%, a 31% relative improvement.
- Matters with a completed close-out context note increased from 34% to 88%.
- Quiet-account follow-up coverage improved from 46% to 91% of priority accounts.
- Average days from matter close to useful executive follow-up fell from 27 days to 9 days.

Evidence used: anonymised matter close-out records, account-health dashboard excerpts, follow-up task logs, and a partner-approved relationship workflow map.

## The result
Onyx has a retention rhythm that matches its brand: considered, discreet, and rigorous. The workflow protects the personal nature of legal service while making continuity an owned capability. Repeat work is supported by a system, not left to chance.`,
  },
  {
    id: "case-fabrica-bid-pipeline",
    projectId: "p-2",
    title: "Forging a multi-channel commercial bid pipeline",
    slug: "fabrica-multi-channel-bid-pipeline",
    excerpt:
      "How Ferrous & Kin Construction replaced seasonal lead dependence with a qualified opportunity system built for commercial bids.",
    category: "Acquisition Systems",
    featuredImage: "/work/fabrica-bid-dashboard.webp",
    seoTitle: "Ferrous & Kin Construction bid pipeline case study",
    seoDescription:
      "How Ferrous & Kin Construction built a visible, multi-channel commercial opportunity and bid pipeline.",
    body: `## The growth pattern
Ferrous & Kin Construction had a capable delivery team and a credible body of work, but new opportunities arrived unevenly. One source could produce a busy quarter and then disappear. Referrals, tender portals, property relationships, and past-client demand were all present, yet they behaved like separate streams rather than one commercial system.

## The real constraint
The company did not need more unqualified leads. It needed a reliable way to decide which opportunities deserved estimating time, how each channel performed, and what future workload the current pipeline could support. Without that structure, the team risked overinvesting in weak bids while missing the early signals of a future revenue gap.

## The system we forged
We designed a common opportunity model across every acquisition channel.

- A pre-qualification score covers project fit, buying authority, timing, delivery capacity, and commercial risk.
- The pipeline separates prospecting, pre-qualification, qualified opportunity, proposal, negotiation, and award.
- Channel attribution follows opportunities through to awarded value rather than stopping at lead volume.
- A weighted forecast translates live bids into a realistic view of future workload.
- Seasonal resilience reporting shows when one channel or project type is carrying too much of the plan.
- Referral prompts reconnect completed projects to consultants, developers, and client networks.

## Adoption in the field
The workflow was designed around the meetings Ferrous & Kin already held. Estimators do not maintain a second reporting system; core bid information feeds the commercial view. Leaders can review exceptions and decisions instead of reconstructing the pipeline from email threads and spreadsheets.

## Measurement snapshot
Baseline period: October-December 2025. Launch date: 18 February 2026. Measurement period: March-May 2026.

- Qualified bid pipeline value increased from $1.7M to $3.7M, a 118% lift.
- Bid/no-bid decisions documented before estimating increased from 28% to 86%.
- Opportunities with complete channel attribution increased from 35% to 92%.
- Weighted 90-day workload forecast variance improved from 32% off-plan to 12% off-plan.

Evidence used: anonymised bid pipeline dashboard, estimating meeting scorecards, channel-attribution export, and screenshots of the weighted forecast view.

## The durable advantage
Ferrous & Kin can now see demand before it becomes workload. The business has a shared language for opportunity quality, a clearer basis for allocating estimating effort, and a portfolio of channels that can be strengthened deliberately. Growth becomes an engineered pipeline rather than a sequence of busy and quiet seasons.`,
  },
  {
    id: "case-fabrica-bid-workflow",
    projectId: "p-2",
    title: "Rebuilding the bid workflow from site review to follow-up",
    slug: "fabrica-estimating-follow-up-workflow",
    excerpt:
      "A connected estimating and follow-up workflow that gives every commercial bid a clear owner, decision gate, and next action.",
    category: "Revenue Operations",
    featuredImage: "/work/fabrica-bid-workflow.webp",
    seoTitle: "Ferrous & Kin estimating workflow case study",
    seoDescription:
      "How Ferrous & Kin connected site review, estimating, bid assembly, follow-up, and referral into one workflow.",
    body: `## Where bids were losing momentum
Ferrous & Kin’s strongest bids combined site knowledge, commercial judgment, and fast coordination. The weakness appeared between those moments. Site notes arrived in different formats, estimating assumptions were difficult to trace, approval happened late, and follow-up often started only after the client went quiet.

## Mapping the handoffs
We treated the bid process as a production system. Together with the commercial and delivery teams, we mapped every handoff from first enquiry to award decision and identified the information required to move forward with confidence.

## The redesigned workflow
The new operating path contains explicit gates rather than a long, ambiguous to-do list.

- Site review uses a consistent brief for scope, access, risk, programme, and decision context.
- A bid/no-bid gate protects estimating capacity before detailed work begins.
- Assumptions, exclusions, supplier inputs, and margin decisions live with the opportunity.
- Internal review focuses on exceptions and commercial risk instead of document chasing.
- Proposal assembly draws from an approved evidence library while remaining tailored to the buyer.
- Follow-up is planned before submission, with owners and useful reasons to reconnect.
- Win, loss, and no-decision reviews feed lessons back into qualification and positioning.

## A workflow people can run
The system was deliberately visual. Each bid shows its stage, blocked inputs, owner, next decision, and time in stage. That clarity makes stand-ups shorter and escalation earlier. It also gives new team members a practical model of how Ferrous & Kin pursues the right work.

## Measurement snapshot
Baseline period: November 2025-January 2026. Launch date: 4 March 2026. Measurement period: April-June 2026.

- Median bid cycle time moved from 24 days to 15 days.
- Bids with a named follow-up owner before submission increased from 39% to 94%.
- Internal review rework rounds fell from 2.6 average rounds to 1.4.
- Post-decision learning captured for wins, losses, and no-decisions increased from 18% to 81%.

Evidence used: anonymised workflow timestamps, proposal-review logs, follow-up task history, and a bid/no-bid gate template approved by the commercial team.

## What Ferrous & Kin now owns
The bid process is faster to understand, easier to govern, and less dependent on heroic coordination. Commercial discipline is built into the workflow, while experienced estimators retain room for judgment. Every outcome—win or loss—makes the next bid system stronger.`,
  },
  {
    id: "case-lumen-retention",
    projectId: "p-3",
    title: "Turning patient recall into a compassionate retention system",
    slug: "lumen-patient-retention-system",
    excerpt:
      "How Lumen Dental Collective connected care-plan adherence, recall timing, and thoughtful intervention into one patient-retention view.",
    category: "Retention",
    featuredImage: "/work/lumen-retention-dashboard.webp",
    seoTitle: "Lumen Dental patient retention case study",
    seoDescription:
      "How Lumen Dental Collective built a humane patient recall, care-plan, and retention operating system.",
    body: `## The care gap
Lumen Dental Collective delivered attentive clinical care, yet the system between appointments was fragmented. Recall lists were broad, overdue follow-up lacked context, and teams could not easily distinguish a patient who needed a reminder from one who faced a genuine barrier to continuing care.

## A better definition of retention
We reframed retention as continuity of care rather than appointment frequency. The goal was not to send more messages. It was to understand each patient’s care path, identify the right intervention, and make follow-up feel as considered as the in-clinic experience.

## The patient continuity view
We brought the signals that matter into one calm operating picture.

- Recall cohorts show patients by due window, treatment context, and previous response.
- Care-plan adherence highlights incomplete clinical steps without treating every delay equally.
- Follow-up timing adapts to urgency, patient preference, and the nature of the next action.
- Intervention prompts separate administrative reminders from conversations that need empathy or clinical context.
- Team queues assign a clear owner while preserving a complete history of contact and outcome.
- Retention reporting follows continuity over time instead of rewarding message volume.

## Designing for the team
The interface prioritises clarity and restraint. Staff see the small set of patients who need attention today, why they matter, and the most appropriate next step. Managers can spot cohort-level gaps and improve the underlying journey rather than simply increasing outreach.

## Measurement snapshot
Baseline period: January-March 2026. Launch date: 20 April 2026. Measurement period: May-July 2026.

- Overdue recall recovery increased from 164 recovered patients per quarter to 235, a 43% lift.
- Patients with care-plan context attached to follow-up increased from 31% to 87%.
- Same-week recall queue completion improved from 58% to 84%.
- Administrative reminders reduced by 22% while clinically relevant conversations increased.

Evidence used: anonymised recall cohort exports, care-plan follow-up screenshots, queue-completion logs, and a manager-reviewed patient-continuity map.

## The outcome
Lumen now has a retention system that reflects its clinical ethos: luminous, calm, and human. Patients receive more relevant continuity, teams spend less time reconstructing context, and leaders can improve care journeys with evidence rather than assumption.`,
  },
  {
    id: "case-lumen-referral-loop",
    projectId: "p-3",
    title: "Building a patient journey that naturally earns referrals",
    slug: "lumen-recall-referral-loop",
    excerpt:
      "A connected care journey that turns welcome, follow-up, reactivation, and advocacy into a measurable referral loop.",
    category: "Referral Systems",
    featuredImage: "/work/lumen-care-workflow.webp",
    seoTitle: "Lumen Dental referral journey case study",
    seoDescription:
      "How Lumen designed a connected patient journey that supports reactivation, advocacy, and trusted referrals.",
    body: `## Referral was an outcome, not yet a system
Lumen’s happiest patients regularly recommended the practice, but the team could not see which experiences created advocacy or when a referral invitation would feel natural. Referral activity was celebrated after the fact rather than designed into the patient journey.

## Following the moments that build trust
We mapped the emotional and operational journey from welcome through active care, recall, reactivation, and advocacy. The work revealed that referral readiness was rarely tied to a single appointment. It emerged after a sequence of clear communication, felt progress, and thoughtful follow-through.

## The journey we designed
The new loop connects six moments without forcing patients into a campaign.

- Welcome establishes preferences, expectations, and the next meaningful milestone.
- Care-plan communication makes progress visible in plain language.
- Post-visit follow-up confirms understanding and catches unresolved friction.
- Recall continues the relationship with context rather than a generic reminder.
- Reactivation offers a helpful path back without judgment.
- Advocacy prompts appear only after a positive signal and make sharing simple.

## Measurement with empathy
We linked referral sources to the patient journey while minimising unnecessary data collection. Lumen can now understand which experiences tend to precede advocacy, where reactivation stalls, and whether referred patients receive the same quality of welcome as the person who introduced them.

## Measurement snapshot
Baseline period: February-April 2026. Launch date: 11 May 2026. Measurement period: June-August 2026.

- Patients reaching a defined referral-ready signal increased from 96 to 146 per quarter, a 52% lift.
- New patient enquiries with a named patient referral source increased from 38 to 57.
- Reactivation completion improved from 21% to 34% of overdue patients contacted.
- Post-visit unresolved-friction flags fell from 14% of visits to 8%.

Evidence used: anonymised patient journey dashboard, referral-source logs, reactivation cohort report, and screenshots of the advocacy prompt rules.

## The compounding loop
The result is a referral system that feels like care, not promotion. Better continuity creates more confident advocates; advocates bring in patients with higher trust; a thoughtful welcome reinforces the cycle. Lumen can improve that loop deliberately while preserving the warmth that made referrals happen in the first place.`,
  },
  {
    id: "case-marrow-wholesale-engine",
    projectId: "p-5",
    title: "From opportunistic wholesale wins to a repeatable growth engine",
    slug: "marrow-wholesale-acquisition-engine",
    excerpt:
      "How Marrow Coffee Roasters built a visible cafe-partner pipeline around samples, fit, territory, and reorder potential.",
    category: "Acquisition Systems",
    featuredImage: "/work/marrow-wholesale-dashboard.webp",
    seoTitle: "Marrow Coffee wholesale growth case study",
    seoDescription:
      "How Marrow Coffee Roasters built a repeatable wholesale cafe-partner acquisition and reorder system.",
    body: `## The wholesale ambition
Marrow Coffee Roasters had a product people remembered and a growing set of wholesale relationships. New accounts, however, were won through a mixture of reputation, chance introductions, and founder persistence. The team could not reliably see which prospects were most likely to value Marrow, what happened after a sample, or where future account growth would come from.

## The commercial constraint
Wholesale growth is not simply a list of cafes. Fit depends on menu, volume, service expectations, territory, margin, training needs, and the likelihood of a durable reorder rhythm. Marrow needed a system that protected the craft of the brand while making the commercial motion repeatable.

## The wholesale operating view
We connected acquisition and account quality in one pipeline.

- Ideal-partner criteria cover concept, volume, quality alignment, decision process, and service fit.
- Territory mapping balances opportunity density with operational capacity.
- The sample journey records interest, tasting feedback, decision context, and the next useful action.
- Pipeline stages run from discovery through sample, qualification, first order, onboarding, and active account.
- Margin bands keep product mix and service commitments visible during commercial decisions.
- Reorder cadence identifies healthy accounts, emerging risk, and expansion potential.

## Moving from reporting to action
Each dashboard signal leads to a practical queue: samples needing follow-up, accounts approaching a reorder window, territories with whitespace, or partnerships that need support. The team can focus on the few actions most likely to create a durable wholesale relationship.

## Measurement snapshot
Baseline period: March-May 2025. Launch date: 9 September 2025. Measurement period: October-December 2025.

- Active wholesale accounts increased from 64 to 101, adding 37 accounts in 90 days.
- Sample-to-first-order conversion improved from 18% to 29%.
- Prospects with complete fit scoring increased from 22% to 89%.
- Accounts with a visible reorder cadence increased from 51% to 84%.

Evidence used: anonymised wholesale CRM export, sample journey dashboard, reorder cadence report, and territory opportunity map.

## The result
Marrow now has a growth engine that treats craft and commercial discipline as allies. The brand can pursue the right cafes, learn from every sample, and support partners beyond the first order. Wholesale growth is becoming a capability the team owns rather than a series of fortunate wins.`,
  },
  {
    id: "case-marrow-partner-system",
    projectId: "p-5",
    title: "Designing a margin-aware cafe partner system",
    slug: "marrow-margin-aware-partner-system",
    excerpt:
      "A branded sample-to-reorder experience that aligns pricing, onboarding, service, and account growth for Marrow’s wholesale partners.",
    category: "Pricing & Retention",
    featuredImage: "/work/marrow-partner-system.webp",
    seoTitle: "Marrow Coffee partner system case study",
    seoDescription:
      "How Marrow aligned wholesale sampling, pricing, onboarding, service, and reorders in one partner system.",
    body: `## Beyond the first order
Marrow’s wholesale experience was strongest when a founder or roaster personally carried the context from tasting to onboarding. As the account base grew, that continuity became difficult to reproduce. Pricing choices, training commitments, equipment needs, and reorder expectations could drift between sales and service.

## One partner experience
We designed the wholesale relationship as a connected product. Every artifact—from the sample kit to the reorder review—needed to express Marrow’s craft while helping both teams make sound commercial decisions.

## The system components
The partner system combines brand experience with operational clarity.

- A curated sample kit frames each roast around the partner’s menu and customer rather than generic tasting notes.
- A margin-aware price architecture makes volume, service, and product-mix trade-offs explicit.
- Proposal modules connect coffee selection, training, launch support, equipment context, and delivery rhythm.
- Onboarding captures owners, milestones, menu readiness, team training, and the first reorder checkpoint.
- Account reviews combine reorder behaviour, support needs, product performance, and expansion ideas.
- A service recovery path gives issues a clear owner and closes the loop with the partner.

## Designed to feel like Marrow
The physical and digital touchpoints share a tactile language of dark wood, copper, uncoated stock, and restrained detail. The system feels crafted rather than automated, but the underlying workflow is consistent enough for the wider team to deliver.

## Measurement snapshot
Baseline period: June-August 2025. Launch date: 14 October 2025. Measurement period: November 2025-January 2026.

- Blended wholesale gross margin improved from 34.6% to 43.0%, an 8.4-point gain.
- Accounts onboarded with a completed partner profile increased from 27% to 91%.
- First reorder within 45 days improved from 48% to 67%.
- Service issues with a documented owner and closure note increased from 36% to 88%.

Evidence used: anonymised margin report, partner onboarding checklist exports, reorder report, and service recovery workflow screenshots.

## The compounding outcome
Marrow can now protect margin without reducing the relationship to price, onboard partners without losing warmth, and identify account growth before a reorder pattern weakens. The cafe receives a coherent partnership; Marrow gains a model that can scale without sanding away what makes the brand distinctive.`,
  },
  {
    id: "case-josren-commerce-intelligence",
    projectId: "p-josren-fashion",
    title: "Turning collection signals into a fashion commerce system",
    slug: "josren-fashion-commerce-intelligence",
    excerpt:
      "How Josren Fashion connected editorial demand, product discovery, merchandising, and repeat-client behaviour in one collection view.",
    category: "Commerce Systems",
    featuredImage: "/work/josren-commerce-dashboard.webp",
    seoTitle: "Josren Fashion commerce system case study",
    seoDescription:
      "How Josren Fashion connected collection performance, merchandising, discovery, and repeat-client behaviour.",
    body: `## The collection challenge
Josren Fashion creates value through point of view: the relationship between silhouette, material, styling, and the moment a client discovers a piece. Traditional ecommerce reporting flattened that richness into traffic and orders. The team could see what sold, but not always why a look created interest, where discovery weakened, or how collection demand should shape merchandising decisions.

## A more useful commercial picture
We designed the commerce view around the collection rather than the transaction. Editorial content, product discovery, size and colour demand, conversion, and repeat-client behaviour now sit in one connected model.

## What the system brings together
- Collection-level reporting connects campaigns, looks, products, and orders.
- Discovery paths reveal which editorial moments move clients into meaningful product consideration.
- Size and colour signals distinguish genuine demand from unavailable inventory.
- Product pairing shows which pieces build a complete look and improve basket quality.
- Client cohorts separate first discovery, first purchase, repeat purchase, and high-intent return visits.
- Merchandising queues surface strong-interest pieces, quiet products, and stock-constrained opportunities.

## From dashboard to decision
The interface is intentionally visual. The team can move from a collection overview into the performance of a look, then understand the product and client signals beneath it. Each view leads to an action: restyle, restock, reposition, retarget, or retire.

## Measurement snapshot
Baseline period: January-March 2026. Launch date: 3 June 2026. Measurement period: June-July 2026.

- Collection conversion rate improved from 1.9% to 2.4%, a 27% relative lift.
- Product views with a known discovery path increased from 44% to 82%.
- Stock-constrained high-interest products identified before sellout increased from 3 per launch to 11.
- Returning-client revenue share improved from 26% to 34% during the measured collection window.

Evidence used: anonymised commerce analytics, product discovery dashboard, merchandising queue screenshots, and collection cohort report.

## The outcome
Josren is building a commerce system that preserves creative judgment while giving it sharper evidence. Product decisions no longer begin and end with units sold. The brand can learn from how clients discover, combine, and return to its work—turning each collection into intelligence for the next.`,
  },
  {
    id: "case-josren-collection-launch",
    projectId: "p-josren-fashion",
    title: "Designing a collection launch that compounds attention",
    slug: "josren-collection-launch-system",
    excerpt:
      "A connected launch workflow spanning concept, campaign, early access, product drop, fulfilment signals, and repeat-client follow-up.",
    category: "Launch Systems",
    featuredImage: "/work/josren-launch-workflow.webp",
    seoTitle: "Josren Fashion collection launch case study",
    seoDescription:
      "How Josren Fashion designed a repeatable collection launch from concept and campaign through fulfilment and client return.",
    body: `## Why launches felt heavier than they should
A fashion launch asks creative, production, commerce, and communication teams to converge on one moment. For Josren, the work was strong but the operating sequence was difficult to see as a whole. Campaign assets, product readiness, early-access clients, inventory decisions, and post-launch learning could progress at different speeds.

## One launch architecture
We mapped the collection launch as a sequence of seven connected states: concept, capsule architecture, campaign production, early access, public drop, fulfilment learning, and client return. Each state has a decision owner, readiness standard, and explicit handoff.

## The workflow
- A collection brief connects the creative thesis to audience, commercial role, and launch constraints.
- Capsule architecture makes hero pieces, supporting looks, price structure, and inventory exposure visible.
- Campaign production tracks the minimum asset set required across editorial, product, social, and client channels.
- Early access identifies the clients and partners for whom the collection is most relevant.
- Drop readiness combines product, inventory, site, service, and fulfilment checks.
- Live signals separate attention, consideration, availability friction, and conversion.
- Post-launch follow-up gives returning clients a relevant next chapter rather than a generic promotion.

## A system that still feels editorial
The workflow uses tactile cards and visual gates instead of a dense project plan. Josren can see the state of the launch without turning creative work into bureaucracy. Repeated forms make blocked handoffs and missing assets immediately visible.

## Measurement snapshot
Baseline period: February-April 2026. Launch date: 18 June 2026. Measurement period: first 21 days after launch.

- Launch sell-through by day 21 improved from 38% to 51%, a 34% relative lift.
- Campaign assets ready 72 hours before launch increased from 46% to 93%.
- Early-access clients moving from preview to purchase increased from 19% to 31%.
- Fulfilment exceptions in the first launch week fell from 17% of orders to 9%.

Evidence used: anonymised launch readiness board, commerce sell-through report, early-access cohort export, and fulfilment exception log.

## The compounding result
Each launch now leaves behind more than sales. It produces reusable assets, clearer client signals, merchandising lessons, and a stronger operating rhythm. Josren can protect the theatre of a collection reveal while making the system behind it calmer and more repeatable.`,
  },
  {
    id: "case-right-mind-admissions",
    projectId: "p-right-mind-homes",
    title: "Making the path from family enquiry to the right home clearer",
    slug: "right-mind-homes-enquiry-admissions-system",
    excerpt:
      "How Right Mind Homes connected family enquiries, suitability conversations, visits, availability, and move-in planning.",
    category: "Admissions Operations",
    featuredImage: "/work/right-mind-admissions-dashboard.webp",
    seoTitle: "Right Mind Homes admissions system case study",
    seoDescription:
      "How Right Mind Homes designed a clearer, more humane enquiry, suitability, visit, and move-in process.",
    body: `## A decision that deserves clarity
Families approaching Right Mind Homes are rarely making a simple purchase decision. They are balancing care needs, practical constraints, trust, timing, and the emotional weight of choosing a home. The existing enquiry process depended on thoughtful people, but context could fragment between first contact, suitability conversations, visits, and planning.

## The central constraint
Speed mattered, but speed alone was not the answer. Right Mind Homes needed to respond promptly without rushing families, understand fit without making the conversation feel clinical, and keep every handoff informed without asking people to repeat their story.

## The admissions operating view
We designed a shared journey around the questions families actually need answered.

- First contact records preferences, urgency, communication needs, and the reason for exploring support.
- Suitability conversations combine care context, personal priorities, home fit, and decision participants.
- Availability is viewed alongside fit rather than treated as a simple vacancy list.
- Visit planning prepares both the family and the home team for a useful, unhurried conversation.
- Decision follow-up captures questions and next steps without pressuring the family.
- Move-in planning connects practical preparation, familiar routines, relationships, and early support.

## Better visibility, more human contact
The dashboard shows every enquiry, its current stage, owner, next action, and response timing. It helps teams protect continuity while giving leaders an honest view of capacity and demand. Automation handles reminders and handoff prompts; people retain the conversations that require care and judgment.

## Measurement snapshot
Baseline period: March-May 2026. Launch date: 8 July 2026. Measurement period: July-September 2026.

- Median first response time moved from 14 hours to 4 hours, a 71% reduction.
- Enquiries with a named owner within one business day increased from 62% to 95%.
- Visit bookings from suitable enquiries improved from 32% to 45%.
- Families asked to repeat core context in later stages fell from 29% to 11%.

Evidence used: anonymised enquiry dashboard, response-time log, visit booking report, and family journey handoff checklist.

## The outcome
Right Mind Homes now has the foundation for an admissions process that is responsive, transparent, and dignified. Families receive a more coherent experience, and teams can coordinate the journey without reducing a deeply personal decision to a sales pipeline.`,
  },
  {
    id: "case-right-mind-family-journey",
    projectId: "p-right-mind-homes",
    title: "Designing continuity from first conversation to feeling at home",
    slug: "right-mind-homes-family-journey",
    excerpt:
      "A family-centred service journey connecting listening, visits, shared planning, move-in, settling-in, and ongoing communication.",
    category: "Service Design",
    featuredImage: "/work/right-mind-family-workflow.webp",
    seoTitle: "Right Mind Homes family journey case study",
    seoDescription:
      "How Right Mind Homes connected first contact, shared planning, move-in, settling-in, and family communication.",
    body: `## The experience extends beyond admission
Choosing a home is only the beginning of the relationship. The quality of the first weeks depends on how well personal context travels from enquiry into planning, arrival, daily routines, and family communication. Right Mind Homes wanted that continuity to be deliberate rather than dependent on individual memory.

## Mapping the experience of change
We followed the journey from the perspective of the person moving, their family, and the home team. The resulting service map treats each stage as both an operational handoff and a human transition.

## The connected journey
- First contact creates a calm entry point and records how each person prefers to communicate.
- Listening conversations capture routines, interests, relationships, concerns, and what feeling at home means.
- Suitability and visits allow both sides to explore fit openly.
- Shared planning converts what was learned into practical preparations and named responsibilities.
- Move-in sequencing reduces avoidable uncertainty around the day itself.
- Settling-in check-ins focus on belonging, comfort, and unresolved questions rather than administration alone.
- Ongoing family communication establishes a dependable rhythm with clear ownership.

## Making continuity visible
The workflow uses a continuous path through a sequence of home-like spaces. Teams can see what has been learned, what must happen next, and which details should travel forward. Prompts prevent silence without replacing meaningful conversation.

## Measurement snapshot
Baseline period: April-June 2026. Launch date: 22 July 2026. Measurement period: August-October 2026.

- Family update completion during the first 30 days improved from 54% to 79%, a 46% relative lift.
- Move-in plans with named responsibilities increased from 49% to 92%.
- Settling-in check-ins completed on schedule improved from 58% to 86%.
- Unresolved family questions older than 72 hours fell from 18 open items to 6.

Evidence used: anonymised family communication log, move-in planning board, settling-in checklist exports, and service journey map screenshots.

## The durable result
Right Mind Homes is building an experience in which operational reliability supports emotional safety. People encounter fewer disconnected handoffs, families know what to expect, and teams have a shared model for turning a move into the beginning of life at home.`,
  },
];
