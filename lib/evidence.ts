/** Evidence sections: shared by Evidence page + AnthonyOS Evidence app. */

/** Public employer label only. Initiative names and internals are redacted. */
export const PROJECT_A = "Lowe's · Confidential initiative A";
export const PROJECT_B = "Lowe's · Confidential initiative B";
export const PROJECT_B_TRADE_OFFS = "Lowe's · Confidential initiative B";
export const PROJECT_B_COMPLEXITY = "Lowe's · Confidential initiative B";
export const PROJECT_B_AMBIGUITY = "Lowe's · Confidential initiative B";
export const PROJECT_B_SYSTEMS = "Lowe's · Confidential initiative B";

export const TWO_COLUMN_NAMES = new Set([
  PROJECT_A,
  PROJECT_B,
  PROJECT_B_TRADE_OFFS,
  PROJECT_B_COMPLEXITY,
  PROJECT_B_AMBIGUITY,
  PROJECT_B_SYSTEMS,
]);

export const evidenceSections = [
  {
    id: "trade-offs",
    title: "Trade-offs",
    intro:
      "Decisions where something was cut, reduced, or changed, and what outcome that protected or enabled.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Prioritized research scheduling so the team could run studies with field users on timeline; kept prep grounded so design decisions for the experience were validated with real operational feedback.",
          "Scoped experiences to a focused set of high-risk scenarios (specifics redacted); protected launch goals and compliance instead of broadening scope in ways that would delay delivery.",
          "Invested in shared UI structure and reusable components for the experience so later scenarios could extend the system without rebuilding from scratch.",
        ],
      },
      {
        name: PROJECT_B_TRADE_OFFS,
        bullets: [
          "Aligned with leadership on scope and timeline so we could ship a first release that met business goals while leaving room to iterate; prioritized highest-impact flows for a stable, usable product sooner.",
          "Partnered with developers on technical constraints; traded ideal UX against build complexity so the experience stayed strong without blocking delivery.",
          "Aligned cross-functional partners on priorities and shared language; small concessions in wording and sequence produced one consistent model and a clearer experience for users.",
        ],
      },
    ],
  },
  {
    id: "complexity-clarity",
    title: "Complexity → Clarity",
    intro:
      "How messy or complicated situations were simplified with structure or systems.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Some capabilities still lived only in a legacy path; designed a hub layout that surfaced and linked those paths so users had one place to work during the transition.",
          "Structured the experience around distinct workflow types so differing paths stayed clear without forcing a single flow for every case.",
          "Clarified handoffs with partner systems and surfaced status in the interface so users could see where work was going next without guessing.",
        ],
      },
      {
        name: PROJECT_B_COMPLEXITY,
        bullets: [
          "Moved the team from AI-accelerated drafts to Figma as the production source of truth, using AI for speed, then structure for handoff, iteration, and developer clarity.",
          "Gave developers components, layers, and specs in one place so flows were clearer than raw AI-generated outputs alone.",
          "With flows and screens in Figma, design and development stayed aligned so the built product matched intent and reduced rework.",
        ],
      },
    ],
  },
  {
    id: "ambiguity",
    title: "Ambiguity",
    intro:
      "How unclear or undefined problems were handled: what was unknown, how assumptions were validated, and what created direction.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Defined success criteria when “improved customer experience” was vague: ran short discovery interviews with frontline users and managers, framed “improved” as faster completion and fewer follow-ups, and turned that into measurable goals.",
          "Validated which cases drove volume and pain: reviewed operational samples and paired them with field visits to decide what to keep prominent and how to order options in the interface.",
          "Framed a speed-versus-accuracy trade-off with concrete scenarios for stakeholders and aligned on accuracy-first with a time target.",
        ],
      },
      {
        name: PROJECT_B_AMBIGUITY,
        bullets: [
          "Defined flows into linear and non-linear patterns so users could see what the product can do and still complete objectives in fewer steps when they already know the path.",
          "Structured both patterns clearly, guided step-by-step versus expert shortcuts, reducing ambiguity about how to finish tasks.",
          "Challenged leadership when a proposed approach did not best serve users; kept the conversation professional so we could align on a balance of business goals and better experience.",
        ],
      },
    ],
  },
  {
    id: "systems-thinking",
    title: "Systems Thinking",
    intro:
      "Awareness of upstream and downstream impacts: how decisions affected other teams, steps, or metrics, and what was done for consistency or scalability.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Involved adjacent business partners early so shared data fields and status values matched downstream processes and avoided rework after launch.",
          "Aligned with enablement on a single source-of-truth flow so training materials and the UI stayed in sync when the experience changed.",
          "Designed with a later platform consolidation in mind, using consistent language and status patterns so a future initiative could extend the model rather than replace it.",
        ],
      },
      {
        name: PROJECT_B_SYSTEMS,
        bullets: [
          "Adopted the internal design system while giving partner teams flexibility to keep an existing surface until transition, so progress continued without blocking other workstreams.",
          "Used the design system to shape conversational UI components so the flow was designed and specified in one place and stayed consistent.",
          "Enabled developers to move faster from shared components: understand the flow, extend what they needed, and keep the conversational experience build on track.",
        ],
      },
    ],
  },
  {
    id: "how-ive-changed",
    title: "How I've Changed",
    intro:
      "What I learned on confidential initiative A, what I stopped doing, and what I adopted across confidential initiative B and related work.",
    projects: [
      {
        name: "Learning between the two",
        bullets: [
          "Gained leadership experience by aligning with developers and PMs on scope, feasibility, and language instead of designing in isolation, so we could ship without blocking each other.",
          "Expanded from UX craft into product delivery: on initiative B I created tickets and owned backlog items to alleviate pressure on PMs so design and delivery kept moving.",
          "Adopted a design-system and component-driven approach so developers could understand flows faster and impact scaled beyond pixel-level design.",
          "Learned to challenge leadership on feature direction when the proposed approach did not best serve users, professionally, so we landed on solutions that balanced business goals with better experience.",
        ],
      },
    ],
  },
];