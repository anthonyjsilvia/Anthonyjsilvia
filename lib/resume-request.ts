import { contactInfo } from "@/lib/contact";

/** Shared copy + form defaults for Request Resume (site + AnthonyOS). */

export const resumeRequestCopy = {
  eyebrow: "Private by request",
  title: "Request Resume",
  lede:
    "My full resume stays private to protect personal and confidential details. Share a bit about the role or opportunity, and I’ll send a current copy directly.",
  formHeading: "Request a copy",
  formDescription:
    "Tell me who you are and what you’re hiring for. I’ll reply by email with the resume.",
  defaultSubject: "Resume request",
  defaultCategory: "general",
  defaultBody:
    "Hi Anthony,\n\nI’d like to request your resume for the following opportunity:\n\n- Company:\n- Role:\n- Timeline:\n\nThanks,",
  submitLabel: "Request resume",
  successTitle: "Request sent",
  successMessage:
    "Thanks, I’ll review your note and send a resume if it’s a fit.",
  successActionLabel: "Submit another request",
  fallbackEmail: contactInfo.email,
} as const;
