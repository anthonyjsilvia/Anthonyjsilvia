import { en, type Messages } from "@/lib/i18n/en";

/** British English. Same meaning as `en`, with British spelling and vocabulary. */
export const enGB: Messages = {
  ...en,
  chrome: {
    ...en.chrome,
    goHome: "Go to the home page",
    opensInNewTab: "opens in a new tab",
  },
  nav: {
    ...en.nav,
    requestResume: "Request CV",
  },
  hero: {
    ...en.hero,
    requestResume: "Request CV",
    requestResumeLabel: "Request CV",
  },
  footer: {
    ...en.footer,
    body: "Open to Product Designer roles where systems thinking, front-line ops UX, and an MBA lens are real advantages: research-led decisions, accessibility-first craft, and AI practice that raises throughput without skipping judgement.",
    hostedLabel: "Hosted using NodeDa (opens in a new tab)",
    poweredLabel: "Powered by nrova.com (opens in a new tab)",
  },
  about: {
    ...en.about,
    sections: [
      {
        ...en.about.sections[0],
        paragraphs: [
          "Before I was designing tools, I was using them. From 2019 to 2022 I did customer-facing and operational work at Lowe's. I was recruited from the stores into Launchpad, the company's internal talent programme, and I joined the product design team in 2022.",
          "That path is why I start with the job someone is trying to finish. A handoff can look fine in a diagram and fall apart when a person is already behind. A screen can assume a quiet desk. A workflow can forget the next person in the queue. The store years are where I learned to see that, and I still design for that pressure.",
        ],
      },
      ...en.about.sections.slice(1),
    ],
  },
  a11y: {
    ...en.a11y,
    colorScheme: "Colour scheme",
    reduceMotionBody:
      "Minimise animations and transitions across the site. Useful for vestibular sensitivity or saving battery.",
    emphasizeLinksBody:
      "Underlines text links so they are not identified by colour alone. Buttons and the site name stay clear.",
  },
  os: {
    ...en.os,
    darkModeBody: "Use the dark colour scheme.",
  },
};
