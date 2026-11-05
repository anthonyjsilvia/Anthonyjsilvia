/** English About copy. Localized pages read `useMessages().about`. */

import { en } from "@/lib/i18n/en";

export type AboutSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export const aboutContent = en.about;
