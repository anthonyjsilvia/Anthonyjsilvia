/** Contact channels: shared by Contact page + AnthonyOS Contact app. */

export const contactInfo = {
  email: "contact@anthonysilvia.com",
  linkedin: "linkedin.com/in/anthonyjsilvia",
  personal: "anthonysilvia.com",
};

export const nodedaLinks = {
  requestService: "https://nodeda.com/contact/request-service",
  homepage: "https://nodeda.com",
  logoLight: "https://nodeda.com/logos/NodeDa.black.svg",
  logoDark: "https://nodeda.com/logos/NodeDa.white.svg",
};

export type ContactChannel = {
  id: string;
  href: string;
  label: string;
  value: string;
  description: string;
  external: boolean;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    href: `mailto:${contactInfo.email}`,
    label: "Email",
    value: contactInfo.email,
    description: "Drop a line. I usually reply within a day",
    external: false,
  },
  {
    id: "linkedin",
    href: `https://${contactInfo.linkedin}`,
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    description: "Professional profile and experience",
    external: true,
  },
  {
    id: "personal",
    href: `https://${contactInfo.personal}`,
    label: "Website",
    value: contactInfo.personal,
    description: "More about me and my work",
    external: true,
  },
];
