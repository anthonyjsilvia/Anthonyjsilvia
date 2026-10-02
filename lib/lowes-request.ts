import { contactInfo } from "@/lib/contact";

/** Lowe's confidential case request — same pattern as Request Resume. */

export const lowesRequestCopy = {
  eyebrow: "Confidential by request",
  title: "Request Lowe's case details",
  lede:
    "My Lowe's product design work is retail-associate-facing technology under NDA. Public Evidence stays high-level and redacted. Share a bit about the role, and I can walk through deeper decision-level detail privately.",
  formHeading: "Request details",
  formDescription:
    "Tell me who you are and what you’re hiring for. I’ll reply if we can share a confidential walkthrough.",
  defaultSubject: "Lowe's case details request",
  defaultCategory: "general",
  defaultBody:
    "Hi Anthony,\n\nI’d like to request a confidential walkthrough of your Lowe's retail-associate-facing product design work for the following opportunity:\n\n- Company:\n- Role:\n- Timeline:\n\nThanks,",
  submitLabel: "Request details",
  successTitle: "Request sent",
  successMessage:
    "Thanks. I’ll review your note and follow up if we can share a confidential walkthrough.",
  successActionLabel: "Submit another request",
  fallbackEmail: contactInfo.email,
  image: "/portfolio/lowes/cover.jpg",
  imageAlt:
    "Lowe's store after rain with a rainbow over the wet parking lot.",
  imageCredit:
    "Photo by Anthony Silvia.",
} as const;
