/** About copy, shared by the About page and the AnthonyOS About app. */

export type AboutSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export const aboutContent = {
  eyebrow: "About",
  title: "I learned the work on the floor.",
  body:
    "I'm Anthony Silvia, a product designer in Charlotte. I started in Lowe's stores, moved into product design through Launchpad, and I still design for operational work that has to hold up when the floor is busy. I also run NodeDa, the consultancy I founded in 2017.",
  sections: [
    {
      id: "path",
      title: "Where I come from",
      paragraphs: [
        "Before I was designing tools, I was using them. From 2019 to 2022 I did customer-facing and operational work at Lowe's. I was recruited from the stores into Launchpad, the company's internal talent program, and I joined the product design team in 2022.",
        "That path is why I start with the job someone is trying to finish. A handoff can look fine in a diagram and fall apart when a person is already behind. A screen can assume a quiet desk. A workflow can forget the next person in line. The store years are where I learned to see that, and I still design for that pressure.",
      ],
    },
    {
      id: "practice",
      title: "How I work",
      paragraphs: [
        "At Lowe's I own product design for internal systems: discovery with the people who do the work, a clear picture of what success is, prototypes in Figma, and usability tests I plan and run. I partner with product, engineering, and operations so what we ship can actually be built and used.",
        "Accessibility is part of the design, not a pass at the end. I work to WCAG 2.2 because these tools don't get a second, quieter version of the interface.",
        "I came into design with enough of a coding background to stay in the technical conversation. I use Claude, Cursor, and Figma to move faster through notes, options, and delivery prep. AI widens the exploration. It does not make the call. The research, the constraints, and the people accountable for the outcome still decide what ships.",
      ],
    },
    {
      id: "own",
      title: "What I build on my own",
      paragraphs: [
        "In 2017 I founded NodeDa, and I've kept it going alongside the day job. It's a small consultancy for product strategy and experience design, mostly with small businesses and early products, from the first research conversation through something a team can build.",
        "Kinlily started as Cookbook. I took it from an idea to a live iOS app, which is the closest thing I have to owning a product with no one else to hide behind. NodeDa Work is the other side of that practice: a suite I designed so boards, HR, documents, finance, and the rest of the operation could live together instead of as a pile of tools.",
      ],
    },
    {
      id: "school",
      title: "School, while working",
      paragraphs: [
        "I went back to school without leaving the work. A bachelor's in graphic design and media arts at Southern New Hampshire University, with a minor in user experience, then an MBA there in 2026. The design degree is the craft. The MBA is how I argue for scope, trade-offs, and whether a product should exist at all.",
      ],
    },
  ] satisfies readonly AboutSection[],
  facts: [
    { label: "Based", value: "Charlotte, North Carolina" },
    { label: "Now", value: "Product Designer at Lowe's" },
    { label: "Also", value: "Principal Consultant, NodeDa" },
    { label: "Study", value: "MBA, Southern New Hampshire University" },
  ],
  image: "/me.PNG",
  imageAlt: "Anthony Silvia",
  primaryCta: { href: "/#portfolio", label: "View portfolio" },
  secondaryCta: { href: "/contact", label: "Contact" },
} as const;
